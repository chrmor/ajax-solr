var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.ApiManager({
	  //solrUrl: 'http://localhost:8983/solr/'
      solrUrl: 'http://gramsciproject.org:8080/solr-gramsci-quaderni/'
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
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'bottom_pager',
      target: '#bottom_pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#bottom_pager-header').html($('<span style="margin:3pt"></span>').text(''));
      }
    }));

    var fields = ['topic_ss', 'quaderno_struct_ss', 'nome_ss', 'title_s'];
	  var wikipedia_fields = ['mentions_subject_ss', 'mentions_ss', 'mentions_place_ss', 'mentions_book_ss', 'mentions_language_ss', 'mentions_event_ss', 'mentions_person_ss',  'mentions_type_ss', 'title_s' ];
    var facetsNamesMapping = {'aggettivo_ss': 'Aggettivazione del nome', 'grafia_ss': 'Grafia nome', 'nome_ss': 'Indice dei nomi', 'mentions_ss': 'Cita', 'cited_by_ss': 'Voce Dizionario', 'mentions_place_ss': 'Luoghi', 'mentions_book_ss': 'Libri', 'mentions_language_ss': 'Lingue', 'mentions_event_ss': 'Eventi', 'mentions_person_ss': 'Persone', 'annotated_in_ss': 'Annotato con Pundit', 'annotated_by_ss': 'Utenti di Pundit', 'topic_ss': 'Indice tematico', 'fulltext_t': 'Testo della nota', 'quaderno_struct_ss': 'Quaderno', 'quaderno_s': 'Quaderno', 'title_s': 'Titolo della nota', 'label_ss': 'Nota'};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.SmallFacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
        //multivalue: false
        //enableOrQuery: true
      }));
    }
    for (var i = 0, l = wikipedia_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.WikipediaSmallFacetsWidget({
        id: wikipedia_fields[i],
        target: '#' + wikipedia_fields[i],
        field: wikipedia_fields[i]
        // enableOrQuery: true
      }));
    }
    /*
    Manager.addWidget(new AjaxSolr.FacetsWidget({
        id: cited_by_ss,
        target: '#cited_by_ss' ,
        field: 'cited_by_ss'
    }));
    */
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection',
      facetsNamesMapping: facetsNamesMapping
    }));
	/*
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'note',
      target: '#note_search',
      fields: ['label_ss'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
	*/
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: ['fulltext_t', 'title_s'],
      facetsNamesMapping: facetsNamesMapping,
      // submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dic_text',
      target: '#dic_search',
      fields: [ 'topic_ss'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'nomi_text',
      target: '#nomi_search',
      fields: [ 'nome_ss'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dbp_text',
      target: '#dbp_search',
      fields: [ 'fulltext_t', 'nome_ss', 'nome_xpointer_ss', 'mentions_subject_ss', 'mentions_ss', 'mentions_person_ss', 'mentions_event_ss', 'mentions_book_ss', 'mentions_place_ss', 'mentions_language_ss', 'mentions_type_ss'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
    //   id: 'event_text',
    //   target: '#event_search',
    //   fields: [ 'mentions_event_ss'],
    //   facetsNamesMapping: facetsNamesMapping,
    //   submitOnlyIfTermSelect: true
    // }));
    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
//       id: 'book_text',
//       target: '#book_search',
//       fields: [ 'mentions_book_ss'],
//       facetsNamesMapping: facetsNamesMapping,
//       submitOnlyIfTermSelect: true
//     }));
    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
//       id: 'place_text',
//       target: '#place_search',
//       fields: [ 'mentions_place_ss'],
//       facetsNamesMapping: facetsNamesMapping,
//       submitOnlyIfTermSelect: true
//     }));
    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
//       id: 'language_text',
//       target: '#language_search',
//       fields: [ 'mentions_language_ss'],
//       facetsNamesMapping: facetsNamesMapping,
//       submitOnlyIfTermSelect: true
//     }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'quaderno_s', 'aggettivo_ss', 'grafia_ss', 'fulltext_t', 'label_ss', 'nome_ss', 'text', 'cited_by_ss', 'mentions_subject_ss', 'mentions_ss', 'mentions_place_ss', 'mentions_book_ss', 'mentions_language_ss', 'mentions_event_ss', 'mentions_person_ss', 'annotated_in_ss', 'annotated_by_ss', 'mentions_type_ss', 'topic_ss', 'quaderno_struct_ss'],
      'facet.limit': 1000,
      'facet.mincount': 1,
      'sort': 'quaderno_f asc, nota_i asc, subnota_i asc',
      'json.nl': 'map',
      'rows': 50
    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    // Process URI
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
