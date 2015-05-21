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
          var facetName = self.facetsNamesMapping[fq[i].split(":")[0]];
          links.push($('<a href="#"></a>').text('[x] ' + facetName + " : " + fq[i].split(":")[1]).click(self.removeFacet(fq[i])));
        }
      }
    }

    if (links.length > 0) {
      links.unshift($('<a href="#"></a>').text('Remove all filters').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        self.doRequest();
        return false;
      }));
    }

    if (links.length) {
      var $target = $(this.target);
      $target.empty();
      //$(this.target).html('Applied filters');
      for (var i = 0, l = links.length; i < l; i++) {
        $target.append($('<li></li>').append(links[i]));
      }
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
