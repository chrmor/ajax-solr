var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://gramsciproject.org:8080/solr-demo-eswc/'
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

    var fields = ['Source_s'];
	  var wikipedia_fields = ['PrimeMinister_ss','President_ss','OfficeHolder_ss','MilitaryConflict_ss','Event_ss','Thing_ss','Settlement_ss','PopulatedPlace_ss','Politician_ss','Place_ss','Person_ss','City_ss','Agent_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','PrimeMinister_ss':'PrimeMinister','President_ss':'President','OfficeHolder_ss':'OfficeHolder','MilitaryConflict_ss':'MilitaryConflict','Event_ss':'Event','Thing_ss':'Thing','Settlement_ss':'Settlement','PopulatedPlace_ss':'PopulatedPlace','Politician_ss':'Politician','Place_ss':'Place','Person_ss':'Person','City_ss':'City','Agent_ss':'Agent'/*auto-facets-mapping-here*/};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.SmallFacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i],
        multivalue: false
        //,
        //enableOrQuery: true
      }));
    }
    for (var i = 0, l = wikipedia_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.WikipediaSmallFacetsWidget({
        id: wikipedia_fields[i],
        target: '#' + wikipedia_fields[i],
        field: wikipedia_fields[i],
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
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'title_ss', 'text_ss'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dbp_text',
      target: '#dbp_search',
      fields: ['Source_s','PrimeMinister_ss','President_ss','OfficeHolder_ss','MilitaryConflict_ss','Event_ss','Thing_ss','Settlement_ss','PopulatedPlace_ss','Politician_ss','Place_ss','Person_ss','City_ss','Agent_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Source_s','PrimeMinister_ss','President_ss','OfficeHolder_ss','MilitaryConflict_ss','Event_ss','Thing_ss','Settlement_ss','PopulatedPlace_ss','Politician_ss','Place_ss','Person_ss','City_ss','Agent_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
      'facet.mincount': 1,
      //'sort': 'quaderno_f asc, nota_i asc',
      'json.nl': 'map'
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
