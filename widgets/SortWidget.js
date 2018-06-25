(function ($) {

AjaxSolr.SortWidget = AjaxSolr.AbstractWidget.extend({
  init: function () {
    var self = this;
    $(this.target).find('input').bind('keydown', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        if (value && self.set(value)) {
          self.doRequest();
        }
      }
    });
  },

  afterRequest: function () {
    var self = this;
    var currentSort = this.manager.store.values('sort');
    $(this.target).find('select').val(currentSort);
    $(this.target).find('select').bind('change',function() {
    var newSorting = $(this).val();
    self.manager.store.removeByValue('sort',self.manager.store.values('sort')[0]);
    self.manager.store.addByValue('sort',newSorting);
    self.doRequest();
	});
  }
});

})(jQuery);
