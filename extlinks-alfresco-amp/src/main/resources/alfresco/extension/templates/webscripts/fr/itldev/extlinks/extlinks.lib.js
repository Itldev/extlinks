function getOrInitExtLinksFolderInSite(site) {
    var siteHome = companyhome.childByNamePath("/Sites/" + site);
    if (siteHome != null) {
        var extLinksHome = siteHome.childByNamePath("ExtLinks");
        //creates extlinksHome if doesn't exists
        if (extLinksHome == undefined || !extLinksHome.isContainer)
        {
            try {
                extLinksHome = siteHome.createNode("ExtLinks", "cm:folder");
            } catch (e) {
                model.status = "ERROR";
                model.message = "Not able to create ExtLinks dir";
                return null;
            }
        }
        return extLinksHome;
    } else {
        model.status = "ERROR";
        model.message = "Site" + site + " doesn't exists";
        return null;
    }
}


function listCategories(site) {
    var queryEncoded = "TYPE:\"itl:extlinkscategory\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks//*\" ";
    var results = search.luceneSearch(queryEncoded);
    if (results != null) {
        model.items = results;
    }
}

function addCategory(site, categoryTitle) {
    extLinksHome = getOrInitExtLinksFolderInSite(site);

    if (extLinksHome !== null) {
        if (categoryTitle !== undefined && categoryTitle !== "") {
            var catNode = extLinksHome.childByNamePath(categoryTitle);
            if (catNode == undefined)
            {
                try {
                    catNode = extLinksHome.createNode(categoryTitle, "itl:extlinkscategory");
                    catNode.name = categoryTitle;
                    catNode.properties['itl:extlinkscatname'] = categoryTitle;
                    catNode.save();
                    model.status = "OK";
                } catch (e) {
                    model.status = "ERROR";
                    model.message = "Category creation error : " + e;
                }
            } else {
                model.status = "ERROR";
                model.message = "Category Already exists";
            }
        } else {
            model.status = "ERROR";
            model.message = "Undefined new category title";
        }
    }
}


function delCategory(site, categoryTitle) {
    extLinksHome = getOrInitExtLinksFolderInSite(site);

    if (extLinksHome !== null) {
        if (categoryTitle !== undefined && categoryTitle !== "") {
            var catNode = extLinksHome.childByNamePath(categoryTitle);
            if (catNode == undefined)
            {
                model.status = "ERROR";
                model.message = "Category doesn't exists";
            } else {
                try {
                    catNode.remove();
                } catch (e) {
                    model.status = "ERROR";
                    model.message = "Category deletion error : " + e;
                }
            }
        } else {
            model.status = "ERROR";
            model.message = "Undefined category title";
        }
    }
}



function editCategory(site, categoryTitle, categoryNewTitle) {
    extLinksHome = getOrInitExtLinksFolderInSite(site);

    if (extLinksHome !== null) {
        if (categoryTitle !== undefined && categoryTitle !== "" && categoryNewTitle !== undefined && categoryNewTitle !== "") {
            var catNode = extLinksHome.childByNamePath(categoryTitle);
            if (catNode == undefined)
            {
                model.status = "ERROR";
                model.message = "Category doesn't exists";
            } else {
                try {
                    catNode.properties['itl:extlinkscatname'] = categoryNewTitle;
                    catNode.name = categoryNewTitle;
                    catNode.save();
                } catch (e) {
                    model.status = "ERROR";
                    model.message = "Category edition error : " + e;
                }
            }
        } else {
            model.status = "ERROR";
            model.message = "Undefined category title";
        }
    }
}

function sortLnk(a, b) {
    var aNumOrder = a.properties['itl:extlinksnumordre'];
    var bNumOrder = b.properties['itl:extlinksnumordre'];
    if (aNumOrder < bNumOrder)
        return -1;
    if (aNumOrder > bNumOrder)
        return 1;
    return 0;
}

function listLinks(site, categoryTitle) {

    category = decodeURIComponent(categoryTitle);

    var queryEncoded = "TYPE:\"itl:extlinkscategory\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks//*\" ";
    var categories = search.luceneSearch(queryEncoded);
    var catExists = false;
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == category) {
            catExists = true;
            break;
        }
    }

    if (!catExists) {
        model.status = "ERROR";
        model.message = "No Such category";
        return;
    }


    var queryEncoded = "TYPE:\"itl:extlinkslink\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks/cm:" + search.ISO9075Encode(categoryTitle) + "//*\" ";
    var results = search.luceneSearch(queryEncoded);

    if (results != null && results.length > 0) {
        results.sort(sortLnk);
        model.items = results;
    } else {
        model.message = "No link"
    }
}


