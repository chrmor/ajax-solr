<?php 

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

//Get the content of the js config file...
$time_start = microtime_float();
$conf = file_get_contents('../js/conf_template.js');
$time_end = microtime_float();
echo "JS file read in ".($time_end - $time_start)." milliseconds.<br/>";
//Get the content of the js config file...
$time_start = microtime_float();
$html = file_get_contents('../html/html-template.html');
$time_end = microtime_float();
echo "HTML file read in ".($time_end - $time_start)." milliseconds.<br/>";
//get all _ss dinamic facets from Solr
$time_start = microtime_float();
$list_str = file_get_contents('http://localhost:8080/solr-demo-eswc/select?q=*:*&wt=csv&rows=0&fl=*_ss');
//Turn the list into an array...
$facets = explode(",",$list_str);
$time_end = microtime_float();
echo "Read facets from Solr: ".($time_end - $time_start)." milliseconds.<br/>";

//sort($facets);
//for each facet in the array...
$time_start = microtime_float();
for ($x=0; $x < count($facets); $x++) {
	$separator = ",";
	if ($x == count($facets)-1) {
		$separator = "";
	}
	$facet = preg_replace("/\n/","",$facets[$x]);
	$facetLabel = str_replace("_ss","",$facet);
	//insert the proper code into the js config file
	$conf = str_replace("/*auto-facets-mapping-here*/", "'".$facet."':'".$facetLabel."'".$separator."/*auto-facets-mapping-here*/", $conf);	
	$conf = str_replace("/*auto-facets-here*/", "'".$facet."'".$separator."/*auto-facets-here*/", $conf);
	$conf = str_replace("/*auto-facets-autocomplete-here*/", "'".$facet."'".$separator."/*auto-facets-autocomplete-here*/", $conf);	
	$conf = str_replace("/*auto-facets-request-here*/", "'".$facet."'".$separator."/*auto-facets-request-here*/", $conf);	
	//insert the proper code into the html index file
	$html = str_replace("<!--Auto-facets-here-->", "<!--Auto-facets-here-->\n<p class=\"h5\">".$facetLabel."</p>\n<div class=\"tagcloud panel-facet\" id=\"".$facet."\"></div>\n<hr/>",$html);
}
$time_end = microtime_float();
echo "String replaced in ".($time_end - $time_start)." milliseconds.<br/>";

echo "Updating js confign file...<br/>";
$time_start = microtime_float();
echo file_put_contents("../js/demo.js",$conf)." bytes written.<br/>";
$time_end = microtime_float();
echo "JS updated in ".($time_end - $time_start)." milliseconds.<br/>";

echo "Updating html index file...<br/>";
$time_start = microtime_float();
echo file_put_contents("../../index-demo-eswc.html",$html)." bytes written.<br/>";
$time_end = microtime_float();
echo "HTML updated in ".($time_end - $time_start)." milliseconds.<br/>";


?>