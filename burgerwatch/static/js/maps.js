var map;
var markers = [];

function initialize() {
  var mapOptions = {
    zoom: 12,
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

// 
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
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
    deleteMarkers();
    trucks = data['data'];
    for (i=0; i < trucks.length; i++) {
      var truck = trucks[i];
      var pos = new google.maps.LatLng(truck[22], truck[23]);
      var title = truck[9];
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: map.red_icon,
        title: title,
      });
      markers.push(marker);

      var template_vars = {
        title: truck[9],
        url: truck[24],
        address: truck[13],
      };
      template = createTemplate(template_vars);
      bindInfoWindow(marker, map, infowindow, template);
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
  //This changes the color of markers with the same name
  // when you select one of them
  google.maps.event.addListener(marker, 'click', function() {
    var gold_markers = _.filter(markers, function(m) {
      return m.getIcon()==map.gold_icon;
    });
    if (gold_markers.length > 0) {
      _.each(gold_markers, function(g) {
        g.setIcon(map.red_icon);
      });
    }
    marker.setIcon(map.gold_icon);
  });
}

// written by KE
function highlightSimilarMarkers(map, marker) {
    google.maps.event.addListener(marker, 'click', function() {
      similar = _.where(markers, {title:marker.title});
      _.each(similar, function(g){
        g.setIcon(map.gold_icon);
      });
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

