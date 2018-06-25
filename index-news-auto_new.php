<?php 

$folder = "news-auto";
$htmlFile = "index-news-auto_new.html";

$facetQuery = "";
$call = "";
$customFacets = 0;

//API support!!!
if (isset($_GET['custom_facets'])) {
	$customFacets = $_GET['custom_facets'];
}


//Get the JSON from the URL fragment
if (isset($_GET['api_call'])) {
	
    $call = $_GET['api_call'];
	$obj = json_decode(urldecode($call));
	$facetQuery = urlencode($obj->{'facet_query_solr'});
	//echo $facetQuery;
	//echo split('/.}',split('"facet_query_solr": "',urldecode($call))[1])[0] . '<br/>';
	
	/* TO BE REMOVED
	//echo $call;
	$jsonApi = urldecode($call);
	//echo $jsonApi . "<br/>";
	//Parse and extract selected facets
	$jsonApi = str_replace('{"facets_selector":{','',$jsonApi);
	$jsonApi = str_replace('}}','',$jsonApi);
	//echo $jsonApi . '<br/>';
	//$jsonApi = str_replace('{','',$jsonApi);
	//$jsonApi = str_replace(' ','',$jsonApi);
	//$jsonApi = str_replace('}','',$jsonApi);
	//$jsonApi = str_replace('"','',$jsonApi);
	$pieces = split('","',$jsonApi);
	$npieces = array();
	for ($i=0; $i<count($pieces);$i++) {
		//echo $pieces[$i] . '<br/>';
		$orred = split(' OR ',$pieces[$i]);
		$orredFilters = array();
		for ($n =0; $n < count($orred); $n++) {
			//echo $orred[$n] . '<br/>';
			$values = split(':',$orred[$n]);
			$field = str_replace('"','',$values[0]);
			if (strpos($values[1],'*') === false) $value = '"' . str_replace('"','',$values[1]) . '"';
			else $value = str_replace('"', '', $values[1]);
			$orredFilters[$n] = $field . ':' . $value;	
		}	
		$npieces[$i] = '(' . join(' OR ', $orredFilters) . ')';
		
	}
	$jsonApi = join(' AND ', $npieces);
	//echo $jsonApi . "<br/>";
	$jsonApi = urlencode($jsonApi);
	$facetQuery = $jsonApi;
	//echo "JSONAPI: " . $jsonApi . "<br/>"; 
	*/

	
}



//Set the additional query to the Solr call

//Facets count...
$facetscount=2;
if (isset($_GET['facetscount'])) {
    $facetscount = $_GET['facetscount'];
}

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

function cmpFacetsRank($a, $b)
{
	$ranka = $a['rank'];
	$rankb = $b['rank'];
	if ($ranka == $rankb) {
        return 0;
    }
    return ($ranka < $rankb) ? 1 : -1;
}

function cmpFacetsPreRank($a, $b)
{
	$ranka = $a['prerank'];
	$rankb = $b['prerank'];
	if ($ranka == $rankb) {
        return 0;
    }
    return ($ranka < $rankb) ? 1 : -1;
}

function rankFacet($a, $totalDocs, $totalValues, $totalFilteredDocs) {
    $k1 = 1;
	$k2 = 0;
	$k3 = 0;
	$k4 = 0;
	$k5 = 0.2;
	$k6 = 1;
	return 	$k1 * $a['docs']/$totalFilteredDocs + 
			$k6 * $a['count']/$totalValues + 
			$k4 * $a['docs']/$a['max_docs'] + 
			$k2 * $a['max_count']/$totalValues + 
			$k3 * ($a['weighted_count']/$a['max_count'])/($a['max_weighted_count']/$a['max_count']) +
			$k5 * log($a['count']) * $a['count']/$a['max_count'] ;
}

function preRankFacet($a) {
    $k1 = 1;
	return 	$k1 * $a['docs'];
}

