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
	  var wikipedia_fields = ['TradeUnion_ss','ProgrammingLanguage_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Film_ss','EthnicGroup_ss','CelestialBody_ss','Building_ss','Athlete_ss','ArchitecturalStructure_ss','Aircraft_ss','Actor_ss','Scientist_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','MusicalArtist_ss','MilitaryConflict_ss','Event_ss','Award_ss','AcademicJournal_ss','WorldHeritageSite_ss','Magazine_ss','Band_ss','Artist_ss','Newspaper_ss','GovernmentAgency_ss','Website_ss','Software_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Thing_ss':'Unclassified entity','TradeUnion_ss':'TradeUnion','ProgrammingLanguage_ss':'ProgrammingLanguage','NaturalPlace_ss':'NaturalPlace','MusicGenre_ss':'MusicGenre','Mountain_ss':'Mountain','MilitaryUnit_ss':'MilitaryUnit','MemberOfParliament_ss':'MemberOfParliament','MeanOfTransportation_ss':'MeanOfTransportation','Film_ss':'Film','EthnicGroup_ss':'EthnicGroup','CelestialBody_ss':'CelestialBody','Building_ss':'Building','Athlete_ss':'Athlete','ArchitecturalStructure_ss':'ArchitecturalStructure','Aircraft_ss':'Aircraft','Actor_ss':'Actor','Scientist_ss':'Scientist','PoliticalParty_ss':'PoliticalParty','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','MusicalArtist_ss':'MusicalArtist','MilitaryConflict_ss':'MilitaryConflict','Event_ss':'Event','Award_ss':'Award','AcademicJournal_ss':'AcademicJournal','WorldHeritageSite_ss':'WorldHeritageSite','Magazine_ss':'Magazine','Band_ss':'Band','Artist_ss':'Artist','Newspaper_ss':'Newspaper','GovernmentAgency_ss':'GovernmentAgency','Website_ss':'Website','Software_ss':'Software','WrittenWork_ss':'WrittenWork','PeriodicalLiterature_ss':'PeriodicalLiterature','Disease_ss':'Disease','Politician_ss':'Politician','City_ss':'City','University_ss':'University','Company_ss':'Company','Work_ss':'Work','Person_ss':'Person','Organisation_ss':'Organisation','Place_ss':'Place'/*auto-facets-mapping-here*/};

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
      fields: ['Source_s','Thing_ss','TradeUnion_ss','ProgrammingLanguage_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Film_ss','EthnicGroup_ss','CelestialBody_ss','Building_ss','Athlete_ss','ArchitecturalStructure_ss','Aircraft_ss','Actor_ss','Scientist_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','MusicalArtist_ss','MilitaryConflict_ss','Event_ss','Award_ss','AcademicJournal_ss','WorldHeritageSite_ss','Magazine_ss','Band_ss','Artist_ss','Newspaper_ss','GovernmentAgency_ss','Website_ss','Software_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Notebook_ss','Source_s','Thing_ss','TradeUnion_ss','ProgrammingLanguage_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Film_ss','EthnicGroup_ss','CelestialBody_ss','Building_ss','Athlete_ss','ArchitecturalStructure_ss','Aircraft_ss','Actor_ss','Scientist_ss','PoliticalParty_ss','Non-ProfitOrganisation_ss','MusicalArtist_ss','MilitaryConflict_ss','Event_ss','Award_ss','AcademicJournal_ss','WorldHeritageSite_ss','Magazine_ss','Band_ss','Artist_ss','Newspaper_ss','GovernmentAgency_ss','Website_ss','Software_ss','WrittenWork_ss','PeriodicalLiterature_ss','Disease_ss','Politician_ss','City_ss','University_ss','Company_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-request-here*/],
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
