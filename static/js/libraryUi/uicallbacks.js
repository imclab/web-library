//callbacks for UI interactions
/**
 * Toggle library edit mode when edit button clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.toggleEdit =  function(e){
    Z.debug("edit checkbox toggled", 3);
    if(J(this).prop('checked')){
        Z.debug("has val: " + J(this).val());
        Zotero.nav.urlvars.pathVars['mode'] = 'edit';
    }
    else{
        Z.debug("removing edit mode", 3);
        delete Zotero.nav.urlvars.pathVars['mode'];
    }
    Zotero.nav.pushState();
    return false;
};

/**
 * Launch create collection dialog when create-collection-link clicked
 * Default to current collection as parent of new collection, but allow change
 * @param  {event} e click even
 * @return {boolean}
 */
Zotero.ui.callbacks.createCollection = function(e){
    Z.debug("create-collection-link clicked", 3);
    Z.debug(J(this));
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest(".ajaxload"));
    var ncollections = library.collections.nestedOrderingArray();
    var dialogEl = J("#create-collection-dialog").empty();
    if(Zotero.config.mobile){
        J("#newcollectionformTemplate").tmpl({ncollections:ncollections}).replaceAll(dialogEl);
    }
    else{
        J("#newcollectionformTemplate").tmpl({ncollections:ncollections}).appendTo(dialogEl);
    }
    
    var currentCollectionKey = Zotero.nav.getUrlVar('collectionKey');
    J("#new-collection-parent").val(currentCollectionKey);
    
    var createFunction = J.proxy(function(){
        var newCollection = new Zotero.Collection();
        newCollection.parentCollectionKey = J("#new-collection-parent").val();
        newCollection.name = J("input#new-collection-title-input").val() || "Untitled";
        
        var library = Zotero.ui.getAssociatedLibrary(J(this).closest('div.ajaxload'));
        
        //var d = library.addCollection(newCollectionTitle, parentCollectionKey);
        var d = library.addCollection(newCollection);
        d.done(J.proxy(function(){
            //Zotero.nav.forceReload = true;//delete Zotero.nav.urlvars.pathVars['mode'];
            library.collections.dirty = true;
            Zotero.nav.pushState(true);
        }, this));
        Zotero.ui.closeDialog(J("#create-collection-dialog"));
    },this);
    
    Zotero.ui.dialog(J('#create-collection-dialog'), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Create': createFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#create-collection-dialog"));
            }
        }
    });
    
    var width = J("#new-collection-parent").width() + 50;
    J("#create-collection-dialog").dialog('option', 'width', width);
    return false;
};

