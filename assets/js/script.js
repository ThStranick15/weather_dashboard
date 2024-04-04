const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiKey = '40fe7d425264123a1fd0fdf4d95d23a5'
const iconURL = 'https://openweathermap.org/img/wn'

function getCurrentWeatherByCity(cityName){
    const add = `/weather?q=${cityName}&appid=${apiKey}&units=imperial`
    const newURL = baseURL + add
    return $.get(newURL)
}

function outputCurrentWeatherData(weatherData){
    const name = weatherData.name
    const date = dayjs().format('MMM D, YYYY')
    const temp = weatherData.main.temp
    const hum = weatherData.main.humidity
    const wind = weatherData.wind.speed

    const icon = `/${weatherData.weather[0].icon}@2x.png`
    const iURL = iconURL + icon

    $('#current-name').text(`${name}`)
    $('#current-icon').attr("src", `${iURL}`)
    $('#current-icon-text').text('')
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
        const icon = `/${day.weather[0].icon}@2x.png`
        const iURL = iconURL + icon
        forecast.append(`
        <div class="d-flex flex-column bg-primary-subtle align-items-center rounded p-2 m-2">
        <p>${dayjs(day.dt_txt).format('MMM D, YYYY')}</p>
        <img src="${iURL}">
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

    pastWeather.forEach(function(element){
    searches.append(`
    <button class="past-button btn btn-outline-primary w-100 mt-2">${element}</button>
    `)})

    $('.past-button').on('click', addPastCity)
}

function addCity(e){
    e.preventDefault()
    const city = $('#city-input').val()
    $('#city-input').empty()
    console.log($('#city-input'))
    getCurrentWeatherByCity(city)
    .then(outputCurrentWeatherData)
    .then(getForecastWeather)
    .then(outputForecastWeather)
    .then(addPastSearches)

    $('.past-button').on('click', addPastCity)
}

function addPastCity(e){
    e.preventDefault()
    const pastCity = e.target
    const city = $(pastCity).text()
    getCurrentWeatherByCity(city)
    .then(outputCurrentWeatherData)
    .then(getForecastWeather)
    .then(outputForecastWeather)
}

function init(){
    $('#search').on('click', addCity)
    addPastSearches()
    
    
}

init()
