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
	  var wikipedia_fields = ['TradeUnion_ss','ProgrammingLanguage_ss','MusicGenre_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Galaxy_ss','Film_ss','EthnicGroup_ss','ChemicalSubstance_ss','ChemicalCompound_ss','Athlete_ss','AnatomicalStructure_ss','Aircraft_ss','Actor_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','NaturalPlace_ss','MusicalArtist_ss','Mountain_ss','MilitaryConflict_ss','Event_ss','Building_ss','Award_ss','ArchitecturalStructure_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','Magazine_ss','CelestialBody_ss','Band_ss','Artist_ss','Newspaper_ss','Website_ss','GovernmentAgency_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Software_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Thing_ss':'Unclassified entity','TradeUnion_ss':'TradeUnion','ProgrammingLanguage_ss':'ProgrammingLanguage','MusicGenre_ss':'MusicGenre','MilitaryUnit_ss':'MilitaryUnit','MemberOfParliament_ss':'MemberOfParliament','MeanOfTransportation_ss':'MeanOfTransportation','Library_ss':'Library','Galaxy_ss':'Galaxy','Film_ss':'Film','EthnicGroup_ss':'EthnicGroup','ChemicalSubstance_ss':'ChemicalSubstance','ChemicalCompound_ss':'ChemicalCompound','Athlete_ss':'Athlete','AnatomicalStructure_ss':'AnatomicalStructure','Aircraft_ss':'Aircraft','Actor_ss':'Actor','PoliticalParty_ss':'PoliticalParty','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','NaturalPlace_ss':'NaturalPlace','MusicalArtist_ss':'MusicalArtist','Mountain_ss':'Mountain','MilitaryConflict_ss':'MilitaryConflict','Event_ss':'Event','Building_ss':'Building','Award_ss':'Award','ArchitecturalStructure_ss':'ArchitecturalStructure','AcademicJournal_ss':'AcademicJournal','WorldHeritageSite_ss':'WorldHeritageSite','Scientist_ss':'Scientist','Magazine_ss':'Magazine','CelestialBody_ss':'CelestialBody','Band_ss':'Band','Artist_ss':'Artist','Newspaper_ss':'Newspaper','Website_ss':'Website','GovernmentAgency_ss':'GovernmentAgency','WrittenWork_ss':'WrittenWork','PeriodicalLiterature_ss':'PeriodicalLiterature','Disease_ss':'Disease','Software_ss':'Software','Politician_ss':'Politician','City_ss':'City','University_ss':'University','Company_ss':'Company','Work_ss':'Work','Person_ss':'Person','Organisation_ss':'Organisation','Place_ss':'Place'/*auto-facets-mapping-here*/};

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
      fields: ['Source_s','Thing_ss','TradeUnion_ss','ProgrammingLanguage_ss','MusicGenre_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Galaxy_ss','Film_ss','EthnicGroup_ss','ChemicalSubstance_ss','ChemicalCompound_ss','Athlete_ss','AnatomicalStructure_ss','Aircraft_ss','Actor_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','NaturalPlace_ss','MusicalArtist_ss','Mountain_ss','MilitaryConflict_ss','Event_ss','Building_ss','Award_ss','ArchitecturalStructure_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','Magazine_ss','CelestialBody_ss','Band_ss','Artist_ss','Newspaper_ss','Website_ss','GovernmentAgency_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Software_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Notebook_ss','Source_s','Thing_ss','TradeUnion_ss','ProgrammingLanguage_ss','MusicGenre_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Galaxy_ss','Film_ss','EthnicGroup_ss','ChemicalSubstance_ss','ChemicalCompound_ss','Athlete_ss','AnatomicalStructure_ss','Aircraft_ss','Actor_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','NaturalPlace_ss','MusicalArtist_ss','Mountain_ss','MilitaryConflict_ss','Event_ss','Building_ss','Award_ss','ArchitecturalStructure_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','Magazine_ss','CelestialBody_ss','Band_ss','Artist_ss','Newspaper_ss','Website_ss','GovernmentAgency_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Software_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
      'facet.mincount': 1,
      'sort': 'id desc',
      'json.nl': 'map',
      'rows': 60
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
