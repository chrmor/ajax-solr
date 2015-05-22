function toggleOrQuery() {
  if (enableOr == true) enableOr = false;
  else enableOr = true;
  if (enableOr==true) alert('OR-ed filters are now ENABLED.'); else alert('OR-ed filters are now DISABLED.');
}

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
        $('#pager-header').html($('<span style="margin:3pt"></span>').text('Viewing from ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total + ' results'));
      }
    }));

    var fields = ['Source_s','Thing_ss'];
	  var wikipedia_fields = ['Website_ss','TradeUnion_ss','Software_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Magazine_ss','Film_ss','Event_ss','EthnicGroup_ss','Band_ss','Award_ss','Artist_ss','AdministrativeRegion_ss','WrittenWork_ss','WorldHeritageSite_ss','PeriodicalLiterature_ss','Non-ProfitOrganisation_ss','City_ss','GovernmentAgency_ss','President_ss','Politician_ss','OfficeHolder_ss','Company_ss','Settlement_ss','Work_ss','University_ss','EducationalInstitution_ss','Disease_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Thing_ss':'Unclassified entity','Website_ss':'Website','TradeUnion_ss':'TradeUnion','Software_ss':'Software','ProgrammingLanguage_ss':'ProgrammingLanguage','PoliticalParty_ss':'PoliticalParty','Newspaper_ss':'Newspaper','MusicalArtist_ss':'MusicalArtist','MusicGenre_ss':'MusicGenre','MilitaryUnit_ss':'MilitaryUnit','MilitaryConflict_ss':'MilitaryConflict','Magazine_ss':'Magazine','Film_ss':'Film','Event_ss':'Event','EthnicGroup_ss':'EthnicGroup','Band_ss':'Band','Award_ss':'Award','Artist_ss':'Artist','AdministrativeRegion_ss':'AdministrativeRegion','WrittenWork_ss':'WrittenWork','WorldHeritageSite_ss':'WorldHeritageSite','PeriodicalLiterature_ss':'PeriodicalLiterature','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','City_ss':'City','GovernmentAgency_ss':'GovernmentAgency','President_ss':'President','Politician_ss':'Politician','OfficeHolder_ss':'OfficeHolder','Company_ss':'Company','Settlement_ss':'Settlement','Work_ss':'Work','University_ss':'University','EducationalInstitution_ss':'EducationalInstitution','Disease_ss':'Disease','Person_ss':'Person','Country_ss':'Country','PopulatedPlace_ss':'PopulatedPlace','Place_ss':'Place','Organisation_ss':'Organisation'/*auto-facets-mapping-here*/};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.SmallFacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i],
        enableOrQuery: false
      }));
    }
    for (var i = 0, l = wikipedia_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.WikipediaSmallFacetsWidget({
        id: wikipedia_fields[i],
        target: '#' + wikipedia_fields[i],
        field: wikipedia_fields[i],
		enableOrQuery: false
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
      fields: [ 'title_s'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dbp_text',
      target: '#dbp_search',
      fields: ['Source_s','Thing_ss','Website_ss','TradeUnion_ss','Software_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Magazine_ss','Film_ss','Event_ss','EthnicGroup_ss','Band_ss','Award_ss','Artist_ss','AdministrativeRegion_ss','WrittenWork_ss','WorldHeritageSite_ss','PeriodicalLiterature_ss','Non-ProfitOrganisation_ss','City_ss','GovernmentAgency_ss','President_ss','Politician_ss','OfficeHolder_ss','Company_ss','Settlement_ss','Work_ss','University_ss','EducationalInstitution_ss','Disease_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Source_s','Thing_ss','Website_ss','TradeUnion_ss','Software_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Magazine_ss','Film_ss','Event_ss','EthnicGroup_ss','Band_ss','Award_ss','Artist_ss','AdministrativeRegion_ss','WrittenWork_ss','WorldHeritageSite_ss','PeriodicalLiterature_ss','Non-ProfitOrganisation_ss','City_ss','GovernmentAgency_ss','President_ss','Politician_ss','OfficeHolder_ss','Company_ss','Settlement_ss','Work_ss','University_ss','EducationalInstitution_ss','Disease_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
      'facet.mincount': 1,
      //'sort': 'id',
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
