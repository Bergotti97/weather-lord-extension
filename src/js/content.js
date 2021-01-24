/**
 * I think when will they update gmail, classes will change
 * That`s why i pull out selectors
 */
const newMsgBtnSelector = ".T-I.T-I-KE.L3";
const msgPopupSelector = ".iN";
const iconContainerSelector = ".bAK";
const msgTextareaSelector = ".Am.Al.editable.LW-avf.tS-tW";

/**
 * If we need to change hover text or image src
 */
cloudIconSrc = 'https://simpleicon.com/wp-content/uploads/cloud.png';
cloudHoverText = 'Add weather into a message';


/**
 * I use OpenWeatherMap Api
 * Pull out constants for east to change
 */
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "886705b4c1182eb1c69f28eb8c520e20";


/**
 * We need to do setInterval function, because Gmail is a SPA (single-page application),
 * to know when page is fully loaded
 */
const checkPageStatus = setInterval(() => {
    switch (document.readyState) {
        case "complete":
            onLoadedPage();
            console.log("Weather extension ready  (*_*)")
            clearInterval(checkPageStatus);
            break;

        default:
            console.log("Weather extension not ready yet ^_^")
    }
}, 1000)


/**
 * When we know, that page already loaded, we start injecting clod icon button
 */
function onLoadedPage() {
    injectIcons();

    document.querySelector(newMsgBtnSelector).addEventListener('click', () => {
        injectIcons();
    })
}

/**
 * After we click on new message button,
 * we have to wait when new message popup will be created,
 * so i add setInterval function,
 * we add data attribute to know, that script is injected
 */
function injectIcons() {
    const checkMsgPopups = setInterval(() => {
        const msgPopups = document.querySelectorAll(msgPopupSelector);
        if (msgPopups.length !== 0) {
            msgPopups.forEach((popup, index) => {
                if (!popup.dataset.extensionInjected) {
                    const iconContainer = popup.querySelector(iconContainerSelector);
                    createCloudIcon(iconContainer, index);
                    popup.setAttribute('data-extension-injected', '' + index + '')
                }
            })

            clearInterval(checkMsgPopups);
        }
    }, 1000)
}

/**
 * @param element is a new message popup element
 * @param index given to data extension-injected to unify new message popups
 */
function createCloudIcon(element, index) {
    let cloudContainer = document.createElement('div')
    cloudContainer.className = 'weather-lord___cloud-container';
    cloudContainer.setAttribute('data-extension-injected', '' + index + '')

    let hoverText = document.createElement('span')
    hoverText.className = 'weather-lord___cloud-hover';
    hoverText.textContent = cloudHoverText;

    let cloudIcon = document.createElement('img');
    cloudIcon.src = cloudIconSrc;
    cloudIcon.className = 'weather-lord___cloud-icon';
    cloudIcon.setAttribute('data-extension-injected', '' + index + '')
    cloudIcon.alt = '';
    cloudContainer.appendChild(cloudIcon);
    cloudContainer.appendChild(hoverText);
    element.appendChild(cloudContainer);

    cloudContainer.addEventListener('click', (event) => {
        getWeather(event);
    })
}

/**
 * OpenWeatherMap Api
 * Its a pretty simple and free api
 */
function getWeather(event) {
    navigator.geolocation.getCurrentPosition((r) => {
        const lat = r.coords.latitude + 0.0201; //fit to lat value of Nijnii Novgorod (because api is not perfect)
        const lon = r.coords.longitude - 0.0452; //fit to lon value of Nijnii Novgorod (because api is not perfect)
        fetch(weatherApiUrl + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey, {}).then(function (resp) {
            return resp.json()
        }).then(function (data) {
            const msgPopups = document.querySelectorAll(msgPopupSelector);
            if (msgPopups.length !== 0) {
                msgPopups.forEach((popup) => {
                    //Find correct message popup with data-extension-injected value
                    if (popup.dataset.extensionInjected === event.target.dataset.extensionInjected) {
                        const textArea = popup.querySelector(msgTextareaSelector);
                        const weather = data.weather[0].main.toLowerCase();
                        const temperature = (Math.round(data.main.temp) - 273); //API give temperature in K ( 1℃ = -273K)
                        const temperatureFeelsLike = (Math.round(data.main.feels_like) - 273); //API give temperature in K ( 1℃ = -273K)
                        textArea.innerHTML += 'Now in ' + data.name + " " + weather + ", temperature: " + temperature + " ℃, feels like: " + temperatureFeelsLike + " ℃";
                    }
                })
            }
        }).catch(function (e) {
            console.log("WeatherLordExtension error: " + e)
        });
    });
}