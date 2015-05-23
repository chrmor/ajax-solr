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
	var dataFields = ['Notebook_ss'];
	  var wikipedia_fields = ['Website_ss','TradeUnion_ss','Scientist_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Film_ss','Event_ss','EthnicGroup_ss','CelestialBody_ss','Band_ss','Award_ss','AdministrativeRegion_ss','AcademicJournal_ss','WorldHeritageSite_ss','Software_ss','Non-ProfitOrganisation_ss','Magazine_ss','Artist_ss','WrittenWork_ss','PeriodicalLiterature_ss','GovernmentAgency_ss','City_ss','President_ss','Politician_ss','OfficeHolder_ss','Settlement_ss','Company_ss','Disease_ss','Work_ss','University_ss','EducationalInstitution_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Thing_ss':'Unclassified entity','Website_ss':'Website','TradeUnion_ss':'TradeUnion','Scientist_ss':'Scientist','ProgrammingLanguage_ss':'ProgrammingLanguage','PoliticalParty_ss':'PoliticalParty','Newspaper_ss':'Newspaper','MusicalArtist_ss':'MusicalArtist','MusicGenre_ss':'MusicGenre','MilitaryUnit_ss':'MilitaryUnit','MilitaryConflict_ss':'MilitaryConflict','Film_ss':'Film','Event_ss':'Event','EthnicGroup_ss':'EthnicGroup','CelestialBody_ss':'CelestialBody','Band_ss':'Band','Award_ss':'Award','AdministrativeRegion_ss':'AdministrativeRegion','AcademicJournal_ss':'AcademicJournal','WorldHeritageSite_ss':'WorldHeritageSite','Software_ss':'Software','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','Magazine_ss':'Magazine','Artist_ss':'Artist','WrittenWork_ss':'WrittenWork','PeriodicalLiterature_ss':'PeriodicalLiterature','GovernmentAgency_ss':'GovernmentAgency','City_ss':'City','President_ss':'President','Politician_ss':'Politician','OfficeHolder_ss':'OfficeHolder','Settlement_ss':'Settlement','Company_ss':'Company','Disease_ss':'Disease','Work_ss':'Work','University_ss':'University','EducationalInstitution_ss':'EducationalInstitution','Person_ss':'Person','Country_ss':'Country','PopulatedPlace_ss':'PopulatedPlace','Place_ss':'Place','Organisation_ss':'Organisation'/*auto-facets-mapping-here*/};

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
    for (var i = 0, l = dataFields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.DataSmallFacetsWidget({
        id: dataFields[i],
        target: '#' + dataFields[i],
        field: dataFields[i],
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
      fields: ['Notebook_ss','Source_s','Thing_ss','Website_ss','TradeUnion_ss','Scientist_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Film_ss','Event_ss','EthnicGroup_ss','CelestialBody_ss','Band_ss','Award_ss','AdministrativeRegion_ss','AcademicJournal_ss','WorldHeritageSite_ss','Software_ss','Non-ProfitOrganisation_ss','Magazine_ss','Artist_ss','WrittenWork_ss','PeriodicalLiterature_ss','GovernmentAgency_ss','City_ss','President_ss','Politician_ss','OfficeHolder_ss','Settlement_ss','Company_ss','Disease_ss','Work_ss','University_ss','EducationalInstitution_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Notebook_ss','Source_s','Thing_ss','Website_ss','TradeUnion_ss','Scientist_ss','ProgrammingLanguage_ss','PoliticalParty_ss','Newspaper_ss','MusicalArtist_ss','MusicGenre_ss','MilitaryUnit_ss','MilitaryConflict_ss','Film_ss','Event_ss','EthnicGroup_ss','CelestialBody_ss','Band_ss','Award_ss','AdministrativeRegion_ss','AcademicJournal_ss','WorldHeritageSite_ss','Software_ss','Non-ProfitOrganisation_ss','Magazine_ss','Artist_ss','WrittenWork_ss','PeriodicalLiterature_ss','GovernmentAgency_ss','City_ss','President_ss','Politician_ss','OfficeHolder_ss','Settlement_ss','Company_ss','Disease_ss','Work_ss','University_ss','EducationalInstitution_ss','Person_ss','Country_ss','PopulatedPlace_ss','Place_ss','Organisation_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
      'facet.mincount': 1,
      'sort': 'id desc',
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
