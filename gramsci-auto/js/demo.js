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
	  solrUrl: 'http://gramsciproject.org:8080/solr-leaks-auto/gramsci/'
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
	var auto_fields = ['type_Work_ss','type_Saint_ss','type_Company_ss','type_Building_ss','type_Scientist_ss','type_Island_ss','type_FictionalCharacter_ss','type_PoliticalParty_ss','type_PeriodicalLiterature_ss','type_Cleric_ss','type_OfficeHolder_ss','type_Book_ss','type_Language_ss','type_MilitaryConflict_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Event_ss','type_Place_ss','type_Monarch_ss','type_Settlement_ss','type_Writer_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Storia_contemporanea_europea_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Scrittori_italiani_del_XIX_secolo_ss','cat_Regioni_geografiche_ss','cat_Re_di_Francia_ss','cat_Ministri_del_Tesoro_del_Regno_d’Italia_ss','cat_Membri_dell’Académie_française_ss','cat_Forme_di_governo_ss','cat_Etica_ss','cat_Epistemologia_ss','cat_Teorie_politiche_ss','cat_Storia_del_pensiero_economico_ss','cat_Rivoluzione_francese_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Personalità_dell’ateismo_ss','cat_Marxismo_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_politica_ss','cat_Deputati_dell’VIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_Consulta_Nazionale_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Membri_dell’Accademia_delle_Scienze_di_Torino_ss','cat_Diritto_costituzionale_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Accademici_dei_Lincei_ss','cat_Scrittori_toscani_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Capitali_europee_della_cultura_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Film_drammatici_ss','cat_Antifascisti_italiani_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Ideologie_politiche_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Concetti_e_principi_filosofici_ss','cat_Ebrei_italiani_ss','cat_Massoni_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Religione_e_politica_ss','cat_Scuole_e_correnti_filosofiche_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Personalità_del_Risorgimento_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'type_Work_ss':'Work','type_Saint_ss':'Saint','type_Company_ss':'Company','type_Building_ss':'Building','type_Scientist_ss':'Scientist','type_Island_ss':'Island','type_FictionalCharacter_ss':'FictionalCharacter','type_PoliticalParty_ss':'PoliticalParty','type_PeriodicalLiterature_ss':'PeriodicalLiterature','type_Cleric_ss':'Cleric','type_OfficeHolder_ss':'OfficeHolder','type_Book_ss':'Book','type_Language_ss':'Language','type_MilitaryConflict_ss':'MilitaryConflict','type_AdministrativeRegion_ss':'AdministrativeRegion','type_Philosopher_ss':'Philosopher','type_Event_ss':'Event','type_Place_ss':'Place','type_Monarch_ss':'Monarch','type_Settlement_ss':'Settlement','type_Writer_ss':'Writer','type_Artist_ss':'Artist','type_Politician_ss':'Politician','type_Country_ss':'Country','cat_Storia_contemporanea_europea_ss':'Storia contemporanea europea','cat_Scrittori_legati_a_Napoli_ss':'Scrittori legati a Napoli','cat_Scrittori_italiani_del_XIX_secolo_ss':'Scrittori italiani del XIX secolo','cat_Regioni_geografiche_ss':'Regioni geografiche','cat_Re_di_Francia_ss':'Re di Francia','cat_Ministri_del_Tesoro_del_Regno_d’Italia_ss':'Ministri del Tesoro del Regno d’Italia','cat_Membri_dell’Académie_française_ss':'Membri dell’Académie française','cat_Forme_di_governo_ss':'Forme di governo','cat_Etica_ss':'Etica','cat_Epistemologia_ss':'Epistemologia','cat_Teorie_politiche_ss':'Teorie politiche','cat_Storia_del_pensiero_economico_ss':'Storia del pensiero economico','cat_Rivoluzione_francese_ss':'Rivoluzione francese','cat_Politici_del_Partito_Socialista_Italiano_ss':'Politici del Partito Socialista Italiano','cat_Personalità_dell’ateismo_ss':'Personalità dell’ateismo','cat_Marxismo_ss':'Marxismo','cat_Filosofia_politica_ss':'Filosofia politica','cat_Filosofi_della_politica_ss':'Filosofi della politica','cat_Deputati_dell’VIII_Legislatura_del_Regno_d’Italia_ss':'Deputati dell’VIII Legislatura del Regno d’Italia','cat_Deputati_della_Consulta_Nazionale_ss':'Deputati della Consulta Nazionale','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss':'Storia dei rapporti fra Stato italiano e Chiesa cattolica','cat_Membri_dell’Accademia_delle_Scienze_di_Torino_ss':'Membri dell’Accademia delle Scienze di Torino','cat_Diritto_costituzionale_ss':'Diritto costituzionale','cat_Direttori_di_periodici_ss':'Direttori di periodici','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss':'Decorati con l’Ordine supremo della Santissima Annunziata','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss':'Cavalieri dell’Ordine della Giarrettiera','cat_Accademici_dei_Lincei_ss':'Accademici dei Lincei','cat_Scrittori_toscani_ss':'Scrittori toscani','cat_Personalità_dell’Italia_fascista_ss':'Personalità dell’Italia fascista','cat_Periodici_del_passato_ss':'Periodici del passato','cat_Politici_del_Partito_Nazionale_Fascista_ss':'Politici del Partito Nazionale Fascista','cat_Ufficiali_del_Regio_Esercito_ss':'Ufficiali del Regio Esercito','cat_Città_medaglie_d’oro_al_valor_militare_ss':'Città medaglie d’oro al valor militare','cat_Città_benemerite_del_Risorgimento_italiano_ss':'Città benemerite del Risorgimento italiano','cat_Capitali_europee_della_cultura_ss':'Capitali europee della cultura','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss':'Ministri della Pubblica Istruzione del Regno d’Italia','cat_Film_drammatici_ss':'Film drammatici','cat_Antifascisti_italiani_ss':'Antifascisti italiani','cat_Militari_italiani_della_prima_guerra_mondiale_ss':'Militari italiani della prima guerra mondiale','cat_Ideologie_politiche_ss':'Ideologie politiche','cat_Posizioni_e_teorie_filosofiche_ss':'Posizioni e teorie filosofiche','cat_Concetti_e_principi_filosofici_ss':'Concetti e principi filosofici','cat_Ebrei_italiani_ss':'Ebrei italiani','cat_Massoni_ss':'Massoni','cat_Fondatori_di_riviste_italiane_ss':'Fondatori di riviste italiane','cat_Religione_e_politica_ss':'Religione e politica','cat_Scuole_e_correnti_filosofiche_ss':'Scuole e correnti filosofiche','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss':'Personaggi citati nella Divina Commedia Inferno','cat_Personalità_del_Risorgimento_ss':'Personalità del Risorgimento','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss':'Decorati con l’Ordine dei Santi Maurizio e Lazzaro'/*auto-facets-mapping-here*/};

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
      fields: ['type_Work_ss','type_Saint_ss','type_Company_ss','type_Building_ss','type_Scientist_ss','type_Island_ss','type_FictionalCharacter_ss','type_PoliticalParty_ss','type_PeriodicalLiterature_ss','type_Cleric_ss','type_OfficeHolder_ss','type_Book_ss','type_Language_ss','type_MilitaryConflict_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Event_ss','type_Place_ss','type_Monarch_ss','type_Settlement_ss','type_Writer_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Storia_contemporanea_europea_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Scrittori_italiani_del_XIX_secolo_ss','cat_Regioni_geografiche_ss','cat_Re_di_Francia_ss','cat_Ministri_del_Tesoro_del_Regno_d’Italia_ss','cat_Membri_dell’Académie_française_ss','cat_Forme_di_governo_ss','cat_Etica_ss','cat_Epistemologia_ss','cat_Teorie_politiche_ss','cat_Storia_del_pensiero_economico_ss','cat_Rivoluzione_francese_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Personalità_dell’ateismo_ss','cat_Marxismo_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_politica_ss','cat_Deputati_dell’VIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_Consulta_Nazionale_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Membri_dell’Accademia_delle_Scienze_di_Torino_ss','cat_Diritto_costituzionale_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Accademici_dei_Lincei_ss','cat_Scrittori_toscani_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Capitali_europee_della_cultura_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Film_drammatici_ss','cat_Antifascisti_italiani_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Ideologie_politiche_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Concetti_e_principi_filosofici_ss','cat_Ebrei_italiani_ss','cat_Massoni_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Religione_e_politica_ss','cat_Scuole_e_correnti_filosofiche_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Personalità_del_Risorgimento_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['type_Work_ss','type_Saint_ss','type_Company_ss','type_Building_ss','type_Scientist_ss','type_Island_ss','type_FictionalCharacter_ss','type_PoliticalParty_ss','type_PeriodicalLiterature_ss','type_Cleric_ss','type_OfficeHolder_ss','type_Book_ss','type_Language_ss','type_MilitaryConflict_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Event_ss','type_Place_ss','type_Monarch_ss','type_Settlement_ss','type_Writer_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Storia_contemporanea_europea_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Scrittori_italiani_del_XIX_secolo_ss','cat_Regioni_geografiche_ss','cat_Re_di_Francia_ss','cat_Ministri_del_Tesoro_del_Regno_d’Italia_ss','cat_Membri_dell’Académie_française_ss','cat_Forme_di_governo_ss','cat_Etica_ss','cat_Epistemologia_ss','cat_Teorie_politiche_ss','cat_Storia_del_pensiero_economico_ss','cat_Rivoluzione_francese_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Personalità_dell’ateismo_ss','cat_Marxismo_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_politica_ss','cat_Deputati_dell’VIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_Consulta_Nazionale_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Membri_dell’Accademia_delle_Scienze_di_Torino_ss','cat_Diritto_costituzionale_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Accademici_dei_Lincei_ss','cat_Scrittori_toscani_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Capitali_europee_della_cultura_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Film_drammatici_ss','cat_Antifascisti_italiani_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Ideologie_politiche_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Concetti_e_principi_filosofici_ss','cat_Ebrei_italiani_ss','cat_Massoni_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Religione_e_politica_ss','cat_Scuole_e_correnti_filosofiche_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Personalità_del_Risorgimento_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss'/*auto-facets-request-here*/],
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
