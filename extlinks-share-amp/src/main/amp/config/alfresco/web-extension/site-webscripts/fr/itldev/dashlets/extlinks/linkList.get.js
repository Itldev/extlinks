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