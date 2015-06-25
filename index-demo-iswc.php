<?php 

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

function addFacets($tagFacet, $placeHolder, $last, $minCount, $prefix) {
	
	global $conf, $html;

	
	//$list_str = file_get_contents('http://gramsciproject.org:8080/solr-demo-eswc/select?q=*:*&wt=csv&rows=0&fl=*_ss');
	$list_str = file_get_contents('http://gramsciproject.org:8080/solr-gramsci-auto/collection1/select?q=*%3A*&start=1&wt=json&indent=true&facet=true&facet.query=*%3A*&facet.field=' . $tagFacet);
	//echo PHP_VERSION . "<br/>";
	$p = split('"facet_fields":',$list_str);
	$p = split('"'. $tagFacet .'":',$p[1]);
	//echo $p[1] . "<br/>";
	$p = split(']',$p[1]);
	$list = str_replace('[','',$p[0]);
	$list = str_replace(' ','',$list);
	//$list = str_replace('"','',$list);
	//$list = str_replace('\'','',$list);
	$arr = split('"',$list);
	$i = 0;
	for ($j =0; $j < count($arr); $j++) {
		//echo $arr[$j] . "<br/>";
		$temp;
		if ($j&1) {
			$temp = $arr[$j];
		} else {
			if (str_replace(',','',$arr[$j])>=$minCount)
				$facets[$i] = $temp;
				$i++;
		}
	
	}


	//Turn the list into an array...
	//$facets = explode(",",$list_str);
	$facets = array_reverse($facets);

	$time_end = microtime_float();
	//echo "Read facets from Solr: ".($time_end - $time_start)." milliseconds.<br/>";

	//sort($facets);
	//for each facet in the array...
	$time_start = microtime_float();
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
		//insert the proper code into the html index file
		$html = str_replace($placeHolder, $placeHolder . "\n<p class=\"h5\">".$facetLabel."</p>\n<div class=\"tagcloud panel-facet\" id=\"".$facet."\"></div>\n<hr/>",$html);
	}
	$time_end = microtime_float();
	//echo "String replaced in ".($time_end - $time_start)." milliseconds.<br/>";
}

//Get the content of the js config file...
$time_start = microtime_float();
$conf = file_get_contents('demo-iswc/js/conf_template.js');
$time_end = microtime_float();
//echo "JS file read in ".($time_end - $time_start)." milliseconds.<br/>";
//Get the content of the js config file...
$time_start = microtime_float();
$html = file_get_contents('demo-iswc/html/html-template.html');
$time_end = microtime_float();
//echo "HTML file read in ".($time_end - $time_start)." milliseconds.<br/>";
//get all _ss dinamic facets from Solr
$time_start = microtime_float();


addFacets('rdf_type_ss',"<!--auto-type-facets-here-->",0,2,'type_');
addFacets('wikipedia_category_ss',"<!--auto-cat-facets-here-->",1,3,'cat_');

//echo "Updating js confign file...<br/>";
$time_start = microtime_float();
file_put_contents("demo-iswc/js/demo.js",$conf);
$time_end = microtime_float();
//echo "JS updated in ".($time_end - $time_start)." milliseconds.<br/>";

//echo "Updating html index file...<br/>";
$time_start = microtime_float();
file_put_contents("index-demo-iswc.html",$html);
$time_end = microtime_float();
//echo "HTML updated in ".($time_end - $time_start)." milliseconds.<br/>";

//header("Location: http://ajaxsolr.localhost:8888/index-demo-eswc.php");
echo $html;

?>