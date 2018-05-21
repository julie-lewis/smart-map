$(document).ready(()=>{
  // ********************************************
  // VARIABLES
  // ********************************************
  const overlayWrap = document.getElementById('overlay-wrapper');

  // ********************************************
  // DEFINE MODAL CONTENT
  // ********************************************
  // function setOverlay() {
  //   let overlay = $('#overlay-content');
  //   let overlayDiv += '<div id="overlay"><span id="close" class="close">&times;</span>';
  //   overlayDiv += '<h3>Contact your local Chemwash</h3>'
  //   overlayDiv += '<hr class="hr">';
  //   overlayDiv += '<p>Contact Form</p>';
  //   overlayDiv += '</div>';
  //
  //   overlay.html(overlayDiv);
  // } //end setOverlay


  // ********************************************
  // OPEN MODAL ON CLICK
  // ********************************************
  $("#contactButton").on('click', e => { // Delegated event handler so that margins don't open undefined
    overlayWrap.style.display = "block";
    //let selected = e.target; // Gets clicked item
    //let selectedIndex = $(selected).data('index'); //Indentifies index of clicked on node
    //setOverlay();
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


}); //end document. ready
