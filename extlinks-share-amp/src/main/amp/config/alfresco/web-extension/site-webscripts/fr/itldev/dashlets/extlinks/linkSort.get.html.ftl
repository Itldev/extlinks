   
<#if numLinks?? && numLinks!=0>
        <ul id="ulsort" class="draglist"> 
            <#list links as link>
                <li class="extlinks-sort-item" id="${link.nodeRef}">${link.title}</li>
            </#list>
	</ul> 
<#else>
            <div class="detail-list-item first-item last-item">
               <span>${msg("label.noLink")}</span>
            </div>
</#if>