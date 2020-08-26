import React, {Component} from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faSearch, faMapMarkerAlt, faBars} from '@fortawesome/free-solid-svg-icons'
import InfoWindowEx from './infoWindowEx'
import axios from 'axios';

let stylesDay = require('../json/content-style-day.json');
let stylesNight = require('../json/content-style-night.json');

let mapOptions = (function () {
    if (localStorage.getItem("mapOptions") !== null) {
        console.log('EXISTS');
        return localStorage.getItem("mapOptions");

    } else {
        console.log('!EXISTS');
        localStorage.setItem("mapOptions", 'stylesnight');
        return 'stylesnight';
    }
})();

const ModeMapBg = (mapOptions === '"stylesday"')?stylesDay:stylesNight;
let ModeSideBg = (mapOptions === '"stylesday"') ? `options-box stylesday` : `options-box stylesnight`;
let dropdownBg = (mapOptions === '"stylesday"') ? 'dropdown-bg-day' : 'dropdown-bg-night';

const Mode = props => (props.mode === '"stylesday"') ? < FontAwesomeIcon icon = {faSun}/>:<FontAwesomeIcon icon={faMoon}/>;
const FilterBoolean = props => {
    if (props.boolean === false) {
        return (
            <p>empty</p>
        );
    } else {
        return <></>;
    }
}


