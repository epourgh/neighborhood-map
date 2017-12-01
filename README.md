#### Author: ampourgh | Version: 2.0.0 | Last Modified: 9/17/2017

# Project 5 — Neighborhood Map

## Getting Started

### Prerequisites
All the files included in the map/ file, including:
* index.html
* SimpleHTTPServer.py
* js folder - which includes the Google Maps API and contentStyle.json
* css folder - the layout of index.html
* img folder - which includes 5 images used for the sidebar
* lib doler - conatins the 2 extensions used for the project; knockout-3.4.2 and jquery-3.2.1.min

Along with:
* Git command line
* Python 3.61

### Installing
1. Fork the catalog folder
2. Copy the link of the fork
3. In Git, use the clone command as so: git clone 

```git 
<forked url> <folder name>
```

OR

Directly download the folder.

### Booting up webpage on localhost
Boot up Git Bash and navigate to where the Neighborhood_Map folder is, click on the folder and use the command ls to make sure SimpleHTTPServer.py is present. From there, use the following command to start server port 8000:
```git
python SimpleHTTPServer.py
```
If the following message appears, the webpage is connected onto localhost.

"SUCCESSFULLY CONNECTED!
serving at port 8000, access the page at: http://localhost:8000"

As such, navigate to the following address on a browser: http://localhost:8000

### Neighborhood_Maps Knockout.js' MVVM Breakdown
The project uses Knockout.js' MVVM model, with the model, view and view model. Index.html includes the veiw, with how the information is embeded and displayed page. This includes the list of locations, the search filter that changes what information is displayed in the list, and the refresh display when the filter runs out of items to display. The model is located within js/googleMapsAPI.js' file under the variable locations. Each item in the locations' array is the property of a marker in the map, which are pushed to display the their respctive markers and for the usage of the view model. The view model is located lower down the same JavaScript file, and gives all the functionality that is visually depicted by the view.

### Wikipedia API
Within js/googleMapsAPI.js, each marker property has a Wiki title which is based on what the Wikipedia's title is. Occasionally the title between the Wikipedia and the name of the location are the same, but there are times where the title and Wiki title are different, causing the AJAX  request not to return the Wiki content. Within the populateInfoWindow function, the Ajax request is made to retrieve the introductory information of the Wiki page and a link to the Wiki page.

### Marker Icon and Animation
The marker's icon is set to be a colored dot instead of the standard marker icon that accompanies Google Maps. The marker has an animation when clicked that lasts for a short period of time. 

### Importing Map's Color Template
Near the top of js/googleMapsAPI.js, there's a getJSON jquery request to import the the json style sheet for the use of the map's colors. This information is then sent to the styles property of the Maps variable.

### Google Error
If the the page cannot access the Google Maps API, the google error display will show up on the page, notifying the trouble of accessing Google Maps. The error is binded on the Google Maps API key on Index.html, and the error's function can be found at the end of js/googleMapsAPI.js.

### Acknowledgments
* https://www.shareicon.net for icons used for the project
* Udacity's google maps, cat clicker and wikipedia/NYTimes articles tutorials for the initial structure of the map layout, the MVVM template and two APIs used on the project
* used knockoutjs.com documentation to create the filter and the visibility of the 'NO FILTER RESULTS.' section
* Jason Chan's tutorial on 'Wikipedia Search API Javascript AJAX call GET' to get the wikipedia title and URL
* w3schools.com for the CSS used to create the dropdown for the <= 800px hamburger filter, along with CSS tweaks such as the gradiant transition for the dropdown
* css-tricks.com for addditional modifications to the CSS
* developers.google.com for the night time template, CIRCLE markers, fullscreen option and marker animation
* KudVenKat's number of tutorials of coding and loading error handlers
* stackoverflow.com for the code snippets used for the short animation and for the syntax for unwrapping observables
