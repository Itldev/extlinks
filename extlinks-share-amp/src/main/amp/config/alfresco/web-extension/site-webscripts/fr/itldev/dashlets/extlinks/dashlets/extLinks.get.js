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


function getFilters(filterType)
{
var myConfig = new XML(config.script),
        filters = [];
        for each (var xmlFilter in myConfig[filterType].filter)
{
filters.push(
{
type: xmlFilter.@type.toString(),
        label: xmlFilter.@label.toString()
});
}

return filters;
}

model.filterNbCols = getFilters("filter-columns");
        function sortByTitle(link1, link2)
        {
        return (link1.title > link2.title) ? 1 : (link1.title < link2.title) ? - 1 : 0;
        }


var site, container, theUrl, connector, result, links;
        site = page.url.templateArgs.site;
        model.site = site;
        
        
        // ==================================
        // vérification du role
        // ==================================
        model.userIsNotSiteConsumer = false;
        var obj = null;
        var json = remote.call("/api/sites/" + page.url.templateArgs.site + "/memberships/" + encodeURIComponent(user.name));
        if (json.status == 200)          { obj = eval('(' + json + ')'); }
if (obj){model.userIsSiteManager = obj.role === "SiteManager"; }


// ==================================
// Lecture du fichier de conf
// ==================================
        confUrlService = "/fr/itldev/extlinks/params/"+site+"/get";
        
        confConnector = remote.connect("alfresco");
        params = "{\"regionId\" : \""+args['region-id']+"\"}";
        
        jsonConf = confConnector.post(confUrlService,
            params,
            "application/json");
            
        jsonConfObj = eval('(' + jsonConf + ')');
        
        model.columnsFilter = "null";
        if(jsonConfObj.columns !=null){
             model.columnsFilter= "\""+jsonConfObj.columns+"\"";
        }
        
        model.categoryFilter = "null";
        if(jsonConfObj.category !=null){
             model.categoryFilter= "\""+jsonConfObj.category+"\"";
        }
        
       
        // ==================================
        // instanciation et params objets JS
        // ==================================
        // 

        model.htmlId = args.htmlid;
        model.siteId = page.url.templateArgs.site;
        model.regionId = args['region-id'];
        model.objectId = instance.object.id;                