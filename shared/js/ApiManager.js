
AjaxSolr.ApiManager = AjaxSolr.Manager.extend({

    processURI: function(uri, facetsList) {
        if (typeof(location.hash) !== "undefined" && location.hash !== "" && (typeof(facetsList) !== "undefined" && facetsList.length > 0)) {
            var jsonData, data = null;
            var paramLocation  = location.hash.indexOf('?');

            if (paramLocation !== -1 && paramLocation > 1) {
                data = location.hash.substring(1, paramLocation - 1);
            } else {
                data = location.hash.substring(1);
            }

            var decodedData     = decodeURIComponent(data);

            try {
                jsonData = JSON.parse(decodedData);
            } catch (e) {
                // Do nothing: received value is not JSON
                console.log("Received data that is not valid JSON. Nothing to process.");
                return;
            }

            if (jsonData.hasOwnProperty('facets_selector')) {
                var facetsKeys = Object.keys(jsonData.facets_selector);
                for (var jKey in facetsKeys) {
                    var facet  = facetsKeys[jKey];
                    var qValue = jsonData.facets_selector[facet];

                    if (facetsList.indexOf(facet) > -1) {
                        var query = facet + ':' + AjaxSolr.Parameter.escapeValue(qValue).replace(new RegExp('%2C', 'g'), ',');
                        this.store.addByValue('fq', query)
                        location.hash = '';
                    }
                }
            }
        }
    }

});