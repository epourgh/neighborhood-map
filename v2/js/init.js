"use strict";

let markers = [];
let stylesDay = [];
let stylesNight = [];

// localStorage.setItem("mapOptions", JSON.stringify(mapOptions));

let mapOptions = (function() {
    if (localStorage.getItem("mapOptions") !== null) {
        console.log('EXISTS');
        return localStorage.getItem("mapOptions");

    } else {
        console.log('!EXISTS');
        localStorage.setItem("mapOptions", 'stylesnight');
        return 'stylesnight';
        // localStorage.setItem("mapOptions", JSON.stringify(mapOptions));
    }
})();

mapOptions = mapOptions.toLowerCase().toString();

const templateMode = document.getElementById('template-mode');
templateMode.innerHTML = (mapOptions == '"stylesnight"') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

let list = [];
let map;

function initMap() {

  function stylesContent() {
    Promise.all([
            fetch("./js/json/locations.json").then(value => value.json()),
            fetch("./js/json/content-style-day.json").then(value => value.json()),
            fetch("./js/json/content-style-night.json").then(value => value.json())
        ]).then(function (response) {

            var locations = response[0].locations;
            stylesDay = response[1];
            stylesNight = response[2].stylesData;
            let stylesComparison = '"stylesnight"'.toLowerCase().toString()


            console.log(mapOptions)
            console.log(stylesComparison)

            let mapStyleSettings = (mapOptions == stylesComparison) ? stylesNight : stylesDay;
            let iconStyleSettings = (function() {
                if (mapOptions == stylesComparison) {
                    return ({
                        regFillColor: 'rgb(0, 255, 255)',
                        highlightFillColor: '#fff'
                    })
                
                } else {
                    return ({
                        regFillColor: 'rgb(75, 75, 75)',
                        highlightFillColor: '#000'
                    })
                }
            })()
            
            console.log(iconStyleSettings);


            // added max width to the info window for Wikipedia content
            var largeInfowindow = new google.maps.InfoWindow({
                maxWidth: 200
            });


            // Style the markers a bit. This will be our listing marker icon.
            var iconSymbol = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillOpacity: 1,
                fillColor: iconStyleSettings.regFillColor,
                strokeColor: iconStyleSettings.regFillColor,
            };

            // Create a "highlighted location" marker color for when the user
            // mouses over the marker.
            var iconSymbolHighlighted = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillOpacity: 1,
                fillColor: iconStyleSettings.highlightFillColor,
                strokeColor: iconStyleSettings.highlightFillColor,
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
            
            // STYLES

            map = new google.maps.Map(document.getElementById("map"), {
                center: {
                    lat: 29.496698,
                    lng: -95.38426199999999
                },
                zoom: 10,
                styles: mapStyleSettings,
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

            console.log(stylesNight)
            console.log(stylesDay)
            // map.styles = stylesDay; 

        }).catch(function (err) {
            document.getElementById('errorMessage').innerHTML += "Error loading the Map's stylesheet.";
        });


    }

    stylesContent();

}
