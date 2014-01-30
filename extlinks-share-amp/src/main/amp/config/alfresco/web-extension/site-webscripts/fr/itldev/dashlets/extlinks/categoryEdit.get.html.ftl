<div id="${args.htmlid}-addCatDialog">
   <div class="hd">${msg("label.dialogTitle")}</div>

   <div class="bd">
      <form id="${args.htmlid}-form" action="" method="POST">
         <div class="yui-gd">
            <div class="yui-u first"><label for="${args.htmlid}-title">${msg("label.category-title")}:</label></div>
            <div class="yui-u"><input  id="${args.htmlid}-cattitle" type="text" name="title" value="${category}" maxlength="50" /></div>
                <input  id="${args.htmlid}-cattitle-old" type="hidden" name="oldtitle" value="${category}"/>
         </div>        
         <div class="bdft">
            <input type="submit" id="${args.htmlid}-ok" value="${msg("button.ok")}" />
            <input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
         </div>
      </form>
   </div>

</div>