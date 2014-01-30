/**
 * Itldev root namespace.
 * 
 * @namespace Itldev
 */
// Ensure Itldev root object exists
if (typeof Itldev == "undefined" || !Itldev)
{
    var Itldev = {};
}


/**
 * Itldev top-level module namespace.
 * 
 * @namespace Itldev
 * @class Itldev.component
 */
Itldev.dashlet = Itldev.dashlet || {};


/**
 * Dashboard ExtLinks component.
 * 
 * @namespace Itldev.dashlet
 * @class Itldev.dashlet.ExtLinks
 */
(function()
{
    var Dom = YAHOO.util.Dom,
            Event = YAHOO.util.Event,
            Selector = YAHOO.util.Selector,
            DDM = YAHOO.util.DragDropMgr;

    var PREFERENCES_EXTLINKS = "org.alfresco.share.ExtLinks",
            PREF_COLUMNS = ".columns",
            PREF_CATEGORIES = ".categories";



    /**
     * Dashboard ExtLinks constructor.
     * 
     * @param {String} htmlId The HTML id of the parent element
     * @return {Itldev.dashlet.ExtLinks} The new component instance
     * @constructor
     */
    Itldev.dashlet.ExtLinks = function ExtLinks_constructor(htmlId)
    {
        Itldev.dashlet.ExtLinks.superclass.constructor.call(this, "Itldev.dashlet.ExtLinks", htmlId, ["button", "container"]);
        // Preferences service
        this.services.preferences = new Alfresco.service.Preferences();
        return this;
    };

    YAHOO.extend(Itldev.dashlet.ExtLinks, Alfresco.component.Base,
            {
                options:
                        {
                            siteId: "",
                            regionId: "",
                            htmlId: "",
                            columnsFilter: "onecol",
                            categoryFilter: null
                        },
                catLinksList: null,
                onReady: function ExtLinks_onReady()
                {
                    //columns menu initialization
                    this.loadColumnsMenu();
                    //categories menu initialization
                    this.loadCategoriesMenu();

                    //record modifications button initialization
                    this.widgets.SaveButton = Alfresco.util.createYUIButton(this, "save-button", this.onSaveConfig,
                            {
                                value: "create"
                            });

                    //sort links button initialization
                    this.widgets.SortButton = Alfresco.util.createYUIButton(this, "sort-button", this.onSortLinks);

                    //new category event listener
                    var addCategoryLink = Dom.get(this.id + "-newCat-link");
                    if (addCategoryLink)
                    {
                        Event.addListener(addCategoryLink, "click", this.onNewCat, this, true);
                    }

                    //Gets html element categorie Link List in DOM 
                    this.catLinksList = Dom.get(this.id + "-catLinkList");

                    //loads Links in the selected category and display
                    this.loadLinksAndDisplay(this);
                },
                /**
                 * Load and display colmumns menu
                 * @return {undefined}
                 */
                loadColumnsMenu: function ExtLinks_loadColumnsMenu()
                {
                    this.widgets.columns = Alfresco.util.createYUIButton(this, "columns", this.onNbColumnsChanged,
                            {
                                type: "menu",
                                menu: "columns-menu",
                                lazyloadmenu: false
                            });

                    if (this.widgets.columns !== null) {
                        // set the correct menu label
                        var menuItems = this.widgets.columns.getMenu().getItems();

                        if (this.options.columnsFilter === null) {
                            this.options.columnsFilter = menuItems[0].value;
                        }

                        for (index in menuItems)
                        {
                            if (menuItems.hasOwnProperty(index))
                            {
                                if (menuItems[index].value === this.options.columnsFilter)
                                {
                                    this.widgets.columns.set("label", menuItems[index].cfg.getProperty("text"));
                                    break;
                                }
                            }
                        }
                    }
                    var selection = Selector.query(".toolbar div", this.id, true);
                    Dom.removeClass(selection, "hidden");
                },
                /**
                 * load categories menu
                 * @return {undefined}
                 */
                loadCategoriesMenu: function ExtLinks_loadCategoriesMenu() {
                    var mainRef = this;

                    //On category changed event
                    var onCategoryChanged = function(p_sType, p_aArgs)
                    {
                        var menuItem = p_aArgs[1];
                        if (menuItem)
                        {
                            mainRef.widgets.categories.set("label", menuItem.cfg.getProperty("text"));
                            mainRef.options.categoryFilter = menuItem.value;
                            mainRef.services.preferences.set(mainRef.buildPreferences(PREF_CATEGORIES), mainRef.widgets.categories.value);
                            //reload selected category
                            mainRef.loadLinksAndDisplay();
                        }
                    };

                    //On category list succesfully loaded
                    var onCategoryLoad_Success = function(p_response)
                    {
                        var selValue = null;
                        //builds menu from service json response
                        var categoriesMenuItems = new Array();
                        for (var i = 0; i < p_response.json.items.length; i++) {
                            var catName = p_response.json.items[i].name;
                            categoriesMenuItems.push({text: catName, value: catName});
                            if (catName === this.options.categoryFilter) {
                                selValue = catName;
                            }
                        }
                        var categoriesMenuDomElement = document.getElementById(mainRef.id + "-categories");
                        categoriesMenuDomElement.innerHTML = '';

                        YAHOO.util.Event.onContentReady(this.id + "-categories", function() {
                            //deletes previous element if exists


                            mainRef.widgets.categories = new YAHOO.widget.Button({type: "menu", name: "categories-menu", menu: categoriesMenuItems, container: this});
                            if (selValue !== null) {
                                mainRef.widgets.categories.set("label", selValue);
                                mainRef.widgets.categories.value = selValue;
                            }
                            mainRef.widgets.categories.getMenu().subscribe("click", onCategoryChanged);
                        });
                    };

                    //calls categories listing rest service
                    Alfresco.util.Ajax.request(
                            {
                                url: Alfresco.constants.PROXY_URI + "/fr/itldev/extlinks/categories/" + this.options.siteId + "/list",
                                method: Alfresco.util.Ajax.POST,
                                requestContentType: Alfresco.util.Ajax.JSON,
                                responseContentType: Alfresco.util.Ajax.JSON,
                                dataObj:
                                        {
                                            regionId: this.options.regionId,
                                            category: this.options.categoryFilter,
                                            columns: this.options.columnsFilter
                                        },
                                successCallback:
                                        {
                                            fn: onCategoryLoad_Success,
                                            scope: this
                                        },
                                scope: this,
                                noReloadOnAuthFailure: true
                            });
                },
                /**
                 * Build the Activities dashlet preferences name string with optional suffix.
                 * The component region ID and the current siteId (if any) is used as part of the
                 * preferences name - to uniquely identify the preference within the site or user
                 * dashboard context.
                 * 
                 * @method buildPreferences
                 * @param suffix {string} optional suffix to append to the preferences name
                 */
                buildPreferences: function Activities_buildPreferences(suffix)
                {
                    var opt = this.options;
                    return PREFERENCES_EXTLINKS + "." + opt.regionId + (opt.siteId ? ("." + opt.siteId) : "") + (suffix ? suffix : "");
                },
                /**Change columns display style according to the drop down menu
                 * 
                 * @param {type} event
                 * @param {type} args
                 */
                onNbColumnsChanged: function ExtLinks_onNbColumnsChanged(event, args)
                {
                    var menuItem = args[1];

                    this.options.columnsFilter = menuItem.value;
                    if (menuItem)
                    {
                        this.widgets.columns.set("label", menuItem.cfg.getProperty("text"));
                        this.options.columnsFilter = menuItem.value;
                        this.services.preferences.set(this.buildPreferences(PREF_COLUMNS), this.widgets.columns.value);
                        this.applyNewStyle();
                    }
                },
                /**
                 * Saves columns and category settings
                 * 
                 * @method onSaveConfig
                 */
                onSaveConfig: function ExtLinks_onSaveConfig() {

                    var setParamsUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "/fr/itldev/extlinks/params/" + this.options.siteId + "/set");

                    Alfresco.util.Ajax.request(
                            {
                                url: setParamsUrl,
                                method: Alfresco.util.Ajax.POST,
                                requestContentType: Alfresco.util.Ajax.JSON,
                                responseContentType: Alfresco.util.Ajax.JSON,
                                dataObj:
                                        {
                                            regionId: this.options.regionId,
                                            category: this.options.categoryFilter,
                                            columns: this.options.columnsFilter
                                        },
                                successCallback:
                                        {
                                            fn: function() {
                                                Alfresco.util.PopupManager.displayMessage({text: this.msg("save.success")});
                                            },
                                            scope: this
                                        },
                                scope: this
                            });
                },
                /*
                 * ========= Categories Events =========== 
                 *
                 */
                /**
                 * On new Category creation method
                 * 
                 * @method onNewCat
                 */
                onNewCat: function ExtLinks_onNewCat() {

                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/categories/" + this.options.siteId + "/add");

                    var onConfigNewCat_SuccessCallback = function(response)
                    {
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("createcat.success")});
                            this.loadCategoriesMenu();
                            //TODO notify all dashlets on the page categories menu update request
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("createcat.error") + " : " + response.json.errormessage});
                        }
                    };

                    var configDialog = new Alfresco.module.SimpleDialog(this.id + "-addCatDialog").setOptions({
                        width: "30em",
                        templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/extlinks/category/",
                        actionUrl: actionUrl,
                        onSuccess:
                                {
                                    fn: onConfigNewCat_SuccessCallback,
                                    scope: this
                                }
                    });

                    configDialog.show();
                },
                /**
                 * On Category deletion method
                 * 
                 * @method onNewCat
                 */
                onDelCat: function ExtLinks_onDelCat() {

                    var dashletObject = this;

                    var catToDel = dashletObject.options.categoryFilter;

                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/categories/" + dashletObject.options.siteId + "/del");

                    confirmDelDialog = new YAHOO.widget.SimpleDialog(this.id + "delCatDialog", {
                        width: "20em",
                        effect: {
                            effect: YAHOO.widget.ContainerEffect.FADE,
                            duration: 0.25
                        },
                        fixedcenter: true,
                        modal: true,
                        visible: false,
                        draggable: false
                    });

                    newWaitingPanel = new YAHOO.widget.Panel("wait",
                            {width: "240px",
                                fixedcenter: true,
                                close: false,
                                draggable: false,
                                zindex: 4,
                                modal: true,
                                visible: false
                            }
                    );
                    newWaitingPanel.setHeader(dashletObject.msg('deletecat.deleting'));
                    newWaitingPanel.setBody('<img src="http://l.yimg.com/a/i/us/per/gr/gp/rel_interstitial_loading.gif" />');
                    newWaitingPanel.render(document.body);


                    var onDelCat_SuccessCallback = function(response) {
                        newWaitingPanel.hide();
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("deletecat.success")});
                            dashletObject.loadCategoriesMenu();
                            dashletObject.loadLinksAndDisplay();
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("deletecat.error") + " : " + response.json.errormessage});
                        }

                    };


                    var onDelCat_FailedCallback = function() {
                        newWaitingPanel.hide();
                        Alfresco.util.PopupManager.displayMessage({text: this.msg("deletecat.error")});
                    };



                    var handleYes = function() {
                        newWaitingPanel.show();
                        confirmDelDialog.hide();
                        Alfresco.util.Ajax.request(
                                {
                                    url: actionUrl,
                                    method: Alfresco.util.Ajax.POST,
                                    requestContentType: Alfresco.util.Ajax.JSON,
                                    responseContentType: Alfresco.util.Ajax.JSON,
                                    dataObj:
                                            {
                                                title: catToDel
                                            },
                                    successCallback:
                                            {
                                                fn: onDelCat_SuccessCallback,
                                                scope: this
                                            },
                                    failureCallback:
                                            {
                                                fn: onDelCat_FailedCallback,
                                                scope: this
                                            },
                                    scope: this,
                                    noReloadOnAuthFailure: true
                                });
                    };
                    var handleNo = function() {
                        this.hide();
                        confirmDelDialog.hide();
                    };
                    var myButtons = [
                        {text: this.msg("yes"), handler: handleYes},
                        {text: this.msg("cancel"), handler: handleNo, isDefault: true}
                    ];

                    confirmDelDialog.setHeader(this.msg("deletecat.dialogheader"));
                    confirmDelDialog.setBody(this.msg("deletecat.dialogquestion"));
                    confirmDelDialog.cfg.setProperty("icon", YAHOO.widget.SimpleDialog.ICON_WARN);

                    confirmDelDialog.cfg.queueProperty("buttons", myButtons);
                    confirmDelDialog.render(document.body);
                    confirmDelDialog.show();



                },
                onEditCat: function ExtLinks_onEditCat() {

                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/categories/" + this.options.siteId + "/edit");

                    var onConfigEditCat_SuccessCallback = function(response)
                    {
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("editcat.success")});
                            this.loadCategoriesMenu();
                            //TODO notify all dashlets on the page categories menu update request
                            this.loadLinksAndDisplay();
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("editcat.error") + " : " + response.json.errormessage});
                        }
                    };

                    var configDialog = new Alfresco.module.SimpleDialog(this.id + "-editCatDialog").setOptions({
                        width: "30em",
                        templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/extlinks/category/" + this.options.categoryFilter,
                        actionUrl: actionUrl,
                        onSuccess:
                                {
                                    fn: onConfigEditCat_SuccessCallback,
                                    scope: this
                                }
                    });

                    configDialog.show();

                },
                /**
                 * @method onNewLink
                 */
                /*
                 * ========= Links Events =========== 
                 *
                 */
                onNewLink: function ExtLinks_onNewLink() {
                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/links/" + this.options.siteId + "/add");


                    var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT +
                            "components/dashlets/extlinks/addLink/{siteId}/{categoryName}", {
                        siteId: this.options.siteId,
                        categoryName: this.options.categoryFilter
                    });

                    var onNewLink_SuccessCallback = function(response) {
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("createlink.success")});
                            this.loadLinksAndDisplay();
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: this.msg("createlink.error") + " : " + response.json.errormessage});
                        }

                        configDialog.hide();
                    };

                    var configDialog = new Alfresco.module.SimpleDialog(this.id + "-addLinkDialog").setOptions({
                        width: "30em",
                        templateUrl: templateUrl,
                        actionUrl: actionUrl,
                        onSuccess:
                                {
                                    fn: onNewLink_SuccessCallback,
                                    scope: this
                                }
                    });

                    configDialog.show();

                },
                /**
                 * 
                 * @param {type} event
                 * @param {type} params
                 */
                onDelLink: function ExtLinks_onDelLink(event, params) {

                    var dashletObject = params[2];

                    var linkToDel = params[0].substring(0, params[0].length - params[1].length);

                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/links/" + dashletObject.options.siteId + "/del");

                    confirmDelDialog = new YAHOO.widget.SimpleDialog(this.id + "delLinkDialog", {
                        width: "20em",
                        effect: {
                            effect: YAHOO.widget.ContainerEffect.FADE,
                            duration: 0.25
                        },
                        fixedcenter: true,
                        modal: true,
                        visible: false,
                        draggable: false
                    });

                    newWaitingPanel = new YAHOO.widget.Panel("wait",
                            {width: "240px",
                                fixedcenter: true,
                                close: false,
                                draggable: false,
                                zindex: 4,
                                modal: true,
                                visible: false
                            }
                    );
                    newWaitingPanel.setHeader(dashletObject.msg('deletelink.deleting'));
                    newWaitingPanel.setBody('<img src="http://l.yimg.com/a/i/us/per/gr/gp/rel_interstitial_loading.gif" />');
                    newWaitingPanel.render(document.body);


                    var onDelLink_SuccessCallback = function(response) {
                        newWaitingPanel.hide();
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("deletelink.success")});
                            dashletObject.loadLinksAndDisplay();
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("deletelink.error") + " : " + response.json.errormessage});
                        }

                    };


                    var onDelLink_FailedCallback = function() {
                        newWaitingPanel.hide();
                        Alfresco.util.PopupManager.displayMessage({text: his.msg("deletelink.error")});
                    };



                    var handleYes = function() {
                        newWaitingPanel.show();
                        confirmDelDialog.hide();
                        //Effectuer la suppression via un appel AJAX
                        Alfresco.util.Ajax.request(
                                {
                                    url: actionUrl,
                                    method: Alfresco.util.Ajax.POST,
                                    requestContentType: Alfresco.util.Ajax.JSON,
                                    responseContentType: Alfresco.util.Ajax.JSON,
                                    dataObj:
                                            {
                                                linkFile: linkToDel
                                            },
                                    successCallback:
                                            {
                                                fn: onDelLink_SuccessCallback,
                                                scope: this
                                            },
                                    failureCallback:
                                            {
                                                fn: onDelLink_FailedCallback,
                                                scope: this
                                            },
                                    scope: this,
                                    noReloadOnAuthFailure: true
                                });
                    };
                    var handleNo = function() {
                        this.hide();
                        confirmDelDialog.hide();
                    };
                    var myButtons = [
                        {text: dashletObject.msg("yes"), handler: handleYes},
                        {text: dashletObject.msg("cancel"), handler: handleNo, isDefault: true}
                    ];

                    confirmDelDialog.setHeader(dashletObject.msg("deletelink.dialogheader"));
                    confirmDelDialog.setBody(dashletObject.msg("deletelink.dialogquestion"));
                    confirmDelDialog.cfg.setProperty("icon", YAHOO.widget.SimpleDialog.ICON_WARN);

                    confirmDelDialog.cfg.queueProperty("buttons", myButtons);
                    confirmDelDialog.render(document.body);
                    confirmDelDialog.show();

                },
                /**
                 * 
                 * @param {type} event
                 * @param {type} params : 
                 */
                onEditLink: function ExtLinks_onEditLink(event, params) {


                    var dashletObject = params[2];

                    var linkToEdit = params[0].substring(0, params[0].length - params[1].length);
                    YAHOO.log('edition de lien ' + linkToEdit);

                    var actionUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                            "fr/itldev/extlinks/links/" + dashletObject.options.siteId) + "/edit";
                    var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT +
                            "components/dashlets/extlinks/editLink/{siteId}/{linkFileName}/{category}", {
                        siteId: dashletObject.options.siteId,
                        linkFileName: linkToEdit,
                        category:dashletObject.options.categoryFilter
                    });


                    var onEditLink_successCallback = function(response) {
                        if (response.json.status === 'OK') {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("editlink.success")});
                            dashletObject.loadLinksAndDisplay();
                        } else {
                            Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("editlink.error") + " : " + response.json.errormessage});
                        }
                        editLinkDialog.hide();
                    };


                    var editLinkDialog = new Alfresco.module.SimpleDialog(this.id + "-editLinkDialog").setOptions({
                        width: "30em",
                        templateUrl: templateUrl,
                        actionUrl: actionUrl,
                        onSuccess:
                                {
                                    fn: onEditLink_successCallback,
                                    scope: this
                                }
                    });
                    editLinkDialog.show();

                },
                /** 
                 *  Displays Sort Links Dialog box
                 * @return {undefined}
                 */
                onSortLinks: function ExtLinks_onSortLinks() {

                    var sortLinksDialog = new YAHOO.widget.SimpleDialog(this.id + "sortLinksDialog", {
                        width: "30em",
                        effect: {
                            effect: YAHOO.widget.ContainerEffect.FADE,
                            duration: 0.25
                        },
                        fixedcenter: true,
                        modal: true,
                        visible: false,
                        draggable: false,
                        parent: this
                    });

                    var handleNo = function() {
                        this.hide();
                    };


                    var dashletObject = this;


                    //Save new links Order
                    var saveSort = function() {
                        var parseList = function(ul) {
                            var items = ul.getElementsByTagName("li");
                            var out = "";
                            var sep = "";
                            for (i = 0; i < items.length; i = i + 1) {
                                out += sep + items[i].id;
                                sep = ",";
                            }
                            return out;
                        };

                        var onSortLinks_SuccessCallback = function(response) {
                            if (response.json.status === 'OK') {
                                Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("sortlink.succes")});
                                dashletObject.loadLinksAndDisplay();
                            } else {
                                Alfresco.util.PopupManager.displayMessage({text: dashletObject.msg("sortlink.error") + " : " + response.json.errormessage});
                            }

                        };

                        var ulsort = Dom.get("ulsort");
                        var sortLinksUrl = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI +
                                "/fr/itldev/extlinks/links/" + dashletObject.options.siteId + "/sort");

                        //send AJAX request to sort links
                        Alfresco.util.Ajax.request(
                                {
                                    url: sortLinksUrl,
                                    method: Alfresco.util.Ajax.POST,
                                    requestContentType: Alfresco.util.Ajax.JSON,
                                    responseContentType: Alfresco.util.Ajax.JSON,
                                    dataObj:
                                            {
                                                sortedList: parseList(ulsort)
                                            },
                                    successCallback:
                                            {
                                                fn: onSortLinks_SuccessCallback,
                                                scope: this
                                            },
                                    scope: this
                                });
                        this.hide();

                    };


                    sortLinksDialog.setHeader(this.msg("sortlink.headerlabel") + " (" + this.options.categoryFilter + ")");

                    var myButtons = [
                        {text: this.msg("label.save"), handler: saveSort},
                        {text: this.msg("label.cancel"), handler: handleNo, isDefault: true}
                    ];
                    sortLinksDialog.cfg.queueProperty("buttons", myButtons);

                    Alfresco.util.Ajax.request(
                            {
                                url: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/extlinks/sortlist",
                                dataObj:
                                        {
                                            site: this.options.siteId,
                                            category: this.options.categoryFilter,
                                            htmlId: this.options.htmlId
                                        },
                                successCallback:
                                        {
                                            fn: function ExtLinks_onLinksListLoaded(p_response, p_obj)
                                            {
                                                sortLinksDialog.setBody(p_response.serverResponse.responseText);
                                                //configure drag n drop elements
                                                new YAHOO.util.DDTarget("ulsort");

                                                var dragElements = YAHOO.util.Dom.getElementsByClassName('extlinks-sort-item');
                                                for (var i = 0; i < dragElements.length; ++i) {
                                                    new DDList(dragElements[i]);
                                                }
                                            },
                                            scope: this
                                        },
                                failureCallback:
                                        {
                                            fn: function ExtLinks_onLinksListLoadFailed()
                                            {
                                                this.catLinksList.innerHTML = '<div class="detail-list-item first-item last-item">' + dashletObject.msg('label.nolink') + '</div>';
                                            },
                                            scope: this
                                        },
                                scope: this,
                                noReloadOnAuthFailure: true
                            });

                    sortLinksDialog.render(document.body);
                    sortLinksDialog.show();
                },
                /**
                 * Modify links style in Dom to apply columns settings
                 * @return {undefined}
                 */
                applyNewStyle: function ExtLinks_applyNewStyle() {

                    var nodes = YAHOO.util.Selector.query('.ext-links .scrollableList  .link-' + this.options.htmlId);

                    if (this.options.columnsFilter === "onecol") {
                        YAHOO.util.Dom.setStyle(nodes, 'width', '100%');
                    }
                    if (this.options.columnsFilter === "twocol") {
                        YAHOO.util.Dom.setStyle(nodes, 'width', '50%');
                    }
                    if (this.options.columnsFilter === "threecol") {
                        YAHOO.util.Dom.setStyle(nodes, 'width', '33%');
                    }
                    if (this.options.columnsFilter === "fourcol") {
                        YAHOO.util.Dom.setStyle(nodes, 'width', '25%');
                    }
                },
                /**
                 * Loads links in the selected category
                 * 
                 * @method loadLinksAndDisplay
                 */
                loadLinksAndDisplay: function ExtLinks_loadLinksAndDisplay() {


                    var onCategoryLinksLoad_Success = function(p_response, p_obj)
                    {
                        var html = p_response.serverResponse.responseText;
                        if (YAHOO.lang.trim(html).length === 0)
                        {
                            this.activityList.innerHTML = Dom.get(this.id + "-empty").innerHTML;
                        }
                        else
                        {
                            this.catLinksList.innerHTML = html;
                        }

                        //new Link link's Event listener
                        var addLink = Dom.get(this.id + "-newLink-link");
                        if (addLink)
                        {
                            Event.addListener(addLink, "click", this.onNewLink, this, true);
                        }

                        //del category event Listener
                        var delCat = Dom.get(this.id + "-delCat-link");
                        if (delCat)
                        {
                            Event.addListener(delCat, "click", this.onDelCat, this, true);
                        }

                        //edit category EventListener
                        var editCat = Dom.get(this.id + "-editCat-link");
                        if (editCat)
                        {
                            Event.addListener(editCat, "click", this.onEditCat, this, true);
                        }

                        //Del Link link's Event listener
                        var delLinks = Dom.getElementsByClassName(this.id + "-extlinks-del");
                        for (var i = 0; i < delLinks.length; i++)
                        {
                            Event.addListener(delLinks[i], "click", this.onDelLink, [delLinks[i].id, "-del-link", this]);
                        }

                        //Editt link link's Event listener
                        var editLinks = Dom.getElementsByClassName(this.id + "-extlinks-edit");
                        for (var i = 0; i < editLinks.length; i++)
                        {
                            Event.addListener(editLinks[i], "click", this.onEditLink, [editLinks[i].id, "-edit-link", this]);
                        }

                        this.applyNewStyle();
                    };

                    var onCategoryLinksLoad_Failed = function()
                    {
                        this.catLinksList.innerHTML = '<div class="detail-list-item first-item last-item">' + this.msg('label.nolink') + '</div>';
                    };

                    Alfresco.util.Ajax.request(
                            {
                                url: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/extlinks/list",
                                dataObj:
                                        {
                                            site: this.options.siteId,
                                            category: this.options.categoryFilter,
                                            htmlId: this.options.htmlId
                                        },
                                successCallback:
                                        {
                                            fn: onCategoryLinksLoad_Success,
                                            scope: this
                                        },
                                failureCallback:
                                        {
                                            fn: onCategoryLinksLoad_Failed,
                                            scope: this
                                        },
                                scope: this,
                                noReloadOnAuthFailure: true
                            });


                }
            });

    DDList = function(id, sGroup, config) {
        //inspired by http://developer.yahoo.com/yui/examples/dragdrop/dd-reorder.html

        DDList.superclass.constructor.call(this, id, sGroup, config);

        this.logger = this.logger || YAHOO;
        var el = this.getDragEl();
        Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent 

        this.goingUp = false;
        this.lastY = 0;
    };

    YAHOO.extend(DDList, YAHOO.util.DDProxy, {
        startDrag: function(x, y) {
            this.logger.log(this.id + " startDrag");

            // make the proxy look like the source element 
            var dragEl = this.getDragEl();
            var clickEl = this.getEl();
            Dom.setStyle(clickEl, "visibility", "hidden");

            dragEl.innerHTML = clickEl.innerHTML;

            Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
            Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
            Dom.setStyle(dragEl, "border", "2px solid gray");
        },
        endDrag: function(e) {

            var srcEl = this.getEl();
            var proxy = this.getDragEl();

            // Show the proxy element and animate it to the src element's location 
            Dom.setStyle(proxy, "visibility", "");
            var a = new YAHOO.util.Motion(
                    proxy, {
                points: {
                    to: Dom.getXY(srcEl)
                }
            },
            0.2,
                    YAHOO.util.Easing.easeOut
                    );
            var proxyid = proxy.id;
            var thisid = this.id;

            // Hide the proxy and show the source element when finished with the animation 
            a.onComplete.subscribe(function() {
                Dom.setStyle(proxyid, "visibility", "hidden");
                Dom.setStyle(thisid, "visibility", "");
            });
            a.animate();
        },
        onDragDrop: function(e, id) {

            // If there is one drop interaction, the li was dropped either on the list, 
            // or it was dropped on the current location of the source element. 
            if (DDM.interactionInfo.drop.length === 1) {

                // The position of the cursor at the time of the drop (YAHOO.util.Point) 
                var pt = DDM.interactionInfo.point;

                // The region occupied by the source element at the time of the drop 
                var region = DDM.interactionInfo.sourceRegion;

                // Check to see if we are over the source element's location.  We will 
                // append to the bottom of the list once we are sure it was a drop in 
                // the negative space (the area of the list without any list items) 
                if (!region.intersect(pt)) {
                    var destEl = Dom.get(id);
                    var destDD = DDM.getDDById(id);
                    destEl.appendChild(this.getEl());
                    destDD.isEmpty = false;
                    DDM.refreshCache();
                }

            }
        },
        onDrag: function(e) {

            // Keep track of the direction of the drag for use during onDragOver 
            var y = Event.getPageY(e);

            if (y < this.lastY) {
                this.goingUp = true;
            } else if (y > this.lastY) {
                this.goingUp = false;
            }

            this.lastY = y;
        },
        onDragOver: function(e, id) {

            var srcEl = this.getEl();
            var destEl = Dom.get(id);

            // We are only concerned with list items, we ignore the dragover 
            // notifications for the list. 
            if (destEl.nodeName.toLowerCase() === "li") {
                var orig_p = srcEl.parentNode;
                var p = destEl.parentNode;

                if (this.goingUp) {
                    p.insertBefore(srcEl, destEl); // insert above 
                } else {
                    p.insertBefore(srcEl, destEl.nextSibling); // insert below 
                }

                DDM.refreshCache();
            }
        }
    });


})();

