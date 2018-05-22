document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJy7fFz2MNZ5zlNnpbG0FnDHlWJUClNsc&signed_in=true&libraries=places&callback=initialize&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

function initialize() {
   initMap();
   initAutoComplete();
}

var map;

function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  var markerCluster = new MarkerClusterer(map, markers,
          {imagePath: 'images'});

  // Gets then renders JSON file data, per plotMarkers function
  fetch('markers.json')
    .then(function(response){return response.json()})
    .then(plotMarkers);


}

var markers;
var bounds;

function plotMarkers(m)
{
  markers = [];
  bounds = new google.maps.LatLngBounds();

  m.forEach(function (marker) {
    var position = new google.maps.LatLng(marker.lat, marker.lng);
    var name = '<h2>' + marker.name + '</h2>' +
               '<p>Phone: <a href="tel:' + marker.phone + '">' + marker.phone + '</a></p>' +
                '<div id="contactButton">' +
                  '<button>Request a Quote</button>' +
                '</div>'
    ;

    var marker =
      new google.maps.Marker({
        position: position,
        map: map,
        info: name,
        animation: google.maps.Animation.DROP
      });

    infoWindow = new google.maps.InfoWindow({ content: name });

    marker.addListener('mouseover', function() {
       infoWindow.setContent( this.info );
       infoWindow.open( map, this );
    });

    bounds.extend(position);

  });

  map.fitBounds(bounds);

}


  // ********************************************
  // VARIABLES
  // ********************************************
  const overlayWrap = document.getElementById('overlay-wrapper');

  // ********************************************
  // OPEN MODAL ON CLICK
  // ********************************************
  $("#map").on('click', '#contactButton', e => {
    overlayWrap.style.display = "block";
  });

  // ********************************************
  // MODAL CONTROLS
  // ********************************************
  // Close modal by clicking X
  $('#overlay-wrapper').on('click', '#close', e=> { // Delegated event handler to existing DOM element
    $("#overlay-wrapper").css("display", "none");
  });

  // Close modal by clicking outside of modal
  window.onclick = function(event) {
    if (event.target == overlayWrap) {
      $("#overlay-wrapper").css("display", "none");
    }
  };


  // This example displays an address form, using the autocomplete feature
  // of the Google Places API to help users fill in the information.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  var placeSearch, autocomplete;
  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
      }
    }
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }
