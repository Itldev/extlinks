<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/dashlets/extlinks.css"/>
</@>

<@markup id="js">
   <#-- Dépendances javaScript locales pour gérer le nb de colonnes -->        
    <@script type="text/javascript" src="${page.url.context}/res/modules/simple-dialog.js"></@script>
    <@script type="text/javascript" src="${url.context}/res/components/dashlets/extlinks.js" />    
</@>



<script type="text/javascript">//< ! [CDATA[
  new Itldev.dashlet.ExtLinks("${htmlid}").setOptions(
  {
    "siteId" : "${siteId}",
    "regionId" : "${regionId}",
    "htmlId" : "${htmlId}",
    "columnsFilter" : ${columnsFilter},
    "categoryFilter" : ${categoryFilter}
  }).setMessages(
      ${messages}
   );
  new Alfresco.widget.DashletResizer("${htmlid}", "${objectId}");
//] ] ></script>



<@markup id="html">
   <@uniqueIdDiv>
     <#assign id = args.htmlid>
      <div class="dashlet ext-links">
         <div class="title">${msg("header.links")}</div>
         <#if (userIsSiteManager)!false>
            <div class="toolbar flat-button" style="overflow:hidden;">
           
                    
                        <span class="align-left yui-button yui-menu-button" id="${id}-columns">
                           <span class="first-child">                           
                               <button type="button" tabindex="0"></button>
                           </span>
                        </span>
                        <select id="${id}-columns-menu">
                                   <#list filterNbCols as filter>
                                       <option value="${filter.type?html}">${msg(filter.label)}</option>
                                   </#list>
                       </select> 
                                            
                       <span class="align-left yui-button yui-menu-button" id="${id}-categories">
                       </span>
                  
                       <span class="align-left yui-button yui-menu-button" id="${id}-save-button-span">                            
                            <span class="first-child">
                                 <button id="${id}-save-button" type="button">${msg("link.saveConfig")}</button>
                            </span>
                        </span>

                        <span class="align-left yui-button yui-menu-button" id="${id}-sort-button-span">                            
                            <span class="first-child">
                                 <button id="${id}-sort-button" type="button">${msg("link.sort")}</button>
                            </span>
                        </span>

                  <!-- lien de creation de categorie -->   
                  <span class="align-right yui-button-align">
                     <span class="first-child">           
                        <a  id="${args.htmlid}-newCat-link" class="theme-color-1">${msg("link.createCategory")}</a>
                     </span>
                  </span>               
              
            </div>
         </#if>
          <div id="${id}-catLinkList" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>></div>
        </div>
        
          <#-- Empty results list template -->
           <div id="${id}-empty" style="display: none">
                <div class="empty"><h3>${msg("empty.title")}</h3><span>${msg("empty.description")}</span></div>
           </div>
   </@>
</@>
