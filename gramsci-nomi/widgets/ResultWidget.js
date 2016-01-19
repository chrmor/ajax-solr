function sortResults(obj, prop, asc) {
    var sobj = obj.sort(function(a, b) {
        var a = JSON.parse(a);
        var b = JSON.parse(b);

        var aval, bval = '';

        try {
          aval = parseInt(a[prop]);
        } catch (err) {
          aval = a[prop];
        }

        try {
          bval = parseInt(b[prop]);
        } catch (err) {
          bval = b[prop];
        }

        if (asc) return (aval > bval) ? 1 : ((aval < bval) ? -1 : 0);
        else return (bval > aval) ? 1 : ((bval < aval) ? -1 : 0);
    });
    return sobj;
}

function sortResultsByJson(obj, prop, asc) {
    var sobj = obj.sort(function(a, b) {
        var aval, bval = '';

        try {
          aval = parseInt(a[prop]);
        } catch (err) {
          aval = a[prop];
        }

        try {
          bval = parseInt(b[prop]);
        } catch (err) {
          bval = b[prop];
        }

        if (asc) return (aval > bval) ? 1 : ((aval < bval) ? -1 : 0);
        else return (bval > aval) ? 1 : ((bval < aval) ? -1 : 0);

    });
    return sobj;
}

