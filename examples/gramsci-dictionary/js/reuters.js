var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://metasound.dibet.univpm.it:8080/solr-gramsci-dictionary/'
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

    var fields = ['topic_ss', 'type_ss', 'norm_length_s', 'cites_quaderno_ss', 'author_s'];
    var facetsNamesMapping = {"type_ss":"Tipo di voce", "norm_length_s":"Lunghezza voce", "topic_ss":"Tema", "cites_quaderno_ss":"Contiene citazioni da", "label_s":"Titolo della voce", "text":"Testo della voce"};
    
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
//    'Gramsci dictionary', 'DBpedia entity', 'Public Notebook'
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
      fields: [ 'text']
    }));
    Manager.init();
    var query;
    if (location.href.indexOf('?title=') != -1) {
        query = 'label_s:"' + decodeURI(location.href.split('?title=')[1]) + '"';
        // XXX: we need to remove the query string from the URL 
        // to avoid bad behaviours with click on subsequent links in the pages....
    } else {
        query = "*:*";
    }
    Manager.store.addByValue('q', query);
    var params = {
      facet: true,
      'facet.field': [ 'topic_ss', 'type_ss', 'norm_length_s', 'cites_quaderno_ss', 'label_s', 'author_s'],
      'facet.limit': 200,
      'facet.mincount': 1,
      'json.nl': 'map',
      'sort': 'label_s asc',
      'rows': 50
      
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

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
