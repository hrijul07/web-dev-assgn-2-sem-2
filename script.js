
const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#city");
const weatherInfo = document.querySelector(".info");
const historyList = document.querySelector(".searchHistory");
const consoleBox = document.querySelector("#consoleBox");

const apiKey = "f4b18f5584a32f586f3d97e8bd56429b"; 


const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


function logMessage(msg) {
    console.log(msg);

    const p = document.createElement("p");
    p.textContent = msg;

    consoleBox.appendChild(p);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchedCity = cityInput.value.trim();

    logMessage("Form submitted");
    logMessage("City entered: " + searchedCity);

    getdata(searchedCity);
});


async function getdata(searchedCity) {

    logMessage("Start Fetching");

    if (searchedCity) {
        try {
            logMessage("Before API call");

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apiKey}`
            );

            logMessage("After fetch() call (async)");

            const data = await response.json();

            logMessage("Response received");

            if (data.cod == 200) {

                logMessage("Data processed successfully");

                weatherInfo.innerHTML = `
                    <h2>Weather Info</h2>
                    <p>City: ${data.name}</p>
                    <p>Temperature: ${(data.main.temp - 273.15).toFixed(1)} °C</p>
                    <p>Weather: ${data.weather[0].main}</p>
                    <p>Humidity: ${data.main.humidity}</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;

                
                if (!searchHistory.includes(searchedCity)) {
                    searchHistory.push(searchedCity);
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                }

                showHistory();

            } else {
                logMessage("City not found or API error");

                weatherInfo.innerHTML = `
                    <h2>Weather Info</h2>
                    <p style="color:red;">${data.message}</p>
                `;
            }

        } catch (err) {
            logMessage("Error occurred: " + err.message);

            weatherInfo.innerHTML = `
                <p style="color:red;">Something went wrong</p>
            `;
        }
    }

    logMessage("End Fetching");
}


function showHistory() {
    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history.forEach((city) => {
        const btn = document.createElement("button");

        btn.textContent = city;

        btn.addEventListener("click", () => {
            logMessage("History clicked: " + city);
            getdata(city);
        });

        historyList.appendChild(btn);
    });
}


showHistory();
