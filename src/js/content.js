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

function onLoadedPage() {
    injectIcons();

    document.querySelector('.T-I.T-I-KE.L3').addEventListener('click', () => {
        injectIcons();
    })
}

function createCloudIcon(element, index) {
    let cloudContainer = document.createElement('div')
    cloudContainer.className = 'weather-lord___cloud-container';
    cloudContainer.setAttribute('data-extension-injected', '' + index + '')

    let hoverText = document.createElement('span')
    hoverText.className = 'weather-lord___cloud-hover';
    hoverText.textContent = 'Add weather into a message'

    let cloudIcon = document.createElement('img');
    cloudIcon.src = 'https://simpleicon.com/wp-content/uploads/cloud.png';
    cloudIcon.className = 'weather-lord___cloud-icon';
    cloudIcon.setAttribute('data-extension-injected', '' + index + '')
    cloudIcon.alt = '';
    cloudContainer.appendChild(cloudIcon);
    cloudContainer.appendChild(hoverText);
    element.appendChild(cloudContainer);

    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "886705b4c1182eb1c69f28eb8c520e20";

    cloudContainer.addEventListener('click', (e) => {
        navigator.geolocation.getCurrentPosition((r) => {

            const lat = r.coords.latitude + 0.0201; //fit to value Nijnii Novgorod
            const lon = r.coords.longitude - 0.0452; //fit to value Nijnii Novgorod
            fetch(weatherApiUrl + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey, {}).then(function (resp) {
                return resp.json()
            }) // Convert data to json
                .then(function (data) {
                    const msgPopups = document.querySelectorAll('.iN');
                    if (msgPopups.length !== 0) {
                        msgPopups.forEach((popup, index) => {
                            if (popup.dataset.extensionInjected === e.target.dataset.extensionInjected) {
                                const textArea = popup.querySelector('.Am.Al.editable.LW-avf.tS-tW');
                                textArea.innerHTML += 'Now in ' + data.name + " " + data.weather[0].main.toLowerCase() + ", temperature: " + (Math.round(data.main.temp) - 273) + " ℃, feels like: " + (Math.round(data.main.feels_like) - 273) + " ℃";
                            }
                        })
                    }
                })
                .catch(function (e) {
                    // catch any errors
                    console.log("WeatherLordExtension error: " + e)
                });
        });
    })
}

function injectIcons() {
    const checkMsgPopups = setInterval(() => {
        const msgPopups = document.querySelectorAll('.iN');
        if (msgPopups.length !== 0) {
            msgPopups.forEach((popup, index) => {
                if (!popup.dataset.extensionInjected) {
                    const iconContainer = popup.querySelector('.bAK');
                    createCloudIcon(iconContainer, index);
                    popup.setAttribute('data-extension-injected', '' + index + '')
                }
            })

            clearInterval(checkMsgPopups);
        }
    }, 1000)
}

