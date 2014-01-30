<#escape x as jsonUtils.encodeJSONString(x)>
	{
		"status" : "${status}",
                "message" : "${message}",
                "items" :[
  			<#list items as l>
			{
                            "name":"${l.name}",                           
                            "title": "${l.properties['{http://www.alfresco.org/model/linksmodel/1.0}title']}",
                            "url": "${l.properties['{http://www.alfresco.org/model/linksmodel/1.0}url']}",
                            "extlnknumordre" : "${l.properties['itl:extlinksnumordre']}",
                            "nodeRef": "${l.name}"
			}
                        <#if l_has_next>,</#if>
   			</#list>
   		]
	}
</#escape>

