
var map;

function initialize() {
  var mapOptions = {
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  loadTruckMarkers(map);

  // Try HTML5 geolocation
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

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function createContent() {
  var template = _.template("")
}

function loadTruckMarkers(map) {
  var infowindow = new google.maps.InfoWindow({
    content: ""
  });

  $.getJSON("/trucks", function(data) {
    trucks = data['data'];
    for (i=0; i < trucks.length; i++) {
      var truck = trucks[i];
      var pos = new google.maps.LatLng(truck[22], truck[23]);
      var title = truck[9];

      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: title,
      });
      bindInfoWindow(marker, map, infowindow, title);

    }
  });
}

function bindInfoWindow(marker, map, infowindow, title) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(title);
        infowindow.open(map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

