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

