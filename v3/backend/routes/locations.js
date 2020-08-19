const router = require('express').Router();
const fetch = require("node-fetch");
let wikiTitles = require('../wikiTitles');
Locations = require('../models/locations.model');


router.route('/').get((req, res) => {

    Locations.find()
        .then(locationList => res.json(locationList))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/wiki', function (req, res) {
    var wikiApi = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1';
    let array = [];

    for (let i = 0; i < wikiTitles.length; i++) {
        array.push(fetch(`${wikiApi}&titles=${wikiTitles[i].title}`).then(value => value.json()))
    }

    Promise.all(array).then(function (data) {

        const regex = /.*?(\.)(?=\s[A-Z])/;
        let secondArray = {};
        let pageid;
        let page;
        let m;

        for (let i = 0; i < wikiTitles.length; i++) {
            pageid = Object.keys(data[i].query.pages)[0];
            page = data[i].query.pages[pageid].extract;

            if ((m = regex.exec(page)) !== null) {
                secondArray[wikiTitles[i]._id] = m[0];
            }

        }

        console.log(secondArray)
        res.send(secondArray);

    }).catch(function (err) {
        console.log('Fetch Error.', err);
    });
})

router.route('/add').post((req, res) => {

    var newLocations = new Locations({
        title: req.body.title,
        coordinates: {
            lat: Number(req.body.coordinates.lat),
            lng: Number(req.body.coordinates.lng)
        },
        address: req.body.address,
        wikiSearchParams: req.body.wikiSearchParams,
        yelpSearchParams: req.body.yelpSearchParams,
        dates: Date.parse(req.body.date)
    });

    newLocations.save()
        .then(() => res.json('Location added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Locations.findById(req.params.id)
        .then(location => res.json(location))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Locations.findByIdAndDelete(req.params.id)
        .then(() => res.json('Location deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Locations.findById(req.params.id)
        .then(location => {

            location = {
                title: req.body.title,
                coordinates: {
                    lat: Number(req.body.coordinates.lat),
                    lng: Number(req.body.coordinates.lng)
                },
                address: req.body.address,
                wikiSearchParams: req.body.wikiSearchParams,
                yelpSearchParams: req.body.yelpSearchParams,
                dates: Date.parse(req.body.date)
            };

            location.save()
                .then(() => res.json('Locations updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;