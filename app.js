document.addEventListener('DOMContentLoaded', function () {

//Checks to see if map exists on page, if true - inserts API in head
  if (document.querySelectorAll('#map').length > 0){
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJy7fFz2MNZ5zlNnpbG0FnDHlWJUClNsc&libraries=places&callback=initialize&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

//Allows both map and autocomplete callbacks
function initialize() {
   initMap();
   initAutocomplete();
}

// ********************************************
// SET MAP
// ********************************************
var map;

function initMap()
{
  //Creates new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  // Gets and renders JSON file data, per plotMarkers function
  // fetch('markers.json')
  //   .then(function(response){return response.json()})
  //   .then(plotMarkers);

  // Gets markers from Window
  const markers = window.MARKERS;
  plotMarkers(markers);

  //Creates cluster markers, using cluster icons from Image folder
  var markerCluster = new MarkerClusterer(map, markers,
          {imagePath: 'images'});
}

// ********************************************
// PLOT MARKERS
// ********************************************
function plotMarkers(m)
{
  let markers = [];
  let bounds = new google.maps.LatLngBounds();

  m.forEach(function (marker) {
    //sets position of marker, based on lng/lat from object
    var position = new google.maps.LatLng(marker.lat, marker.lng);
    //sets content of infoWindow, to be called later
    var infoContent = '<h2>' + marker.name + '</h2>' +
               '<p>Phone: <a href="tel:' + marker.phone + '">' + marker.phone + '</a></p>' +
                '<div id="contactButton">' +
                  '<button>Request a Quote</button>' +
                '</div>'
    ;

    marker =
      new google.maps.Marker({
        position: position,
        map: map,
        info: infoContent,
        animation: google.maps.Animation.DROP
      });

    infoWindow = new google.maps.InfoWindow({ content: infoContent });

    marker.addListener('mouseover', function() {
       infoWindow.setContent( this.info );
       infoWindow.open( map, this );
    });

    bounds.extend(position);

  });

  map.fitBounds(bounds);

}


// ********************************************
// MODAL CONTROLS
// ********************************************

// Open Modal on click
$("#map").on('click', '#contactButton', e => {
  const overlayWrap = document.getElementById('overlay-wrapper');
  overlayWrap.style.display = "block";
});

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

// ********************************************
// ADDRESS AUTOCOMPLETE SETTINGS
// ********************************************

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

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
