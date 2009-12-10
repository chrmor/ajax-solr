// $Id$

/**
 * @see http://wiki.apache.org/solr/SolJSON#JSON_specific_parameters
 */
AjaxSolr.Manager = AjaxSolr.AbstractManager.extend({
  executeRequest: function () {
    var self = this;
    if (this.proxyUrl) {
      jQuery.post(this.proxyUrl, { query: this.store.string() }, function (data) { self.handleResponse(data); }, 'json');
    }
    else {
      jQuery.getJSON(this.solrUrl + '?' + this.store.string() + '&wt=json&json.wrf=?', {}, function (data) { self.handleResponse(data); });
    }
  }
});