import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let city_name;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public", { extensions: ["html", "htm", "js"] }));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/weather", async (req, res) => {
  const yourAPIKey = "01a44fdb7e3a5559952e2fb751c037d2";
  city_name = req.body.city;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${yourAPIKey}&units=metric`;
  let weather;
  try {
    let result = await axios.get(`${API_URL}`);
    weather = result.data;
    console.log("data:", weather);
    res.render("index.ejs", {
      content: {
        city_name: weather.name,
        min_temp: weather.main.temp_min,
        max_temp: weather.main.temp_max,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed,
        weather: weather.weather[0].main,
        visibility: weather.visibility,
        icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.render("index.ejs", {
      content: null,
      error: "Error fetching weather data",
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