function addFacets($tagFacet, $placeHolder, $last, $minCount, $prefix, $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, $arrangeHierarchichal, $facetQuery) {
	
	global $conf, $html;
	//Init values...
	$totalDocs = 0;
	$totalFacets = 0;
	$totalValues = 0;
	$totalWeightedCount = 0;
	$totalFilteredDocs = 0;
	
	//$solrServer = "http://localhost:8080/solr-leaks-auto/news/";
	$solrServer = "http://gramsciproject.org:8080/solr-leaks-auto/news/";
	//$solrServer = "http://localhost:8983/solr/";
	//$solrServer = "http://localhost:9200/news/external/_solr/";
	
	$orderedFacets = array();
	
	//We have to get all the possible types of entities attached to selected documents. We use the $tagFacet facet and the $facetQuery filter.
	$solrQuery = $solrServer . 'select?q=*%3A*&start=1&wt=json&indent=true&facet=true&facet.limit=10000&facet.query=*%3A*&facet.mincount=' . $minCount . '&facet.field=' . $tagFacet . "&fq=" . $facetQuery;
	
	//echo $solrQuery . '<br/>';
	$list_str =	file_get_contents($solrQuery);
	$resObj = json_decode($list_str);
	$totalFilteredDocs = $resObj->{'response'}->{'numFound'};
	$facet_counts = $resObj->{'facet_counts'}->{'facet_fields'}->{$tagFacet};
	$j = 0;
	
	for ($i = 0; $i < count($facet_counts); $i += 2) {
		$value = $facet_counts[$i];
		$orderedFacets[$value] = [];
		$orderedFacets[$value]['docs'] = 0;
		$orderedFacets[$value]['max_docs'] = 0;
	}
	
	for ($i = 0; $i < count($facet_counts); $i += 2) {
		$value = $facet_counts[$i];
		//echo $value . '<br/>';
		$count = $facet_counts[$i+1];
		//if (!in_array($value,$facetsBlackList) && !in_array($value,$highPriorityFacets)) {
			$orderedFacets[$value]['docs'] += $count;
			//$facets[$j] = $value;
			//echo $facets[$j] . ' : ' . $count . '<br/>';
			$j++;
		//}
	}	
	
	$solrQuery = $solrServer . 'select?q=*%3A*&start=1&wt=json&indent=true&facet=true&facet.limit=10000&facet.query=*%3A*&facet.mincount=' . $minCount . '&facet.field=' . $tagFacet;
	//echo $solrQuery . '<br/>';
	$list_str =	file_get_contents($solrQuery);
	$resObj = json_decode($list_str);
	$totalDocs = $resObj->{'response'}->{'numFound'};
	$facet_counts = $resObj->{'facet_counts'}->{'facet_fields'}->{$tagFacet};
	$j = 0;
	for ($i = 0; $i < count($facet_counts); $i += 2) {
		$value = $facet_counts[$i];
		$count = $facet_counts[$i+1];
		if (array_key_exists($value, $orderedFacets)) {
			$orderedFacets[$value]['max_docs'] += $count;	
			//echo $value . ' : ' . $orderedFacets[$value]['max_docs'] .'<br/>';
			$totalFacets += 1;
			$j++;
		}
		
	}

	foreach ($orderedFacets as $key => $value) {
		$orderedFacets[$key]['prerank'] = preRankFacet($orderedFacets[$key]);
	}
	uasort($orderedFacets,'cmpFacetsPreRank');
	$facets = [];
	$facets = array_slice($facets, 0, $numberOfFacetsLimit);
	$orderedFacets = array_slice($orderedFacets, 0, $numberOfFacetsLimit);

	//Query for the values of all dynaimc facets for the filtered results
	$solrQuery = $solrServer . 'select?start=0&rows=0&q=*%3A*&wt=json&indent=true&facet.limit=10000&facet=true&facet.mincount=' . $minCount . '&fq=' . $facetQuery;
	foreach ($orderedFacets as $key => $value) {
		 $solrQuery .= '&facet.field=' . $key;
	}
	//echo $solrQuery . '<br/>';
	$result = file_get_contents($solrQuery);
	$resObj = json_decode($result);
	$facets = array_keys($orderedFacets);
	foreach ($facets as $fac) {
		$facet_counts = $resObj->{'facet_counts'}->{'facet_fields'}->{$fac};
		if (count($facet_counts) == 0) {
			unset($orderedFacets[$fac]);
			//var_dump($orderedFacets);
			//echo "removing " . $fac . count($facet_counts) . ' <br/>';
		} else {
			for ($i = 0; $i < count($facet_counts); $i += 2) {
				$value = $facet_counts[$i];
				$count = $facet_counts[$i+1];
				if (!isset($orderedFacets[$fac]['weighted_count'])) {
					$orderedFacets[$fac]['weighted_count'] = 0;
				}
				$orderedFacets[$fac]['weighted_count'] += $count;
				//echo $orderedFacets[$fac]['weighted_count'] . '<br/>';
				if (!isset($orderedFacets[$fac]['count'])) {
					$orderedFacets[$fac]['count'] = 0;
				}
				$orderedFacets[$fac]['count'] += 1;
				//echo $fac . ' : ' . $orderedFacets[$fac]['count'] . '<br/>';
			}	
		}
			
	}


	//Get alla possible values of the dynamic facets for all documents
	$solrQuery = $solrServer . 'select?start=0&rows=0&q=*%3A*&wt=json&indent=true&facet.limit=10000&facet=true&facet.mincount=' . $minCount;
	$facnumb = 0;
	foreach ($orderedFacets as $key => $value) {
		//echo "filtering query " . $key , '<br/>';
		$solrQuery .= '&facet.field=' . $key;
	}
	/*
	foreach ($facets as $fac) {
		if ($facnumb >= $numberOfFacetsLimit) {
			break;
		}
		 $solrQuery .= '&facet.field=' . $fac;
		 $facnumb ++;
	}
	*/
	//echo $solrQuery . '<br/>';
	$result = file_get_contents($solrQuery);
	$resObj = json_decode($result);
	foreach ($orderedFacets as $key => $value) {
		$facet_counts = $resObj->{'facet_counts'}->{'facet_fields'}->{$key};
		for ($i = 0; $i < count($facet_counts); $i += 2) {
			$value = $facet_counts[$i];
			$count = $facet_counts[$i+1];
			if (!isset($orderedFacets[$key]['max_weighted_count'])) {
				$orderedFacets[$key]['max_weighted_count'] = 0;
			}
			$orderedFacets[$key]['max_weighted_count'] += $count;
			if (!isset($orderedFacets[$key]['max_count'])) {
				$orderedFacets[$key]['max_count'] = 0;
			}
			$orderedFacets[$key]['max_count'] += 1;
			
			$totalValues += 1;
		}	
	}

	
	foreach ($orderedFacets as $key => $value) {
		$orderedFacets[$key]['rank'] = rankFacet($orderedFacets[$key],$totalDocs,$totalValues,$totalFilteredDocs);
	}	
	uasort($orderedFacets,'cmpFacetsRank');
	$c = 0;
	//echo 'Total docs: ' . $totalDocs . ' Total filtered docs: ' . $totalFilteredDocs . 'Total facets: ' . $totalFacets . ' Total values: ' . $totalValues . '<br/>';


	$facets = array();
	foreach ($orderedFacets as $key => $value) {
		$facets[$c] = $key;
		$c ++;
		//echo $key . ' : entities:' . $value['count'] . ' of ' . $value['max_count'] . ' wcount:' . $value['weighted_count'] . ' of ' . $value['max_weighted_count'] . ' docs:' . $value['docs'] . ' of ' . $value['max_docs'] . ' Rank: ' . $value['rank'] . '<br/>';
	}
	

	//Add the high priority facets at the beginning...
	$highPriorityFacets = array_reverse($highPriorityFacets);
	foreach ($highPriorityFacets as $highPriorityFacet) {
		array_unshift($facets,$highPriorityFacet);
	}


	//Facets will be written in the html template from bottom to top, so we reverse the order...
	$facets = array_reverse($facets);
	
	$length = count($facets);
	if ($length > $numberOfFacetsLimit) {
		$facets = array_slice($facets,$length-$numberOfFacetsLimit);
	}
	
	
	$time_end = microtime_float();
	//echo "Read facets from Solr: ".($time_end - $time_start)." milliseconds.<br/>";

	//sort($facets);
	//for each facet in the array...
	$time_start = microtime_float();
	$paths = array();
	$pathsLabels = array();
	
	for ($x=0; $x < count($facets); $x++) {
	
		$separator = ",";
		if ($last==1 && $x == count($facets)-1) {
			$separator = "";
		}
		$facet = preg_replace("/\n/","",$facets[$x]);
		$facetLabel = str_replace('_',' ',str_replace("_ss","",str_replace($prefix,'',$facet)));
		//insert the proper code into the js config file
		$conf = str_replace("/*auto-facets-mapping-here*/", "'".$facet."':'".$facetLabel."'".$separator."/*auto-facets-mapping-here*/", $conf);	
		$conf = str_replace("/*auto-facets-here*/", "'".$facet."'".$separator."/*auto-facets-here*/", $conf);
		$conf = str_replace("/*auto-facets-autocomplete-here*/", "'".$facet."'".$separator."/*auto-facets-autocomplete-here*/", $conf);	
		$conf = str_replace("/*auto-facets-request-here*/", "'".$facet."'".$separator."/*auto-facets-request-here*/", $conf);	
		
		
		//$path = split('-SUBCLASS-',$facetLabel);
		if ($arrangeHierarchichal) {
				array_push($paths, $facetLabel);
				$pieces = split('-SUBCLASS-',$facetLabel);
				$label = $pieces[count($pieces)-1];
				$pathsLabels[$label] = $facet;
		} else {
			//insert the proper code into the html index file
			$html = str_replace($placeHolder, $placeHolder . "\n<p class=\"h5\">".$facetLabel."</p>\n<div class=\"tagcloud panel-facet\" id=\"".$facet."\"></div>\n<hr/>",$html);
		}
		
		
		
	}
	$time_end = microtime_float();
	//echo "String replaced in ".($time_end - $time_start)." milliseconds.<br/>";
	
	if ($arrangeHierarchichal) {
		sort($paths);
		$array = array();
		foreach ($paths as $path) {
		  //$path = trim($path, '-SUBCLASS-');
		  $list = split('-SUBCLASS-', $path);
		  $n = count($list);

		  $arrayRef = &$array; // start from the root
		  for ($i = 0; $i < $n; $i++) {
		    $key = $list[$i];
		    $arrayRef = &$arrayRef[$key]; // index into the next level
		  }
		}
		//insert the proper code into the html index file
		$html = str_replace($placeHolder, $placeHolder . buildUL($array, '', $pathsLabels),$html);
	}
	
}

