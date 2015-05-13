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

    var fields = [];
	  var wikipedia_fields = ['Settlement_ss','Country_ss','Politician_ss','TelevisionStation_ss','Thing_ss','OfficeHolder_ss','Agent_ss','Company_ss','President_ss','PoliticalParty_ss','Place_ss','PopulatedPlace_ss','City_ss','Broadcaster_ss','Person_ss','Organisation_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Settlement_ss':'Settlement','Country_ss':'Country','Politician_ss':'Politician','TelevisionStation_ss':'TelevisionStation','Thing_ss':'Thing','OfficeHolder_ss':'OfficeHolder','Agent_ss':'Agent','Company_ss':'Company','President_ss':'President','PoliticalParty_ss':'PoliticalParty','Place_ss':'Place','PopulatedPlace_ss':'PopulatedPlace','City_ss':'City','Broadcaster_ss':'Broadcaster','Person_ss':'Person','Organisation_ss':'Organisation'/*auto-facets-mapping-here*/};

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
      fields: ['Settlement_ss','Country_ss','Politician_ss','TelevisionStation_ss','Thing_ss','OfficeHolder_ss','Agent_ss','Company_ss','President_ss','PoliticalParty_ss','Place_ss','PopulatedPlace_ss','City_ss','Broadcaster_ss','Person_ss','Organisation_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Settlement_ss','Country_ss','Politician_ss','TelevisionStation_ss','Thing_ss','OfficeHolder_ss','Agent_ss','Company_ss','President_ss','PoliticalParty_ss','Place_ss','PopulatedPlace_ss','City_ss','Broadcaster_ss','Person_ss','Organisation_ss'/*auto-facets-request-here*/],
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
