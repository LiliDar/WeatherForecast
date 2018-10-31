var app = new Vue({

    el: '#app',

    data: {
        city: '',
        date: [],
        weatherArray: [],
        error: '',
        forecast: {
            24: [],
            48: [],
            72: [],
        },
        nextDays: [],
        currentDay: [],
        appear: false,
        name: '',
        show: true,

    },

    methods: {

        getWeatherData() {

            var input = document.getElementById('city')

            this.city = input.value;

            fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + this.city + '&APPID=6779a37f697006bac9ebdcad0f9c2980', {
                    "method": "GET",
                })
                .then(r => r.json())

                .then(json => {
                    console.log(json);
                    app.error = json.cod;
                    console.log(app.error)

                    if (app.error != '200') {
                        app.appear = true;
                        app.show = false;
                    } else {
                        app.appear = false;
                        app.show = true;
                    }

                    app.weatherArray = json.list;
                    console.log(app.weatherArray)

                    app.fillForecastObject();
                    app.fillNextDaysArray();
                    app.fillCurrentDayArray();

                    app.name = json.city.name;
                    console.log(app.name)

                })
        },

        fillForecastObject() {
            var dayOne = [];
            var dayTwo = [];
            var dayThree = [];

            for (let i = 0; i < this.weatherArray.length; i++) {
                if (i < 8) {
                    dayOne.push(this.weatherArray[i])
                } else if (i < 16 && i > 7) {
                    dayTwo.push(this.weatherArray[i])
                } else if (i < 24 && i > 15) {
                    dayThree.push(this.weatherArray[i])
                } else {
                    break
                }
                this.forecast["24"] = dayOne;
                this.forecast["48"] = dayTwo;
                this.forecast["72"] = dayThree;
            }
        },

        getForecastAverageTemp(time, type, data, nr, nr2, nr3) {
            var avgMain = 0;
            for (var i = 0; i < this.forecast[time].length; i++) {
                avgMain += this.forecast[time][i][data][type];
            }
            return Math.round((avgMain / 8 - [nr]) * nr2 + nr3);
        },


        fillNextDaysArray() {

            this.nextDays = [
                {
                    max: app.getForecastAverageTemp(24, "temp_max", "main", 273.15, 1, 0),
                    min: app.getForecastAverageTemp(24, "temp_min", "main", 273.15, 1, 0),
                    humidity: app.getForecastAverageTemp(24, "humidity", "main", 0, 1, 0),
                    clouds: app.getForecastAverageTemp(24, "all", "clouds", 0, 1, 0),
                    wind: app.getForecastAverageTemp(24, "speed", "wind", 0, 1, 0),
                                },
                {

                    max: app.getForecastAverageTemp(48, "temp_max", "main", 273.15, 1, 0),
                    min: app.getForecastAverageTemp(48, "temp_min", "main", 273.15, 1, 0),
                    humidity: app.getForecastAverageTemp(48, "humidity", "main", 0, 1, 0),
                    clouds: app.getForecastAverageTemp(48, "all", "clouds", 0, 1, 0),
                    wind: app.getForecastAverageTemp(48, "speed", "wind", 0, 1, 0),
                                },
                {
                    max: app.getForecastAverageTemp(72, "temp_max", "main", 273.15, 1, 0),
                    min: app.getForecastAverageTemp(72, "temp_min", "main", 273.15, 1, 0),
                    humidity: app.getForecastAverageTemp(72, "humidity", "main", 0, 1, 0),
                    clouds: app.getForecastAverageTemp(72, "all", "clouds", 0, 1, 0),
                    wind: app.getForecastAverageTemp(72, "speed", "wind", 0, 1, 0),
                                },
                            ]
        },

        fillCurrentDayArray() {

            this.currentDay = [
                {
                    temp: app.getForecastAverageTemp(24, "temp", "main", 273.15, 1, 0),
                    temp2: app.getForecastAverageTemp(24, "temp", "main", 273.15, 1.8, 32),
                    name: app.name,
                },
            ]
        },
    },
})