function buildUL($array, $prefix, $pathsLabels) {
  $ui = "";
  $ui .= "\n<ul class=\"list-group\">\n";
  foreach ($array as $key => $value) {
    //$ui .= "<blockquote>";
	$ui .= "<li class=\"list-group-item\"><p class=\"h5\">" . $key ."</p>";
	if ($pathsLabels[$key] != null) {
			$ui .= "<div class=\"tagcloud panel-facet\" id=\"".$pathsLabels[$key]."\"></div>";
	}
    
    // if the value is another array, recursively build the list
    if (is_array($value))
      $ui .= buildUL($value, "", $pathsLabels) . "</li>";
    //$ui .= "</blockquote>\n";
  }
  $ui .= "</ul>\n";
  return $ui;
}

//Get the content of the js config file...
$time_start = microtime_float();
$conf = file_get_contents($folder . '/js/conf_template.js');
$time_end = microtime_float();
//echo "JS file read in ".($time_end - $time_start)." milliseconds.<br/>";
//Get the content of the js config file...
$time_start = microtime_float();
$html = file_get_contents($folder . '/html/html-template.html');
$time_end = microtime_float();
//echo "HTML file read in ".($time_end - $time_start)." milliseconds.<br/>";
//get all _ss dinamic facets from Solr
$time_start = microtime_float();

