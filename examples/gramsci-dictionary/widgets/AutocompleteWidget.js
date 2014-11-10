(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({

  constructor: function (attributes) {
    AjaxSolr.AutocompleteWidget.__super__.constructor.apply(this, arguments);
    AjaxSolr.extend(this, {
      facetsNamesMapping: null,
      submitOnlyIfTermSelect: false
    }, attributes);
  },

  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events').val('');

    var self = this;

    // sort autocomplete values b
    var sortValues = function(a, b) {
      var aVal = parseInt(a.counter);
      var bVal = parseInt(b.counter);                  
      var diff = bVal - aVal;
      if (diff == 0) {
        if (a.label < b.label)
          return -1;
        else if (a.label > b.label)
          return 1;
        else
          return 0;
      } else {
        return diff;
      }      
    };

    var callback = function (response) {
      var list = [];
      for (var i = 0; i < self.fields.length; i++) {
        var field = self.fields[i];
        for (var facet in response.facet_counts.facet_fields[field]) {
          label = self.facetsNamesMapping[field];    
          if (label == undefined) {
              label = field;
          } else {
              label = label;
          }
          list.push({
            field: field,
            value: facet,
            counter: response.facet_counts.facet_fields[field][facet],
            label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + label
          });
        }
      }

      self.requestSent = false;
      $(self.target).find('input').autocomplete('destroy').autocomplete({
        delay: 500,
        source: function(request, response) {
          var re = $.ui.autocomplete.escapeRegex(request.term);
          var strtWithPattern = new RegExp("^" + re, "i");
          
          var a  = $.grep(list, function(item, index) {
            return strtWithPattern.test(item.value);
          });
          a.sort(sortValues);
          response(a);
        },
        select: function(event, ui) {
          if (ui.item) {
            self.requestSent = true;
            if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
              self.doRequest();
            }
          }
        }
      });

      // This has lower priority so that requestSent is set.
      $(self.target).find('input').bind('keydown', function(e) {
        if (self.requestSent === false && e.which == 13) {
          if (!self.submitOnlyIfTermSelect) {
            var value = $(this).val();
            if (value && self.set(value)) {
              self.doRequest();
            }
          }
        }
      });
    } // end callback

    var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
    for (var i = 0; i < this.fields.length; i++) {
      params.push('facet.field=' + this.fields[i]);
    }
    var values = this.manager.store.values('fq');
    for (var i = 0; i < values.length; i++) {
      params.push('fq=' + encodeURIComponent(values[i]));
    }
    params.push('q=' + this.manager.store.get('q').val());
    $.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
  }
});

})(jQuery);
