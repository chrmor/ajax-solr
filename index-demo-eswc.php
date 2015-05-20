<?php 

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

//Get the content of the js config file...
$time_start = microtime_float();
$conf = file_get_contents('demo-eswc/js/conf_template.js');
$time_end = microtime_float();
//echo "JS file read in ".($time_end - $time_start)." milliseconds.<br/>";
//Get the content of the js config file...
$time_start = microtime_float();
$html = file_get_contents('demo-eswc/html/html-template.html');
$time_end = microtime_float();
//echo "HTML file read in ".($time_end - $time_start)." milliseconds.<br/>";
//get all _ss dinamic facets from Solr
$time_start = microtime_float();

$list_str = file_get_contents('http://localhost:8080/solr-demo-eswc/select?q=*:*&wt=csv&rows=0&fl=*_ss');
$pippo = file_get_contents('http://localhost:8080/solr-demo-eswc/collection1/select?q=*%3A*&start=1&wt=json&indent=true&facet=true&facet.query=*%3A*&facet.field=tagType_ss');
//echo PHP_VERSION . "<br/>";
//echo $pippo;
$p = split('"facet_fields":',$pippo);
$p = split('"tagType_ss":',$p[1]);
echo $p[1] . "<br/>";
$p = split(']',$p[1]);
echo $p[0] . "<br/>";
//echo split(']',split('\[',split('"tagType_ss":',split('"facet_fields":',$pippo)[1])[1])[1])[0];
//$rowList = split(']',split('\[',split('"tagType_ss":',split('"facet_fields":',$pippo)[1])[1])[1])[0];


//Turn the list into an array...
$facets = explode(",",$list_str);
$facets = array_reverse($facets);

$time_end = microtime_float();
//echo "Read facets from Solr: ".($time_end - $time_start)." milliseconds.<br/>";

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
//echo "String replaced in ".($time_end - $time_start)." milliseconds.<br/>";

//echo "Updating js confign file...<br/>";
$time_start = microtime_float();
file_put_contents("demo-eswc/js/demo.js",$conf);
$time_end = microtime_float();
//echo "JS updated in ".($time_end - $time_start)." milliseconds.<br/>";

//echo "Updating html index file...<br/>";
$time_start = microtime_float();
file_put_contents("index-demo-eswc.html",$html);
$time_end = microtime_float();
//echo "HTML updated in ".($time_end - $time_start)." milliseconds.<br/>";

//header("Location: http://ajaxsolr.localhost:8888/index-demo-eswc.php");
echo $html;

?>