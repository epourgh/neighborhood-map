import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';


const Location = props => {

    return (
        <p>
            <FontAwesomeIcon icon={faMoon} />
            <FontAwesomeIcon icon={faSun} />
            {props.location.title}
        </p>
    )
}

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [mode, setMode] = useState('night');

    useEffect(() => {
        axios.get('http://localhost:5000/locations/')
            .then(response => {
                setLocations(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    const idvalue = '5e640fd46ebda9d56c1bc79b';

    const locationList = () => {
        return locations.map(location => {
            return <Location location={location} setLocations={setLocations} locations={locations} key={location._id} />;
        })
    }
    const changeAppearance = () => {
        let changedMode = (mode == 'night')?'day':'night';
        setMode(changedMode)
    }

    return (
        <div id="options-box" className="options-box">
            <span onClick={() => changeAppearance()} class="icon-mode-style" id='template-mode'>{mode} mode</span>
            <br />
            <h1>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                locations
            </h1>

            <div className="filter">
                <i onclick="showChoices()" className="fas fa-bars mobile-hamburger"></i>
                <input id="filter" className="filter-input" onkeyup="contentUpdate()" type="text" /> 

                <span><FontAwesomeIcon icon={faSearch} /></span>
            </div>
            {locationList()}
        </div>
    )

}