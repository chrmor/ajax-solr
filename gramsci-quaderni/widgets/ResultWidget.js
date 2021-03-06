(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,
  showAnnotations: true,
  punditlive: false,
  showAllAnnotations: false,

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
	
	/*CONSOLIDATION OF NNOTATIONS*/
	if (this.showAnnotations) {
		var allXpointers = new Array();
		var allItems = new Array();
	    if (typeof angular != 'undefined') {
	 		 angular.element('#consolidatehook').scope().wipe();
	    }	
	}
	
	
	
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
	  
	  /*CONSOLIDATION OF NNOTATIONS*/
	  //Support for consolidation of annotations via Pundit. This is executed only if angular is activated
	  if (this.showAnnotations && typeof angular != 'undefined') {
		  
		  
		  var nomeStruct = new Object();
		  
		  var fqs = this.manager.store.values('fq');
		  for (var j = 0; j<fqs.length; j++) {
			  //If the the facet nome_ss is selected...
			  if (fqs[j].indexOf('nome_ss') == 0) {
				  var grafie = new Array();
				  var nome = fqs[j].split('nome_ss')[1].replace(':','').replace('"','').replace('"','');	
				  for (var k = 0; k<fqs.length; k++) {
					  if (fqs[k].indexOf('grafia_ss') == 0) {
					  	var grafia = fqs[k].split('grafia_ss')[1].replace(':','').replace('"','').replace('"','');
						grafie.push(grafia);
					  }	
				  }
				  nomeStruct[nome] = grafie;
			  }
			  if (fqs[j].indexOf('aggettivo_ss') == 0) {
				  var aggettivo = fqs[j].split('aggettivo_ss')[1].replace(':','').replace('"','').replace('"','');	
				  
				  if (doc.aggettivi_xpointer_ss !== undefined) {
					  for (var k = 0; k < doc.aggettivi_xpointer_ss.length ; k++) {
						  var json = $.parseJSON(doc.aggettivi_xpointer_ss[k]);
						  g = json.value;
						  if (aggettivo == g) {
							  xpointers = json.xpointers.split("; ");
							  for (var co = 0; co < xpointers.length; co++) {
							  	  allXpointers.push(xpointers[co]);
								  if (this.punditLive) {
									  if (allXpointers.length > 10) {
								   		 angular.element('#consolidatehook').scope().dwload(allXpointers);
								 		 allXpointers = new Array();
									  }	
								  }								  
							  }
							  
						  }
					  
					  }

				  }
			  }
		  }	
		  
		  if (doc.grafie_xpointer_ss !== undefined) {
			  for (var k = 0; k < doc.grafie_xpointer_ss.length ; k++) {
				  var json = $.parseJSON(doc.grafie_xpointer_ss[k]);
				  n = json.nome;
				  g = json.value;
				  if (this.showAllAnnotations || ( (nomeStruct[n] !== undefined && nomeStruct[n].length == 0)  ||  ($.inArray(g, nomeStruct[n]) != -1) ) ) {
					  xpointers = json.xpointers.split("; ");
					  for (var co = 0; co < xpointers.length; co++) {
						  
		  		        var item = {
		  		            uri: xpointers[co],
		  		            label: n,
		  		            description: n,
		  		            type: ["http://purl.org/pundit/ont/ao#fragment-text"],
							link: "http://nomi.gramsciproject.org/index-nomi.html#" + encodeURIComponent('{"facets_selector":{"nome_s":"' + n + '"}}')
		  		        };
						  
					  	  allXpointers.push(xpointers[co]);
						  allItems.push(item);
						  if (this.punditLive) {
							  if (allXpointers.length > 10) {
						   		 angular.element('#consolidatehook').scope().dwload(allXpointers);
						 		 allXpointers = new Array();
							  }	
						  }								  
					  }
					  
				  }
			  
			  }

		  }
		  
	  }
	  
    }
	/*CONSOLIDATION OF NNOTATIONS*/
	if (this.showAnnotations && this.punditLive) {
	  	if (allXpointers.length > 0) {
	 		angular.element('#consolidatehook').scope().dwload(allXpointers);
			allXpointers = new Array();
	  	}	
	}
  	/*CONSOLIDATION OF NNOTATIONS*/
	if (this.showAnnotations && !this.punditLive && typeof angular != 'undefined') {
			
			angular.element('#consolidatehook').scope().consolidateItems(allItems,allXpointers);
			//var punditItems = angular.element('#consolidatehook').scope().addOnMouseOver();
			
			//angular.element('#consolidatehook').scope().consolidate(allXpointers);
	}
	
	
  },

  template: function (doc, forceOpenAccordion) {
    var snippet = '';
    var start;
    var lastSpaceBar;
    var abstractText = '';
    var allText = ''; '<span class="allText-' + doc.id + '">' + doc.text[0] + '<span>';

    /*
    if (doc.text[0].length > 600) {
        start = doc.text[0].substring(0, 600);
        lastSpaceBar = start.lastIndexOf(" ");
        start = start.substring(0,lastSpaceBar);
        abstractText = '<div id="abstractText-' + doc.id + '">' + start + '...</div>';
        allText = '<div id="allText-' + doc.id + '" class="allText-' + doc.id + ' hidden">' + doc.text[0] + '</div>';
    } else {
    */
      allText = '<div id="allText-' + doc.id + '">' + doc.text[0] + '</div>';
    //}

    if (abstractText !== '') {
      snippet += abstractText + allText;
    }
    else {
      snippet += allText;
    }

    docUrl = doc.uri_ss[0];
	  shownAt = doc.isShownAt_ss[0];

    if (abstractText !== '') {
      snippet += '<div class="small text-right" style="margin-top:10px"><span id="allTextLink-' + doc.id + '"><a href="#" id="lnkSeeAllText-' + doc.id +'" onClick="seeAllText(' + doc.id + ');">See all text</a> - </span><a href="' + shownAt + '" target="_blank">See in <strong>GramsciProject.org</strong></a> - <a href="http://feed.thepund.it/?b=' + encodeURIComponent(shownAt) +'.html&conf=' + encodeURIComponent("http://gramsciproject.org/pundit-conf/pundit-gramsci.js") + '"  target="_blank">Annotate with Pundit</a></divs>';
    } else {
      snippet += '<div class="small text-right" style="margin-top:10px"><a href="' + shownAt + '" target="_blank">Visualizza nella <strong>BoxView</strong></a> - <a href="http://feed.thepund.it/?b=' + encodeURIComponent(shownAt) +'.html&conf=' + encodeURIComponent("http://gramsciproject.org/pundit-conf/pundit-gramsci.js") + '"  target="_blank">Annota con Pundit</a></divs>';
    }

    var output =  '<div class="panel panel-default"><a id="a-' + doc.id + '" name="a-' + doc.id + '"></a>' +
                    '<div class="panel-heading">' +
                      '<h4>' +
                        '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + doc.id + '">';

    if (doc.label_ss != null) {
        output += doc.label_ss + ' - ' + doc.title_s;
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

    // Panel body
    output += '<div id="collapse' + doc.id + '"  data-docid="' + doc.id + '" class="panel-collapse collapse ' + openPanels + '">' +
                '<div class="panel-body">';

    if (doc.type_ss != undefined) {
        output += '<p><strong>Type: ' + doc.type_ss + '</strong><p/>';
    }
    output += '<p>' + snippet + '</p>';

    output +=   '</div>' +
              '</div>'

    // close accordion div
    output += '</div></div>';

    /*
    if (doc.notebook_author_ss != undefined && doc.notebook_id_ss != undefined) {
        output += '<hr/>' + doc.notebook_author_ss + ' annotated this note. <a href="http://ask.thepund.it/#/notebooks/' + doc.notebook_id_ss +'" target="_blank"><br/>See notebook at Ask.ThePund.it</a></div>';
    }
    output += "<hr/>";
    */
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