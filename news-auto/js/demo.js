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
	var auto_fields = ['type_Place-SUBCLASS-PopulatedPlace_ss','type_EthnicGroup_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-GovernmentAgency_ss','type_Disease_ss','type_ChemicalSubstance-SUBCLASS-ChemicalCompound_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Scientist_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Astronaut_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-Company_ss','type_Place_ss','type_Place-SUBCLASS-PopulatedPlace-SUBCLASS-Country_ss','type_Agent-SUBCLASS-Person_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-EducationalInstitution-SUBCLASS-University_ss','cat_Oak_Ridge_Associated_Universities_ss','cat_Liberal_democracies_ss','cat_Former_Spanish_colonies_ss','cat_Association_of_Public_and_Land-Grant_Universities_ss','cat_Republics_ss','cat_Association_of_American_Universities_ss','cat_National_Association_of_Independent_Colleges_and_Universities_members_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'type_Place-SUBCLASS-PopulatedPlace_ss':'Place-SUBCLASS-PopulatedPlace','type_EthnicGroup_ss':'EthnicGroup','type_Agent-SUBCLASS-Organisation-SUBCLASS-GovernmentAgency_ss':'Agent-SUBCLASS-Organisation-SUBCLASS-GovernmentAgency','type_Disease_ss':'Disease','type_ChemicalSubstance-SUBCLASS-ChemicalCompound_ss':'ChemicalSubstance-SUBCLASS-ChemicalCompound','type_Agent-SUBCLASS-Person-SUBCLASS-Scientist_ss':'Agent-SUBCLASS-Person-SUBCLASS-Scientist','type_Agent-SUBCLASS-Person-SUBCLASS-Astronaut_ss':'Agent-SUBCLASS-Person-SUBCLASS-Astronaut','type_Agent-SUBCLASS-Organisation-SUBCLASS-Company_ss':'Agent-SUBCLASS-Organisation-SUBCLASS-Company','type_Place_ss':'Place','type_Place-SUBCLASS-PopulatedPlace-SUBCLASS-Country_ss':'Place-SUBCLASS-PopulatedPlace-SUBCLASS-Country','type_Agent-SUBCLASS-Person_ss':'Agent-SUBCLASS-Person','type_Agent-SUBCLASS-Organisation-SUBCLASS-EducationalInstitution-SUBCLASS-University_ss':'Agent-SUBCLASS-Organisation-SUBCLASS-EducationalInstitution-SUBCLASS-University','cat_Oak_Ridge_Associated_Universities_ss':'Oak Ridge Associated Universities','cat_Liberal_democracies_ss':'Liberal democracies','cat_Former_Spanish_colonies_ss':'Former Spanish colonies','cat_Association_of_Public_and_Land-Grant_Universities_ss':'Association of Public and Land-Grant Universities','cat_Republics_ss':'Republics','cat_Association_of_American_Universities_ss':'Association of American Universities','cat_National_Association_of_Independent_Colleges_and_Universities_members_ss':'National Association of Independent Colleges and Universities members','cat_Member_states_of_the_United_Nations_ss':'Member states of the United Nations','cat_Living_people_ss':'Living people'/*auto-facets-mapping-here*/};

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
      fields: ['type_Place-SUBCLASS-PopulatedPlace_ss','type_EthnicGroup_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-GovernmentAgency_ss','type_Disease_ss','type_ChemicalSubstance-SUBCLASS-ChemicalCompound_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Scientist_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Astronaut_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-Company_ss','type_Place_ss','type_Place-SUBCLASS-PopulatedPlace-SUBCLASS-Country_ss','type_Agent-SUBCLASS-Person_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-EducationalInstitution-SUBCLASS-University_ss','cat_Oak_Ridge_Associated_Universities_ss','cat_Liberal_democracies_ss','cat_Former_Spanish_colonies_ss','cat_Association_of_Public_and_Land-Grant_Universities_ss','cat_Republics_ss','cat_Association_of_American_Universities_ss','cat_National_Association_of_Independent_Colleges_and_Universities_members_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['date_ss','type_Place-SUBCLASS-PopulatedPlace_ss','type_EthnicGroup_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-GovernmentAgency_ss','type_Disease_ss','type_ChemicalSubstance-SUBCLASS-ChemicalCompound_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Scientist_ss','type_Agent-SUBCLASS-Person-SUBCLASS-Astronaut_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-Company_ss','type_Place_ss','type_Place-SUBCLASS-PopulatedPlace-SUBCLASS-Country_ss','type_Agent-SUBCLASS-Person_ss','type_Agent-SUBCLASS-Organisation-SUBCLASS-EducationalInstitution-SUBCLASS-University_ss','cat_Oak_Ridge_Associated_Universities_ss','cat_Liberal_democracies_ss','cat_Former_Spanish_colonies_ss','cat_Association_of_Public_and_Land-Grant_Universities_ss','cat_Republics_ss','cat_Association_of_American_Universities_ss','cat_National_Association_of_Independent_Colleges_and_Universities_members_ss','cat_Member_states_of_the_United_Nations_ss','cat_Living_people_ss'/*auto-facets-request-here*/],
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
