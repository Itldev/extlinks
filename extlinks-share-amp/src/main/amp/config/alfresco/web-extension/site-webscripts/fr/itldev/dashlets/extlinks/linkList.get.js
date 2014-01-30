//lecture des elements passés via le pont AJAX (dataObj)
model.htmlId = args.htmlId;
model.site = args.site;



theUrl = "/fr/itldev/extlinks/links/" + model.site + "/list";

connector = remote.connect("alfresco");

result = connector.post(theUrl, "{\"category\" : \"" + args.category + "\"}",
        "application/json");
if (result.status == 200)
{
    if (eval('(' + result.response + ')').status === "OK") {
        model.category = args.category;
    }
    links = eval('(' + result.response + ')').items;
    model.links = links;
    model.numLinks = links.length;




}

// ==================================
// vérification du role
// ==================================
model.userIsNotSiteConsumer = false;
var obj = null;
var json = remote.call("/api/sites/" + model.site + "/memberships/" + encodeURIComponent(user.name));
if (json.status == 200)
{
    obj = eval('(' + json + ')');
}
if (obj)
{
    model.userIsSiteManager = obj.role === "SiteManager";
}