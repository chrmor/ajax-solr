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
    $(this.target).html($('<img>').attr('src', 'gramsci-media/images/ajax-loader.gif'));
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
      items = items.concat(this.facetLinks('title_s', doc.related_to_ss));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<h5></h5>').append(items[j]));
      }

	  items = [];
	  items = items.concat(this.facetLinks('subject_ss', doc.subject_ss));
      $subjects = $('#subjects_' + doc.id);
      $subjects.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $subjects.append($('<h5></h5>').append(items[j]));
      }

	  items = [];
	  items = items.concat(this.facetLinks('contributor_ss', doc.contributor_ss));
      $contributors = $('#contributors_' + doc.id);
      $contributors.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $contributors.append($('<h5></h5>').append(items[j]));
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

    var output = "";
    output += '<div class="panel panel-default"><a id="a-' + doc.id + '" name="a-' + doc.id + '"></a>' +
                        '<div class="panel-heading">' +
                              '<h4>' +
                                '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + doc.id + '">';

    if (doc.title_s != null) {
        output += doc.title_s;
    } else {
        output += 'Unnamed media';
    }

    output += '</a></h4></div>';

    var openPanels;
    if (forceOpenAccordion) {
        openPanels = 'in';
    } else {
        openPanel = '';
    }

    output += '<div id="collapse' + doc.id + '"  data-docid="' + doc.id + '" class="panel-collapse collapse ' + openPanels + '">' +
                      '<div class="panel-body">';
        
    output += '<p>' + doc.description_s + '</p>';
    
    var generateDefaultMediaLink = false;
    if (doc.shownAt_s.indexOf('vimeo.com/') !== -1) {
        var videoId = '';
        var uriTokens = doc.shownAt_s.split('/');
        
        for (var i = uriTokens.length-1; i >= 0; i--) {
            var token = uriTokens[i];
            if (/^[0-9]+$/.test(token)) {
                videoId = token;
                break;
            }
        }
        
        if (videoId !== '') {
            output += '<iframe src="//player.vimeo.com/video/' + videoId + '?title=0&amp;byline=0&amp;portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        } else {
            generateDefaultMediaLink = true;
        }
        
    } else if (doc.shownAt_s.indexOf('youtube.com/') !== -1) {
        var videoId = '';
        var indexOfVParameter = doc.shownAt_s.indexOf('?v=');
        if (indexOfVParameter !== -1) {
            videoId = doc.shownAt_s.substring(indexOfVParameter+3, doc.shownAt_s.length);
            videoId = videoId.split('&')[0];            
            output += '<iframe width="560" height="315" src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
        } else {
            generateDefaultMediaLink = true;
        }        
    } else {
        generateDefaultMediaLink = true;
    }
    
    if (generateDefaultMediaLink) {
        output += '<p><a href="' + doc.shownAt_s + '" target="_blank">Accedi al Media</a></p>';
    }

	output += '<hr/>';
	
    output += '<div class="col-xs-6" style="margin-left:0;padding-left:0">';    
    output += '  <h5>Tema: <a id="subjects_' + doc.id + '" class="subjects"></a></h5>';    
    output += '</div>';
    output += '<div class="col-xs-6" style="margin-left:0;padding-left:0">';
    output += '  <h5>Speaker: <a id="contributors_' + doc.id + '" class="contributors"></a></h5>';
    output += '</div>';
    
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