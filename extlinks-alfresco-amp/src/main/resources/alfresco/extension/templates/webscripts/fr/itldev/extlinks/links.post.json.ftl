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