$facetsBlackList = array("type_Agent_ss","type_PopulatedPlace_ss");
if ($customFacets != 0) {
	$highPriorityFacets = array("type_Politician_ss","type_Newspaper_ss","type_PoliticalParty_ss","type_Event_ss","type_EthnicGroup_ss", "type_Company_ss","type_Non-ProfitOrganisation_ss");	
} else {
	$highPriorityFacets = array();
}
 //array("type_Organisation_ss","type_Animal_ss","type_CelestialBody_ss","type_Scientist_ss","type_ChemicalSubstance_ss","type_Place_ss","type_Disease_ss","type_Artist_ss");
$numberOfFacetsLimit = 15;
$fq = $facetQuery;
addFacets('tagType_ss',"<!--auto-type-facets-here-->",0,2,'type_', $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, false,$fq);

$facetsBlackList = array("cat_Living_people_ss");
if ($customFacets != 0) {
	$highPriorityFacets = array("cat_Liberal_democracies_ss", "cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss", "cat_Least_developed_countries_ss", "cat_American_people_of_Italian_descent_ss");
} else {
	$highPriorityFacets = array();
}
 //array("cat_American_physicists_ss","cat_Concepts_in_physics_ss","cat_English-language_journals_ss","cat_American_astronauts_ss");
$numberOfFacetsLimit = 15;
addFacets('tagCategory_ss',"<!--auto-cat-facets-here-->",1,1,'cat_', $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, false,$fq);

//echo "Updating js confign file...<br/>";
$time_start = microtime_float();
file_put_contents($folder . "/js/demo.js",$conf);
$time_end = microtime_float();
//echo "JS updated in ".($time_end - $time_start)." milliseconds.<br/>";

//echo "Updating html index file...<br/>";
$time_start = microtime_float();
file_put_contents($htmlFile,$html);
$time_end = microtime_float();
//echo "HTML updated in ".($time_end - $time_start)." milliseconds.<br/>";
//echo "http://ajaxsolr.localhost:8888/" . $htmlFile . "#" . $call;
$uilink = "http://quaderni.gramsciproject.org/" . $htmlFile . "#" . rawurlencode($call);
//echo "<a href=\"" . $uilink . "\">Get the UI</a>";
header("Location: " . $uilink);


?>