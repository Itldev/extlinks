//lecture des elements passés via le pont AJAX (dataObj)
model.htmlId = args.htmlId;
model.site = args.site;
model.category = args.category;


links = remote.connect("alfresco").post('/fr/itldev/extlinks/links/' + model.site + "/list",
        "{\"category\" : \"" + model.category + "\"}",
        "application/json");

if (links.status == 200)
{
    links = eval('(' + links.response + ')').items;
    model.links = links;
    model.numLinks = links.length;
}