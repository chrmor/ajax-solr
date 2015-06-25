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
	  solrUrl: 'http://gramsciproject.org:8080/solr-gramsci-auto/'
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
	var auto_fields = ['type_Place_ss','type_MilitaryPerson_ss','type_Language_ss','type_FictionalCharacter_ss','type_EthnicGroup_ss','type_Cleric_ss','type_Album_ss','type_Scientist_ss','type_MilitaryUnit_ss','type_Disease_ss','type_Continent_ss','type_Newspaper_ss','type_Book_ss','type_PoliticalParty_ss','type_OfficeHolder_ss','type_Agent_ss','type_Monarch_ss','type_MilitaryConflict_ss','type_Event_ss','type_Settlement_ss','type_PeriodicalLiterature_ss','type_Writer_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Teorie_politiche_ss','cat_Teologia_cristiana_ss','cat_Socialismo_ss','cat_Senatori_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Senatori_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Riviste_letterarie_italiane_ss','cat_Regioni_geografiche_ss','cat_Presidenti_del_Consiglio_dei_Ministri_del_Regno_d’Italia_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Politica_ss','cat_Politica_d’Italia_ss','cat_Poeti_italiani_del_XX_secolo_ss','cat_Personalità_del_Risorgimento_ss','cat_Ministri_della_Marina_del_Regno_d’Italia_ss','cat_Meridionalismo_ss','cat_Medaglie_d’oro_al_valor_militare_ss','cat_Fondatori_di_quotidiani_ss','cat_Filosofi_del_diritto_ss','cat_Famiglia_Bonaparte_ss','cat_Economia_politica_ss','cat_Dittature_ss','cat_Deputati_della_XXIX_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XVI_Legislatura_del_Regno_d’Italia_ss','cat_Coreggenti_ss','cat_Coprincipi_francesi_di_Andorra_ss','cat_Componenti_della_spedizione_dei_Mille_ss','cat_Compagnia_di_Gesù_ss','cat_Città_romane_della_Sicilia_ss','cat_Città_murate_dell’Emilia-Romagna_ss','cat_Cavalieri_del_Toson_d’oro_ss','cat_Areligiosità_ss','cat_Antropologia_della_famiglia_ss','cat_Anticlericali_italiani_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Terza_Repubblica_francese_ss','cat_Storia_moderna_del_Cristianesimo_ss','cat_Storia_del_pensiero_economico_ss','cat_Scrittori_italiani_del_XX_secolo_ss','cat_Politici_legati_a_Parigi_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Partiti_politici_italiani_del_passato_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Luoghi_legati_ai_Vespri_siciliani_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_storia_ss','cat_Europa_danubiana_ss','cat_Deputati_della_XXV_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVI_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVIII_Legislatura_del_Regno_d’Italia_ss','cat_Città_romane_dell’Emilia-Romagna_ss','cat_Capitali_europee_della_cultura_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Storia_contemporanea_europea_ss','cat_Stato_ss','cat_Riviste_letterarie_del_Novecento_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Marxismo_ss','cat_Grand_croix_della_Legion_d’Onore_ss','cat_Ebrei_italiani_ss','cat_Diritto_costituzionale_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Rivoluzione_francese_ss','cat_Quotidiani_italiani_ss','cat_Filosofi_della_politica_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Concetti_e_principi_filosofici_ss','cat_Antisemitismo_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Massoni_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Antifascisti_italiani_ss','cat_Ideologie_politiche_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Religione_e_politica_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss','cat_Scuole_e_correnti_filosofiche_ss'/*auto-facets-here*/];
    var facetsNamesMapping = {'type_Place_ss':'Place','type_MilitaryPerson_ss':'MilitaryPerson','type_Language_ss':'Language','type_FictionalCharacter_ss':'FictionalCharacter','type_EthnicGroup_ss':'EthnicGroup','type_Cleric_ss':'Cleric','type_Album_ss':'Album','type_Scientist_ss':'Scientist','type_MilitaryUnit_ss':'MilitaryUnit','type_Disease_ss':'Disease','type_Continent_ss':'Continent','type_Newspaper_ss':'Newspaper','type_Book_ss':'Book','type_PoliticalParty_ss':'PoliticalParty','type_OfficeHolder_ss':'OfficeHolder','type_Agent_ss':'Agent','type_Monarch_ss':'Monarch','type_MilitaryConflict_ss':'MilitaryConflict','type_Event_ss':'Event','type_Settlement_ss':'Settlement','type_PeriodicalLiterature_ss':'PeriodicalLiterature','type_Writer_ss':'Writer','type_AdministrativeRegion_ss':'AdministrativeRegion','type_Philosopher_ss':'Philosopher','type_Artist_ss':'Artist','type_Politician_ss':'Politician','type_Country_ss':'Country','cat_Teorie_politiche_ss':'Teorie politiche','cat_Teologia_cristiana_ss':'Teologia cristiana','cat_Socialismo_ss':'Socialismo','cat_Senatori_della_XXVII_Legislatura_del_Regno_d’Italia_ss':'Senatori della XXVII Legislatura del Regno d’Italia','cat_Senatori_della_XXIII_Legislatura_del_Regno_d’Italia_ss':'Senatori della XXIII Legislatura del Regno d’Italia','cat_Scrittori_legati_a_Napoli_ss':'Scrittori legati a Napoli','cat_Riviste_letterarie_italiane_ss':'Riviste letterarie italiane','cat_Regioni_geografiche_ss':'Regioni geografiche','cat_Presidenti_del_Consiglio_dei_Ministri_del_Regno_d’Italia_ss':'Presidenti del Consiglio dei Ministri del Regno d’Italia','cat_Politici_del_Partito_Socialista_Italiano_ss':'Politici del Partito Socialista Italiano','cat_Politica_ss':'Politica','cat_Politica_d’Italia_ss':'Politica d’Italia','cat_Poeti_italiani_del_XX_secolo_ss':'Poeti italiani del XX secolo','cat_Personalità_del_Risorgimento_ss':'Personalità del Risorgimento','cat_Ministri_della_Marina_del_Regno_d’Italia_ss':'Ministri della Marina del Regno d’Italia','cat_Meridionalismo_ss':'Meridionalismo','cat_Medaglie_d’oro_al_valor_militare_ss':'Medaglie d’oro al valor militare','cat_Fondatori_di_quotidiani_ss':'Fondatori di quotidiani','cat_Filosofi_del_diritto_ss':'Filosofi del diritto','cat_Famiglia_Bonaparte_ss':'Famiglia Bonaparte','cat_Economia_politica_ss':'Economia politica','cat_Dittature_ss':'Dittature','cat_Deputati_della_XXIX_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXIX Legislatura del Regno d’Italia','cat_Deputati_della_XXIII_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXIII Legislatura del Regno d’Italia','cat_Deputati_della_XVI_Legislatura_del_Regno_d’Italia_ss':'Deputati della XVI Legislatura del Regno d’Italia','cat_Coreggenti_ss':'Coreggenti','cat_Coprincipi_francesi_di_Andorra_ss':'Coprincipi francesi di Andorra','cat_Componenti_della_spedizione_dei_Mille_ss':'Componenti della spedizione dei Mille','cat_Compagnia_di_Gesù_ss':'Compagnia di Gesù','cat_Città_romane_della_Sicilia_ss':'Città romane della Sicilia','cat_Città_murate_dell’Emilia-Romagna_ss':'Città murate dell’Emilia-Romagna','cat_Cavalieri_del_Toson_d’oro_ss':'Cavalieri del Toson d’oro','cat_Areligiosità_ss':'Areligiosità','cat_Antropologia_della_famiglia_ss':'Antropologia della famiglia','cat_Anticlericali_italiani_ss':'Anticlericali italiani','cat_Ufficiali_del_Regio_Esercito_ss':'Ufficiali del Regio Esercito','cat_Terza_Repubblica_francese_ss':'Terza Repubblica francese','cat_Storia_moderna_del_Cristianesimo_ss':'Storia moderna del Cristianesimo','cat_Storia_del_pensiero_economico_ss':'Storia del pensiero economico','cat_Scrittori_italiani_del_XX_secolo_ss':'Scrittori italiani del XX secolo','cat_Politici_legati_a_Parigi_ss':'Politici legati a Parigi','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss':'Personaggi citati nella Divina Commedia Inferno','cat_Partiti_politici_italiani_del_passato_ss':'Partiti politici italiani del passato','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss':'Ministri della Pubblica Istruzione del Regno d’Italia','cat_Militari_italiani_della_prima_guerra_mondiale_ss':'Militari italiani della prima guerra mondiale','cat_Luoghi_legati_ai_Vespri_siciliani_ss':'Luoghi legati ai Vespri siciliani','cat_Filosofia_politica_ss':'Filosofia politica','cat_Filosofi_della_storia_ss':'Filosofi della storia','cat_Europa_danubiana_ss':'Europa danubiana','cat_Deputati_della_XXV_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXV Legislatura del Regno d’Italia','cat_Deputati_della_XXVI_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXVI Legislatura del Regno d’Italia','cat_Deputati_della_XXVII_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXVII Legislatura del Regno d’Italia','cat_Deputati_della_XXVIII_Legislatura_del_Regno_d’Italia_ss':'Deputati della XXVIII Legislatura del Regno d’Italia','cat_Città_romane_dell’Emilia-Romagna_ss':'Città romane dell’Emilia-Romagna','cat_Capitali_europee_della_cultura_ss':'Capitali europee della cultura','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss':'Storia dei rapporti fra Stato italiano e Chiesa cattolica','cat_Storia_contemporanea_europea_ss':'Storia contemporanea europea','cat_Stato_ss':'Stato','cat_Riviste_letterarie_del_Novecento_ss':'Riviste letterarie del Novecento','cat_Politici_del_Partito_Nazionale_Fascista_ss':'Politici del Partito Nazionale Fascista','cat_Marxismo_ss':'Marxismo','cat_Grand_croix_della_Legion_d’Onore_ss':'Grand croix della Legion d’Onore','cat_Ebrei_italiani_ss':'Ebrei italiani','cat_Diritto_costituzionale_ss':'Diritto costituzionale','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss':'Cavalieri dell’Ordine della Giarrettiera','cat_Rivoluzione_francese_ss':'Rivoluzione francese','cat_Quotidiani_italiani_ss':'Quotidiani italiani','cat_Filosofi_della_politica_ss':'Filosofi della politica','cat_Direttori_di_periodici_ss':'Direttori di periodici','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss':'Decorati con l’Ordine supremo della Santissima Annunziata','cat_Concetti_e_principi_filosofici_ss':'Concetti e principi filosofici','cat_Antisemitismo_ss':'Antisemitismo','cat_Posizioni_e_teorie_filosofiche_ss':'Posizioni e teorie filosofiche','cat_Personalità_dell’Italia_fascista_ss':'Personalità dell’Italia fascista','cat_Periodici_del_passato_ss':'Periodici del passato','cat_Massoni_ss':'Massoni','cat_Città_benemerite_del_Risorgimento_italiano_ss':'Città benemerite del Risorgimento italiano','cat_Antifascisti_italiani_ss':'Antifascisti italiani','cat_Ideologie_politiche_ss':'Ideologie politiche','cat_Fondatori_di_riviste_italiane_ss':'Fondatori di riviste italiane','cat_Città_medaglie_d’oro_al_valor_militare_ss':'Città medaglie d’oro al valor militare','cat_Religione_e_politica_ss':'Religione e politica','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss':'Decorati con l’Ordine dei Santi Maurizio e Lazzaro','cat_Scuole_e_correnti_filosofiche_ss':'Scuole e correnti filosofiche'/*auto-facets-mapping-here*/};

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
      fields: ['type_Place_ss','type_MilitaryPerson_ss','type_Language_ss','type_FictionalCharacter_ss','type_EthnicGroup_ss','type_Cleric_ss','type_Album_ss','type_Scientist_ss','type_MilitaryUnit_ss','type_Disease_ss','type_Continent_ss','type_Newspaper_ss','type_Book_ss','type_PoliticalParty_ss','type_OfficeHolder_ss','type_Agent_ss','type_Monarch_ss','type_MilitaryConflict_ss','type_Event_ss','type_Settlement_ss','type_PeriodicalLiterature_ss','type_Writer_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Teorie_politiche_ss','cat_Teologia_cristiana_ss','cat_Socialismo_ss','cat_Senatori_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Senatori_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Riviste_letterarie_italiane_ss','cat_Regioni_geografiche_ss','cat_Presidenti_del_Consiglio_dei_Ministri_del_Regno_d’Italia_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Politica_ss','cat_Politica_d’Italia_ss','cat_Poeti_italiani_del_XX_secolo_ss','cat_Personalità_del_Risorgimento_ss','cat_Ministri_della_Marina_del_Regno_d’Italia_ss','cat_Meridionalismo_ss','cat_Medaglie_d’oro_al_valor_militare_ss','cat_Fondatori_di_quotidiani_ss','cat_Filosofi_del_diritto_ss','cat_Famiglia_Bonaparte_ss','cat_Economia_politica_ss','cat_Dittature_ss','cat_Deputati_della_XXIX_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XVI_Legislatura_del_Regno_d’Italia_ss','cat_Coreggenti_ss','cat_Coprincipi_francesi_di_Andorra_ss','cat_Componenti_della_spedizione_dei_Mille_ss','cat_Compagnia_di_Gesù_ss','cat_Città_romane_della_Sicilia_ss','cat_Città_murate_dell’Emilia-Romagna_ss','cat_Cavalieri_del_Toson_d’oro_ss','cat_Areligiosità_ss','cat_Antropologia_della_famiglia_ss','cat_Anticlericali_italiani_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Terza_Repubblica_francese_ss','cat_Storia_moderna_del_Cristianesimo_ss','cat_Storia_del_pensiero_economico_ss','cat_Scrittori_italiani_del_XX_secolo_ss','cat_Politici_legati_a_Parigi_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Partiti_politici_italiani_del_passato_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Luoghi_legati_ai_Vespri_siciliani_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_storia_ss','cat_Europa_danubiana_ss','cat_Deputati_della_XXV_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVI_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVIII_Legislatura_del_Regno_d’Italia_ss','cat_Città_romane_dell’Emilia-Romagna_ss','cat_Capitali_europee_della_cultura_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Storia_contemporanea_europea_ss','cat_Stato_ss','cat_Riviste_letterarie_del_Novecento_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Marxismo_ss','cat_Grand_croix_della_Legion_d’Onore_ss','cat_Ebrei_italiani_ss','cat_Diritto_costituzionale_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Rivoluzione_francese_ss','cat_Quotidiani_italiani_ss','cat_Filosofi_della_politica_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Concetti_e_principi_filosofici_ss','cat_Antisemitismo_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Massoni_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Antifascisti_italiani_ss','cat_Ideologie_politiche_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Religione_e_politica_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss','cat_Scuole_e_correnti_filosofiche_ss'/*auto-facets-autocomplete-here*/],
      facetsNamesMapping: facetsNamesMapping,
      submitOnlyIfTermSelect: true
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
	  'fq': 'type_s:document',	
      'facet.field': ['type_Place_ss','type_MilitaryPerson_ss','type_Language_ss','type_FictionalCharacter_ss','type_EthnicGroup_ss','type_Cleric_ss','type_Album_ss','type_Scientist_ss','type_MilitaryUnit_ss','type_Disease_ss','type_Continent_ss','type_Newspaper_ss','type_Book_ss','type_PoliticalParty_ss','type_OfficeHolder_ss','type_Agent_ss','type_Monarch_ss','type_MilitaryConflict_ss','type_Event_ss','type_Settlement_ss','type_PeriodicalLiterature_ss','type_Writer_ss','type_AdministrativeRegion_ss','type_Philosopher_ss','type_Artist_ss','type_Politician_ss','type_Country_ss','cat_Teorie_politiche_ss','cat_Teologia_cristiana_ss','cat_Socialismo_ss','cat_Senatori_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Senatori_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Scrittori_legati_a_Napoli_ss','cat_Riviste_letterarie_italiane_ss','cat_Regioni_geografiche_ss','cat_Presidenti_del_Consiglio_dei_Ministri_del_Regno_d’Italia_ss','cat_Politici_del_Partito_Socialista_Italiano_ss','cat_Politica_ss','cat_Politica_d’Italia_ss','cat_Poeti_italiani_del_XX_secolo_ss','cat_Personalità_del_Risorgimento_ss','cat_Ministri_della_Marina_del_Regno_d’Italia_ss','cat_Meridionalismo_ss','cat_Medaglie_d’oro_al_valor_militare_ss','cat_Fondatori_di_quotidiani_ss','cat_Filosofi_del_diritto_ss','cat_Famiglia_Bonaparte_ss','cat_Economia_politica_ss','cat_Dittature_ss','cat_Deputati_della_XXIX_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXIII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XVI_Legislatura_del_Regno_d’Italia_ss','cat_Coreggenti_ss','cat_Coprincipi_francesi_di_Andorra_ss','cat_Componenti_della_spedizione_dei_Mille_ss','cat_Compagnia_di_Gesù_ss','cat_Città_romane_della_Sicilia_ss','cat_Città_murate_dell’Emilia-Romagna_ss','cat_Cavalieri_del_Toson_d’oro_ss','cat_Areligiosità_ss','cat_Antropologia_della_famiglia_ss','cat_Anticlericali_italiani_ss','cat_Ufficiali_del_Regio_Esercito_ss','cat_Terza_Repubblica_francese_ss','cat_Storia_moderna_del_Cristianesimo_ss','cat_Storia_del_pensiero_economico_ss','cat_Scrittori_italiani_del_XX_secolo_ss','cat_Politici_legati_a_Parigi_ss','cat_Personaggi_citati_nella_Divina_Commedia_Inferno_ss','cat_Partiti_politici_italiani_del_passato_ss','cat_Ministri_della_Pubblica_Istruzione_del_Regno_d’Italia_ss','cat_Militari_italiani_della_prima_guerra_mondiale_ss','cat_Luoghi_legati_ai_Vespri_siciliani_ss','cat_Filosofia_politica_ss','cat_Filosofi_della_storia_ss','cat_Europa_danubiana_ss','cat_Deputati_della_XXV_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVI_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVII_Legislatura_del_Regno_d’Italia_ss','cat_Deputati_della_XXVIII_Legislatura_del_Regno_d’Italia_ss','cat_Città_romane_dell’Emilia-Romagna_ss','cat_Capitali_europee_della_cultura_ss','cat_Storia_dei_rapporti_fra_Stato_italiano_e_Chiesa_cattolica_ss','cat_Storia_contemporanea_europea_ss','cat_Stato_ss','cat_Riviste_letterarie_del_Novecento_ss','cat_Politici_del_Partito_Nazionale_Fascista_ss','cat_Marxismo_ss','cat_Grand_croix_della_Legion_d’Onore_ss','cat_Ebrei_italiani_ss','cat_Diritto_costituzionale_ss','cat_Cavalieri_dell’Ordine_della_Giarrettiera_ss','cat_Rivoluzione_francese_ss','cat_Quotidiani_italiani_ss','cat_Filosofi_della_politica_ss','cat_Direttori_di_periodici_ss','cat_Decorati_con_l’Ordine_supremo_della_Santissima_Annunziata_ss','cat_Concetti_e_principi_filosofici_ss','cat_Antisemitismo_ss','cat_Posizioni_e_teorie_filosofiche_ss','cat_Personalità_dell’Italia_fascista_ss','cat_Periodici_del_passato_ss','cat_Massoni_ss','cat_Città_benemerite_del_Risorgimento_italiano_ss','cat_Antifascisti_italiani_ss','cat_Ideologie_politiche_ss','cat_Fondatori_di_riviste_italiane_ss','cat_Città_medaglie_d’oro_al_valor_militare_ss','cat_Religione_e_politica_ss','cat_Decorati_con_l’Ordine_dei_Santi_Maurizio_e_Lazzaro_ss','cat_Scuole_e_correnti_filosofiche_ss'/*auto-facets-request-here*/],
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
