(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  constructor: function (attributes) {
    AjaxSolr.CurrentSearchWidget.__super__.constructor.apply(this, arguments);
    AjaxSolr.extend(this, {
      facetsNamesMapping: null,
    }, attributes);
  },

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
		if (fq[i].substring(0, 11) === "Notebook_ss") {
			var value = fq[i];
			var facetName = value.substring(0, 11);
			var json = value.substring(13, value.length - 1);
			jo = JSON.parse(json.replace(/\\/g, ''));
			links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + jo.name + " (by " + jo.author + ")").click(self.removeFacet(fq[i])));
		}
        else if (fq[i].match(/\sOR\s/) != null) {
          var cf = '';
          
		  
		  var facetsComponents = fq[i].split(' OR ');
          for (var t = 0; t < facetsComponents.length; t++) {
            var f = facetsComponents[t];
            var matchedData = f.match(/(.+):(.+)/);
            if (matchedData.length >= 2) {
//              if (cf == '')
				if (matchedData[1]=='*')
					cf += '* : ';
				if (matchedData[1]=='type_s')
					continue;
				else 
					cf += self.facetsNamesMapping[matchedData[1]] + ' : ';
//              else if (!cf.endsWith('OR '))
				cf += matchedData[2];
				if (t < facetsComponents.length -1) 
					cf += ' OR ';
            }
          }

          if (cf != '')
            links.push($('<a href="#"></a>').text('[x] ' + cf).click(self.removeFacet(fq[i])));
        } else {
			//XXX: type_s filter is always present but invisible!
			if (fq[i].split(":")[0]!="type_s") {
              var facetName = self.facetsNamesMapping[fq[i].split(":")[0]];
		  	  links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + fq[i].split(":")[1]).click(self.removeFacet(fq[i])));
		  	}
          
        }
      }
    }

    if (links.length > 0) {
      links.unshift($('<a href="#"></a>').text('Remove all filters').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
		//XXX:Automatically re-set the type_s invisible filter!
		self.manager.store.addByValue('fq','type_s:document');
        self.doRequest();
        return false;
      }));
    }

    if (links.length) {
      var target = $(this.target);
      target.empty();
      //$(this.target).html('Applied filters');
      for (var i = 0, l = links.length; i < l; i++) {
        target.append($('<li></li>').append(links[i]));
      }
	  fqs = self.manager.store.values('fq');

	  /* TO BE REMOVED
	  query = '';
	  
	  for (i=0; i<fqs.length;i++) {
		  
		  var orred = fqs[i].split(' OR ');
		  for (k=0; k<orred.length; k++) {
		  	  pieces = orred[k].split(':');
			  if (pieces[0].indexOf('"') == -1) {
				  query += '"' + pieces[0] + '":';
			  } else {
				  query += pieces[0];
			  }
			  if (pieces[1].indexOf('"') == -1) {
				  query += '"' + pieces[1] + '"';
			  } else {
				  query += pieces[1];
			  }	  
			  if (k < orred.length -1) {
			  		query += ' OR ';
			  }
		  }
		  if (i < fqs.length - 1) {
		   	  query += ',';
		  }
		  
		  
	  	  
	  }
	  */
	  
	  //query = encodeURIComponent('{"facets_selector":{"' + serfq.split('"').join('').split(':').join('":"').split(',').join('","').replace('"type_s":"document",','') + '"}}');
	  
	  var query = fqs.join(' AND ');
	  query = encodeURIComponent('{"facet_query_solr":"' + query.split('"').join('\\"') + '"}');
	  var apiHost = document.location.href.replace('.html','.php').split('#')[0];
	  var apiCall = apiHost + "?api_call=" + query;
	  target.append('<br/><div><a href="' + apiCall + '">Rebuild facets based on current filters</a></div>');
	  target.append('<br/><div><a href="' + apiHost + '">Reset facets to default</a></div>');
    }
    else {
      $(this.target).html('Viewing all documents');
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
