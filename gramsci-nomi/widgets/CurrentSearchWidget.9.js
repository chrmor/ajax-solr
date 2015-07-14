(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  constructor: function (attributes) {
    AjaxSolr.CurrentSearchWidget.__super__.constructor.apply(this, arguments);
    AjaxSolr.extend(this, {
      facetsNamesMapping: null,
    }, attributes);
  },


  parseJSONFacetValue: function (value) {
      var facetValue = '';
	  //JSON Facet
	  //XXX This is very specific for this browser
	  //TODO: find a way to make in a generic behaviour
	  value = value.substring(1,value.length-1).replace(new RegExp('\\\\', 'g'),'')
	  if (value.lastIndexOf('{',0) === 0) {
	  	var jsondata = $.parseJSON(value);
		if (jsondata['value'] !== 'undefined') {
			facetValue += jsondata['value'];
		}
		if (jsondata['title'] !== 'undefined') {
			facetValue += ', ' + jsondata['title'];
		}
	  } else {
	  	facetValue = value;
	  }
	  return facetValue;
  },

  afterRequest: function () {

    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
        var facetName  = '';
        var facetValue = '';
        if (q.indexOf(":") !== -1) {
          facetName = self.facetsNamesMapping[q.split(":")[0]];
          facetValue = q.split(":")[1];
		  facetValue = self.parseJSONFacetValue(facetValue);
          links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + facetValue).click(function () {
            self.manager.store.get('q').val('*:*');
            self.doRequest();
            return false;
          }));
        } else {
          facetValue = q;
          links.push($('<a href="#"></a>').text('[x] ' + q).click(function () {
            self.manager.store.get('q').val('*:*');
            self.doRequest();
            return false;
          }));
        }
    }

    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
      if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/)) {
        var field = fq[i].match(/^\w+:/)[0];
        var value = fq[i].substr(field.length + 1, 10);
		value = self.parseJSONFacetValue(value);
        links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + value).click(self.removeFacet(fq[i])));
      }
      else {
        //links.push($('<a href="#"></a>').text('[x] ' + fq[i].replace("_ss","").replace("_"," ")).click(self.removeFacet(fq[i])));

        if (fq[i].match(/\sOR\s/) != null) {
          var cf = '';
          var facetsComponents = fq[i].split(' OR ');
          for (var t = 0; t < facetsComponents.length; t++) {
            var f = facetsComponents[t];
            var matchedData = f.match(/(.+):(.+)/);
            if (matchedData.length >= 2) {
              if (cf == '')
                cf += self.facetsNamesMapping[matchedData[1]] + ' : ';
              else if (!cf.endsWith('OR '))
                cf += ' OR ';

              cf += matchedData[2];
            }
          }

          if (cf != '')
            links.push($('<a href="#"></a>').text('[x] ' + cf).click(self.removeFacet(fq[i])));
        } else {
			var facet = fq[i].split(":")[0];
          var facetName = self.facetsNamesMapping[facet];
		  var value = fq[i].replace(facet + ':','');
		  value = self.parseJSONFacetValue(value);
          links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + value).click(self.removeFacet(fq[i])));
        }
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
      $(this.target).html('<li style="margin-bottom:10px">Le ricerche testuali e i menu di navigazione sono ristretti dai filtri applicati. Per tornare all’elenco completo delle voci rimuovere tutti i filtri.</li>');
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
