import React, {Component} from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';
let stylesDay = require('../json/content-style-day.json');
let stylesNight = require('../json/content-style-night.json');


const Mode = props => (props.mode === 'day')?<FontAwesomeIcon icon={faSun} />:<FontAwesomeIcon icon={faMoon} />;
const FilterBoolean = props => (props.boolean === true)? '':'empty';

export default class Locations extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            locations: [],
            filter:[],
            filterBoolean: true, 
            mode: 'night',
            markers: []
        }
    }
    
    componentDidMount() {
       axios.get('http://localhost:5000/locations/')
           .then(response => {
                // this.state.Locations(response.data);
               this.setState({
                   locations: response.data,
                   filter: response.data
               })
           })
           .catch((error) => {
               console.log(error);
           })
    }

    handleChange (e) {
        let modeChange = (this.state.mode === 'night') ? 'day' : 'night';
        this.setState({ mode: modeChange });
    }
    


    showChoices = () => {
        console.log(this.state.locations)
    }

    contentUpdate = e => {
        let searchTerm = e.target.value;
        let filtering = []
        let count = 0;

        if (searchTerm === '') {

            count = 9999;

            this.setState({
                filter: this.state.locations,
                filterBoolean: true
            })

            console.log('show all')
        } else {

            for (let i = this.state.locations.length - 1; i >= 0; i--) {

                if (this.state.locations[i].title.toLowerCase().indexOf(searchTerm) > -1) {

                    filtering.push(this.state.locations[i]);
                    count += 1;

                }

            }

            this.setState({
                filter: filtering,
                filterBoolean: true
            })

            if (count === 0) {
                this.setState({
                    filterBoolean: false
                })
            }
        }
    }

    render() {
        return (
            <>
                <div id="options-box" className="options-box">

                    <span onClick={() => this.handleChange()} className="icon-mode-style">
                        <Mode mode={this.state.mode} />
                    </span>

                    <br />
                    <h1>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        locations
                    </h1>

                    <div className="filter">
                        <i onClick={this.showChoices} className="fas fa-bars mobile-hamburger"></i>
                        <input type="text" className="filter-input" onKeyUp={this.contentUpdate} type="text" /> 

                        <span><FontAwesomeIcon icon={faSearch} /></span>
                    </div>

                    <FilterBoolean boolean={this.state.filterBoolean} />

                    {
                        this.state.filter.map(location => {
                            return (
                                <p key={location._id}>
                                    {location.title}
                                </p>
                            )
                        })
                    }

                </div>

            </>
        )
    }

}