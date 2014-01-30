<import resource="classpath:alfresco/extension/templates/webscripts/fr/itldev/extlinks/extlinks.lib.js">


model.items = new Array();
model.status = "OK";
model.message = "";

var site = search.ISO9075Encode(url.templateArgs["site"]);
var action = url.templateArgs["action"];

var siteHome = companyhome.childByNamePath("/Sites/" + site);
if (siteHome == undefined || !siteHome.isContainer)
{
    model.status = "ERROR";
    model.message = "Site doesn't exists.";
} else {
    try {
        var title = json.get('title');
    } catch (e) {
    }


    if (action === "list") {
        listCategories(site)
    } else if (action === "add") {
        addCategory(site, title);
    } else if (action === "del") {
        delCategory(site, title);
    } else if (action === "edit") {
        try {
            var oldtitle = json.get('oldtitle');
        } catch (e) {
        }
        editCategory(site, oldtitle, title);
    } else {
        model.status = "ERROR";
        model.message = "Unknown Action : " + action;
    }
}


