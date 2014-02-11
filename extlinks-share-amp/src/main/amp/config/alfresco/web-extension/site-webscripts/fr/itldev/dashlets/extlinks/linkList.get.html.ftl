<#--

    ExtLinks is an alfresco and alfresco share module that supplies an extended
     bookmarks dashlets.

    Copyright (C) Itl Developpement 2013

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see `<http://www.gnu.org/licenses/>`.

-->

<div id="${htmlId}-cat-title" style="display: inline-block;width: 100%;" >
<#if category?? && category!="">
<span class="first-child" style="float:left;">
    <h1>${category}</h1>
 </span>

  <#if (userIsSiteManager)!false>     
        
         <span class="first-child" style="float:left;">                                    
             <a id="${htmlId}-delCat-link">
                 <img src="${url.context}/res/modules/images/del.gif" />
             </a>                                   
         </span>
         <span class="first-child" style="float:left;" >                                    
             <a id="${htmlId}-editCat-link">
                 <img src="${url.context}/res/modules/images/edit.gif" />
             </a>                                   
         </span>

        <span class="first-child" style="float:right;">    
              <a  id="${htmlId}-newLink-link" class="theme-color-1">${msg("link.createLink")}</a>
        </span>
  </#if>
</div>
<#if numLinks?? && numLinks!=0>
            <#list links as link><div class="detail-list-item collink link-${htmlId}">	
                   	  
                     <div class="link">
                        <a  href="${link.url}" class="theme-color-1" target="_blank">${link.title}</a>
                     </div>
                     <div class="actions">
                         <#if (userIsSiteManager)!false>
                            <span class="first-child" style="float:right;">                                    
                                </span>
                               <span class="first-child " style="float:right;" >                                    
                                    <a id="${link.name}-edit-link" class="${htmlId}-extlinks-edit">
                                        <img src="${url.context}/res/modules/images/edit.gif" />
                                    </a>                                   
                                </span>
                                <span class="first-child" style="float:right;">                                    
                                    <a id="${link.name}-del-link" class="${htmlId}-extlinks-del">
                                        <img src="${url.context}/res/modules/images/del.gif" />
                                    </a>                                   
                                </span>
                          </#if>                        
                     </div>
               

               </div></#list>
         <#else>
            <div class="detail-list-item first-item last-item">
               <span>${msg("label.noLinks")}</span>
            </div>
     </#if>
</#if>
