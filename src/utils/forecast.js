const request = require('request');

const forecast = (latitude, longitude, callback) =>{
    const url = 'https://api.darksky.net/forecast/61f825273269371b024d35752ec1d61b/' + 
    encodeURIComponent(latitude) + ',' +  encodeURIComponent(longitude) +'?units=si&lang=de';

    request({ url, json: true}, (error, response) => {
        const { error:responseError, currently, daily } = response.body;
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (responseError) {
            callback(response.body.error, undefined)
        } else {
            const degrees = currently.temperature;
            const rainChance = currently.precipProbability;
            callback(undefined, daily.data[0].summary + ' Es ist gerade ' + degrees + ' Grad. Es gibt eine ' + rainChance + ' % Regenwahrscheinlichkeit.')
        }
    });
};




module.exports = forecast