var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://gramsciproject.org:8080/solr-gramsci-media/'
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

    var fields = ['ctype_ss', 'type_s', 'subject_ss', 'contributor_ss', 'language_ss', 'date_s', 'description_s', 'dictionary_ss'];
    var facetsNamesMapping = {'ctype_ss': 'Tipologia Media', 'type_s': 'Tipologia Contributo', 'subject_ss': 'Keyword', 'contributor_ss':'Speaker', 'language_ss':'Lingua', 'date_s':'Data', 'title_s': 'Titolo', 'description_s': 'Descrizione', 'text': 'Testo', 'dictionary_ss': 'Voce del dizionario' };

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
      id: 'dic_text',
      target: '#dic_search',
      fields: [ 'text', 'title_s', 'contributor_ss', 'subject_ss', 'dictionary_ss' ],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: false,
      autocompleteOnlyOnStartWith: true
    }));
    Manager.init();
    var query;
    if (location.href.indexOf('?title=') != -1) {
        query = 'title_s:"' + decodeURI(location.href.split('?title=')[1]) + '"';
        // XXX: we need to remove the query string from the URL
        // to avoid bad behaviours with click on subsequent links in the pages....
    } else {
        query = "*:*";
    }
    Manager.store.addByValue('q', query);
    Manager.store.addByValue('q.op', 'AND');

    // API: USE TEH FRAGMENT TO SHOW A SINGLE PAGE...
    if (location.hash.indexOf('title:') != -1) {
      query = 'title_s:' + AjaxSolr.Parameter.escapeValue(decodeURI(location.hash.split('title:')[0].replace(new RegExp('\\+', 'g'),' ')).replace(new RegExp('%2C', 'g'),','));
      Manager.store.addByValue('fq', query);
      location.hash = "";
    }

    var params = {
      facet: true,
      'facet.field': [ 'ctype_ss', 'type_s', 'subject_ss', 'contributor_ss', 'dictionary_ss', 'language_ss', 'date_s', 'title_s', 'description_s', 'shownAt_s', 'text'],
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

$(document).ready(function() {
  $('[data-toggle="popover"]').popover({
    container: 'body',
    html: true,
    trigger: 'focus',
    title: 'Search Instructions',
  });
});
