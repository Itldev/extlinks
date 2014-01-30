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




    if (action === "list") {
        try {
            var category = json.get('category');

            listLinks(site, category);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }
    } else if (action === "add") {

        try {
            var linkname = json.get('linkname');
            var link = json.get('link');
            var categoryNodeRef = json.get('categoryNodeRef');
            addLink(site, categoryNodeRef, linkname, link);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }

    } else if (action === "del") {
        try {
            var linkFile = json.get('linkFile');
            delLink(site, linkFile);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }
    } else if (action === "edit") {
        try {
            var linkname = json.get('linkname');
            var link = json.get('link');
            var categoryNodeRef = json.get('categoryNodeRef');
            var linkFileName = json.get('linkFileName');
            editLink(site, categoryNodeRef, linkFileName, linkname, link);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }
    } else if (action === "get") {
        try {
            var linkFile = json.get('linkFile');
            getLink(site, linkFile);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }

    } else if (action === "sort") {
        try {
            var sortedList = json.get('sortedList');
            sortLinks(sortedList);
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error getting parameters : " + e;
        }
    } else {
        model.status = "ERROR";
        model.message = "Unknown Action : " + action;
    }
}


