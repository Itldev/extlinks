<#escape x as jsonUtils.encodeJSONString(x)>
	{
		"status" : "${status}",
                "message" : "${message}",
                "items" :[
  			<#list items as cat>
			{
				"name":"${cat.name}",
                                "nodeRef":"${cat.nodeRef}"
			}
                        <#if cat_has_next>,</#if>
   			</#list>
   		]
	}
</#escape>

