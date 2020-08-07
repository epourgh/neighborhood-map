"use strict";

var markers = [];
var list = [];
let map;

// These are the listings that will be shown to the user.
// Normally we'd have these in a database instead.
const locations = [{
        id: 0,
        title: 'Point Bolivar Lighthouse',
        location: {
            lat: 29.3672908,
            lng: -94.76678729999999
        },
        address: 'Everett, Port Bolivar, TX 77650',
        wikiTitle: 'Point Bolivar Light'
    },
    {
        id: 1,
        title: 'The Menil Collection',
        location: {
            lat: 29.737185,
            lng: -95.397685
        },
        address: '1533 Sul Ross St, Houston, TX 77006',
        wikiTitle: 'Menil Collection'
    },
    {
        id: 2,
        title: 'Nasa Space Center',
        location: {
            lat: 29.5432762,
            lng: -95.11057
        },
        address: '1601 E NASA Pkwy, Houston, TX 77058',
        wikiTitle: 'Space Center Houston'
    },
    {
        id: 3,
        title: 'Sugarland Town Square',
        location: {
            lat: 29.5975462,
            lng: -95.62122859999999
        },
        address: '1533 Sul Ross St, Houston, TX 77006',
        wikiTitle: 'Sugarland Town Square'
    },
    {
        id: 4,
        title: 'Houston Museum District',
        location: {
            lat: 29.7348281,
            lng: -95.37041579999999
        },
        address: 'Museum District, Houston, TX',
        wikiTitle: 'Houston Museum District'
    }
];

function initMap() {

  function stylesContent() {

      fetch('./contentStyle.json')
          .then(function (response) {

            var styles = response.stylesData;

            map = new google.maps.Map(document.getElementById("map"), {
                center: {
                    lat: 29.496698,
                    lng: -95.38426199999999
                },
                zoom: 10,
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

    }).catch(function (err) {
        document.getElementById('errorMessage').innerHTML += "Error loading the Map's stylesheet.";
    });


    }

    stylesContent();

    // added max width to the info window for Wikipedia content
    var largeInfowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });


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

    const myDiv = document.getElementById("myDiv");

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {

        // Get the position from the location array.

        var id = locations[i].id;
        var position = locations[i].location;
        var positionLat = locations[i].location.lat;
        var positionLng = locations[i].location.lng;
        var title = locations[i].title;
        var address = locations[i].address;
        var wikiTitle = locations[i].wikiTitle;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map,
            position: position,
            positionLng: positionLat,
            positionLat: positionLng,
            icon: iconSymbol,
            animation: google.maps.Animation.DROP,
            title: title,
            address: address,
            wikiTitle: wikiTitle,
            infowindow: largeInfowindow
        });


        // Push the marker to our array of markers.
        markers.push(marker);

        markerListener(id);

        let element = document.createElement('a');
        element.innerHTML = title;
        element.id = id;

        element.onclick = function () {
            populateInfoWindow(markers[this.id], largeInfowindow);
            shortAnimation(markers[this.id]);
        };

        element.onmouseover = function () {
            markers[this.id].setIcon(iconSymbolHighlighted);
        }

        element.onmouseout = function () {
            markers[this.id].setIcon(iconSymbol);
        }

        myDiv.appendChild(element);


    }

    function markerListener(id) {

        let marker = markers[id];

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            console.log('clicked')
            populateInfoWindow(this, largeInfowindow);
            shortAnimation(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(iconSymbolHighlighted);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(iconSymbol);
        });
    }


}