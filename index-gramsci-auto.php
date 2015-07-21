<?php 

$folder = "gramsci-auto";
$htmlFile = "index-gramsci-auto.html";

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

function addFacets($tagFacet, $placeHolder, $last, $minCount, $prefix, $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, $arrangeHierarchichal) {
	
	global $conf, $html;

	
	$solrServer = "http://localhost:8080/solr-gramsci-auto/";
	//$solrServer = "http://gramsciproject.org:8080/solr-gramsci-auto/";
	$solrQuery = $solrServer . 'collection1/select?q=*%3A*&start=1&wt=json&indent=true&facet=true&facet.query=*%3A*&facet.mincount=' . $minCount . '&facet.field=' . $tagFacet;
	//echo $solrQuery . '<br/>';
	$list_str =		
	file_get_contents($solrQuery);
	
	$p = split('"facet_fields":',$list_str);
	$p = split('"'. $tagFacet .'":',$p[1]);
	
	$p = split(']',$p[1]);
	$list = str_replace('[','',$p[0]);
	$list = str_replace(' ','',$list);
	
	$arr = split('"',$list);
	$i = 0;
	for ($j =0; $j < count($arr); $j++) {
		//echo $arr[$j] . "<br/>";
		if ($j&1) {
			if (!in_array($arr[$j],$facetsBlackList) && !in_array($arr[$j],$highPriorityFacets)) {
				//echo $arr[$j] . '<br/>';
				$facets[$i] = $arr[$j];	
			}
			
			$i++;
		} 
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

$facetscount=8;
if (isset($_GET['facetscount'])) {
    $facetscount = $_GET['facetscount'];
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

$facetsBlackList = array();
$highPriorityFacets = array();
$numberOfFacetsLimit = 50;
addFacets('rdf_type_ss',"<!--auto-type-facets-here-->",0,$facetscount,'type_', $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, false);

$facetsBlackList = array();
$highPriorityFacets = array();
$numberOfFacetsLimit = 50;
addFacets('wikipedia_category_ss',"<!--auto-cat-facets-here-->",1,$facetscount,'cat_', $facetsBlackList, $highPriorityFacets, $numberOfFacetsLimit, false);

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

//header("Location: http://ajaxsolr.localhost:8888/index-demo-eswc.php");
echo $html;

?>