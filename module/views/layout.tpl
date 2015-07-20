<!DOCTYPE html>
%#Set default values
%#if not 'js' in locals(): js = []
%#if not 'css' in locals(): css = []
%#if not 'title' in locals(): title = 'Untitled ...'
%setdefault('js', [])
%setdefault('css', [])
%setdefault('title', 'Untitled ...')

%# Layout is built with:
%# - page header: logo, top navigation bar, indicators, user menu
%# - side menu: left sidebar menu
%# - content: including current page layout with title
%# - page footer: copyright
%# Following variables allow to include or not different layout pieces: 
%setdefault('print_menu'  , True)
%setdefault('print_header', True)
%setdefault('print_title' , True)
%setdefault('print_footer', True)
%# For breadcrumb, declare as is when rebasing layout: 
%# - breadcrumb=[ ['Groups', '/servicegroups'], [groupalias, '/servicegroup/'+groupname] ]
%setdefault('breadcrumb', '')

%# Current page may be refreshed or not
%setdefault('refresh', False)

%setdefault('user', None)
%setdefault('app', None)

%setdefault('navi', None)
%setdefault('elts_per_page', 25)

%from shinken.bin import VERSION
%if app is not None:
%helper = app.helper
%end

<html lang="en">
   <head>
      <meta charset="utf-8">
      <title>{{title or 'No title'}}</title>

      <!-- 
         This file is a part of Shinken.

         Shinken is free software: you can redistribute it and/or modify it under the terms of the
         GNU Affero General Public License as published by the Free Software Foundation, either
         version 3 of the License, or (at your option) any later version.

         WebUI Version: {{app.app_version if app is not None and app.app_version is not None else ''}}
         Shinken Framework Version: {{VERSION}}
      -->


      <!--[if lt IE 9]>
      <script src="/static/js/ie9/html5.js"></script>
      <script src="/static/js/ie9/json2.js"></script>
      <![endif]-->

      <!-- Stylesheets 
      ================================================== -->
      <link href="/static/css/bootstrap.min.css" rel="stylesheet">
      <link href="/static/css/bootstrap-theme.min.css" rel="stylesheet">
      <link href="/static/css/font-awesome.min.css" rel="stylesheet">

      <link href="/static/css/metisMenu.min.css" rel="stylesheet">
      <link href="/static/css/sb-admin-2.css" rel="stylesheet">
      
      <link href="/static/css/jquery.meow.css" rel="stylesheet">
      <link href="/static/css/typeahead.css" rel="stylesheet">

      <link href="/static/css/daterangepicker.css" rel="stylesheet">

      <link href="/static/css/shinken-layout.css" rel="stylesheet">

      <!-- css3 effect for pulse is not available on IE It's not real comment, if so it will not work. -->
      <!--[IF !IE]> -->
      <link href="/static/css/pulse.css" rel="stylesheet">
      <!-- <![ENDIF]-->

      %# And now for css files
      %for p in css:
      <link rel="stylesheet" type="text/css" href="/static/{{p}}">
      %end

      <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Search for hosts and services in Shinken" />

      <!-- Scripts
      ================================================== -->
      <script src="/static/js/jquery-1.11.1.min.js"></script>
      <script src="/static/js/bootstrap.min.js"></script>
      <script src="/static/js/bootstrap-tab-bookmark.js"></script>

      <script src="/static/js/metisMenu.min.js"></script>
      <script src="/static/js/sb-admin-2.js"></script>

      <script src="/static/js/moment.min.js"></script>

      <!-- See: https://github.com/dangrossman/bootstrap-daterangepicker -->
      <script src="/static/js/daterangepicker.js"></script>

      <script src="/static/js/jquery.jclock.js"></script>
      <script src="/static/js/jquery.jTruncate.js"></script>
      <script src="/static/js/jquery.meow.js"></script>
      <script src="/static/js/typeahead.bundle.min.js"></script>

      <script src="/static/js/screenfull.js"></script>
      
      <!--Shinken ones : refresh pages -->
      %if refresh:
      <script>
      var app_refresh_period = {{app.refresh_period}};
      </script>
      <script src="/static/js/shinken-refresh.js"></script>
      %end
      <!--Shinken ones : actions, user's prefs, ... -->
      <script src="/static/js/shinken-actions.js"></script>
      <script src="/static/js/shinken-layout.js"></script>
      <script src="/static/js/shinken-bookmarks.js"></script>

      %# End of classic js import. Now call for specific ones ...
      %for p in js:
      <script type="text/javascript" src="/static/{{p}}"></script>
      %end
   </head>

   <body>
      <div id="wrapper">
        %if print_header:
        %include("header_element")
        <div id="page-wrapper">
        %else:
        <div class="container">
        %end
        <div id="page-content">
            <div class="row">
               %if print_title:
               <!-- Page header -->
               <section class="content-header">
                  %if navi:
                  %include("pagination_element", navi=navi, page=page, elts_per_page=elts_per_page, display_steps_form=True)
                  %end
                  <h3 class="page-header" style="margin-top: 10px">
                    <ol class="breadcrumb" style="margin:0px">
                      <li><a href="/">Home</a></li>
                      %if breadcrumb == '':
                      <li class="active">{{title or 'No title'}}</li>
                      %else:
                      %_go_active = 'active'
                      %for p in breadcrumb:
                      %_go_active = ''
                      %if p[0]:
                      <li class="{{_go_active}}"><a href="{{p[1]}}">{{p[0]}}</a></li>
                      %else:
                      <li class="{{_go_active}}">{{p}}</li>
                      %end
                      %end
                      %end
                    </ol>
                  </h3>

               </section>
               %end
               
               <!-- Page content -->
               <section class="content">
                %include
               </section>

               %if navi and len(navi) > 1:
               <hr>
               <section class="pagination-footer">
                %include("pagination_element", navi=navi, page=page, elts_per_page=None)
               </section>
               %end
            </div>
         </div>
         </div>
      </div>

      %if print_footer:
      %include("footer_element")
      %end

      <!-- A modal div that will be filled and shown when we want forms ... -->
      <div class="modal fade" id="modal" role="dialog" aria-labelledby="Generic modal box" aria-hidden="true">
         <div class="modal-dialog modal-lg">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  <h4 class="modal-title">About Shinken Web UI:</h4>
               </div>
               <div class="modal-body">
                  <!--  ... -->
               </div>
               <div class="modal-footer">
                  <a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
               </div>
            </div>
         </div>
      </div>

      <!-- About modal window -->
      <div class="modal fade" role="dialog" aria-labelledby="About box" aria-hidden="true" id="about">
         <div class="modal-dialog modal-lg">
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  <h4 class="modal-title">About Shinken Web UI:</h4>
               </div>
               <div class="modal-body">
                  <!-- About Form -->
                  <form class="form-horizontal">
                  <fieldset>
                     <div class="control-group">
                        <label class="control-label" for="app_version">Web User Interface Version</label>
                        <div class="controls">
                           <input readonly="" name="app_version" type="text" class="form-control" placeholder="Not set" class="input-medium" value="Shinken Web UI, version: {{app.app_version if app is not None else ''}}">
                        </div>
                     </div>

                     <div class="control-group">
                        <label class="control-label" for="shinken_version">Shinken Framework Version</label>
                        <div class="controls">
                           <input readonly="" name="shinken_version" type="text" class="form-control" placeholder="Not set" class="input-medium" value="Shinken Framework, version: {{VERSION}}">
                        </div>
                     </div>

                     <div class="control-group">
                        <label class="control-label" for="app_copyright">Copyright</label>
                        <div class="controls">
                           <input readonly="" name="app_copyright" type="text" class="form-control" placeholder="Not set" class="input-medium" value="{{app.app_copyright if app is not None else ''}}">
                        </div>
                     </div>

                     <div class="control-group">
                        <label class="control-label" for="app_release">Release notes</label>
                        <div class="controls">
                           <input readonly="" name="app_release" type="text" class="form-control" placeholder="Not set" class="input-medium" value="{{app.app_release if app is not None else ''}}">
                        </div>
                     </div>
                  </fieldset>
                  </form>
               </div>
               <div class="modal-footer">
                  <a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
               </div>
            </div>
         </div>
      </div>
   </body>
</html>
