import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';
let stylesDay = require('../json/content-style-day.json');
let stylesNight = require('../json/content-style-night.json');


const Location = props => {

    return (
        <p>
            {props.location.title}
        </p>
    )
}

const Mode = props => {

    const changeAppearance = () => {
        let changedMode = (props.mode === 'night') ? 'day' : 'night';
        props.setMode(changedMode)
    }
    
    if (props.mode === 'day') {
        return (
            <span onClick={() => changeAppearance()} className="icon-mode-style">
                <FontAwesomeIcon icon={faSun} />
            </span>
            
        )
    } else {
        return (
            <span onClick={() => changeAppearance()} className="icon-mode-style">
                <FontAwesomeIcon icon={faMoon} />
            </span>
        )
    }
}

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [mode, setMode] = useState('night');
    let mapStyleSettings = (mode === 'night') ? stylesNight : stylesDay;
    let [markers, setMarkers] = useState([]);
    
    useEffect(() => {
        axios.get('http://localhost:5000/locations/')
            .then(response => {
                setLocations(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);


    const locationList = () => {
        return locations.map(location => {
            return <Location location={location} setLocations={setLocations} locations={locations} key={location._id} />;
        })
    }

    const showChoices = () => {
        console.log('choices')
    }

    const contentUpdate = () => {
        console.log('search')
    }

    return (
        <>
            <div id="options-box" className="options-box">
                <span  className="icon-mode-style" id='template-mode'></span>
                
                <Mode mode={mode} setMode={setMode}/>

                <br />
                <h1>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    locations
                </h1>

                <div className="filter">
                    <i onClick={() => showChoices()} className="fas fa-bars mobile-hamburger"></i>
                    <input id="filter" className="filter-input" onKeyUp={() => contentUpdate()} type="text" /> 

                    <span><FontAwesomeIcon icon={faSearch} /></span>
                </div>
                {locationList()}
            </div>
        </>
    )

}