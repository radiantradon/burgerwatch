$(function() {
  $( "button" ).on( "click", function( event ) {
    event.preventDefault();
    var serialized = $("form").serialize();
    console.log( serialized );
    var url = "/filtertrucks?"+serialized;
    loadTruckMarkers(map, url);
  });
});