export class Locations extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            locations: [],
            filtered: {
                locations: [],
                moreThanOneResult: true
            },
            markers: [],
            markerObjects: [],
            mode: mapOptions,
            wiki: '',
            selected: {
                infoWindow: false,
                place: {},
                active: {},
            },
            dropdown: {
                content: 'dropdown-content-1',
                classes: ''
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.onMarkerMounted = element => {
            this.setState(prevState => ({
                markerObjects: [...prevState.markerObjects, element]
            }))
        }
    }
    
    componentDidMount() {

        const content = this.state.dropdown.content;

        this.setState({
            dropdown: {
                content,
                classes: `${content} ${dropdownBg}`
            }
        });


       axios.get('http://localhost:5000/locations/')
           .then(response => {
                // this.state.Locations(response.data);
               this.setState({
                   locations: response.data
               })

               let filtering = [];
                for (let i = 0; i < response.data.length; i++) {
                    filtering.push({
                        id: i,
                        content: this.state.locations[i]
                    });
                }

                this.setState({
                    filtered: {
                        locations: filtering,
                        moreThanOneResult: true
                    },
               })

           })
           .catch((error) => {
               console.log(error);
           })

       axios.get('http://localhost:5000/locations/wiki/')
            .then(response => {
                   console.log(response.data);
                   this.setState({
                       wiki: response.data
                   })
            }).catch((error) => {
                console.log(error);
            })
    }

    handleChange (e) {
        let modeChange = (this.state.mode === 'night') ? 'day' : 'night';
        this.setState({ mode: modeChange });
    }
    


    showChoices = () => {
        let content = (this.state.dropdown.content === 'dropdown-content-1')?'dropdown-content-2':'dropdown-content-1';

        console.log(this.state.dropdown)
        console.log(content)

        this.setState({
            dropdown: {
                content,
                classes: `${content} ${dropdownBg}`
            }
        });
    }

    contentUpdate = e => {
        let searchTerm = e.target.value;
        let filtering = []
        let count = 0;

        if (searchTerm === '') {

            count = 9999;

            for (let i = this.state.locations.length - 1; i >= 0; i--) {
                filtering.push({id: i, content: this.state.locations[i]});
            }

            this.setState({
                filtered: {
                    locations: filtering,
                    moreThanOneResult: true
                }
            })

            console.log('show all')
        } else {

            for (let i = this.state.locations.length - 1; i >= 0; i--) {

                if (this.state.locations[i].title.toLowerCase().indexOf(searchTerm) > -1) {

                    filtering.push({id: i, content: this.state.locations[i]});
                    count += 1;

                }

            }

            this.setState({
                filtered: {
                    locations: filtering,
                    moreThanOneResult: true
                }
            })

            if (count === 1) {
                this.onMarkerClick(this.state.markerObjects[this.state.filtered.locations[0].id].props, this.state.markerObjects[this.state.filtered.locations[0].id].marker)
            }

            if (count === 0) {
                this.setState({
                    filtered: {
                        locations: [],
                        moreThanOneResult: false
                    }
                })
            }
        }
    }

    onMarkerClick = (props, marker) => {
        console.log(window.parent.google.maps.Marker)
        console.log(props)

        marker.icon.scaledSize = {
            width: 50,
            height: 50
        }
        marker.icon.size = {
            width: 50,
            height: 50
        }
        
        console.log(marker.icon)
        // this.props.google.maps.Size(15, 15)

        this.setState({
            selected: {
                infoWindow: true,
                place: props.value,
                active: marker,
            }
        })
    }


    displayMarkers = () => {

        const markerIcon = (this.state.mode === '"stylesday"') ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Location_dot_black.svg/1024px-Location_dot_black.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Location_dot_cyan.svg/1200px-Location_dot_cyan.svg.png";

        const iconMarker = new window.google.maps.MarkerImage(
            markerIcon,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            new this.props.google.maps.Point(32, 32), /* anchor is bottom center of the scaled image */
            new this.props.google.maps.Size(15, 15)
        );

        let markersJsx = []
        
        this.state.filtered.locations.forEach(location => {
            markersJsx.push(<Marker 
                        ref={this.onMarkerMounted}
                        key={location.content._id}
                        id={location.content._id} 
                        value={location.content}
                        icon = {iconMarker}
                        position = {
                                {
                                    lat: location.content.coordinates.lat,
                                    lng: location.content.coordinates.lng
                                }
                            }
                            onClick={this.onMarkerClick}
                    />);
            

        })

        return markersJsx;
    }


    displayLinks = () => {

        let markers = this.state.markerObjects;
        let newLocations = [];

        if(this.state.filtered.locations[0]!==undefined) {
            for (let i = 0; i <= this.state.filtered.locations.length - 1; i++) {
                newLocations.push(<p><a href="#" onClick={() => this.onMarkerClick(markers[this.state.filtered.locations[i].id].props, markers[this.state.filtered.locations[i].id].marker)}>{this.state.filtered.locations[i].content.title}</a></p>);
            }

        }

        return newLocations;
        
    }

    changeMode = () => {
        mapOptions = (this.state.mode == '"stylesnight"') ? 'stylesday' : 'stylesnight';

        localStorage.setItem("mapOptions", JSON.stringify(mapOptions));
        window.location.reload();
    }

    render() {
        return (
            <>
                <div id="options-box" className={ModeSideBg}>

                    <span onClick={() => this.changeMode()} className="icon-mode-style">
                        <Mode mode={this.state.mode} />
                    </span>

                    <br />

                    <div className="filter">
                        <h2>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />&nbsp;
                            locations
                        </h2>

                        <FontAwesomeIcon icon={faBars} onClick={this.showChoices} className="mobile-hamburger" />
                        &nbsp;&nbsp;
                        <input type="text" className="filter-input" onKeyUp={this.contentUpdate} type="text" /> 
                        &nbsp;&nbsp;
                        <span><FontAwesomeIcon icon={faSearch} /></span>
                    </div>

                    
                    <div className={this.state.dropdown.classes}>
                        <div className="myDiv">
                            <FilterBoolean boolean={this.state.filtered.boolean} />
                            {this.displayLinks()}
                        </div>
                    </div>

                </div>
                <Map
                    google={this.props.google}
                    zoom={10}
                    styles={ModeMapBg}
                    className="map"
                    initialCenter = {
                        {
                            lat: 29.496698,
                            lng: -95.38426199999999
                        }
                    }
                    defaultCenter = {
                        {
                            lat: 29.496698,
                            lng: -95.38426199999999
                        }
                    }
                    position = {
                        {
                            lat: 29.496698,
                            lng: -95.38426199999999
                        }
                    }
                    >
                    {this.displayMarkers()}
                    <InfoWindowEx marker={this.state.selected.active} visible={this.state.selected.infoWindow}>
                        <div>
                            <h1>{this.state.selected.place.title}</h1>
                            <p>{this.state.selected.place.address}</p>
                            <p>{this.state.wiki[this.state.selected.place._id]}</p>
                        </div>
                    </InfoWindowEx>
                </Map>

            </>
        )
    }

}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyD5Ppf6iBwfPB6w6baG4sUSJAtIF4GMhQw'
})(Locations);