
var site = url.templateArgs["siteId"];
model.categoryName = url.templateArgs["categoryName"];


//retrieve categories
catUrlService = "/fr/itldev/extlinks/categories/" + site + "/list";
lstCatConnector = remote.connect("alfresco");
jsonCat = lstCatConnector.post(catUrlService, "{}", "application/json");
//todo verifier le retour !!
model.categories = eval('(' + jsonCat.response + ')').items;
