(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'gramsci-dictionary/images/ajax-loader.gif'));
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
    }
  },

  template: function (doc, forceOpenAccordion) {
    var snippet = '';

    /*
    var start;
    var lastSpaceBar
    if (doc.text[0].length > 600) {
        start = doc.text[0].substring(0, 600);
        lastSpaceBar = start.lastIndexOf(" ");
        start = start.substring(0,lastSpaceBar);
        snippet += ' ' + start + '...';
    } else {
        snippet += doc.text[0];
    }
    */

    var output = "";
    output += '<div class="panel panel-default">' +
                        '<div class="panel-heading">' +
                              '<h4>' +
                                '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + doc.id + '">';

    if (doc.label_s != null) {
        output += doc.label_s;
    } else {
        output += 'Unnamed element';
    }

    output += '</a></h4s></div>';

    var openPanels;
    if (forceOpenAccordion /* location.href.indexOf('?uri=') != -1 */) {
        openPanels = 'in';
    } else {
        openPanel = '';
    }

    output += '<div id="collapse' + doc.id + '" class="panel-collapse collapse ' + openPanels + '">' +
                      '<div class="panel-body">';

    if (doc.type_ss != undefined) {
        output += '<p><strong>Type: ' + doc.type_ss + '</strong><p/>';
    }


    //snippet += doc.text[0];

    var entryFile;
    var localName = doc.uri_ss[0].split("/")[doc.uri_ss[0].split("/").length - 1];
    entryFile = "gramsci-dictionary/dictionary_entries/" + localName + "/index.html";

    $.ajax({
      url: entryFile,
      async: false
    }).done(function(data) {
      snippet += data;
    });

    //snippet += '<div class="small text-right"><a href="' + doc.uri_ss[0] + '" target="_blank">Vedi voce intera</a></div>';

    output += '<p>' + snippet + '</p>';

	if (doc.related_to_ss.length>0) {
		output += "<div><strong>Voci relazionate:</strong></div>";
	}

	for (var k=0; k < doc.related_to_ss.length; k++) {
		var relatedentity = doc.related_to_ss[k];		
		output += "<a href=\"/?title=" + relatedentity + "\">" + relatedentity + "</a></br>";
	}


    /*
    if (doc.annotated_by_ss != undefined && doc.notebook_id_ss != undefined) {
        output += '<hr/>' + doc.annotated_by_ss + ' annotated this note. <a href="http://ask.thepund.it/#/notebooks/' + doc.notebook_id_ss[0] +'" target="_blank"><br/>See notebook at Ask.ThePund.it</a></div>';
    }
    */

    output += '</div></div>';

    output += '</div>';

    return output;
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