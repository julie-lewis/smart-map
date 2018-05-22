document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var map;

function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

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
               '<p>Phone: ' + marker.phone + '</p>' +
                '<div id="contactButton">' +
                  '<button>Contact Chemwash</button>' +
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

    // var marker = m.index;
    // console.log(marker);

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
  // DEFINE MODAL CONTENT
  // ********************************************
  function setOverlay() {
    let overlay = $('#overlay-content');
    let overlayDiv = '<div id="overlay"><span id="close" class="close">&times;</span>';
    overlayDiv += '<h3>Contact your local Chemwash</h3>'
    overlayDiv += '<hr class="hr">';
    overlayDiv += '<p>Contact Form</p>';
    overlayDiv += '</div>';

    overlay.html(overlayDiv);
  } //end setOverlay


  // ********************************************
  // OPEN MODAL ON CLICK
  // ********************************************
  $("#map").on('click', '#contactButton', e => {
    overlayWrap.style.display = "block";
    console.log('hi');
    //let selected = e.target; // Gets clicked item
    //let selectedIndex = $(selected).data('index'); //Indentifies index of clicked on node
    setOverlay();
  });

  // ********************************************
  // MODAL CONTROLS
  // ********************************************
  // Close modal by clicking X
  $('#overlay-wrapper').on('click', '#close', e=> { // Delegated event handler to existing DOM element
    $('#overlay').text('');
    $("#overlay").css("display", "none");
    $("#overlay-wrapper").css("display", "none");
  });

  // Close modal by clicking outside of modal
  window.onclick = function(event) {
    if (event.target == overlayWrap) {
      $('#overlay').text('');
      $("#overlay").css("display", "none");
      $("#overlay-wrapper").css("display", "none");
    }
  };
