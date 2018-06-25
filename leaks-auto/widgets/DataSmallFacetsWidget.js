(function ($) {

AjaxSolr.DataSmallFacetsWidget = AjaxSolr.AbstractFacetWidget.extend({
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
	  var nb = JSON.parse(facet);
	  var nname;
	  if (nb.name != '') {
	  	  nname = nb.name;
	  } else {
	  	  nname = "Unnamed notebook";
	  }
	  var author;
	  if (nb.author != '') {
	  	  author = nb.author;
	  } else {
	  	  author = "Unknown author";
	  }
	  
      var facetLabel = nname + " ( by " + author +")";
      $(this.target).append(
        $('<a href="#" id="facet-' + facet + '" class="facets_item"></a>')
        .text(facetLabel)
        .click(this.clickHandler(facet))
      ).append(' (' + objectedItems[i].count +  ')').append('<a target="_blank" class="small" href="http://ask.as.thepund.it/#/myNotebooks/' + nb.id + '"> <span class="glyphicon glyphicon-new-window"></span></a><br/>');
    }
  }
});

})(jQuery);