/**
 * Launch edit collection dialog when update-collection-link clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.updateCollection =  function(e){
    Z.debug("update-collection-link clicked", 3);
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest(".ajaxload"));
    var ncollections = library.collections.nestedOrderingArray();
    var dialogEl = J("#modify-collection-dialog").empty();
    
    if(Zotero.config.mobile){
        J("#updatecollectionformTemplate").tmpl({ncollections:ncollections}).replaceAll(dialogEl);
    }
    else{
        J("#updatecollectionformTemplate").tmpl({ncollections:ncollections}).appendTo(dialogEl);
    }
    
    var currentCollectionKey = Zotero.nav.getUrlVar('collectionKey');
    var currentCollection = library.collections.getCollection(currentCollectionKey);
    var currentParentCollectionKey = currentCollection.parentCollectionKey;
    J("#update-collection-parent-select").val(currentParentCollectionKey);
    J("#updated-collection-title-input").val(currentCollection.get("title"));
    
    var saveFunction = J.proxy(function(){
        var newCollectionTitle = J("input#updated-collection-title-input").val() || "Untitled";
        var newParentCollectionKey = J("#update-collection-parent-select").val();
        
        var collection =  currentCollection;
        if(!collection){
            Zotero.ui.jsNotificationMessage("Selected collection not found", 'error');
            return false;
        }
        var d = collection.update(newCollectionTitle, newParentCollectionKey);
        d.done(J.proxy(function(){
            Zotero.ui.jsNotificationMessage("Collection Saved", 'confirm');
            library.collections.dirty = true;
            Zotero.nav.pushState(true);
            Zotero.ui.closeDialog(J("#modify-collection-dialog"));
        }, this));
        Zotero.ui.closeDialog(J("#modify-collection-dialog"));
    }, this);
    
    Zotero.ui.dialog(J("#modify-collection-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Save': saveFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#modify-collection-dialog"));
            }
        }
    });
    
    var width = J("#update-collection-parent-select").width() + 50;
    J("#modify-collection-dialog").dialog('option', 'width', width);
    J("#updated-collection-title-input").select();
    return false;
};

/**
 * launch delete collection dialog when delete-collection-link clicked
 * default to currently selected collection, but allow switch before delete
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.deleteCollection =  function(e){
    Z.debug("delete-collection-link clicked", 3);
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest(".ajaxload"));
    var currentCollectionKey = Zotero.nav.getUrlVar('collectionKey');
    var currentCollection = library.collections.getCollection(currentCollectionKey);
    var dialogEl = J("#delete-collection-dialog").empty();
    
    J("#delete-collection-dialog").empty().append("");
    if(Zotero.config.mobile){
        J("#deletecollectionformTemplate").tmpl({collection:currentCollection}).replaceAll(dialogEl);
    }
    else{
        J("#deletecollectionformTemplate").tmpl({collection:currentCollection}).appendTo(dialogEl);
    }
    
    J("#delete-collection-select").val(currentCollectionKey);
    
    var deleteFunction = J.proxy(function(){
        Z.debug("Zotero.ui.deleteSelectedCollection", 3);
        var collection = currentCollection;
        if(!collection){
            Zotero.ui.jsNotificationMessage("Selected collection not found", 'error');
            return false;
        }
        var d = collection.remove();
        //var d = library.addCollection(newCollectionTitle, selectedCollectionKey);
        d.done(J.proxy(function(){
            //delete Zotero.nav.urlvars.pathVars['mode'];
            delete Zotero.nav.urlvars.pathVars['collectionKey'];
            library.collections.dirty = true;
            Zotero.nav.pushState();
            Zotero.ui.jsNotificationMessage(collection.title + " removed", 'confirm');
        }, this));
        
        Zotero.ui.closeDialog(J("#delete-collection-dialog"));
        return false;
    }, this);
    
    Zotero.ui.dialog(J("#delete-collection-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Delete': deleteFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#delete-collection-dialog"));
            }
        }
    });
    
    return false;
};

/**
 * clear path vars and send to new item page with current collection when create-item-link clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.createItem = function(e){
    Z.debug("create-item-Link clicked", 3);
    var collectionKey = Zotero.nav.getUrlVar('collectionKey');
    if(collectionKey){
        Zotero.nav.urlvars.pathVars = {action:'newItem', mode:'edit', 'collectionKey':collectionKey};
    }
    else{
        Zotero.nav.urlvars.pathVars = {action:'newItem', mode:'edit'};
    }
    Zotero.nav.pushState();
    return false;
};

Zotero.ui.callbacks.citeItems = function(e){
    Z.debug("cite-item-link clicked", 3);
    e.preventDefault();
    
    //get library and build dialog
    var library = Zotero.ui.getAssociatedLibrary();
    var dialogEl = J("#cite-item-dialog").empty();
    if(Zotero.config.mobile){
        J("#citeitemformTemplate").tmpl({}).replaceAll(dialogEl);
    }
    else{
        J("#citeitemformTemplate").tmpl({}).appendTo(dialogEl);
    }
    
    
    var citeFunction = function(){
        Z.debug("citeFunction", 3);
        Zotero.ui.showSpinner(J("#cite-box-div"));
        
        var style = J("#cite-item-select").val();
        Z.debug(style, 4);
        var itemKeys = Zotero.ui.getSelectedItemKeys(J("#edit-mode-items-form"));
        if(itemKeys.length === 0){
            itemKeys = Zotero.ui.getAllFormItemKeys(J("#edit-mode-items-form"));
        }
        Z.debug(itemKeys, 4);
        var d = library.loadFullBib(itemKeys, style);
        d.done(function(bibContent){
            J("#cite-box-div").html(bibContent);
        });
    };
    
    Z.debug('cite item select width ' + J("#cite-item-select").width() );
    var dropdownWidth = J("#cite-item-select").width();
    dropdownWidth = dropdownWidth > 200 ? dropdownWidth : 200;
    
    var width = dropdownWidth + 150;
    if(!Zotero.config.mobile){
        width = dropdownWidth + 300;
    }
    
    Z.debug("showing cite-item dialog");
    Z.debug("width: " + width);
    Zotero.ui.dialog(J("#cite-item-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        open: function(){
            var dropdownWidth = J("#cite-item-select").width();
            var width = dropdownWidth + 150;
            if(!Zotero.config.mobile){
                width = dropdownWidth + 300;
            }
            J("#cite-item-dialog").dialog('option', 'width', width);
        },
        width: width
    });
    
    J("#cite-item-select").on('change', citeFunction);
    
    Z.debug("done with Zotero.ui.callbacks.citeItems", 3);
    return false;
};

Zotero.ui.callbacks.showExportDialog = function(e){
    Z.debug("export-link clicked", 3);
    
    //get library and build dialog
    var library = Zotero.ui.getAssociatedLibrary(J("#feed-link-div"));
    var dialogEl = J("#export-dialog").empty();
    if(Zotero.config.mobile){
        //J("#exportTemplate").tmpl({}).replaceAll(dialogEl);
        J("#export-dialog").empty().append(J("#export-list").contents().clone() );
    }
    else{
        //J("#exportTemplate").tmpl({}).appendTo(dialogEl);
        J("#export-dialog").empty().append(J("#export-list").contents().clone() );
    }
    
    var exportFunction = function(){
        Z.debug("exportFunction", 3);
    };
    
    Zotero.ui.dialog(J("#export-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#export-dialog"));
            }
        }
    });
    
    Z.debug("done with Zotero.ui.callbacks.exportItems");
    return false;
};

Zotero.ui.callbacks.exportItems = function(e){
    Z.debug("cite-item-link clicked", 3);
    e.preventDefault();
    
    //get library
    var library = Zotero.ui.getAssociatedLibrary(J("#feed-link-div"));
    var urlconfig = J("#feed-link-div").data('urlconfig');
    var itemKeys = Zotero.ui.getSelectedItemKeys(J("#edit-mode-items-form"));
    var requestedFormat = J(this).data('exportformat');
    //override start and limit since we're just looking for itemKeys directly
    var exportConfig = J.extend(urlconfig, {'format':requestedFormat, start:'0', limit:null});
    
    //build link to export file with selected items
    var itemKeyString = itemKeys.join(',');
    if(itemKeyString !== ''){
        exportConfig['itemKey'] = itemKeyString;
    }
    
    var exportUrl = Zotero.ajax.apiRequestUrl(exportConfig) + Zotero.ajax.apiQueryString(exportConfig);
    window.open(exportUrl, '_blank');
};

Zotero.ui.callbacks.uploadAttachment = function(e){
    Z.debug("uploadAttachment", 3);
    e.preventDefault();
    
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest(".ajaxload"));
    var dialogEl = J("#upload-attachment-dialog").empty();
    if(Zotero.config.mobile){
        J("#attachmentuploadTemplate").tmpl({}).replaceAll(dialogEl);
    }
    else{
        J("#attachmentuploadTemplate").tmpl({}).appendTo(dialogEl);
    }
    
    
    var uploadFunction = J.proxy(function(){
        Z.debug("uploadFunction", 3);
        //callback for when everything in the upload form is filled
        //grab file blob
        //grab file data given by user
        //create or modify attachment item
        //Item.uploadExistingFile or uploadChildAttachment
        
        var fileInfo = J("#attachmentuploadfileinfo").data('fileInfo');
        var file = J("#attachmentuploadfileinfo").data('file');
        var specifiedTitle = J("#upload-file-title-input").val();
        
        var progressCallback = function(e){
            Z.debug('fullUpload.upload.onprogress');
            var percentLoaded = Math.round((e.loaded / e.total) * 100);
            Z.debug("Upload progress event:" + e.loaded + " / " + e.total + " : " + percentLoaded + "%");
            J("#uploadprogressmeter").val(percentLoaded);
        };
        
        var uploadSuccess = function(){
            Zotero.ui.closeDialog(J("#upload-attachment-dialog"));
            Zotero.nav.pushState(true);
        };
        
        var uploadFailure = function(failure){
            Z.debug("Upload failed", 3);
            Z.debug(JSON.stringify(failure));
            Zotero.ui.jsNotificationMessage("There was a problem uploading your file.", 'error');
            switch(failure.code){
                case 400:
                    break;
                case 403:
                    Zotero.ui.jsNotificationMessage("You do not have permission to edit files", 'error');
                    break;
                case 409:
                    Zotero.ui.jsNotificationMessage("The library is currently locked. Please try again in a few minutes.", 'error');
                    break;
                case 412:
                    Zotero.ui.jsNotificationMessage("File conflict. Remote file has changed", 'error');
                    break;
                case 413:
                    Zotero.ui.jsNotificationMessage("Requested upload would exceed storage quota.", 'error');
                    break;
                case 428:
                    Zotero.ui.jsNotificationMessage("Precondition required error", 'error');
                    break;
                case 429:
                    Zotero.ui.jsNotificationMessage("Too many uploads pending. Please try again in a few minutes", 'error');
                    break;
            }
            Zotero.ui.closeDialog(J("#upload-attachment-dialog"));
        };
        
        //show spinner while working on upload
        Zotero.ui.showSpinner(J('#fileuploadspinner'));
        
        //upload new copy of file if we're modifying an attachment
        //create child and upload file if we're modifying a top level item
        var itemKey = Zotero.nav.getUrlVar('itemKey');
        var item = library.items.getItem(itemKey);
        
        if(!item.get("parentItem")){
            //get template item
            var childItem = new Zotero.Item();
            childItem.associateWithLibrary(library);
            var templateItemDeferred = childItem.initEmpty('attachment', 'imported_file');
            
            templateItemDeferred.done(J.proxy(function(childItem){
                Z.debug("templateItemDeferred callback");
                childItem.set('title', specifiedTitle);
                
                var uploadChildD = item.uploadChildAttachment(childItem, fileInfo, file, progressCallback);
                
                uploadChildD.done(uploadSuccess).fail(uploadFailure);
            }, this) );
        }
        else if(item.get('itemType') == 'attachment' && item.get("linkMode") == 'imported_file') {
            var uploadD = item.uploadFile(fileInfo, file, progressCallback);
            uploadD.done(uploadSuccess).fail(uploadFailure);
        }
        
    }, this);

    Zotero.ui.dialog(J("#upload-attachment-dialog"), {
        modal:true,
        minWidth: 300,
        width:350,
        draggable: false,
        buttons: {
            'Upload': uploadFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#upload-attachment-dialog"));
            }
        }
    });
    
    var width = J("#fileuploadinput").width() + 50;
    J("#upload-attachment-dialog").dialog('option', 'width', width);
    
    var handleFiles = function(files){
        Z.debug("attachmentUpload handleFiles", 3);
        
        if(typeof files == 'undefined' || files.length === 0){
            return false;
        }
        var file = files[0];
        J("#attachmentuploadfileinfo").data('file', file);
        
        var fileinfo = Zotero.file.getFileInfo(file, function(fileInfo){
            J("#attachmentuploadfileinfo").data('fileInfo', fileInfo);
            J("#upload-file-title-input").val(fileInfo.filename);
            J("#attachmentuploadfileinfo .uploadfilesize").html(fileInfo.filesize);
            J("#attachmentuploadfileinfo .uploadfiletype").html(fileInfo.contentType);
            //J("#attachmentuploadfileinfo .uploadfilemd5").html(fileInfo.md5);
            J("#droppedfilename").html(fileInfo.filename);
        });
        return;
    };
    
    J("#fileuploaddroptarget").on('dragenter dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    
    J("#fileuploaddroptarget").on('drop', function(je){
        Z.debug("fileuploaddroptarget drop callback", 3);
        je.stopPropagation();
        je.preventDefault();
        //clear file input so drag/drop and input don't show conflicting information
        J("#fileuploadinput").val('');
        var e = je.originalEvent;
        var dt = e.dataTransfer;
        var files = dt.files;
        handleFiles(files);
    });
    
    J("#fileuploadinput").on('change', function(je){
        Z.debug("fileuploaddroptarget callback 1");
        je.stopPropagation();
        je.preventDefault();
        var files = J("#fileuploadinput").get(0).files;
        handleFiles(files);
    });
    
    return false;
};

/**
 * Move currently displayed single item or currently checked list of items
 * to the trash when move-to-trash link clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.moveToTrash =  function(e){
    e.preventDefault();
    Z.debug('move-to-trash clicked', 3);
    
    var itemKeys = Zotero.ui.getSelectedItemKeys(J("#edit-mode-items-form"));
    Z.debug(itemKeys, 3);
    
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest('div.ajaxload'));
    var response;
    
    var trashingItems = library.items.getItems(itemKeys);
    var deletingItems = []; //potentially deleting instead of trashing
    
    //show spinner before making the possibly many the ajax requests
    Zotero.ui.showSpinner(J('#library-items-div'));
    
    if(Zotero.nav.getUrlVar('collectionKey') == 'trash'){
        //items already in trash. delete them
        var i;
        for(i = 0; i < trashingItems.length; i++ ){
            var item = trashingItems[i];
            if(item.get('deleted')){
                //item is already in trash, schedule for actual deletion
                deletingItems.push(item);
            }
        }
        
        //make request to permanently delete items
        response = library.items.deleteItems(deletingItems);
    }
    else{
        //items are not in trash already so just add them to it
        response = library.items.trashItems(trashingItems);
    }
    
    library.dirty = true;
    response.always(function(){
        Zotero.nav.clearUrlVars(['collectionKey', 'tag', 'q']);
        Zotero.nav.pushState(true);
    });
    
    return false; //stop event bubbling
};

/**
 * Remove currently displayed single item or checked list of items from trash
 * when remove-from-trash link clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.removeFromTrash =  function(e){
    Z.debug('remove-from-trash clicked', 3);
    var itemKeys = Zotero.ui.getSelectedItemKeys(J("#edit-mode-items-form"));
    Z.debug(itemKeys, 4);
    
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest('div.ajaxload'));
    
    var untrashingItems = library.items.getItems(itemKeys);
    
    //show spinner before making the possibly many the ajax requests
    Zotero.ui.showSpinner(J('#library-items-div'));
    
    var response = library.items.untrashItems(untrashingItems);
    
    library.dirty = true;
    response.always(function(){
        Zotero.nav.clearUrlVars(['collectionKey', 'tag', 'q']);
        Zotero.nav.pushState(true);
    });
    
    return false;
};

/**
 * Remove currently displaying item or currently selected items from current collection
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.removeFromCollection = function(e){
    Z.debug('remove-from-collection clicked', 3);
    var itemKeys = Zotero.ui.getSelectedItemKeys(J("#edit-mode-items-form"));
    var library = Zotero.ui.getAssociatedLibrary(J(this).closest('div.ajaxload'));
    var collectionKey = Zotero.nav.getUrlVar('collectionKey');
    var collection = library.collections.getCollection(collectionKey);
    var responses = [];
    J.each(itemKeys, function(index, itemKey){
        var response = collection.removeItem(itemKey);
        responses.push(response);
    });
    library.dirty = true;
    J.when.apply(this, responses).then(function(){
        Z.debug('removal responses finished. forcing reload', 3);
        //Zotero.nav.forceReload = true;//delete Zotero.nav.urlvars.pathVars['mode'];
        Zotero.nav.clearUrlVars(['collectionKey', 'tag']);
        Zotero.nav.pushState(true);
    });
    return false;
};

/**
 * Add currently displaying item or currently selected items to a chosen collection
 * @param {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.addToCollection =  function(e){
    Z.debug("add-to-collection-link clicked", 3);
    e.preventDefault();
    var library = Zotero.ui.getAssociatedLibrary();
    var dialogEl = J("#add-to-collection-dialog").empty();
    Z.debug(library.collections.ncollections, 4);
    J("#addtocollectionformTemplate").tmpl({ncollections:library.collections.nestedOrderingArray()}).appendTo(dialogEl);
    
    var addToFunction = J.proxy(function(){
        Z.debug("add-to-collection-select changed", 3);
        var targetCollection = J("#target-collection").val();
        Z.debug("move to: " + targetCollection, 4);
        Zotero.ui.addToCollection(targetCollection, library);
        Zotero.ui.closeDialog(J("#add-to-collection-dialog"));
        return false;
    }, this);
    
    Zotero.ui.dialog(J("#add-to-collection-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Add': addToFunction,
            'Cancel': function(){
                J("#add-to-collection-dialog").dialog("close");
            }
        }
    });
    
    var width = J("#target-collection").width() + 50;
    J("#add-to-collection-dialog").dialog('option', 'width', width);
    
    return false;
};

/**
 * Launch library settings dialog (currently just row selection)
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.librarySettings = function(e){
    Z.debug("library-settings-link clicked", 3);
    e.preventDefault();
    //if(Z.config.librarySettingsInit == false){
    var dialogEl = J("#library-settings-dialog").empty();
    J("#librarysettingsTemplate").tmpl({'columnFields':Zotero.Library.prototype.displayableColumns}).appendTo(dialogEl);
    
    J("#display-column-field-title").prop('checked', true).prop('disabled', true);
    J.each(Zotero.prefs.library_listShowFields, function(index, value){
        var idstring = '#display-column-field-' + value;
        J(idstring).prop('checked', true);
    });
    
    var submitFunction = J.proxy(function(){
        var showFields = [];
        J("#library-settings-form").find('input:checked').each(function(){
            showFields.push(J(this).val());
        });
        
        Zotero.utils.setUserPref('library_listShowFields', showFields);
        Zotero.prefs.library_listShowFields = showFields;
        Zotero.callbacks.loadItems(J("#library-items-div"));
        
        Zotero.ui.closeDialog(J("#library-settings-dialog"));
    }, this);
    
    Zotero.ui.dialog(J("#library-settings-dialog"), {
        modal:true,
        draggable: false,
        buttons: {
            'Save': submitFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#library-settings-dialog"));
            }
        }
    });
};

/**
 * Change sort/order arguments when a table header is clicked
 * @param  {event} e click event
 * @return {boolean}
 */
