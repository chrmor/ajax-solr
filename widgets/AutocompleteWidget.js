(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({

  constructor: function (attributes) {
    AjaxSolr.AutocompleteWidget.__super__.constructor.apply(this, arguments);
    AjaxSolr.extend(this, {
      facetsNamesMapping: null,
      submitOnlyIfTermSelect: false,
      autocompleteOnlyOnStartWith: false,
	  removeCommas: false
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
		var suffix;
        for (var facet in response.facet_counts.facet_fields[field]) {
		  if (self.facetsNamesMapping[field] != undefined) {
	          label = self.facetsNamesMapping[field];
	          if (label == undefined) {
	              label = field;
	          } else {
	              label = label;
	          }
			  suffix = '- ' + label;
		  }	else {
			  suffix = '';
		  }
          var value;
		  if (self.removeCommas) {
			  value = facet.replace(",","");
		  } else {
			  value = facet;
		  }
          list.push({
            field: field,
            value: value,
            counter: response.facet_counts.facet_fields[field][facet],
			label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') ' + suffix
          });
        }
      }

      self.requestSent = false;
      $(self.target).find('input').autocomplete('destroy').autocomplete({
        delay: 500,
        source: function(request, response) {
          //var re = $.ui.autocomplete.escapeRegex(request.term);
          var re = request.term;
          var regExPattern = null;

          if (re !== '*' && re !== "?") {
            var indexOfw  = re.indexOf('*');
            var indexOfcw = re.indexOf('?');
            var nre = re;

            if (indexOfcw != -1) {
                nre = nre.replace(/\?/g, '\.');
            }

            if (indexOfw == 0 || indexOfcw == 0) {
              regExPattern = new RegExp(nre.replace(/\*/g, '') + "$");
            } else if (indexOfw == re.length-1) {
              regExPattern = new RegExp("^" + nre.replace(/\*/g, ''), "i");
            } else if (indexOfw > 0 && indexOfw < re.length) {
              var tokens = re.split('*');
              regExPattern = new RegExp("^" + tokens[0].replace(/\*/g, '') + ".*" + tokens[1].replace(/\*/g, ''), "i");
            } else {
              if (self.autocompleteOnlyOnStartWith) {
                regExPattern = new RegExp("^" + nre, "i");
              } else {
                regExPattern = new RegExp(nre, "i");
              }
            }

            var a  = $.grep(list, function(item, index) {
              return regExPattern.test(item.value.normalize());
            });

            a.sort(sortValues);

            response(a);

          } else {
            list.sort(sortValues);
            response(list);
          }
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

            // Clean multiple blank spaces
            if (value.indexOf(' ') != -1) {
              value = value.replace(/\s{2,}/g, ' ');
            }

            if (value) {
				var field = self.fields[0];	
				if (field) {
	                var qf = field + ':' +  value.normalize("NFD");
	                result = self.set(qf);					
				}

              /*
			  var result = false;
              var type = $(this).attr('type');
              
			  if (type === 'dic_text') {
                var qf = 'text:' +  value.normalize("NFD");
                result = self.set(qf);
              } else {
                result = self.set(value);
              }
			  */
              if (result)
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
