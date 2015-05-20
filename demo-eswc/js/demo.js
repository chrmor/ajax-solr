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
	  var wikipedia_fields = ['Person_ss','SpaceStation_ss','Event_ss','Place_ss','PrimeMinister_ss','Animal_ss','Artist_ss','Species_ss','Company_ss','AdministrativeRegion_ss','Website_ss','OfficeHolder_ss','Thing_ss','Astronaut_ss','Settlement_ss','Organisation_ss','MusicalArtist_ss','Eukaryote_ss','City_ss','PopulatedPlace_ss','Work_ss','tagType_ss','MeanOfTransportation_ss','Non-ProfitOrganisation_ss','President_ss','MilitaryConflict_ss','ProgrammingLanguage_ss','Scientist_ss','Disease_ss','Arachnid_ss','Software_ss','EthnicGroup_ss','Agent_ss','VideoGame_ss','Date_ss','Politician_ss','Country_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Person_ss':'Person','SpaceStation_ss':'SpaceStation','Event_ss':'Event','Place_ss':'Place','PrimeMinister_ss':'PrimeMinister','Animal_ss':'Animal','Artist_ss':'Artist','Species_ss':'Species','Company_ss':'Company','AdministrativeRegion_ss':'AdministrativeRegion','Website_ss':'Website','OfficeHolder_ss':'OfficeHolder','Thing_ss':'Thing','Astronaut_ss':'Astronaut','Settlement_ss':'Settlement','Organisation_ss':'Organisation','MusicalArtist_ss':'MusicalArtist','Eukaryote_ss':'Eukaryote','City_ss':'City','PopulatedPlace_ss':'PopulatedPlace','Work_ss':'Work','tagType_ss':'tagType','MeanOfTransportation_ss':'MeanOfTransportation','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','President_ss':'President','MilitaryConflict_ss':'MilitaryConflict','ProgrammingLanguage_ss':'ProgrammingLanguage','Scientist_ss':'Scientist','Disease_ss':'Disease','Arachnid_ss':'Arachnid','Software_ss':'Software','EthnicGroup_ss':'EthnicGroup','Agent_ss':'Agent','VideoGame_ss':'VideoGame','Date_ss':'Date','Politician_ss':'Politician','Country_ss':'Country'/*auto-facets-mapping-here*/};

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
      fields: ['Source_s','Person_ss','SpaceStation_ss','Event_ss','Place_ss','PrimeMinister_ss','Animal_ss','Artist_ss','Species_ss','Company_ss','AdministrativeRegion_ss','Website_ss','OfficeHolder_ss','Thing_ss','Astronaut_ss','Settlement_ss','Organisation_ss','MusicalArtist_ss','Eukaryote_ss','City_ss','PopulatedPlace_ss','Work_ss','tagType_ss','MeanOfTransportation_ss','Non-ProfitOrganisation_ss','President_ss','MilitaryConflict_ss','ProgrammingLanguage_ss','Scientist_ss','Disease_ss','Arachnid_ss','Software_ss','EthnicGroup_ss','Agent_ss','VideoGame_ss','Date_ss','Politician_ss','Country_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Source_s','Person_ss','SpaceStation_ss','Event_ss','Place_ss','PrimeMinister_ss','Animal_ss','Artist_ss','Species_ss','Company_ss','AdministrativeRegion_ss','Website_ss','OfficeHolder_ss','Thing_ss','Astronaut_ss','Settlement_ss','Organisation_ss','MusicalArtist_ss','Eukaryote_ss','City_ss','PopulatedPlace_ss','Work_ss','tagType_ss','MeanOfTransportation_ss','Non-ProfitOrganisation_ss','President_ss','MilitaryConflict_ss','ProgrammingLanguage_ss','Scientist_ss','Disease_ss','Arachnid_ss','Software_ss','EthnicGroup_ss','Agent_ss','VideoGame_ss','Date_ss','Politician_ss','Country_ss'/*auto-facets-request-here*/],
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
