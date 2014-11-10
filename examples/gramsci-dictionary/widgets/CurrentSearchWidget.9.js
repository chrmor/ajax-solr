(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  facetsNamesMapping : {"type_ss":"Tipo di voce", "norm_length_s":"Lunghezza voce", "topic_ss":"Tema", "cites_quaderno_ss":"Contiene citazioni da", "label_s":"Titolo della voce", "text":"Testo della voce"},
  
  afterRequest: function () {
      
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
        var facetName = self.facetsNamesMapping[q.split(":")[0]];
        var facetValue = q.split(":")[1];
      links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + facetValue).click(function () {
        self.manager.store.get('q').val('*:*');
        self.doRequest();
        return false;
      }));
    }

    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
      if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/)) {
        var field = fq[i].match(/^\w+:/)[0];
        var value = fq[i].substr(field.length + 1, 10);
        links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + value).click(self.removeFacet(fq[i])));
      }
      else {
        //links.push($('<a href="#"></a>').text('[x] ' + fq[i].replace("_ss","").replace("_"," ")).click(self.removeFacet(fq[i])));
        
        var facetName = self.facetsNamesMapping[fq[i].split(":")[0]];
        links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + fq[i].split(":")[1]).click(self.removeFacet(fq[i])));
      }
    }

    if (links.length > 0) {
      links.unshift($('<a href="#"></a>').text('Rimuovi tutti i filtri').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        self.doRequest();
        return false;
      }));
    }

    if (links.length) {
      var $target = $(this.target);
      $target.empty();
      for (var i = 0, l = links.length; i < l; i++) {
        $target.append($('<li></li>').append(links[i]));
      }
    }
    else {
      $(this.target).html('<li>Stai visualizzando tutti i documenti. <br/>Puoi restringere la ricerca selezionando i filtri qui sotto.</li>');
    }
  },

  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest();
      }
      return false;
    };
  }
});

})(jQuery);