Zotero.ui.callbacks.sortBy = function(e){
    Z.debug("sort by link clicked", 3);
    e.preventDefault();
    
    var currentOrderField = Zotero.nav.getUrlVar('order') || Zotero.config.userDefaultApiArgs.order;
    var currentOrderSort = Zotero.nav.getUrlVar('sort') || Zotero.config.sortOrdering[currentOrderField] || 'asc';
    
    var dialogEl = J("#sort-dialog");
    J("#sortdialogTemplate").tmpl({'columnFields':Zotero.Library.prototype.displayableColumns, currentOrderField:currentOrderField}).replaceAll(dialogEl);
    
    var submitFunction = J.proxy(function(){
        Z.debug("Zotero.ui.callbacks.sortBy submit callback");
        
        var currentOrderField = Zotero.nav.getUrlVar('order') || Zotero.config.userDefaultApiArgs.order;
        var currentOrderSort = Zotero.nav.getUrlVar('sort') || Zotero.config.userDefaultApiArgs.sort || Zotero.config.sortOrdering[currentOrderField] || 'asc';
        var newOrderField = J("#sortColumnSelect").val();
        var newOrderSort = J("#sortOrderSelect").val() || Zotero.config.sortOrdering[newOrderField];
        
        
        //only allow ordering by the fields we have
        if(J.inArray(newOrderField, Zotero.Library.prototype.sortableColumns) == (-1)){
            return false;
        }
        
        //change newSort away from the field default if that was already the current state
        if(currentOrderField == newOrderField && currentOrderSort == newOrderSort){
            if(newOrderSort == 'asc'){
                newOrderSort = 'desc';
            }
            else{
                newOrderSort = 'asc';
            }
        }
        
        //problem if there was no sort column mapped to the header that got clicked
        if(!newOrderField){
            Zotero.ui.jsNotificationMessage("no order field mapped to column");
            return false;
        }
        
        //update the url with the new values
        Zotero.nav.urlvars.pathVars['order'] = newOrderField;
        Zotero.nav.urlvars.pathVars['sort'] = newOrderSort;
        Zotero.nav.pushState();
        
        //set new order as preference and save it to use www prefs
        Zotero.config.userDefaultApiArgs.sort = newOrderSort;
        Zotero.config.userDefaultApiArgs.order = newOrderField;
        Zotero.utils.setUserPref('library_defaultSort', newOrderField + ',' + newOrderSort);
        
        Zotero.ui.closeDialog(J("#sort-dialog"));
        
    }, this);
    
    Zotero.ui.dialog(J("#sort-dialog"), {
        modal:true,
        minWidth: 300,
        draggable: false,
        buttons: {
            'Save': submitFunction,
            'Cancel': function(){
                Zotero.ui.closeDialog(J("#sort-dialog"));
            }
        }
    });
};

