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

    var fields = ['Source_s'];
	  var wikipedia_fields = ['Website_ss','Software_ss','ProgrammingLanguage_ss','Non-ProfitOrganisation_ss','Newspaper_ss','MusicGenre_ss','Magazine_ss','GovernmentAgency_ss','Film_ss','WrittenWork_ss','PeriodicalLiterature_ss','Person_ss','Company_ss','PopulatedPlace_ss','Disease_ss','Country_ss','Work_ss','University_ss','EducationalInstitution_ss','Place_ss','Organisation_ss','Thing_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'Source_s':'Source','Website_ss':'Website','Software_ss':'Software','ProgrammingLanguage_ss':'ProgrammingLanguage','Non-ProfitOrganisation_ss':'Non-ProfitOrganisation','Newspaper_ss':'Newspaper','MusicGenre_ss':'MusicGenre','Magazine_ss':'Magazine','GovernmentAgency_ss':'GovernmentAgency','Film_ss':'Film','WrittenWork_ss':'WrittenWork','PeriodicalLiterature_ss':'PeriodicalLiterature','Person_ss':'Person','Company_ss':'Company','PopulatedPlace_ss':'PopulatedPlace','Disease_ss':'Disease','Country_ss':'Country','Work_ss':'Work','University_ss':'University','EducationalInstitution_ss':'EducationalInstitution','Place_ss':'Place','Organisation_ss':'Organisation','Thing_ss':'Thing'/*auto-facets-mapping-here*/};

    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.SmallFacetsWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i],
        multivalue: false
        //,
        //enableOrQuery: true
      }));
    }
    for (var i = 0, l = wikipedia_fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.WikipediaSmallFacetsWidget({
        id: wikipedia_fields[i],
        target: '#' + wikipedia_fields[i],
        field: wikipedia_fields[i],
        // enableOrQuery: true
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
      fields: ['Source_s','Website_ss','Software_ss','ProgrammingLanguage_ss','Non-ProfitOrganisation_ss','Newspaper_ss','MusicGenre_ss','Magazine_ss','GovernmentAgency_ss','Film_ss','WrittenWork_ss','PeriodicalLiterature_ss','Person_ss','Company_ss','PopulatedPlace_ss','Disease_ss','Country_ss','Work_ss','University_ss','EducationalInstitution_ss','Place_ss','Organisation_ss','Thing_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': ['Source_s','Website_ss','Software_ss','ProgrammingLanguage_ss','Non-ProfitOrganisation_ss','Newspaper_ss','MusicGenre_ss','Magazine_ss','GovernmentAgency_ss','Film_ss','WrittenWork_ss','PeriodicalLiterature_ss','Person_ss','Company_ss','PopulatedPlace_ss','Disease_ss','Country_ss','Work_ss','University_ss','EducationalInstitution_ss','Place_ss','Organisation_ss','Thing_ss'/*auto-facets-request-here*/],
      'facet.limit': 1000,
      'facet.mincount': 1,
      //'sort': 'quaderno_f asc, nota_i asc',
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
