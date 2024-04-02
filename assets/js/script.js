const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiKey = '40fe7d425264123a1fd0fdf4d95d23a5'

function getCurrentWeatherByCity(cityName){
    const add = `/weather?q=${cityName}&appid=${apiKey}&units=imperial`
    const newURL = baseURL + add
    return $.get(newURL)
}

function outputCurrentWeatherData(weatherData){
    const name = weatherData.name
    const date = dayjs().format('MMM D, YYYY hh:mm a')
    const temp = weatherData.main.temp
    const hum = weatherData.main.humidity
    const wind = weatherData.wind.speed

    $('#current-name').text(`${name}`)
    $('#current-date').text(`${date}`)
    $('#current-temp').text(`${temp}`)
    $('#current-hum').text(`${hum}`)
    $('#current-wind').text(`${wind}`)


    let pastWeather = JSON.parse(localStorage.getItem('weather')) || []

    if(pastWeather.includes(name)){
        console.log(name)
        const index = pastWeather.indexOf(name)
        console.log(index)
        pastWeather.splice(index, 1)
    }

    pastWeather.push(name)

    localStorage.setItem('weather', JSON.stringify(pastWeather))

   

    return name
}

function getForecastWeather(cityName){
    const options = `/forecast?q=${cityName}&units=imperial&appid=${apiKey}`
    //`/forecast/daily?q=${cityName}&units=imperial&cnt=5&appid=${apiKey}`
    
    const url = baseURL + options
  
    return $.get(url)
}

function outputForecastWeather(forecastData){
    const forecast = $('#5-day')
    console.log(forecastData)
    forecast.text('')
    const list = forecastData.list
    for(let i = 0; i < 5; i++){
        const day = list[i*8]
        forecast.append(`
        <div class="d-flex flex-column bg-secondary-subtle p-2 m-2">
        <p>${dayjs(day.dt_txt).format('MMM D, YYYY hh:mm a')}</p>
        <p>Icon</p>
        <p>Temp: ${day.main.temp} deg</p>
        <p>Humidity: ${day.main.humidity}</p>
        <p>Wind Speed: ${day.wind.speed}</p>
        </div>
    `)
    }
    return forecastData.name
}

function addPastSearches(){
    const searches = $('#past-searches')
    searches.text('')

    const pastWeather = JSON.parse(localStorage.getItem('weather')) || []

    console.log(pastWeather)

    pastWeather.forEach(function(element){
    searches.append(`
    <button class="past-button btn btn-outline-primary w-100 mt-2">${element}</button>
    `)})
}

function addCity(e){
    e.preventDefault()
    const city = $('#city-input').val()
    getCurrentWeatherByCity(city)
    .then(outputCurrentWeatherData)
    .then(getForecastWeather)
    .then(outputForecastWeather)
    .then(addPastSearches)

    
}

function addPastCity(e){
    e.preventDefault()
    const city = e.target.val()
    console.log(city)
    getCurrentWeatherByCity(city)
    .then(outputCurrentWeatherData)
    .then(getForecastWeather)
    .then(outputForecastWeather)
}

function init(){
    $('#search').on('click', addCity)
    $('.past-button').on('click', addPastCity) //fix when it loads there are no buttons
}

init()
