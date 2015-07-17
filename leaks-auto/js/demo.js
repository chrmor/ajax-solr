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
	var auto_fields = ['type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Place_ss','type_Organisation_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'subject_s':'Subject','day_s':"Sent on day",'from_s':'From','to_ss':'To','type_AdministrativeRegion_ss':'AdministrativeRegion','type_Band_ss':'Band','type_Work_ss':'Work','type_President_ss':'President','type_Website_ss':'Website','type_University_ss':'University','type_Place_ss':'Place','type_Organisation_ss':'Organisation','type_TelevisionShow_ss':'TelevisionShow','type_Settlement_ss':'Settlement','type_PopulatedPlace_ss':'PopulatedPlace','type_Film_ss':'Film','type_Person_ss':'Person','type_City_ss':'City','type_Software_ss':'Software','type_Country_ss':'Country','type_Company_ss':'Company','type_OfficeHolder_ss':'OfficeHolder','type_PoliticalParty_ss':'PoliticalParty','type_Politician_ss':'Politician','cat_Member_states_of_the_Union_for_the_Mediterranean_ss':'Member states of the Union for the Mediterranean','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss':'Member states of the Organisation of Islamic Cooperation','cat_Countries_in_Europe_ss':'Countries in Europe','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss':'Companies listed on the New York Stock Exchange','cat_Liberal_democracies_ss':'Liberal democracies','cat_Republics_ss':'Republics','cat_Member_states_of_the_United_Nations_ss':'Member states of the United Nations','cat_Living_people_ss':'Living people'/*auto-facets-mapping-here*/};

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
      fields: ['type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Place_ss','type_Organisation_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['subject_s', 'day_s','from_s','to_ss','type_AdministrativeRegion_ss','type_Band_ss','type_Work_ss','type_President_ss','type_Website_ss','type_University_ss','type_Place_ss','type_Organisation_ss','type_TelevisionShow_ss','type_Settlement_ss','type_PopulatedPlace_ss','type_Film_ss','type_Person_ss','type_City_ss','type_Software_ss','type_Country_ss','type_Company_ss','type_OfficeHolder_ss','type_PoliticalParty_ss','type_Politician_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Countries_in_Europe_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-request-here*/],
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
