(function ($) {

AjaxSolr.FacetsWidget = AjaxSolr.AbstractFacetWidget.extend({
    
    /**
     * Overrides the function in parent class
     * TO IMPLEMENT "ORd" facets (instead of ANDd)

     
    add: function (value) {
      return this.changeSelection(function () {
      
        var current = this.manager.store.get('fq')[0];
        this.manager.store.remove('fq',0);
        if (current.value != null) {
           return this.manager.store.addByValue('fq', current.value + ' OR ' + this.fq(value));    
        }    else {
           return this.manager.store.addByValue('fq', this.fq(value));    
        }
      
      });
    },
    */
    
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
    for (var i = 0, l = objectedItems.length; i < l; i++) {
      var facet = objectedItems[i].facet;
      var facetLabel = facet;
      $(this.target).append(
        $('<a href="#" id="facet-' + facet + '" class="facets_item"></a>')
        .text(facetLabel)
        .click(this.clickHandler(facet))
      ).append(' (' + objectedItems[i].count +  ')').append('<br/>');
      
    }
  }
});

})(jQuery);
