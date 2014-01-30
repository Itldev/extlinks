<div id="${args.htmlid}-addLinkDialog">
   <div class="hd">${msg("label.dialogTitle")}</div>

   <div class="bd">
      <form id="${args.htmlid}-form" action="" method="POST">
         <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-title">${msg("label.link-title")}:</label></div>
            <div class="yui-u"><input  id="${args.htmlid}-title" type="text" name="linkname" value="" maxlength="50" /></div>
         </div>

        <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-dest">${msg("label.link-dest")}:</label></div>
            <div class="yui-u"><input  id="${args.htmlid}-dest" type="text" name="link" value="" /></div>
         </div>

        <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-category">${msg("label.link-category")}:</label></div>
                <div class="yui-u">
                        <select id="${args.htmlid}-categories-menu-addlink" name="categoryNodeRef">
                                <#list categories as cat>
                                    <#if "${cat.name}" == "${categoryName}" >
                                         <option selected value="${cat.nodeRef}">${cat.name}</option>
                                    <#else>
                                         <option value="${cat.nodeRef}">${cat.name}</option>
                                    </#if>
                                </#list>
                        </select>
                </div>
         </div>
       
         <div class="bdft">
            <input type="submit" id="${args.htmlid}-ok" value="${msg("button.ok")}" />
            <input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
         </div>
      </form>
   </div>

</div>