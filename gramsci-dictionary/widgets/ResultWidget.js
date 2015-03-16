function isOnScreen($elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

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
      // We set start to 0 beacause we want to select the first page of results!!!
	  self.start = 0;
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
      items = items.concat(this.facetLinks('label_s', doc.related_to_ss));
      //items = items.concat(this.facetLinks('organisations', doc.organisations));
      //items = items.concat(this.facetLinks('exchanges', doc.exchanges));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        var $span = $('<span></span>');
        $span.append(items[j]);

        if (j != items.length-1)
          $span.append(',&nbsp;')

        $links.append($span);
      }

	  items = [];
	  items = items.concat(this.facetLinks('author_s', [doc.author_s]));
      $links = $('#author_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        var $span = $('<span></span>');
        $span.append(items[j]);

        if (j != items.length-1)
          $span.append(',&nbsp;')

        $links.append($span);
      }

		  items = [];
		  items = items.concat(this.facetLinks('topic_ss', doc.topic_ss));
	      $links = $('#topics_' + doc.id);
	      $links.empty();
	      for (var j = 0, m = items.length; j < m; j++) {
          var $span = $('<span></span>');
          $span.append(items[j]);

          if (j != items.length-1)
            $span.append(',&nbsp;')

          $links.append($span);
	      }

        items = [];
        items = items.concat(this.facetLinks('media_ss', doc.media_ss));
        $links = $('#media_' + doc.id);
        $links.empty();
        for (var j = 0, m = items.length; j < m; j++) {
          var $span = $('<span></span>');
          // $span.append(items[j]);

          var link = 'http://media.gramsciproject.org/#title:' + encodeURIComponent(doc.media_ss[j]);
          $span.append($('<a href="' + link + '" target="_blank">' + doc.media_ss[j] + '</a>'));

          if (j != items.length-1)
            $span.append(',&nbsp;')

          $links.append($span);
        }
    }

    var scrolled = false;
    $('#accordion').on('shown.bs.collapse', function (e) {
      var $element = $(e.target)
      var docid = $element.attr('data-docid');
      var $targetElement = $('#a-' + docid);

      if (!isOnScreen($targetElement) ) {
        scrolled = true;
        $('html, body').animate({
          scrollTop: $targetElement.offset().top - 10
        }, 300);
      }
    });

    if (!scrolled) {
      var doc = this.manager.response.response.docs[0];
      var $targetElement = $('#a-' + doc.id);
      if (!isOnScreen($targetElement) ) {
        $('html, body').animate({
          scrollTop: $targetElement.offset().top - 10
        }, 300);
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
    output += '<div class="panel panel-default"><a id="a-' + doc.id + '" name="a-' + doc.id + '"></a>' +
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

    output += '<div id="collapse' + doc.id + '"  data-docid="' + doc.id + '" class="panel-collapse collapse ' + openPanels + '">' +
                      '<div class="panel-body">';

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

    output += '<hr/>';

    output += '  <h5>Autore della voce: <span id="author_' + doc.id + '" class="ctype"></h5>';
    if (doc.topic_ss)
      output += '<h5 style="margin-top:10px">Tema: <span id="topics_' + doc.id + '" class="topics"></span></h5>';

  	if (doc.related_to_ss)
      output += '<h5 style="margin-top:10px">Vedi anche le voci: <span id="links_' + doc.id + '" class="links"></span></h5>';

    if (doc.media_ss)
      output += '<h5 style="margin-top:10px">Vedi anche i media: <span id="media_' + doc.id + '" class="media"></span></h5>';

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