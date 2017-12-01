var map;

// Create a new blank array for all the listing markers.
var markers = [];
  function initMap() {
  function stylesContent() {

    // Importing contentStyle.json for the Map's Skin
    $.getJSON( "js/contentStyle.json", function(data) {
       var styles = data.stylesData;

      // Constructor creates a new map - only center and zoom are required.
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 29.496698, lng: -95.38426199999999},
        zoom:  10,
        styles: styles,
        mapTypeControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },

      });

      // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
      showListings();
    }).fail(function() {
      document.getElementById('errorMessage').innerHTML += "Error loading the Map's stylesheet.";
    });
  }

  stylesContent();

  // These are the listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var locations = [
    {title: 'Point Bolivar Lighthouse',
     location: {lat: 29.3672908, lng: -94.76678729999999},
     address: 'Everett, Port Bolivar, TX 77650',
     wikiTitle: 'Point Bolivar Light'},
    {title: 'The Menil Collection',
     location: {lat: 29.737185, lng: -95.397685},
     address: '1533 Sul Ross St, Houston, TX 77006',
     wikiTitle: 'Menil Collection'},
    {title: 'Nasa Space Center',
     location: {lat: 29.5432762, lng: -95.11057},
     address: '1601 E NASA Pkwy, Houston, TX 77058',
     wikiTitle: 'Space Center Houston'},
    {title: 'Sugarland Town Square',
     location: {lat: 29.5975462, lng: -95.62122859999999},
     address: '1533 Sul Ross St, Houston, TX 77006',
     wikiTitle: 'Sugarland Town Square'},
    {title: 'Houston Museum District',
     location: {lat: 29.7348281, lng: -95.37041579999999},
     address: 'Museum District, Houston, TX',
     wikiTitle: 'Houston Museum District'}
  ];

  // Style the markers a bit. This will be our listing marker icon.
  var iconSymbol = {
     path: google.maps.SymbolPath.CIRCLE,
     scale: 3,
     fillOpacity: 1,
     fillColor: '#0FF',
     strokeColor: '#0FF',
   };

   // Create a "highlighted location" marker color for when the user
   // mouses over the marker.
  var iconSymbolHighlighted = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      fillOpacity: 1,
      fillColor: '#fff',
      strokeColor: '#fff',
  };

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var positionLat = locations[i].location.lat;
    var positionLng = locations[i].location.lng;
    var title = locations[i].title;
    var address = locations[i].address;
    var wikiTitle = locations[i].wikiTitle;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      positionLng: positionLat,
      positionLat: positionLng,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: iconSymbol,
      address: address,
      wikiTitle: wikiTitle
    });

    markerListener(marker);

    // Push the marker to our array of markers.
    markers.push(marker);
  }

  function markerListener(marker){
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
      shortAnimation(this);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(iconSymbolHighlighted);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(iconSymbol);
    });
  }



  // viewModel holding listed locations
  // listed locations are linked to it's respective map marker
  // list is filterable
  var viewModel = function () {

    // viewModel's variable identified as 'self', instead of 'this'
    var self = this;

    // an empty observable array
    self.items = ko.observableArray([]);

    // locations is the model
    // the title of each is pushed into info
    // used for the list in the index.html's view
    locations.forEach(function(thisItem){
      self.items.push( new info(thisItem));
    });

    // in the view, the refresh filter content appears
    // when there's no items in the array after filtering
    self.resetFilter = ko.pureComputed(function() {
      return self.items().length === 0;
    }, self);

    // used when no filter results are found
    // pushes title for each location back into the array
    // markers are listed back onto the map
    self.refreshListings = function() {
      self.items.removeAll();
      locations.forEach(function(thisItem){
        self.items.push( new info(thisItem));
      });
      self.filteredItem("");
      hideListings();
      stylesContent();
    };

    // linking array items to their respective marker on Google map
    self.itemToMarker = function(clickedItem) {
      for (var i = 0; i < markers.length; i++) {

        // unwrapObservable allows the observable to be inspected
        if (ko.utils.unwrapObservable(
            clickedItem.title) == locations[i].title) {
          markers[i].setMap(map);
          populateInfoWindow(markers[i], largeInfowindow);

          // gives the marker icon a short bounce
          shortAnimation(markers[i]);
        }
      }
    };

    // input submited in filter placed in filteredItem variable
    self.filteredItem = ko.observable("");

    // calculate static length of locations array
    var arrayLength = self.items().length;

    // function for filtering the filteredItem
    self.filterItems = function() {

        // if there's an attempt to search a nonexisting item again
        // automatically refreshes filter
        // without need to click resetFilter's content
        if (self.filteredItem() !== "" && self.items().length === 0) {
          locations.forEach(function(thisItem){
            self.items.push( new info(thisItem));
          });
          self.filteredItem("");
          hideListings();
          stylesContent();

          // else if there are filterable items left to filter
        } else if (self.filteredItem() !== "") {

          // lower cased filter item for letter comparison
          var filteredItem2 = self.filteredItem().toLowerCase();

          // used later on for maintaining and removing items
          var g = 0;

          // loop the static length through the initial set of items
          for (var i = 0; i < arrayLength; i++) {

            // calculate dynamic length of array
            var arrayLength2 = self.items().length;

            // for searching existing items in array
            // even when filter has already filtered out the item previously
            // if function is passed if the static and dynamic array aren't equal
            if (i === 0 && arrayLength !== arrayLength2) {
              self.items.removeAll();
              for (var ln = 0; ln < locations.length; ln++) {
                self.items.push( new info(locations[ln]));
              }
            }

            // before plotting down filtered markers, markers are hidden
            if (i === 0) {
              hideListings();
            }

            // if lower cased item in listing shares letters with filter
            if (ko.utils.unwrapObservable(
                self.items()[g].title).toLowerCase(
                ).indexOf(filteredItem2) >= 0) {

              // if at the end of the array
              if (g == (arrayLength2)) {

                // compares items to locations
                // to see what markers to place on the map
                for (var k = 0, l = 0; l < self.items(
                     ).length; k++) {
                  if (ko.utils.unwrapObservable(self.items(
                      )[l].title) == locations[k].title) {
                    markers[k].setMap(map);
                    l++;
                  }
                }

              }
              // increment to the next item
              g++;
            } else {

              // delete the current item from the array
              self.items.splice(self.items.indexOf(
                ko.utils.unwrapObservable(self.items()[g])), 1);
            }

            // if the static loop with the original items is at the end
            if (i == (arrayLength - 1)) {

              // set markers on the map
              for (var m = 0, n = 0; n < self.items().length; m++) {
                if (ko.utils.unwrapObservable(
                    self.items()[n].title) == locations[m].title) {
                  markers[m].setMap(map);
                  n++;

                  // if filter result is an item
                  // then the info window is automatically populated
                  // without the necessity to click
                  if (arrayLength2 == 2 || arrayLength2 == 1) {
                    markers[m].setMap(map);
                    populateInfoWindow(markers[m], largeInfowindow);
                    shortAnimation(markers[m]);
                  }
                }
              }
            }
          }

          // if filtered without information in the input
          // revert the list and markers back to their original state
        } else if (self.filteredItem() === "") {
          self.items.removeAll();
          locations.forEach(function(thisItem){
            self.items.push( new info(thisItem));
          });
          hideListings();
          stylesContent();
        }
    }.bind(self);  // Ensure that "this" is always this view model
  };

  var info = function (data) {
    this.title = ko.observable(data.title);
  };

  // bindings apply to viewModel
  ko.applyBindings (new viewModel());

  // added max width to the info window for Wikipedia content
  var largeInfowindow = new google.maps.InfoWindow({
    maxWidth: 200
  });
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;

    // search the location's wiki title
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
              marker.wikiTitle +"&format=json&callback=wikiCallback";

    $.ajax({
      url: url,

      // default is GET, also can make a POST request
      // type: 'GET',
      contentType: "application/jsonp; charset=utf-8",

      // asynchronous call; no sequential order for when fucntion executes
      async: true,

      // jsonp: callback=wikiCallback
      dataType: "jsonp",
      success: function(data, status, jqXHR) {

        // appends wiki introductory content and url img at the end
        if (marker.wikiTitle !== '') {
          infowindow.setContent('<div class="color-000"><b>' + data[1] +
                                '</b></div>' +  '<div class="color-000">'+
                                marker.address + '</div>' +
                                "<div class='color-000'><br>" + data[2] +
                                " " + "<a href=" + data[3] +
                                " target='_blank'>" +
                                "<img src='img/external.gif' alt='to wikipedia' class='external-img'></img>" +
                                "</a></div>");
        }
      },
      error: function(data) {
        infowindow.setContent('<div class="color-000"><b>' + marker.title +
                              '</b></div>' +  '<div class="color-000">'+
                              marker.address + '</div>' +
                              "<div class='color-000'><br>" +
                              '\nCould not load Wikipedia content.</div>')
      },
    });
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}



// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function will make the specified marker bounce
function shortAnimation(thisMarker) {
  thisMarker.setAnimation(google.maps.Animation.BOUNCE);

  // markers times out after allotted time and animation is set to null
  setTimeout(function() {
    thisMarker.setAnimation(null);
  }, 500);
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function populatesecondInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker.position != marker.position) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

// error message for when Google maps fails to laod
function googleError() {
  document.getElementById('errorMessage').innerHTML += 'Trouble connecting to Google Maps.</br>';
}
