var map;
var markers = [];

function initialize() {
  var mapOptions = {
    zoom: 13,
    red_icon: '/static/img/marker_red_40.png',
    gold_icon: '/static/img/marker_gold_40.png'
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  loadTruckMarkers(map, '/trucks');

  // Try HTML5 geolocation (boilerplate from Google Maps API)
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

// Boilerplate function from Google Maps api
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(37, -122),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

// Created by KE
function createTemplate(template_vars) {
  var str = '<strong><%= title %></strong><br><br>\
    <%= address%><br> \
    <a href="<%=url %>" target="_blank">Download schedule</a>';
  var compiled = _.template(str);
  var html = compiled(template_vars);
  return html;
}

// Helper function to set all markers on a map,
// we pass null to this to remove all markers before
// reloading. Helper function boilerplate from Google
// documentation
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
//Boilerplate from Google documentation
function clearMarkers() {
  setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
// From google documentation
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// Written by KE
function loadTruckMarkers(map, url) {
  var infowindow = new google.maps.InfoWindow({
    content: ""
  });

  $.getJSON(url, function(data) {
    // Delete all markers off the page before continuing
    deleteMarkers();
    // JSON data from SF data website has keys 'meta' and 'data' so just making
    // sure we're only working with the 'data' part
    trucks = data['data'];
    for (i=0; i < trucks.length; i++) {
      var truck = trucks[i];
      var pos = new google.maps.LatLng(truck[22], truck[23]);
      var title = truck[9];
      // Create a new marker for each truck
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: map.red_icon,
        title: title,
      });
      // Save this marker in an array for easy referencing later
      markers.push(marker);

      // JS template context
      var template_vars = {
        title: truck[9],
        url: truck[24],
        address: truck[13],
      };
      // This is used to fill the info bubble that pops up when you click
      // a marker
      template = createTemplate(template_vars);
      bindInfoWindow(marker, map, infowindow, template);

      // JS closures that will bind callbacks to the click event
      changeMarkerColor(map, marker);
      highlightSimilarMarkers(map, marker);
    }
  });
}

// written by KE
function bindInfoWindow(marker, map, infowindow, template) {
  google.maps.event.addListener(marker, 'click', function() {
    // Find the gold icon and make it red again
    infowindow.setContent(template);
    infowindow.open(map, marker);
  });
}

// written by KE
function changeMarkerColor(map, marker) {
  // This changes the color of markers with the same name
  // when you select one of them

  // Event listener inside of a javascript closure
  google.maps.event.addListener(marker, 'click', function() {
    // Use Underscore.js "filter" to look for gold markers that are
    // already positioned on a map and save them into array gold_markers
    var gold_markers = _.filter(markers, function(m) {
      return m.getIcon()==map.gold_icon;
    });
    // If the gold_markers array is not empty then reset them all back to
    // red markers
    if (gold_markers.length > 0) {
      _.each(gold_markers, function(g) {
        g.setIcon(map.red_icon);
      });
    }
    // Now finally, when this marker is clicked change it to a gold marker
    marker.setIcon(map.gold_icon);
  });
}

// written by KE
// When the user clicks on a marker and it turns gold, I want the map to also
// highlight all of the markers that belong to the same business as the one
// the user just clicked on, that's what this closure is for.
function highlightSimilarMarkers(map, marker) {
    // Add an event listener
    google.maps.event.addListener(marker, 'click', function() {
      // Use Underscore.js "where" to find all of the markers that have the same
      // title (i.e. business name) as the marker that was passed in
      similar = _.where(markers, {title:marker.title});
      // Then set each marker in "similar" to gold.
      _.each(similar, function(g){
        g.setIcon(map.gold_icon);
      });
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

