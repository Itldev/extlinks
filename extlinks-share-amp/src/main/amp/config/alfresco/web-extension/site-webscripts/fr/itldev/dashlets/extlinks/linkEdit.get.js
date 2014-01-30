
//loading categories
var site = url.templateArgs["siteId"];
var linkFileName = url.templateArgs["linkFileName"];

alfrescoServiceConnector = remote.connect("alfresco");


catUrlService = "/fr/itldev/extlinks/categories/" + site + "/list";
jsonCat = alfrescoServiceConnector.post(catUrlService, "{}", "application/json");
model.categories = eval('(' + jsonCat.response + ')').items;



getLinkUrlService = "/fr/itldev/extlinks/links/" + site + "/get";
jsonTxt = alfrescoServiceConnector.post(getLinkUrlService, "{\"linkFile\" : \"" + linkFileName + "\"}", "application/json");




jsonLink = eval('(' + jsonTxt.response + ')').items[0];



model.title = jsonLink.title;
model.url = jsonLink.url;
model.linkFileName = linkFileName;
model.categoryName = url.templateArgs["category"];;

