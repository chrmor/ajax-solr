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
	  solrUrl: 'http://gramsciproject.org:8080/solr-leaks-auto/news/'
	  //solrUrl: 'http://gramsciproject.org:8080/solr-gramsci-auto/'
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

    var fields = [];
	var dataFields = [];
	var auto_fields = ['type_Newspaper_ss','type_Event_ss','type_Building_ss','type_Politician_ss','type_PopulatedPlace_ss','type_Organisation_ss','type_President_ss','type_University_ss','type_Place_ss','type_MusicalArtist_ss','type_Country_ss','type_OfficeHolder_ss','type_City_ss','type_Company_ss','type_Person_ss','cat_G15_nations_ss','cat_G20_nations_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Former_British_colonies_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_American_Roman_Catholics_ss','cat_American_people_of_English_descent_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Member_states_of_the_United_Nations_ss','cat_American_people_of_Irish_descent_ss','cat_Grammy_Award-winning_artists_ss','cat_Living_people_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'type_Newspaper_ss':'Newspaper','type_Event_ss':'Event','type_Building_ss':'Building','type_Politician_ss':'Politician','type_PopulatedPlace_ss':'PopulatedPlace','type_Organisation_ss':'Organisation','type_President_ss':'President','type_University_ss':'University','type_Place_ss':'Place','type_MusicalArtist_ss':'MusicalArtist','type_Country_ss':'Country','type_OfficeHolder_ss':'OfficeHolder','type_City_ss':'City','type_Company_ss':'Company','type_Person_ss':'Person','cat_G15_nations_ss':'G15 nations','cat_G20_nations_ss':'G20 nations','cat_Member_states_of_the_Union_for_the_Mediterranean_ss':'Member states of the Union for the Mediterranean','cat_Countries_in_Europe_ss':'Countries in Europe','cat_Former_British_colonies_ss':'Former British colonies','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss':'Member states of the Organisation of Islamic Cooperation','cat_Liberal_democracies_ss':'Liberal democracies','cat_Republics_ss':'Republics','cat_American_Roman_Catholics_ss':'American Roman Catholics','cat_American_people_of_English_descent_ss':'American people of English descent','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss':'Companies listed on the New York Stock Exchange','cat_Member_states_of_the_United_Nations_ss':'Member states of the United Nations','cat_American_people_of_Irish_descent_ss':'American people of Irish descent','cat_Grammy_Award-winning_artists_ss':'Grammy Award-winning artists','cat_Living_people_ss':'Living people'/*auto-facets-mapping-here*/};

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
      id: 'text',
      target: '#search',
      fields: [ 'title_s'],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'dbp_text',
      target: '#dbp_search',
      fields: ['type_Newspaper_ss','type_Event_ss','type_Building_ss','type_Politician_ss','type_PopulatedPlace_ss','type_Organisation_ss','type_President_ss','type_University_ss','type_Place_ss','type_MusicalArtist_ss','type_Country_ss','type_OfficeHolder_ss','type_City_ss','type_Company_ss','type_Person_ss','cat_G15_nations_ss','cat_G20_nations_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Former_British_colonies_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_American_Roman_Catholics_ss','cat_American_people_of_English_descent_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Member_states_of_the_United_Nations_ss','cat_American_people_of_Irish_descent_ss','cat_Grammy_Award-winning_artists_ss','cat_Living_people_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['date_ss','type_Newspaper_ss','type_Event_ss','type_Building_ss','type_Politician_ss','type_PopulatedPlace_ss','type_Organisation_ss','type_President_ss','type_University_ss','type_Place_ss','type_MusicalArtist_ss','type_Country_ss','type_OfficeHolder_ss','type_City_ss','type_Company_ss','type_Person_ss','cat_G15_nations_ss','cat_G20_nations_ss','cat_Member_states_of_the_Union_for_the_Mediterranean_ss','cat_Countries_in_Europe_ss','cat_Former_British_colonies_ss','cat_Member_states_of_the_Organisation_of_Islamic_Cooperation_ss','cat_Liberal_democracies_ss','cat_Republics_ss','cat_American_Roman_Catholics_ss','cat_American_people_of_English_descent_ss','cat_Companies_listed_on_the_New_York_Stock_Exchange_ss','cat_Member_states_of_the_United_Nations_ss','cat_American_people_of_Irish_descent_ss','cat_Grammy_Award-winning_artists_ss','cat_Living_people_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
	  'facet.mincount': 1,
      'sort': 'date_s desc',
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