(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'gramsci-quaderni/images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest();
      return false;
    };
  },

  afterRequest: function () {
    $(this.target).empty();
    $(this.target).append('<div class="panel-group" id="accordion"></div>');

    var accordion = $('#accordion');
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];

      if (this.manager.response.response.docs.length == 1)
        accordion.append(this.template(doc, true));
      else
        accordion.append(this.template(doc, false));

      var items = [];
      items = items.concat(this.facetLinks('topics', doc.topics));
      items = items.concat(this.facetLinks('organisations', doc.organisations));
      items = items.concat(this.facetLinks('exchanges', doc.exchanges));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }

      this.hightlightText(doc);
    }
  },

  template: function (doc, forceOpenAccordion) {
    var snippet = '';
	
	if (doc.description_s != undefined) {
		snippet = '"' + doc.description_s + '" <b>[Enciclopedia Treccani]</b>';
	} else if (doc.comment_s != undefined) {
		snippet = doc.comment_s;
	}
	
    var start;
    var lastSpaceBar;

    var output =  '<div class="panel panel-default"><a id="a-' + doc.id + '" name="a-' + doc.id + '"></a>' +
                    '<div class="panel-heading">' +
                      '<h4>' +
                        '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + doc.id + '">';

    if (doc.nome_s != null) {
        output += doc.nome_s;
    } else {
        output += 'Unnamed element';
    }

    output += '</a></h4></div>';

    var openPanels = '';
    if (forceOpenAccordion) {
        openPanels = 'in';
    } else {
        openPanel = '';
    }

    
	if (typeof(doc.quaderno_grafie_ss) !== 'undefined') {
		//quaderno_grafie_ss example: 
		//{"value": "Croce", "title": "Antonino Lovecchio, Filosofia della prassi e filosofia dello spirito", "label": "Q 4, 28", "count":"3"}		
		var struct_data = this.getStructData(doc.quaderno_grafie_ss);
		
	}

    if (typeof(doc.grafie_count_ss) !== 'undefined') {
		// grafie_count_ss example: {B. Croce: "55", Croce: "1050", Benedetto Croce: "11", B. CROCE: "1"}
		var total_annotations = this.getTotalData(doc.grafie_count_ss);
	  
		// sorted_annotations example: ["Croce", "B. Croce", "Benedetto Croce", "B. CROCE"]
		var sorted_annotations = Object.keys(total_annotations).sort(function(a,b){return total_annotations[b]-total_annotations[a]})
		
	}
	
	if (typeof(doc.quaderno_aggettivi_ss) !== 'undefined') {
		var struct_data_agg = this.getStructData(doc.quaderno_aggettivi_ss);
	}
    if (typeof(doc.aggettivi_count_ss) !== 'undefined') {
		// grafie_count_ss example: {B. Croce: "55", Croce: "1050", Benedetto Croce: "11", B. CROCE: "1"}
		var total_annotations_agg = this.getTotalData(doc.aggettivi_count_ss);
	  
		// sorted_annotations example: ["Croce", "B. Croce", "Benedetto Croce", "B. CROCE"]
		var sorted_annotations_agg = Object.keys(total_annotations_agg).sort(function(a,b){return total_annotations_agg[b]-total_annotations_agg[a]})
		
	}

    // Panel body
    output += '<div id="collapse' + doc.id + '"  data-docid="' + doc.id + '" class="panel-collapse collapse ' + openPanels + '">' +
                '<div class="panel-body">';

    output += '<p>' + snippet + '</p>';
	if (typeof(doc.treccani_ss) !== 'undefined') {
		output += '<p>' + '<a href="' + doc.treccani_ss + '" target="_blank">Vai alla voce Treccani corrispondente.</a></p>';
	}

	

	if (typeof(doc.dizionario_s) !== 'undefined') {
		var lnkData  = '{"facets_selector":{"label_s":"' + doc.dizionario_s + '"}}';
		lnkData = encodeURI(lnkData);
		output += '<p>' + '<a href="/index.html#' + lnkData + '" target="_blank">Vai alla voce del Dizionario Gramsciano' + ' “' + doc.dizionario_s +  '”.</a></p>';
	}

	if (typeof(doc.media_ss) !== 'undefined') {
		var lnkData  = '{"facets_selector":{"dictionary_ss":"' + doc.dizionario_s + '"}}';
		lnkData = encodeURI(lnkData);
		output += '<p>' + '<a href="/index-media.html#' + lnkData + '" target="_blank">Vai ai media collegati.</a></p>';
	}

    if (typeof(doc.quaderno_count_ss) !== 'undefined')
    {
      var data  = doc.quaderno_count_ss;
      var nData = data.length;

  	  var lnkData  = '{"facets_selector":{"nome_ss":"' + doc.nome_s + '"}}';
  	  lnkData = encodeURI(lnkData);
  	  var totalCount = doc.total_count_i;
  	  var totalCountLabel;
  	  if (totalCount == 1) {
  		  totalCountLabel = 'volta';
  	  } else {
  	  	  totalCountLabel = 'volte';
  	  }

  	  var noteCount = doc.note_count_i;
  	  var noteCountLabel;
  	  if (noteCount == 1) {
  		  noteCountLabel = 'nota';
  	  } else {
  	  	  noteCountLabel = 'note';
  	  }
	  output += '<div class="col-lg-12">';
  	  output += '<hr/><p>Il nome è presente ' + '<a href="http://quaderni.gramsciproject.org/index-quaderni-pundit.html#' + lnkData + '" target="_blank">' + totalCount + ' ' + totalCountLabel + '</a> nei Quaderni in ' + noteCount + ' ' + noteCountLabel + '.</p>';
      output += '<hr/></div>';
	  output += '<div class="col-lg-4">';
	  output += '<p>I <b>riferimenti</b> a “' + doc.nome_s + '” sono così presenti all’interno dei singoli quaderni\:</p>';
      output += '<div class="gramsci-quaderni panel-facet" style="margin-bottom:10px">';

      if (nData > 1)
        data = sortResults(data, 'count', false);

      for (var i = 0; i < nData; i++) {
        try {
          var jsonData = $.parseJSON(data[i]);
		  //var pieces = new Array();
	      //for (var iKey in Object.keys(sorted_annotations)) {
	       // pieces[iKey] = 'fulltext_t:\\"' + sorted_annotations[iKey] + '\\"';
		  //}
		  //var lnkData = '{"facet_query_solr":"' + pieces.join(' OR ') +' AND quaderno_s:\\"' + jsonData['value'] + '\\" AND nome_ss:\\"' + doc.nome_s + '\\""}';
          var lnkData = '{"facets_selector":{"quaderno_s":"' + jsonData['value'] + '","nome_ss":"' + doc.nome_s + '"}}';

          lnkData = encodeURI(lnkData);

          output += '<a href="http://quaderni.gramsciproject.org/index-quaderni-pundit.html#' + lnkData + '" target="_blank">' + jsonData['value'] + ' - ' + jsonData['qtitle'] + ' <b>(' + jsonData['count'] + ')</b></a><br/>';
        } catch (err) {
          continue;
        }
      }

      output += '</div>';
	  output += '</div>'
    
	} else {
		output += '<div class="col-lg-8">';
    	output += '<p>Non esistono riferimenti diretti di Gramsci a questo nome.</p>';
		output += '</div>';
	
    }

    if (typeof(doc.quaderno_grafie_ss) !== 'undefined')    {
		if (typeof(doc.quaderno_aggettivi_ss) === 'undefined') {
			cols = 8;
		} else {
			cols = 4;
		}
		output += '<div class="col-lg-' + cols + '">';
		output += '<p><b>Diverse grafie</b> del nome utilizzate da Gramsci:</p>';
		output += this.writeAnnotationStats(sorted_annotations,total_annotations, struct_data, doc, 'grafia_ss', true);
        output += '</div>' 
    }

    if (typeof(doc.quaderno_aggettivi_ss) !== 'undefined')    {
		output += '<div class="col-lg-4">';
		output += '<p><b>Parole derivate</b> dal nome utilizzate da Gramsci:</p>';
		output += this.writeAnnotationStats(sorted_annotations_agg,total_annotations_agg, struct_data_agg, doc, 'aggettivo_ss', false);
        output += '</div>' 
    }
	
    output +=   '</div>' +
              '</div>'

    // close accordion div
    output += '</div></div>';

    return output;
  },

  getTotalData: function(total_data) {
  	
	var total_annotations = {};

	for (var i = 0; i < total_data.length; i++) {
		var jsonData = $.parseJSON(total_data[i]);
		var dValue = jsonData['value'];
		var dCount = jsonData['count'];
		total_annotations[dValue] = dCount;
	}
	return total_annotations;
  },

  getStructData: function(data) {
  	
	var nData = data.length;
	var struct_data = {};
	for (var i = 0; i < nData; i++) {
		var jsonData = $.parseJSON(data[i]);
		var dValue = jsonData['value'];
		if (struct_data[dValue] === undefined) {
			struct_data[dValue] = [];
			struct_data[dValue].push(jsonData);
		} else {
			struct_data[dValue].push(jsonData);
		}
	}
	return struct_data;
	
  },

  writeAnnotationStats: function(sorted_annotations,total_annotations, struct_data, doc, facet_out, setQueryNome) {
      var output = '<div class="gramsci-grafie" style="margin-bottom:5px">';

      for (var iKey in Object.keys(sorted_annotations)) {
        var key  = sorted_annotations[iKey];
		if (struct_data[key] == undefined) {
			console.debug("WARNING: Gragia " + key + 'no found! - ' + doc.uri_ss);
			continue;
		}
		
        var data = struct_data[key];
  	    var grafia_count = total_annotations[key];
        var nGraphData = data.length;

        if (nGraphData > 1)
          data = sortResultsByJson(data, 'count', false);
		
		if (setQueryNome) queryNome = ',"nome_ss":"' + doc.nome_s + '"';
		else queryNome = '';
		
		var lnkGrafiaAll  = '{"facets_selector":{"' + facet_out + '":"' + key + '"' + queryNome + '}}';
		lnkGrafiaAll = encodeURI(lnkGrafiaAll);
        output += '“' + key + '” <a href="http://quaderni.gramsciproject.org/index-quaderni-pundit.html#' + lnkGrafiaAll + '" target="_blank"><b>(' + grafia_count + ')</b></a>';

        output += '<div class="panel-facet" style="margin-bottom:15px">';
        output += '<ul style="padding-left:18px">';

        for (var t = 0; t < nGraphData; t++) {
          var cGraphData = data[t];

          var note  = cGraphData['label'];
          var title = cGraphData['title'];
          var count = cGraphData['count'];

          var lnkData  = '{"facets_selector":{"label_ss":"' + note + '","' + facet_out + '":"' + key + '"' + queryNome + '}}';
          lnkData = encodeURI(lnkData);

          output +=   '<li><a href="http://quaderni.gramsciproject.org/index-quaderni-pundit.html#' + lnkData + '" target="_blank">' + note + ' - ' + title + ' <b>(' + count + ')</b></a></li>';
        }

        output += '</ul>';
        output += '</div>';
      }

      output += '</div>';
	  
	  return output;
  },

  hightlightText: function(doc) {
    // highlight searched text
    var txtSearched = this.manager.store.values('fq');
    if (txtSearched == null || txtSearched.length <= 0)
      txtSearched = this.manager.store.values('q');

    if (txtSearched.length > 0) {
      for (var i = 0; i < txtSearched.length; i++) {
        var fTextSearched = txtSearched[i];
		
		var words = fTextSearched.split(' OR ');
		for (var j = 0; j < words.length; j++) {
	        if (words[j].indexOf('fulltext_t:') === 0) {
	          var txt = words[j].split(':')[1];
			  //support for precise searches in the form "text:"some text""
			  if (txt.endsWith('"') && txt.startsWith('"')) {
				  txt = txt.substring(1,txt.length-1);
			  }
	          var $allText = $('div#allText-' + doc.id);
	          $allText.highlight(txt, {element: 'span', className: 'highlight highlight-' + doc.id + ' hightlight-color-' + i});
	          $allText.removeClass('hidden');
	          $('#abstractText-' + doc.id).addClass('hidden');
	          $('#allTextLink-' + doc.id).addClass('hidden');
	        }	
		}
		
      };
    }
  },

  init: function () {
    $(document).on('click', 'a.more', function () {
      var $this = $(this),
          span = $this.parent().find('span');

      if (span.is(':visible')) {
        span.hide();
        $this.text('more');
      }
      else {
        span.show();
        $this.text('less');
      }

      return false;
    });
  }
});

})(jQuery);

function seeAllText(docId) {
  var $allTextNode      = $('#allText-' + docId);
  var $abstractTextNode = $('#abstractText-' + docId);
  var $linkNode         = $('#lnkSeeAllText-' + docId);

  if ($allTextNode.size() === 1 && $abstractTextNode.size() === 1) {
    if ($allTextNode.hasClass('hidden')) {
      // Show all text
      $abstractTextNode.addClass('hidden');
      $allTextNode.removeClass('hidden');
      $linkNode.text('See abstract');
    } else {
      // Show abstract text
      $allTextNode.addClass('hidden');
      $abstractTextNode.removeClass('hidden');
      $linkNode.text('See all text');
    }
  }

  return false;
}