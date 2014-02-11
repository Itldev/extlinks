<import resource="classpath:alfresco/extension/templates/webscripts/fr/itldev/extlinks/extlinks.lib.js">
// --
//  ExtLinks is an alfresco and alfresco share module that supplies an extended
//   bookmarks dashlets.
//
//  Copyright (C) Itl Developpement 2013
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as
//  published by the Free Software Foundation, either version 3 of the
//  License, or (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see `<http://www.gnu.org/licenses/>`.
// --



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


