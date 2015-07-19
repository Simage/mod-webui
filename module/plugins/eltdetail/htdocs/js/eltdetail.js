/* Copyright (C) 2009-2015:
   Gabes Jean, naparuba@gmail.com
   Gerhard Lausser, Gerhard.Lausser@consol.de
   Gregory Starck, g.starck@gmail.com
   Hartmut Goebel, h.goebel@goebel-consult.de
   Andreas Karfusehr, andreas@karfusehr.de
   Frederic Mohier, frederic.mohier@gmail.com

   This file is part of Shinken.

   Shinken is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Shinken is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with Shinken.  If not, see <http://www.gnu.org/licenses/>.
*/

var eltdetail_logs=false;

// @mohierf@: really need this global ?
var elt_name = '{{elt.get_full_name()}}';


/*
 * Function called when the page is loaded and on each page refresh ...
 */
function on_page_refresh() {
   // Show actions bar
   show_actions();
   
   // Buttons tooltips
   $('button').tooltip();

   // Buttons as switches
   $('input.switch').bootstrapSwitch();

   // Elements popover
   $('[data-toggle="popover"]').popover();

   $('[data-toggle="popover medium"]').popover({ 
      trigger: "hover", 
      placement: 'bottom',
      toggle : "popover",
      viewport: {
         selector: 'body',
         padding: 10
      },
      
      template: '<div class="popover popover-medium"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
   });

   /**
    * Page refresh and tabs management 
    * ---------
    * Commented: use a Js instead in layout.tpl !
    * ---------
   // Look at the hash part of the URI. If it match a nav name, go for it
   if (location.hash.length > 0) {
      if (eltdetail_logs) console.debug('Displaying tab: ', location.hash)
      $('.nav-tabs li a[href="' + location.hash + '"]').trigger('click');
   } else {
      if (eltdetail_logs) console.debug('Displaying first tab')
      $('.nav-tabs li a:first').trigger('click');
   }
   
   // Avoid scrolling the window when a nav tab is selected ...
   // Not functionnal !
   $('.nav-tabs li a').click(function(e){
      if (eltdetail_logs) console.debug('Clicked ', $(this).attr('href'))
      // Try to stop bootstrap scroll to anchor effect ...
      e.preventDefault();
      e.stopImmediatePropagation();
      // Display tab
      $(this).tab('show');
   });

   // When a nav item is selected update the page hash
   $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      if (eltdetail_logs) console.debug('Shown ', $(this).attr('href'))
      location.hash = $(this).attr('href');
   })
    */
   
   
   /*
    * Impacts view 
    */
   // When toggle list is activated ...
   $('#impacts a.toggle-list').on('click', function () {
      var state = $(this).data('state');
      var target = $(this).data('target');
      
      if (state=='expanded') {
         $('#impacts ul[name="'+target+'"]').hide();
         $(this).data('state', 'collapsed')
         $(this).children('i').removeClass('fa-minus').addClass('fa-plus');
      } else {
         $('#impacts ul[name="'+target+'"]').show();
         $(this).data('state', 'expanded')
         $(this).children('i').removeClass('fa-plus').addClass('fa-minus');
      }
   });
   
   /*
    * Custom views 
    */
   $('.cv_pane').on('shown.bs.tab', function (e) {
      show_custom_view($(this));
   })

   // Show each active custom view
   $('.cv_pane.active').each(function(index, elt) {
      show_custom_view($(elt));
   });
   
   /*
    * Dependency graph
    */
   $('a[href="#depgraph"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var n = $('#inner_depgraph').data('element');
      // Loading indicator ...
      $("#inner_depgraph").html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading dependency graph ...');
      // Then we load the inner depgraph page. Easy isn't it? :)
      $('#inner_depgraph').load('/inner/depgraph/'+n);
   });
   
   // Fullscreen management
   $('button[action="fullscreen-request"]').click(function() {
      var elt = $(this).data('element');
      screenfull.request($('#'+elt)[0]);
   });

   
   /*
    * Commands buttons
    */
   // Change a custom variable
   $('button[action="change-variable"]').click(function () {
      var elt = $(this).data('element');
      var variable = $(this).data('variable');
      var value = $(this).data('value');
      if (eltdetail_logs) console.debug("Button - set custom variable '"+variable+"'="+value+" for: ", elt)
      
      display_form("/forms/change_var/"+elt+"?variable="+variable+"&value="+value);
   });
   
   // Toggles ...
   $('input[action="toggle-active-checks"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle active checks for: ", elt, ", currently: ", value)
      toggle_active_checks(elt, value);
   });
   $('input[action="toggle-passive-checks"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle passive checks for: ", elt, ", currently: ", value)
      toggle_passive_checks(elt, value);
   });
   $('input[action="toggle-check-freshness"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle freshness checks for: ", elt, ", currently: ", value)
      toggle_freshness_check(elt, value);
   });
   $('input[action="toggle-notifications"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle notifications for: ", elt, ", currently: ", value)
      toggle_notifications(elt, value);
   });
   $('input[action="toggle-event-handler"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle event handler for: ", elt, ", currently: ", value)
      toggle_event_handlers(elt, value);
   });
   $('input[action="toggle-process-perfdata"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle perfdata processing for: ", elt, ", currently: ", value)
      toggle_process_perfdata(elt, value);
   });
   $('input[action="toggle-flap-detection"]').on('switchChange.bootstrapSwitch', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle flap detection for: ", elt, ", currently: ", value)
      toggle_flap_detection(elt, value);
   });


   /*
    * History / logs
    */
   $('a[data-toggle="tab"][href="#history"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var element = $('#inner_history').data('element');
      
      // Loading indicator ...
      $("#inner_history").html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading history data ...');
      $("#inner_history").load('/logs/inner/'+element, function(response, status, xhr) {
         if (status == "error") {
            $('#inner_history').html('<div class="alert alert-danger">Sorry but there was an error: ' + xhr.status + ' ' + xhr.statusText+'</div>');
         }
      });
   })


   /*
    * Availability
    */
   $('a[data-toggle="tab"][href="#availability"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var element = $('#inner_availability').data('element');
      
      // Loading indicator ...
      $("#inner_availability").html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading availability data ...');
      
      $("#inner_availability").load('/availability/inner/'+element, function(response, status, xhr) {
         if (status == "error") {
            $('#inner_availability').html('<div class="alert alert-danger">Sorry but there was an error: ' + xhr.status + ' ' + xhr.statusText+'</div>');
         }
      });
   })


   /*
    * Helpdesk
    */
   $('a[data-toggle="tab"][href="#helpdesk"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var element = $('#inner_helpdesk').data('element');
      
      // Loading indicator ...
      $("#inner_helpdesk").html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading helpdesk data ...');
      
      $("#inner_helpdesk").load('/helpdesk/tickets/'+element, function(response, status, xhr) {
         if (status == "error") {
            $('#inner_helpdesk').html('<div class="alert alert-danger">Sorry but there was an error: ' + xhr.status + ' ' + xhr.statusText+'</div>');
         }
      });
   })


   /*
    * Timeline
    */
   $('a[data-toggle="tab"][href="#timeline"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var hostname = $('#inner_timeline').data('element');
      // Get timeline tab content ...
      $('#inner_timeline').load('/timeline/inner/'+hostname);
      
   })
   
   
   /*
    * Graphs
    */
   // This to allow the range to change after the page is loaded.
   get_range();
   
   /* We can't apply Jcrop on ready. Why? Because the images are not yet loaded, and so
      they will have a null size. So how to do it?
      The key is to hook the graph tab. onshow will raise when we active it (and was shown).
   */
   $('a[href="#graphs"]').on('shown.bs.tab', function (e) {
      // console.log("Display graph: ", current_graph)
      $('a[data-type="graph"][data-period="'+current_graph+'"]').trigger('click');
   })
   
   // Change graph
   $('a[data-type="graph"]').click(function (e) {
      current_graph=$(this).data('period');
      graphstart=$(this).data('graphstart');
      graphend=$(this).data('graphend');

      // Update graphs
      $("#real_graphs").html( html_graphes[current_graph] );

      // Update active period selected
      $("#graph_periods li.active").removeClass('active');
      $(this).parent('li').addClass('active');
      
      // and call the jcrop javascript
      $('.jcropelt').Jcrop({
         onSelect: update_coords,
         onChange: update_coords
      });
      get_range();
   });
   
   // On first page load, wait for document ready ...
   $(document).ready(function(){
      // Show actions bar
      show_actions();
   });
}


/* 
 * Host/service aggregation toggle image button action 
 */
function toggleAggregationElt(e) {
    var toc = document.getElementById('aggregation-node-'+e);
    var imgLink = document.getElementById('aggregation-toggle-img-'+e);

    img_src = '/static/images/';

    if (toc && toc.style.display == 'none') {
        toc.style.display = 'block';
        if (imgLink != null){
            imgLink.src = img_src+'reduce.png';
        }
    } else {
        toc.style.display = 'none';
        if (imgLink != null){
            imgLink.src = img_src+'expand.png';
        }
    }
}


/* The business rules toggle buttons*/
function toggleBusinessElt(e) {
    //alert('Toggle'+e);
    var toc = document.getElementById('business-parents-'+e);
    var imgLink = document.getElementById('business-parents-img-'+e);

    img_src = '/static/images/';

    if (toc && toc.style.display == 'none') {
   toc.style.display = 'block';
   if (imgLink != null){
       imgLink.src = img_src+'reduce.png';
   }
    } else {
   toc.style.display = 'none';
   if (imgLink != null){
       imgLink.src = img_src+'expand.png';
   }
    }
}

