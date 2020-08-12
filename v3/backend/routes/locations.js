const router = require('express').Router();
let Locations = require('../models/locations.model');

router.route('/').get((req, res) => {
    Locations.find()
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err));
});

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