$(document).ready(function () {
  let localStorageData = new Set(
    JSON.parse(localStorage.getItem("city")) || []
  );
  const apiKey = "e081906e41053d0045aef1f5836faf73";
  const historyContainer = $("#search-history");
  const forecastContainer = $("#forecastDays");

  function showHistory() {
    historyContainer.empty();
    localStorageData.forEach((data) => {
      const button = $("<button>")
        .addClass(
          "btn-history btn text-black btn-secondary font-weight-bold mb-2 mt-2"
        )
        .text(data)
        .attr("data-city", data)
        .on("click", function (event) {
          event.preventDefault();
          getApiData(data);
        });
      historyContainer.append(button);
    });
  }

  function getApiData(city) {
    const forecastData = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=6&appid=${apiKey}&units=imperial`;
    fetch(forecastData)
      .then((response) => response.json())
      .then((data) => {
        localStorageData.add(data.city.name);
        localStorage.setItem(
          "city",
          JSON.stringify(Array.from(localStorageData))
        );
        loadMainWeather(data);
        loadForecastWeather(data);
      })
      .catch((error) => {
        console.log(error);
        alert("An error occurred while fetching weather data.");
      });
  }

  function loadMainWeather(data) {
    const now = dayjs().format(" (M/DD/YYYY)");
    const mainName = $("<div>")
      .attr("id", "main-name")
      .text(data.city.name + now);
    const mainIcon = $("<img>")
      .attr("id", "main-icon")
      .attr("src", getWeatherIcon(data.list[0].weather[0].icon));
    const mainTemp = $("<div>")
      .attr("id", "main-temp")
      .text("Temp: " + data.list[0].temp.day + " F");
    const mainWind = $("<div>")
      .attr("id", "main-wind")
      .text("Wind: " + data.list[0].speed + " mph");
    const mainHumidity = $("<div>")
      .attr("id", "main-humidity")
      .text("Humidity: " + data.list[0].humidity + " %");
    $("#mainWeather").html([
      mainName,
      mainIcon,
      mainTemp,
      mainWind,
      mainHumidity,
    ]);
  }

  function loadForecastWeather(data) {
    forecastContainer.empty();
    for (let i = 1; i <= 5; i++) {
      const card = $("<div>")
        .addClass("card border-2 rounded-2 border-dark me-3 text-light mb-4")
        .css("width", "11rem");
      const cardBody = $("<div>").addClass("card-body").attr("id", `card${i}`);
      const day = $("<div>").addClass("day").text(formatDate(data.list[i].dt));
      const icon = $("<img>")
        .addClass("icon")
        .attr("src", getWeatherIcon(data.list[i].weather[0].icon));
      const temp = $("<div>")
        .addClass("temp")
        .attr("id", `temp${i}`)
        .text(`Temp: ${data.list[i].temp.day} F`);
      const wind = $("<div>")
        .addClass("wind")
        .attr("id", `wind${i}`)
        .text(`Wind: ${data.list[i].speed} mph`);
      const humidity = $("<div>")
        .addClass("humidity")
        .attr("id", `humidity${i}`)
        .text(`Humidity: ${data.list[i].humidity} %`);
      cardBody.append(day, icon, temp, wind, humidity);
      card.append(cardBody);
      forecastContainer.append(card);
    }
  }

  function formatDate(dt) {
    return dayjs.unix(dt).format("M/DD/YYYY");
  }

  function getWeatherIcon(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  }

  $(".btn").on("click", function (event) {
    event.preventDefault();
    const searchCity = $("#city").val();
    $("#city").val("");
    getApiData(searchCity);
    showHistory();
  });

  // Initial call to display search history
  showHistory();
});
