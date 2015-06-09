var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.ApiManager ({
      solrUrl: 'http://gramsciproject.org:8080/solr-gramsci-dictionary/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span style="margin:3pt"></span>').text('Stai visualizzando da ' + Math.min(total, offset + 1) + ' a ' + Math.min(total, offset + perPage) + ' di ' + total + ' risultati'));
      }
    }));

    var fields = ['topic_ss', 'type_ss', 'norm_length_s', 'cites_quaderno_ss', 'author_s', 'media_ss'];
    var facetsNamesMapping = {'author_s': 'Autore dell voce', 'type_ss': 'Tipo di voce', 'norm_length_s': 'Lunghezza voce', 'topic_ss': 'Tema', 'cites_quaderno_ss': 'Contiene citazioni da', 'label_s': 'Titolo della voce', 'text': 'Testo della voce', 'media_ss': 'Media'};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.FacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection',
      facetsNamesMapping: facetsNamesMapping
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dic_title_text',
      target: '#dic_title_search',
      fields: [ 'label_s'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dic_text',
      target: '#dic_search',
      fields: [ 'text'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: false,
      autocompleteOnlyOnStartWith: true
    }));
    Manager.init();
    var query = "*:*";
  	Manager.store.addByValue('q', query);
  	Manager.store.addByValue('q.op', 'AND');


  	// API: USE TEH FRAGMENT TO SHOW A SINGLE PAGE...
  	if (location.hash.indexOf('title:') != -1) {
      query = 'label_s:' + AjaxSolr.Parameter.escapeValue(decodeURI(location.hash.split(':')[1].replace(new RegExp('\\+', 'g'),' ')).replace(new RegExp('%2C', 'g'),','));
      Manager.store.addByValue('fq', query);
  		location.hash = "";
    }

    var params = {
      facet: true,
      'facet.field': [ 'topic_ss', 'type_ss', 'norm_length_s', 'cites_quaderno_ss', 'label_s', 'author_s', 'text', 'media_ss'],
      'facet.limit': 200,
      'facet.mincount': 1,
      'json.nl': 'map',
      'sort': 'label_s asc',
      'rows': 50

    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    Manager.processURI(location, params['facet.field']);

    Manager.doRequest();

  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);

$(document).ready(function() {
  $('[data-toggle="popover"]').popover({
    container: 'body',
    html: true,
    trigger: 'focus',
    title: 'Search Instructions',
  });
});
