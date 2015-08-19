function toggleOrQuery() {
  if (enableOr == true) enableOr = false;
  else enableOr = true;
  if (enableOr==true) alert('OR-ed filters are now ENABLED.'); else alert('OR-ed filters are now DISABLED.');
}

var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      //solrUrl: 'http://localhost:8983/solr/'
	  solrUrl: 'http://gramsciproject.org:8080/solr-leaks-auto/leaks/'
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

    var fields = ['subject_s','day_s','from_s','to_ss'];
	var dataFields = [];
	var auto_fields = ['type_Road_ss','type_Philosopher_ss','type_FictionalCharacter_ss','type_Airline_ss','type_TelevisionStation_ss','type_Disease_ss','type_Athlete_ss','type_Aircraft_ss','type_Magazine_ss','type_Actor_ss','type_MilitaryConflict_ss','type_Scientist_ss','type_Writer_ss','type_GovernmentAgency_ss','type_ChemicalCompound_ss','type_Newspaper_ss','type_Building_ss','type_Book_ss','type_MilitaryUnit_ss','type_Single_ss','type_Event_ss','type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Organisation_ss','type_Place_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Global_systemically_important_banks_ss','cat_Germanic_countries_and_territories_ss','cat_Film_commedia_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Android_operating_system_software_ss','cat_Windows_software_ss','cat_Western_Asia_ss','cat_Protocolli_livello_applicazione_ss','cat_Member_states_of_the_African_Union_ss','cat_English-language_television_series_ss','cat_Countries_bordering_the_Pacific_Ocean_ss','cat_Computer_security_software_companies_ss','cat_Computer_security_exploits_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_Spanish-speaking_countries_ss','cat_Middle_Eastern_countries_ss','cat_Landlocked_countries_ss','cat_G15_nations_ss','cat_Former_Spanish_colonies_ss','cat_Countries_of_the_Indian_Ocean_ss','cat_Countries_in_Africa_ss','cat_Computer_network_security_ss','cat_Application_layer_protocols_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Antivirus_software_ss','cat_Film_drammatici_ss','cat_Capitals_in_Asia_ss','cat_American_inventions_ss','cat_Terminologia_informatica_ss','cat_Member_states_of_NATO_ss','cat_G20_nations_ss','cat_Commonwealth_republics_ss','cat_Constitutional_monarchies_ss','cat_Multinazionali_ss','cat_Member_states_of_the_European_Union_ss','cat_Member_states_of_the_Commonwealth_of_Nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Island_countries_ss','cat_Former_British_colonies_ss','cat_English-speaking_countries_and_territories_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'subject_s':'Subject','day_s':"Sent on day",'from_s':'From','to_ss':'To','type_Road_ss':'Road','type_Philosopher_ss':'Philosopher','type_FictionalCharacter_ss':'FictionalCharacter','type_Airline_ss':'Airline','type_TelevisionStation_ss':'TelevisionStation','type_Disease_ss':'Disease','type_Athlete_ss':'Athlete','type_Aircraft_ss':'Aircraft','type_Magazine_ss':'Magazine','type_Actor_ss':'Actor','type_MilitaryConflict_ss':'MilitaryConflict','type_Scientist_ss':'Scientist','type_Writer_ss':'Writer','type_GovernmentAgency_ss':'GovernmentAgency','type_ChemicalCompound_ss':'ChemicalCompound','type_Newspaper_ss':'Newspaper','type_Building_ss':'Building','type_Book_ss':'Book','type_MilitaryUnit_ss':'MilitaryUnit','type_Single_ss':'Single','type_Event_ss':'Event','type_AdministrativeRegion_ss':'AdministrativeRegion','type_Band_ss':'Band','type_Work_ss':'Work','type_President_ss':'President','type_Website_ss':'Website','type_University_ss':'University','type_Organisation_ss':'Organisation','type_Place_ss':'Place','type_TelevisionShow_ss':'TelevisionShow','type_Settlement_ss':'Settlement','type_PopulatedPlace_ss':'PopulatedPlace','type_Film_ss':'Film','type_Person_ss':'Person','type_City_ss':'City','type_Software_ss':'Software','type_Country_ss':'Country','type_Company_ss':'Company','type_OfficeHolder_ss':'OfficeHolder','type_PoliticalParty_ss':'PoliticalParty','type_Politician_ss':'Politician','cat_Global_systemically_important_banks_ss':'Global systemically important banks','cat_Germanic_countries_and_territories_ss':'Germanic countries and territories','cat_Film_commedia_ss':'Film commedia','cat_Countries_of_the_Mediterranean_Sea_ss':'Countries of the Mediterranean Sea','cat_Android_operating_system_software_ss':'Android operating system software','cat_Windows_software_ss':'Windows software','cat_Western_Asia_ss':'Western Asia','cat_Protocolli_livello_applicazione_ss':'Protocolli livello applicazione','cat_Member_states_of_the_African_Union_ss':'Member states of the African Union','cat_English-language_television_series_ss':'English-language television series','cat_Countries_bordering_the_Pacific_Ocean_ss':'Countries bordering the Pacific Ocean','cat_Computer_security_software_companies_ss':'Computer security software companies','cat_Computer_security_exploits_ss':'Computer security exploits','cat_Arabic-speaking_countries_and_territories_ss':'Arabic-speaking countries and territories','cat_Spanish-speaking_countries_ss':'Spanish-speaking countries','cat_Middle_Eastern_countries_ss':'Middle Eastern countries','cat_Landlocked_countries_ss':'Landlocked countries','cat_G15_nations_ss':'G15 nations','cat_Former_Spanish_colonies_ss':'Former Spanish colonies','cat_Countries_of_the_Indian_Ocean_ss':'Countries of the Indian Ocean','cat_Countries_in_Africa_ss':'Countries in Africa','cat_Computer_network_security_ss':'Computer network security','cat_Application_layer_protocols_ss':'Application layer protocols','cat_Multinational_companies_headquartered_in_the_United_States_ss':'Multinational companies headquartered in the United States','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss':'Companies in the Dow Jones Industrial Average','cat_Antivirus_software_ss':'Antivirus software','cat_Film_drammatici_ss':'Film drammatici','cat_Capitals_in_Asia_ss':'Capitals in Asia','cat_American_inventions_ss':'American inventions','cat_Terminologia_informatica_ss':'Terminologia informatica','cat_Member_states_of_NATO_ss':'Member states of NATO','cat_G20_nations_ss':'G20 nations','cat_Commonwealth_republics_ss':'Commonwealth republics','cat_Constitutional_monarchies_ss':'Constitutional monarchies','cat_Multinazionali_ss':'Multinazionali','cat_Member_states_of_the_European_Union_ss':'Member states of the European Union','cat_Member_states_of_the_Commonwealth_of_Nations_ss':'Member states of the Commonwealth of Nations','cat_Countries_bordering_the_Atlantic_Ocean_ss':'Countries bordering the Atlantic Ocean','cat_Companies_listed_on_NASDAQ_ss':'Companies listed on NASDAQ','cat_Island_countries_ss':'Island countries','cat_Former_British_colonies_ss':'Former British colonies','cat_English-speaking_countries_and_territories_ss':'English-speaking countries and territories','cat_Member_states_of_the_Union_for_the_Mediterranean_ss':'Member states of the Union for the Mediterranean','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss':'Member states of the Organisation of Islamic Cooperation','cat_Countries_in_Europe_ss':'Countries in Europe','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss':'Companies listed on the New York Stock Exchange','cat_Liberal_democracies_ss':'Liberal democracies','cat_Republics_ss':'Republics','cat_Member_states_of_the_United_Nations_ss':'Member states of the United Nations','cat_Living_people_ss':'Living people'/*auto-facets-mapping-here*/};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.SmallFacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i],
        enableOrQuery: false
      }));
    }
    for (var i = 0, l = auto_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.WikipediaSmallFacetsWidget({
        id: auto_fields[i],
        target: '#' + auto_fields[i],
        field: auto_fields[i],
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
      id: 'subjectsearch',
      target: '#search',
      fields: [ 'subject_s'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dbp_text',
      target: '#dbp_search',
      fields: ['type_Road_ss','type_Philosopher_ss','type_FictionalCharacter_ss','type_Airline_ss','type_TelevisionStation_ss','type_Disease_ss','type_Athlete_ss','type_Aircraft_ss','type_Magazine_ss','type_Actor_ss','type_MilitaryConflict_ss','type_Scientist_ss','type_Writer_ss','type_GovernmentAgency_ss','type_ChemicalCompound_ss','type_Newspaper_ss','type_Building_ss','type_Book_ss','type_MilitaryUnit_ss','type_Single_ss','type_Event_ss','type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Organisation_ss','type_Place_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Global_systemically_important_banks_ss','cat_Germanic_countries_and_territories_ss','cat_Film_commedia_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Android_operating_system_software_ss','cat_Windows_software_ss','cat_Western_Asia_ss','cat_Protocolli_livello_applicazione_ss','cat_Member_states_of_the_African_Union_ss','cat_English-language_television_series_ss','cat_Countries_bordering_the_Pacific_Ocean_ss','cat_Computer_security_software_companies_ss','cat_Computer_security_exploits_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_Spanish-speaking_countries_ss','cat_Middle_Eastern_countries_ss','cat_Landlocked_countries_ss','cat_G15_nations_ss','cat_Former_Spanish_colonies_ss','cat_Countries_of_the_Indian_Ocean_ss','cat_Countries_in_Africa_ss','cat_Computer_network_security_ss','cat_Application_layer_protocols_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Antivirus_software_ss','cat_Film_drammatici_ss','cat_Capitals_in_Asia_ss','cat_American_inventions_ss','cat_Terminologia_informatica_ss','cat_Member_states_of_NATO_ss','cat_G20_nations_ss','cat_Commonwealth_republics_ss','cat_Constitutional_monarchies_ss','cat_Multinazionali_ss','cat_Member_states_of_the_European_Union_ss','cat_Member_states_of_the_Commonwealth_of_Nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Island_countries_ss','cat_Former_British_colonies_ss','cat_English-speaking_countries_and_territories_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['subject_s', 'day_s','from_s','to_ss','type_Road_ss','type_Philosopher_ss','type_FictionalCharacter_ss','type_Airline_ss','type_TelevisionStation_ss','type_Disease_ss','type_Athlete_ss','type_Aircraft_ss','type_Magazine_ss','type_Actor_ss','type_MilitaryConflict_ss','type_Scientist_ss','type_Writer_ss','type_GovernmentAgency_ss','type_ChemicalCompound_ss','type_Newspaper_ss','type_Building_ss','type_Book_ss','type_MilitaryUnit_ss','type_Single_ss','type_Event_ss','type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Organisation_ss','type_Place_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Global_systemically_important_banks_ss','cat_Germanic_countries_and_territories_ss','cat_Film_commedia_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Android_operating_system_software_ss','cat_Windows_software_ss','cat_Western_Asia_ss','cat_Protocolli_livello_applicazione_ss','cat_Member_states_of_the_African_Union_ss','cat_English-language_television_series_ss','cat_Countries_bordering_the_Pacific_Ocean_ss','cat_Computer_security_software_companies_ss','cat_Computer_security_exploits_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_Spanish-speaking_countries_ss','cat_Middle_Eastern_countries_ss','cat_Landlocked_countries_ss','cat_G15_nations_ss','cat_Former_Spanish_colonies_ss','cat_Countries_of_the_Indian_Ocean_ss','cat_Countries_in_Africa_ss','cat_Computer_network_security_ss','cat_Application_layer_protocols_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Antivirus_software_ss','cat_Film_drammatici_ss','cat_Capitals_in_Asia_ss','cat_American_inventions_ss','cat_Terminologia_informatica_ss','cat_Member_states_of_NATO_ss','cat_G20_nations_ss','cat_Commonwealth_republics_ss','cat_Constitutional_monarchies_ss','cat_Multinazionali_ss','cat_Member_states_of_the_European_Union_ss','cat_Member_states_of_the_Commonwealth_of_Nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Island_countries_ss','cat_Former_British_colonies_ss','cat_English-speaking_countries_and_territories_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
	  'facet.mincount': 1,
      'sort': 'date_s desc',
      'json.nl': 'map',
      'rows': 100
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
