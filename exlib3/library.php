<!DOCTYPE html>
<?include "config.php";?>
<?
$messages = array();
?>
<html lang="en" class="no-js"> 
    <head> 
        <meta charset="utf-8" />
        <meta name="keywords" content="Zotero, research, tool, firefox, extension"/>
        <meta name="description" content="Zotero is a powerful, easy-to-use research tool that 
                                          helps you gather, organize, and analyze sources and then 
                                          share the results of your research."/>
        
        <title>Zotero Library</title>
        <link rel="shortcut icon" type="image/png" sizes="16x16" href="<?=$staticPath?>/images/theme/zotero_theme/zotero_16.png" />
        <link rel="shortcut icon" type="image/png" sizes="48x48" href="<?=$staticPath?>/images/theme/zotero_theme/zotero_48.png" />
        <link rel="apple-touch-icon" type="image/png" href="<?=$staticPath?>/images/theme/zotero_theme/zotero_48.png" />
        <link rel="apple-touch-icon-precomposed" type="image/png" href="<?=$staticPath?>/images/theme/zotero_theme/zotero_48.png" />
        
        <!-- css -->
        <link rel="stylesheet" href="<?=$staticPath?>/css/theme_style3.css" 
            type="text/css" media="screen" charset="utf-8"/>
        <link rel="stylesheet" href="<?=$staticPath?>/css/library_style3.css" 
            type="text/css" media="screen" charset="utf-8"/>
        
        <link rel="stylesheet" href="<?=$staticPath?>/css/zotero_icons_sprite.css"
            type="text/css" media="screen" charset="utf-8"/>
        <link rel="stylesheet" href="<?=$staticPath?>/css/jquery-ui-1.8.12.custom.css"
            type="text/css" media="screen" charset="utf-8"/>
        <script src="<?=$staticPath?>/library/modernizr/modernizr-1.7.min.js"></script>
        
    </head>
    <!-- library class on body necessary for zotero www init -->
    <body class="body-flex-container library"> 
        <!-- Header -->
        <div id="control-panel-container" class="container header-flex-container topbar">
            <?$controlpanelLoadConfig = array('libraryID'=>$libraryID,
                                       'libraryType'=>$libraryType,
                                       'libraryUrlIdentifier'=>$librarySlug
                                       );
              ?>
            <div id="control-panel" class='ajaxload control-panel-flex-container'
              data-function='controlPanel'
              data-loadconfig='<?=json_encode($controlpanelLoadConfig)?>'>
                <div id="create-item-buttonset">
                    <a href="" id="create-item-link" class="permission-edit">Create Item</a>
                </div>
                <div id="controlpanel-edit-div">
                    <div id="move-item-links-buttonset">
                        <a href="#" class="add-to-collection-link permission-edit">Add to Collection</a>
                        <a href="#" class="remove-from-collection-link permission-edit">Remove from Collection</a>
                        <a href="#" class="move-to-trash-link permission-edit">Move to Trash</a>
                        <a href="#" class="remove-from-trash-link permission-edit">Remove from Trash</a>
                    </div>
                </div>
                <div id="control-panel-editbutton-div">
                    <input type='checkbox' id='edit-checkbox' /><label for="edit-checkbox">Edit</label>
                </div>
            </div>
            <div id="library-search-div">
                <form action="/search/" class="zform zsearch" id="library-search">
                    <div>
                        <input type="text" name="q" size="20" id="header-search-query"/>
                        <button class="button clear-field-button" type="reset"><span class="ui-icon ui-icon-circle-close">&nbsp;</span></button>
                        <input class="button" type="submit" value="Search">
                    </div>
                </form>
            </div>
            <div id="library-settings-div">
                <a href="#" id="library-settings-link">Library Settings</a>
                <a href="#" id="cite-link" class="cite-link">Cite</a>
                <a href="#" id="export-link" class="export-link">Export</a>
                <div id="library-settings-dialog" title="Library Settings">
                </div>
            </div>
        </div>
        <div id="library">
            <!-- Output content -->
            <div class="left-drawer left-drawer-flex-container left-drawer-show" id="left-drawer">
                <div class="left-drawer-flex-content left-drawer-flex-item">
                    <?$collectionListConfig = array('target'=>'collections',
                                                    'libraryID'=>$libraryID, 
                                                    'libraryType'=>$libraryType, 
                                                    'libraryUrlIdentifier'=>$librarySlug
                                                    );
                    ?>
                    <div id="collection-list-div" class="ajaxload" 
                        data-function='syncCollections'
                        data-loadconfig='<?=json_encode($collectionListConfig);?>'
                        >
                        <div id="collection-edit-div">
                        <span class="ui-button sprite-placeholder"></span>
                        <div id="edit-collections-buttons-div" class="left">
                            <a href="#" class="create-collection-link permission-edit">Create Collection</a>
                            <a href="#" class="update-collection-link permission-edit">Edit Collection</a>
                            <a href="#" class="delete-collection-link permission-edit">Delete Collection</a>
                        </div>
                        <div id="create-collection-dialog" title="Create Collection">
                        </div>
                        <div id="modify-collection-dialog" title="Edit Collection">
                        </div>
                        <div id="delete-collection-dialog" title="Delete Collection">
                        </div>
                        <div id="add-to-collection-dialog" title="Add to Collection">
                        </div>
                        <div id="cite-item-dialog" title="Cite Item">
                        </div>
                        <div id="export-dialog" title="Export">
                        </div>
                        
                        </div>
                        <div id="collection-list-container">
                        </div>
                    </div><!-- collection list div -->
                    
                    <!-- tags browser section -->
                    <h3 id="tags-list-label" class="clickable">Tags</h3>
                    <?$tagsListConfig = array('target'=>'tags',
                                                'libraryID'=>$libraryID, 
                                                'libraryType'=>$libraryType, 
                                                'libraryUrlIdentifier'=>$librarySlug
                                                );
                    ?>
                    <div id="tags-list-div" class="ajaxload" 
                        data-prefunction="showSpinnerSection"
                        data-function="syncTags"
                        data-loadconfig='<?=json_encode($tagsListConfig);?>'
                        >
                          <input type="text" id="tag-filter-input" placeholder="Filter Tags" />
                          <div id="tag-lists-container">
                            <ul id="selected-tags-list">
                            </ul>
                            <ul id="tags-list">
                            </ul>
                            <div class="loading"></div>
                          </div>
                          <div id="more-tags-links">
                            <a href='' id='show-more-tags-link'>More</a>
                            <a href='' id='show-less-tags-link'>Fewer</a>
                            <a href='' id='refresh-tags-link'>Refresh</a>
                          </div>
                    </div>
                    <!-- Library Links -->
                    <?$feedLoadConfig = array('libraryID'=>$libraryID,
                                              'libraryType'=>$libraryType,
                                              'libraryUrlIdentifier'=>$librarySlug,
                                              'libraryLabel'=>$displayName
                                               );?>
                    <div id="feed-link-div" class="ajaxload" 
                        data-function="loadFeedLink"
                        data-loadconfig='<?=json_encode($feedLoadConfig);?>'>
                        <a href="" type="application/atom+xml" rel="alternate" class="feed-link"><span class="sprite-icon sprite-feed"></span>Subscribe to this feed</a><br />
                    </div>
                    <div id="export-formats-div" style="display:none;">
                      <div id="export-formats-heading">
                        <h3 id="export-section-title"><a href="#">Export</a></h3>
                      </div>
                      <div id="export-list">
                      </div>
                    </div>
                </div><!-- /left-drawer-flex-content left-drawer-flex-item -->
                <div id="left-drawer-flex-grabber" class="left-drawer-flex-grabber left-drawer-flex-item">
                    
                </div>
            </div>
            
            
            <div id="library-panel" class="library-flex-container">
                <!-- hidden area for possible JS messages -->
                <div id="js-message">
                    <ul id="js-message-list">
                    </ul>
                </div>
                <div id="items-pane" class="ajaxload">
                <div class="item-pane-flex-container">
                <?
                $itemsLoadConfig = array('libraryID'=>$libraryID,
                                           'libraryType'=>$libraryType,
                                           'libraryUrlIdentifier'=>$librarySlug,
                                           'target'=>'items',
                                           'targetModifier'=>'top',
                                           'content'=>'json'
                                           );
                ?>
                    <div id="library-items-div" class="ajaxload item-pane-flex-item" 
                        data-function="loadItems"
                        data-loadconfig='<?=json_encode($itemsLoadConfig);?>'
                        >
                    </div> <!--library items div -->
                    <?$itemLoadConfig = array('libraryID'=>$libraryID,
                                              'libraryType'=>$libraryType,
                                              'libraryUrlIdentifier'=>$librarySlug
                                               );
                    ?>
                    <div id="item-details-div" class="ajaxload item-pane-flex-item"
                        data-function="loadItem"
                        data-loadconfig='<?=json_encode($itemLoadConfig)?>'
                        >
                    </div>
                </div> <!-- items flex -->
                </div> <!-- items pane -->
            </div>
            
            <?$locales = array('en');// array_keys(Zend_Locale::getOrder());?>
            <script type="text/javascript" charset="utf-8">
                var zoterojsClass = "user_library";
                var zoteroData = {itemsPathString: "<?=$itemsPathString?>",
                                  libraryUserID: "<?=$libraryID?>",
                                  libraryPublish: 1,
                              <?/*if(!empty($apiKey)):?>
                                  apiKey: "<?=$apiKey?>",
                              <?endif;*/?>
                                  locale: "<?=$locales[0]?>",
                                  allowEdit: <?=$allowEdit?>,
                                  javascriptEnabled: 1,
                                  library_showAllTags: 1
                                  };
                var zoterojsSearchContext = "library";
            </script>
            <?include '../jquerytemplates/tagrow.jqt';?>
            <?include '../jquerytemplates/tagslist.jqt';?>
            <?include '../jquerytemplates/collectionlist.jqt';?>
            <?include '../jquerytemplates/collectionrow.jqt';?>
            <?include '../jquerytemplates/itemrow.jqt';?>
            <?include '../jquerytemplates/itemstable.jqt';?>
            <?include '../jquerytemplates/itempagination.jqt';?>
            <?include '../jquerytemplates/itemdetails.jqt';?>
            <?include '../jquerytemplates/itemnotedetails.jqt';?>
            <?include '../jquerytemplates/itemform.jqt';?>
            <?include '../jquerytemplates/citeitemform.jqt';?>
            <?include '../jquerytemplates/attachmentform.jqt';?>
            <?include '../jquerytemplates/attachmentupload.jqt';?>
            <?include '../jquerytemplates/datafield.jqt';?>
            <?include '../jquerytemplates/editnoteform.jqt';?>
            <?include '../jquerytemplates/itemtag.jqt';?>
            <?include '../jquerytemplates/itemtypeselect.jqt';?>
            <?include '../jquerytemplates/authorelementssingle.jqt';?>
            <?include '../jquerytemplates/authorelementsdouble.jqt';?>
            <?include '../jquerytemplates/childitems.jqt';?>
            <?include '../jquerytemplates/editcollectionbuttons.jqt';?>
            <?include '../jquerytemplates/choosecollectionform.jqt';?>
            <?include '../jquerytemplates/breadcrumbs.jqt';?>
            <?include '../jquerytemplates/breadcrumbstitle.jqt';?>
            <?include '../jquerytemplates/newcollectionform.jqt';?>
            <?include '../jquerytemplates/updatecollectionform.jqt';?>
            <?include '../jquerytemplates/deletecollectionform.jqt';?>
            <?include '../jquerytemplates/tagunorderedlist.jqt';?>
            <?include '../jquerytemplates/librarysettings.jqt';?>
            <?include '../jquerytemplates/addtocollectionform.jqt';?>
            <?include '../jquerytemplates/exportformats.jqt';?>
            
            <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/library/jquery/jquery-all.js"></script>
            <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/library/globalize/globalize.js"></script>
            <?foreach($locales as $localeStr):?>
                <?if($localeStr != 'en'):?>
                <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/library/globalize/cultures/globalize.culture.<?=str_replace('_', '-', $localeStr)?>.js"></script>
                <?endif;?>
            <?endforeach;?>
            <script type="text/javascript" charset="utf-8">
                if(typeof zoteroData == 'undefined'){
                    var zoteroData = {};
                }
                var baseURL = "";
                var baseDomain = "";
                var staticPath = "<?=$staticPath?>";
            </script>
            
            <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/js/_zoterowwwAll.bugly.js"></script>
            <script type="text/javascript" charset="utf-8">
                J(".body-flex-container").css("height", J(window).height());
                J("#left-drawer").css("height", J(window).height() - 55);
                J(".item-pane-flex-container").css("height", J(".body-flex-container").height() - 50);
                
                J(window).resize(function(){
                    J(".body-flex-container").css("height", J(window).height());
                    J("#left-drawer").css("height", J(window).height() - 55);
                    J(".item-pane-flex-container").css("height", J(".body-flex-container").height() - 50);
                    //J(".item-pane-flex-container").css("height", J(window).height() - 70);
                });
                
                J("#left-drawer-flex-grabber").on('click', function(e){
                    J("#left-drawer").toggleClass('left-drawer-show').toggleClass('left-drawer-hide');
                });
                
            </script>
            <script type="text/javascript" charset="utf-8">
                Zotero.prefs.server_javascript_enabled = true;
                
                Zotero.config = <?include "zoteroconfig.js";?>
            </script>
            
            <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/library/tinymce3.5.5/tiny_mce/tiny_mce.js"></script>
            <script type="text/javascript" charset="utf-8" src="<?=$staticPath?>/library/ckeditor/ckeditor.js"></script>
        </div><!--/content -->
    </body>
</html>
