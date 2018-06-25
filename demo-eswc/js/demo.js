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

    var fields = ['Date_template_ss','Place_template_ss','Person_template_ss','Topic_template_ss','Date_ss','Source_s','Thing_ss'];
	var dataFields = ['Notebook_ss'];
	  var wikipedia_fields = ['Writer_ss','TradeUnion_ss','Textfragment_ss','TennisTournament_ss','TennisPlayer_ss','SportsTeam_ss','Sport_ss','SoccerTournament_ss','SoccerLeague_ss','SoccerClub_ss','Single_ss','ProgrammingLanguage_ss','PrimeMinister_ss','Play_ss','Plant_ss','Mollusca_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Legislature_ss','Journalist_ss','Galaxy_ss','FloweringPlant_ss','Fish_ss','ComicsCreator_ss','Book_ss','AmericanFootballLeague_ss','Aircraft_ss','Activity_ss','TelevisionStation_ss','SportsLeague_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryConflict_ss','Film_ss','EthnicGroup_ss','Building_ss','Broadcaster_ss','Athlete_ss','ArchitecturalStructure_ss','Animal_ss','AnatomicalStructure_ss','TelevisionShow_ss','SportsEvent_ss','Species_ss','Non-ProfitOrganisation_ss','MusicalWork_ss','Magazine_ss','Island_ss','Eukaryote_ss','ChemicalSubstance_ss','ChemicalCompound_ss','CelestialBody_ss','Award_ss','Album_ss','Actor_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','PoliticalParty_ss','Band_ss','Newspaper_ss','Event_ss','Website_ss','GovernmentAgency_ss','PeriodicalLiterature_ss','MusicalArtist_ss','Disease_ss','WrittenWork_ss','Artist_ss','Software_ss','Politician_ss','University_ss','Company_ss','City_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Date_template_ss':'Event date','Place_template_ss':'Event place','Person_template_ss':'Event actor','Topic_template_ss':'Event topic','Date_ss':'Date','Source_s':'Source','Thing_ss':'Unclassified entity','Writer_ss':'Writer','TradeUnion_ss':'TradeUnion','Textfragment_ss':'Textfragment','TennisTournament_ss':'TennisTournament','TennisPlayer_ss':'TennisPlayer','SportsTeam_ss':'SportsTeam','Sport_ss':'Sport','SoccerTournament_ss':'SoccerTournament','SoccerLeague_ss':'SoccerLeague','SoccerClub_ss':'SoccerClub','Single_ss':'Single','ProgrammingLanguage_ss':'ProgrammingLanguage','PrimeMinister_ss':'PrimeMinister','Play_ss':'Play','Plant_ss':'Plant','Mollusca_ss':'Mollusca','MilitaryUnit_ss':'MilitaryUnit','MemberOfParliament_ss':'MemberOfParliament','MeanOfTransportation_ss':'MeanOfTransportation','Library_ss':'Library','Legislature_ss':'Legislature','Journalist_ss':'Journalist','Galaxy_ss':'Galaxy','FloweringPlant_ss':'FloweringPlant','Fish_ss':'Fish','ComicsCreator_ss':'ComicsCreator','Book_ss':'Book','AmericanFootballLeague_ss':'AmericanFootballLeague','Aircraft_ss':'Aircraft','Activity_ss':'Activity','TelevisionStation_ss':'TelevisionStation','SportsLeague_ss':'SportsLeague','NaturalPlace_ss':'NaturalPlace','MusicGenre_ss':'MusicGenre','Mountain_ss':'Mountain','MilitaryConflict_ss':'MilitaryConflict','Film_ss':'Film','EthnicGroup_ss':'EthnicGroup','Building_ss':'Building','Broadcaster_ss':'Broadcaster','Athlete_ss':'Athlete','ArchitecturalStructure_ss':'ArchitecturalStructure','Animal_ss':'Animal','AnatomicalStructure_ss':'AnatomicalStructure','TelevisionShow_ss':'TelevisionShow','SportsEvent_ss':'SportsEvent','Species_ss':'Species','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','MusicalWork_ss':'MusicalWork','Magazine_ss':'Magazine','Island_ss':'Island','Eukaryote_ss':'Eukaryote','ChemicalSubstance_ss':'ChemicalSubstance','ChemicalCompound_ss':'ChemicalCompound','CelestialBody_ss':'CelestialBody','Award_ss':'Award','Album_ss':'Album','Actor_ss':'Actor','AcademicJournal_ss':'AcademicJournal','WorldHeritageSite_ss':'WorldHeritageSite','Scientist_ss':'Scientist','PoliticalParty_ss':'PoliticalParty','Band_ss':'Band','Newspaper_ss':'Newspaper','Event_ss':'Event','Website_ss':'Website','GovernmentAgency_ss':'GovernmentAgency','PeriodicalLiterature_ss':'PeriodicalLiterature','MusicalArtist_ss':'MusicalArtist','Disease_ss':'Disease','WrittenWork_ss':'WrittenWork','Artist_ss':'Artist','Software_ss':'Software','Politician_ss':'Politician','University_ss':'University','Company_ss':'Company','City_ss':'City','Work_ss':'Work','Person_ss':'Person','Organisation_ss':'Organisation','Place_ss':'Place'/*auto-facets-mapping-here*/};

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
      fields: ['Source_s','Thing_ss','Writer_ss','TradeUnion_ss','Textfragment_ss','TennisTournament_ss','TennisPlayer_ss','SportsTeam_ss','Sport_ss','SoccerTournament_ss','SoccerLeague_ss','SoccerClub_ss','Single_ss','ProgrammingLanguage_ss','PrimeMinister_ss','Play_ss','Plant_ss','Mollusca_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Legislature_ss','Journalist_ss','Galaxy_ss','FloweringPlant_ss','Fish_ss','ComicsCreator_ss','Book_ss','AmericanFootballLeague_ss','Aircraft_ss','Activity_ss','TelevisionStation_ss','SportsLeague_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryConflict_ss','Film_ss','EthnicGroup_ss','Building_ss','Broadcaster_ss','Athlete_ss','ArchitecturalStructure_ss','Animal_ss','AnatomicalStructure_ss','TelevisionShow_ss','SportsEvent_ss','Species_ss','Non-ProfitOrganisation_ss','MusicalWork_ss','Magazine_ss','Island_ss','Eukaryote_ss','ChemicalSubstance_ss','ChemicalCompound_ss','CelestialBody_ss','Award_ss','Album_ss','Actor_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','PoliticalParty_ss','Band_ss','Newspaper_ss','Event_ss','Website_ss','GovernmentAgency_ss','PeriodicalLiterature_ss','MusicalArtist_ss','Disease_ss','WrittenWork_ss','Artist_ss','Software_ss','Politician_ss','University_ss','Company_ss','City_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Date_template_ss','Place_template_ss','Person_template_ss','Topic_template_ss','Date_ss','Notebook_ss','Source_s','Thing_ss','Writer_ss','TradeUnion_ss','Textfragment_ss','TennisTournament_ss','TennisPlayer_ss','SportsTeam_ss','Sport_ss','SoccerTournament_ss','SoccerLeague_ss','SoccerClub_ss','Single_ss','ProgrammingLanguage_ss','PrimeMinister_ss','Play_ss','Plant_ss','Mollusca_ss','MilitaryUnit_ss','MemberOfParliament_ss','MeanOfTransportation_ss','Library_ss','Legislature_ss','Journalist_ss','Galaxy_ss','FloweringPlant_ss','Fish_ss','ComicsCreator_ss','Book_ss','AmericanFootballLeague_ss','Aircraft_ss','Activity_ss','TelevisionStation_ss','SportsLeague_ss','NaturalPlace_ss','MusicGenre_ss','Mountain_ss','MilitaryConflict_ss','Film_ss','EthnicGroup_ss','Building_ss','Broadcaster_ss','Athlete_ss','ArchitecturalStructure_ss','Animal_ss','AnatomicalStructure_ss','TelevisionShow_ss','SportsEvent_ss','Species_ss','Non-ProfitOrganisation_ss','MusicalWork_ss','Magazine_ss','Island_ss','Eukaryote_ss','ChemicalSubstance_ss','ChemicalCompound_ss','CelestialBody_ss','Award_ss','Album_ss','Actor_ss','AcademicJournal_ss','WorldHeritageSite_ss','Scientist_ss','PoliticalParty_ss','Band_ss','Newspaper_ss','Event_ss','Website_ss','GovernmentAgency_ss','PeriodicalLiterature_ss','MusicalArtist_ss','Disease_ss','WrittenWork_ss','Artist_ss','Software_ss','Politician_ss','University_ss','Company_ss','City_ss','Work_ss','Person_ss','Organisation_ss','Place_ss'/*auto-facets-request-here*/],
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
