// This function will make the specified marker bounce
function shortAnimation(thisMarker) {
    thisMarker.setAnimation(google.maps.Animation.BOUNCE);

    // markers times out after allotted time and animation is set to null
    setTimeout(function () {
        thisMarker.setAnimation(null);
    }, 500);
}

function populatesecondInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker.position != marker.position) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        // ajax request goes here
        var url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${marker.wikiTitle}&format=json&callback=wikiCallback`;

        fetch(url).then(response => response.json()).then(function (response) {

            console.log(response)

            infowindow.setContent('<div class="color-000"><b>' + response[1] +
                '</b></div>' + '<div class="color-000">' +
                marker.address + '</div>' +
                "<div class='color-000'><br>" + response[2] +
                " " + "<a href=" + response[3] +
                " target='_blank'>" +
                "<img src='images/external.gif' alt='to wikipedia' class='external-img'></img>" +
                "</a></div>");

        }).catch(function (err) {
            console.log(err)

            infowindow.setContent('<div class="color-000"><b>' + marker.title +
                '</b></div>' + '<div class="color-000">' +
                marker.address + '</div>' +
                "<div class='color-000'><br>" +
                '\nCould not load Wikipedia content.</div>')
        });

        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
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


function contentUpdate() {
    
    const searchTerm = document.getElementById('filter').value.toLowerCase();

    const myDivider = document.getElementById("myDiv");
    let children = myDivider.childNodes;

    const refresh = document.getElementById("refresh");
    let count = 0;

    let value;


    if (searchTerm === '') {

        count = 9999;
        
        for (let i = children.length - 1; i >= 0; i--) {
            markers[i].setMap(map);
            children[i].style.display = 'block';
        };

    } else {

        

        for (let i = children.length - 1; i >= 0; i--) {

            if (markers[i].title.toLowerCase().indexOf(searchTerm) > -1) {

                markers[i].setMap(map);
                children[i].style.display = 'block';
                count++;
                value = i;

            } else {
                markers[i].setMap(null);
                children[i].style.display = 'none';
            }

        }

    }
    console.log(`count: ${count}`)
    
    if (count === 1) {
        children[value].click();
    }
    
    refresh.style.display = (count === 0)?'block':'none';
    // markers.forEach((marker) => {});
}


function refreshFilter() {
    document.getElementById('filter').value = '';
    contentUpdate()
}
