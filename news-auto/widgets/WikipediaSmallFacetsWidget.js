(function ($) {

AjaxSolr.WikipediaSmallFacetsWidget = AjaxSolr.AbstractFacetWidget.extend({
  afterRequest: function () {
    if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
      $(this.target).html('no items found in current selection');
      return;
    }

    var maxCount = 0;
    var objectedItems = [];
    for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
      var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
      if (count > maxCount) {
        maxCount = count;
      }
      objectedItems.push({ facet: facet, count: count });
    }
    objectedItems.sort(function (a, b) {
      return a.count > b.count ? -1 : 1;
    });

    $(this.target).empty();
    var length;
    //if (objectedItems.length < 20) {
        length = objectedItems.length;
		//} else {
        //length = 20;
   // }
    for (var i = 0, l = length; i < l; i++) {
      var facet;
      if (objectedItems[i] != undefined) {
       facet = objectedItems[i].facet;   
      }
      var facetLabel = facet;
      $(this.target).append(
        $('<a href="#" id="facet-' + facet + '" class="facets_item"></a>')
        .text(facetLabel)
        .click(this.clickHandler(facet))
      ).append(' (' + objectedItems[i].count +  ')').append('<a target="_blank" class="small" href="http://en.wikipedia.org/wiki/' + facet + '"> <span class="glyphicon glyphicon-new-window"></span></a><br/>');
    }
  }
});

})(jQuery);
