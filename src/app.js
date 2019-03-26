const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(express.static(path.join(__dirname, '../public')));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Tim Sigl'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Tim Sigl'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is the help page!',
        title: 'Help',
        name: 'Tim Sigl'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: 'No address provided'
        });       
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tim Sigl',
        errorMessage: 'Help article not found.'
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a seach term!'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('*', (req, res) =>  {
    res.render('404', {
        title: '404',
        name: 'Tim Sigl',
        errorMessage: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});