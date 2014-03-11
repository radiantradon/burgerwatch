$(function() {
  $( "button" ).on( "click", function( event ) {
    // this callback that takes the form on the front page, serializes it,
    // and sends the URL to loadTruckMarkers, which does the rest
    // /filtertrucks is an API endpoint that will return filtered JSON data
    // based on the form data
    event.preventDefault();
    var serialized = $("form").serialize();
    var url = "/filtertrucks?"+serialized;
    loadTruckMarkers(map, url);
  });

  // Test to see if we're on a phone
  
});