function addLink(site, categoryNodeRef, linkname, link) {

    var category = search.findNode(categoryNodeRef);

    var numordre = 0;
    try {
        var catQueryEncoded = "TYPE:\"itl:extlinkslink\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks/cm:" + search.ISO9075Encode(category.name) + "//*\" "

        var results = search.luceneSearch(catQueryEncoded);
        numordre = results.length;
    } catch (e) {
        numordre = 0;
    }

    var now = new Date();
    var filename = "extLnk-" + now.getTime().toString();


    try {
        lnkNode = category.createNode(filename, "itl:extlinkslink");
        lnkNode.properties["lnk:title"] = linkname;
        lnkNode.properties["lnk:url"] = link;
        lnkNode.properties["itl:extlinksnumordre"] = numordre;
        lnkNode.save();

    } catch (e) {
        model.status = "ERR";
        model.errormessage = "Link creation error " + e.toString();
    }
}


function delLink(site, linkname) {


    var lnkQuery = "@cm\\:name:\"" + search.ISO9075Encode(linkname) + "\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks//*\"";
    var results = search.luceneSearch(lnkQuery);

    if (results.length === 1) {
        try {
            var linkToDelete = results[0];
            linkToDelete.remove();
        } catch (e) {
            model.status = "ERROR";
            model.message = "Error deleting link " + e.toString();
        }

    } else {
        model.status = "ERROR";
        if (results.length === 0) {
            model.message = "No such link";
        } else {
            model.message = "More than one links matches";
        }
    }
}


function editLink(site, categoryNodeRef, linkFileName, linkname, link) {

    var category = search.findNode(categoryNodeRef);

    var lnkQuery = "@cm\\:name:\"" + search.ISO9075Encode(linkFileName) + "\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks//*\"";
    var results = search.luceneSearch(lnkQuery);

    var linkToUpdate;
    if (results.length === 1) {
        linkToUpdate = results[0];
        try {
            if (linkToUpdate.parent.name !== category.name) {
                linkToUpdate.move(category);
            }

            linkToUpdate.properties["lnk:title"] = linkname;
            linkToUpdate.properties["lnk:url"] = link;
            linkToUpdate.save();
        } catch (e) {
            model.status = "ERROR";
            model.message = "Link editing error" + e;
        }
    } else {
        model.status = "ERROR";
        if (results.length === 0) {
            modelmessage = "No such link";
        } else {
            model.message = "More than one links matches";
        }
    }



}

function getLink(site, linkFile) {

    var lnkQuery = "@cm\\:name:\"" + search.ISO9075Encode(linkFile) + "\" AND PATH:\"//app:company_home/st:sites/cm:" + site + "/cm:ExtLinks//*\"";
    var results = search.luceneSearch(lnkQuery);
    if (results.length == 1) {
        model.items.push(results[0]);
    } else {
        model.status = "ERROR";
        model.message = results.length + " documents match. 1 should be selected"
    }
}


function sortLinks(sortedList) {
    var links = sortedList.split(",");

    var numOrder = 0;

    for (var i = 0; i < links.length; i++) {

        var lnkQuery = "@cm\\:name:\"" + search.ISO9075Encode(links[i]) + "\" AND PATH:\"//app:company_home/st:sites//*\"";
        var results = search.luceneSearch(lnkQuery);

        if (results.length === 1) {
            try {
                var linkToUpdate = results[0];
                linkToUpdate.properties["itl:extlinksnumordre"] = numOrder;
                linkToUpdate.save();
                numOrder++;
            } catch (err) {
                model.status = "ERROR";
                model.message = "Unable to sort : one link can't be recorded";
                break;
            }
        } else {
            model.status = "ERROR";
            if (results.length === 0) {
                model.message = "Unable to sort : one link doesn't exists";
            } else {
                model.message = "Unable to sort : one link is duplicated";
            }
            break;
        }
    }

}


function getParams(siteId, regionId) {

    var extLinksHome = getOrInitExtLinksFolderInSite(site);
    var confFileName = "conf-" + regionId + ".json";

    var confFile = extLinksHome.childByNamePath(confFileName);
    if (confFile != undefined)
    {
        model.content = confFile.content;
    } else {
        model.content = "{}";
    }

}


function setParams(site, regionId, category, columns) {
    var extLinksHome = getOrInitExtLinksFolderInSite(site);

    var confFileName = "conf-" + regionId + ".json";

    var confFile = extLinksHome.childByNamePath(confFileName);
    if (confFile == undefined)
    {
        confFile = extLinksHome.createNode(confFileName, "cm:content");
    }

    confFile.content = "{\n" +
            "\"category\" : \"" + category + "\",\n"
            + "\"columns\" : \"" + columns + "\""
            + "\n}";
    confFile.save();
    model.content = "OK";
}

