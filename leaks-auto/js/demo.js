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
	  solrUrl: 'http://gramsciproject.org:8080/solr-leaks-auto/'
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
	var auto_fields = ['type_SoccerPlayer_ss','type_River_ss','type_Protein_ss','type_Planet_ss','type_MusicGenre_ss','type_Mountain_ss','type_MountainRange_ss','type_Monarch_ss','type_Mammal_ss','type_LawFirm_ss','type_GovernmentAgency_ss','type_FloweringPlant_ss','type_Currency_ss','type_Continent_ss','type_Automobile_ss','type_AdministrativeRegion_ss','type_Writer_ss','type_Single_ss','type_ProgrammingLanguage_ss','type_Philosopher_ss','type_MilitaryUnit_ss','type_Language_ss','type_Athlete_ss','type_Actor_ss','type_Station_ss','type_MilitaryConflict_ss','type_Band_ss','type_Airline_ss','type_University_ss','type_Scientist_ss','type_Book_ss','type_Newspaper_ss','type_Building_ss','type_Place_ss','type_Event_ss','type_Organisation_ss','type_PopulatedPlace_ss','type_Website_ss','type_Work_ss','type_TelevisionShow_ss','type_Film_ss','type_Settlement_ss','type_Person_ss','type_City_ss','type_Country_ss','type_Software_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Companies_established_in_2005_ss','cat_Companies_based_in_San_Francisco,_California_ss','cat_Capitali_europee_della_cultura_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_American_venture_capital_firms_ss','cat_1971_births_ss','cat_Western_Europe_ss','cat_Videotelephony_ss','cat_Terminologia_informatica_ss','cat_Tecniche_di_difesa_informatica_ss','cat_Spanish-speaking_countries_ss','cat_Smartphones_ss','cat_Protocolli_di_Internet_ss','cat_Posta_elettronica_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Island_countries_ss','cat_IOS_Apple_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Computer_hardware_companies_ss','cat_Cloud_computing_providers_ss','cat_Bicontinental_countries_ss','cat_American_inventions_ss','cat_American_brands_ss','cat_Social_networking_services_ss','cat_Protocolli_livello_applicazione_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Member_states_of_NATO_ss','cat_Home_computers_ss','cat_Germanic_countries_and_territories_ss','cat_Cross-platform_software_ss','cat_Computer_network_security_ss','cat_Android_operating_system_software_ss','cat_Member_states_of_the_European_Union_ss','cat_IOS_software_ss','cat_G20_nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Film_drammatici_ss','cat_Constitutional_monarchies_ss','cat_Computer_security_exploits_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Republics_ss','cat_Multinazionali_ss','cat_Application_layer_protocols_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Liberal_democracies_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'subject_s':'Subject','day_s':"Sent on day",'from_s':'From','to_ss':'To','type_SoccerPlayer_ss':'SoccerPlayer','type_River_ss':'River','type_Protein_ss':'Protein','type_Planet_ss':'Planet','type_MusicGenre_ss':'MusicGenre','type_Mountain_ss':'Mountain','type_MountainRange_ss':'MountainRange','type_Monarch_ss':'Monarch','type_Mammal_ss':'Mammal','type_LawFirm_ss':'LawFirm','type_GovernmentAgency_ss':'GovernmentAgency','type_FloweringPlant_ss':'FloweringPlant','type_Currency_ss':'Currency','type_Continent_ss':'Continent','type_Automobile_ss':'Automobile','type_AdministrativeRegion_ss':'AdministrativeRegion','type_Writer_ss':'Writer','type_Single_ss':'Single','type_ProgrammingLanguage_ss':'ProgrammingLanguage','type_Philosopher_ss':'Philosopher','type_MilitaryUnit_ss':'MilitaryUnit','type_Language_ss':'Language','type_Athlete_ss':'Athlete','type_Actor_ss':'Actor','type_Station_ss':'Station','type_MilitaryConflict_ss':'MilitaryConflict','type_Band_ss':'Band','type_Airline_ss':'Airline','type_University_ss':'University','type_Scientist_ss':'Scientist','type_Book_ss':'Book','type_Newspaper_ss':'Newspaper','type_Building_ss':'Building','type_Place_ss':'Place','type_Event_ss':'Event','type_Organisation_ss':'Organisation','type_PopulatedPlace_ss':'PopulatedPlace','type_Website_ss':'Website','type_Work_ss':'Work','type_TelevisionShow_ss':'TelevisionShow','type_Film_ss':'Film','type_Settlement_ss':'Settlement','type_Person_ss':'Person','type_City_ss':'City','type_Country_ss':'Country','type_Software_ss':'Software','type_Company_ss':'Company','type_OfficeHolder_ss':'OfficeHolder','type_PoliticalParty_ss':'PoliticalParty','type_Politician_ss':'Politician','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss':'Companies listed on the New York Stock Exchange','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss':'Companies in the Dow Jones Industrial Average','cat_Companies_established_in_2005_ss':'Companies established in 2005','cat_Companies_based_in_San_Francisco,_California_ss':'Companies based in San Francisco, California','cat_Capitali_europee_della_cultura_ss':'Capitali europee della cultura','cat_Arabic-speaking_countries_and_territories_ss':'Arabic-speaking countries and territories','cat_American_venture_capital_firms_ss':'American venture capital firms','cat_1971_births_ss':'1971 births','cat_Western_Europe_ss':'Western Europe','cat_Videotelephony_ss':'Videotelephony','cat_Terminologia_informatica_ss':'Terminologia informatica','cat_Tecniche_di_difesa_informatica_ss':'Tecniche di difesa informatica','cat_Spanish-speaking_countries_ss':'Spanish-speaking countries','cat_Smartphones_ss':'Smartphones','cat_Protocolli_di_Internet_ss':'Protocolli di Internet','cat_Posta_elettronica_ss':'Posta elettronica','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss':'Member states of the Organisation of Islamic Cooperation','cat_Island_countries_ss':'Island countries','cat_IOS_Apple_ss':'IOS Apple','cat_Countries_of_the_Mediterranean_Sea_ss':'Countries of the Mediterranean Sea','cat_Computer_hardware_companies_ss':'Computer hardware companies','cat_Cloud_computing_providers_ss':'Cloud computing providers','cat_Bicontinental_countries_ss':'Bicontinental countries','cat_American_inventions_ss':'American inventions','cat_American_brands_ss':'American brands','cat_Social_networking_services_ss':'Social networking services','cat_Protocolli_livello_applicazione_ss':'Protocolli livello applicazione','cat_Multinational_companies_headquartered_in_the_United_States_ss':'Multinational companies headquartered in the United States','cat_Member_states_of_NATO_ss':'Member states of NATO','cat_Home_computers_ss':'Home computers','cat_Germanic_countries_and_territories_ss':'Germanic countries and territories','cat_Cross-platform_software_ss':'Cross-platform software','cat_Computer_network_security_ss':'Computer network security','cat_Android_operating_system_software_ss':'Android operating system software','cat_Member_states_of_the_European_Union_ss':'Member states of the European Union','cat_IOS_software_ss':'IOS software','cat_G20_nations_ss':'G20 nations','cat_Countries_bordering_the_Atlantic_Ocean_ss':'Countries bordering the Atlantic Ocean','cat_Film_drammatici_ss':'Film drammatici','cat_Constitutional_monarchies_ss':'Constitutional monarchies','cat_Computer_security_exploits_ss':'Computer security exploits','cat_Companies_listed_on_NASDAQ_ss':'Companies listed on NASDAQ','cat_Republics_ss':'Republics','cat_Multinazionali_ss':'Multinazionali','cat_Application_layer_protocols_ss':'Application layer protocols','cat_Member_states_of_the_Union_for_the_Mediterranean_ss':'Member states of the Union for the Mediterranean','cat_Countries_in_Europe_ss':'Countries in Europe','cat_Liberal_democracies_ss':'Liberal democracies','cat_Member_states_of_the_United_Nations_ss':'Member states of the United Nations','cat_Living_people_ss':'Living people'/*auto-facets-mapping-here*/};

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
      fields: ['type_SoccerPlayer_ss','type_River_ss','type_Protein_ss','type_Planet_ss','type_MusicGenre_ss','type_Mountain_ss','type_MountainRange_ss','type_Monarch_ss','type_Mammal_ss','type_LawFirm_ss','type_GovernmentAgency_ss','type_FloweringPlant_ss','type_Currency_ss','type_Continent_ss','type_Automobile_ss','type_AdministrativeRegion_ss','type_Writer_ss','type_Single_ss','type_ProgrammingLanguage_ss','type_Philosopher_ss','type_MilitaryUnit_ss','type_Language_ss','type_Athlete_ss','type_Actor_ss','type_Station_ss','type_MilitaryConflict_ss','type_Band_ss','type_Airline_ss','type_University_ss','type_Scientist_ss','type_Book_ss','type_Newspaper_ss','type_Building_ss','type_Place_ss','type_Event_ss','type_Organisation_ss','type_PopulatedPlace_ss','type_Website_ss','type_Work_ss','type_TelevisionShow_ss','type_Film_ss','type_Settlement_ss','type_Person_ss','type_City_ss','type_Country_ss','type_Software_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Companies_established_in_2005_ss','cat_Companies_based_in_San_Francisco,_California_ss','cat_Capitali_europee_della_cultura_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_American_venture_capital_firms_ss','cat_1971_births_ss','cat_Western_Europe_ss','cat_Videotelephony_ss','cat_Terminologia_informatica_ss','cat_Tecniche_di_difesa_informatica_ss','cat_Spanish-speaking_countries_ss','cat_Smartphones_ss','cat_Protocolli_di_Internet_ss','cat_Posta_elettronica_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Island_countries_ss','cat_IOS_Apple_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Computer_hardware_companies_ss','cat_Cloud_computing_providers_ss','cat_Bicontinental_countries_ss','cat_American_inventions_ss','cat_American_brands_ss','cat_Social_networking_services_ss','cat_Protocolli_livello_applicazione_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Member_states_of_NATO_ss','cat_Home_computers_ss','cat_Germanic_countries_and_territories_ss','cat_Cross-platform_software_ss','cat_Computer_network_security_ss','cat_Android_operating_system_software_ss','cat_Member_states_of_the_European_Union_ss','cat_IOS_software_ss','cat_G20_nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Film_drammatici_ss','cat_Constitutional_monarchies_ss','cat_Computer_security_exploits_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Republics_ss','cat_Multinazionali_ss','cat_Application_layer_protocols_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Liberal_democracies_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['subject_s', 'day_s','from_s','to_ss','type_SoccerPlayer_ss','type_River_ss','type_Protein_ss','type_Planet_ss','type_MusicGenre_ss','type_Mountain_ss','type_MountainRange_ss','type_Monarch_ss','type_Mammal_ss','type_LawFirm_ss','type_GovernmentAgency_ss','type_FloweringPlant_ss','type_Currency_ss','type_Continent_ss','type_Automobile_ss','type_AdministrativeRegion_ss','type_Writer_ss','type_Single_ss','type_ProgrammingLanguage_ss','type_Philosopher_ss','type_MilitaryUnit_ss','type_Language_ss','type_Athlete_ss','type_Actor_ss','type_Station_ss','type_MilitaryConflict_ss','type_Band_ss','type_Airline_ss','type_University_ss','type_Scientist_ss','type_Book_ss','type_Newspaper_ss','type_Building_ss','type_Place_ss','type_Event_ss','type_Organisation_ss','type_PopulatedPlace_ss','type_Website_ss','type_Work_ss','type_TelevisionShow_ss','type_Film_ss','type_Settlement_ss','type_Person_ss','type_City_ss','type_Country_ss','type_Software_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Companies_in_the_Dow_Jones_Industrial_Average_ss','cat_Companies_established_in_2005_ss','cat_Companies_based_in_San_Francisco,_California_ss','cat_Capitali_europee_della_cultura_ss','cat_Arabic-speaking_countries_and_territories_ss','cat_American_venture_capital_firms_ss','cat_1971_births_ss','cat_Western_Europe_ss','cat_Videotelephony_ss','cat_Terminologia_informatica_ss','cat_Tecniche_di_difesa_informatica_ss','cat_Spanish-speaking_countries_ss','cat_Smartphones_ss','cat_Protocolli_di_Internet_ss','cat_Posta_elettronica_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Island_countries_ss','cat_IOS_Apple_ss','cat_Countries_of_the_Mediterranean_Sea_ss','cat_Computer_hardware_companies_ss','cat_Cloud_computing_providers_ss','cat_Bicontinental_countries_ss','cat_American_inventions_ss','cat_American_brands_ss','cat_Social_networking_services_ss','cat_Protocolli_livello_applicazione_ss','cat_Multinational_companies_headquartered_in_the_United_States_ss','cat_Member_states_of_NATO_ss','cat_Home_computers_ss','cat_Germanic_countries_and_territories_ss','cat_Cross-platform_software_ss','cat_Computer_network_security_ss','cat_Android_operating_system_software_ss','cat_Member_states_of_the_European_Union_ss','cat_IOS_software_ss','cat_G20_nations_ss','cat_Countries_bordering_the_Atlantic_Ocean_ss','cat_Film_drammatici_ss','cat_Constitutional_monarchies_ss','cat_Computer_security_exploits_ss','cat_Companies_listed_on_NASDAQ_ss','cat_Republics_ss','cat_Multinazionali_ss','cat_Application_layer_protocols_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Liberal_democracies_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-request-here*/],
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
