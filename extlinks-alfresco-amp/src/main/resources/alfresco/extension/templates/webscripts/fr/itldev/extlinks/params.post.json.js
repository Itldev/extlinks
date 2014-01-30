<import resource="classpath:alfresco/extension/templates/webscripts/fr/itldev/extlinks/extlinks.lib.js">
var site = search.ISO9075Encode(url.templateArgs["site"]);
var action = url.templateArgs["action"];

var siteHome = companyhome.childByNamePath("/Sites/" + site);
if (siteHome == undefined || !siteHome.isContainer)
{
    model.status = "ERROR";
    model.message = "Site doesn't exists.";
} else {

    if (action === "get") {

        try {
            var regionId = json.get('regionId');
            getParams(site, regionId);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }
    } else if (action === "set") {
        try {
            var regionId = json.get('regionId');
            var category = json.get('category');
            var columns = json.get('columns');
            setParams(site, regionId, category, columns);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }

    } else {
        model.status = "ERROR";
        model.message = "Unknown Action : " + action;
    }
}


