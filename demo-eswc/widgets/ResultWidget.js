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
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));

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

  template: function (doc) {
    var snippet = '';
    var start;
    var lastSpaceBar

    //docUrl = doc.uri_ss[0];
	//shownAt = doc.isShownAt_ss[0];
    snippet += '<div class="small text-right"><a href="' + doc.id + '" target="_blank">See annotated page</strong></a></div>';
    var output = "";
    if (doc.title_s != null) {
         output += '<div><h4><em>' + doc.title_s + '<em><br/><small>  from <strong>' + doc.Source_s + '</strong></small></h4>';
    } else {
        output += '<div><h4>Unnamed element<small><br/>from <strong>' + doc.Source_s + '</strong></small></h4>';
    }

    output += '<p>' + snippet + '</p></div>'

    if (doc.notebook_author_ss != undefined && doc.notebook_id_ss != undefined) {
        output += '<hr/>' + doc.notebook_author_ss + ' annotated this note. <a href="http://ask.thepund.it/#/notebooks/' + doc.notebook_id_ss +'" target="_blank"><br/>See notebook at Ask.ThePund.it</a></div>';
    }
    output += "<hr/>";
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