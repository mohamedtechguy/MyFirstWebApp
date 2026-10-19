// Feedback form: check the answers, show errors, and show a result on the page.
var form = document.getElementById("feedback");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var comments = document.getElementById("comments");
var counter = document.getElementById("counter");
var result = document.getElementById("result");

function showError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  if (input) {
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }
}

// Live character counter for the comments box.
comments.addEventListener("input", function () {
  counter.textContent = comments.value.length + " of 200 characters";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  result.textContent = "";
  var ok = true;

  var name = nameInput.value.trim();
  if (name.length < 2) {
    showError(nameInput, "name-error", "Please enter your name (at least 2 characters).");
    ok = false;
  } else {
    showError(nameInput, "name-error", "");
  }

  var email = emailInput.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    showError(emailInput, "email-error", "Please enter an email address like name@example.com.");
    ok = false;
  } else {
    showError(emailInput, "email-error", "");
  }

  var readable = form.querySelector('input[name="readable"]:checked');
  if (!readable) {
    showError(null, "readable-error", "Please choose Yes or No.");
    ok = false;
  } else {
    showError(null, "readable-error", "");
  }

  if (!ok) {
    var firstBad = form.querySelector(".invalid");
    if (firstBad) { firstBad.focus(); }
    return;
  }

  var topic = document.getElementById("topic");
  var topicText = topic.options[topic.selectedIndex].text;
  var message = "Thank you, " + name + ". Your favourite topic is " + topicText +
    " and you said the page is " + (readable.value === "yes" ? "easy" : "not easy") +
    " to read on your device.";
  if (document.getElementById("updates").checked) {
    message += " I will tell you about new versions.";
  }
  if (comments.value.trim() !== "") {
    message += " You wrote: \"" + comments.value.trim() + "\"";
  }
  result.textContent = message;
  form.reset();
  counter.textContent = "0 of 200 characters";
});
// Learning log: build and change the page with DOM methods.
(function () {
  var input = document.getElementById("log-input");
  var list = document.getElementById("log-list");
  var count = document.getElementById("log-count");
  var error = document.getElementById("log-error");

  function updateCount() {
    var total = list.querySelectorAll("li").length;
    var done = list.querySelectorAll("li.done").length;
    count.textContent = total + (total === 1 ? " item, " : " items, ") + done + " done";
  }

  function addItem() {
    var text = input.value.trim();
    if (text === "") {
      error.textContent = "Please type something to add.";
      input.focus();
      return;
    }
    error.textContent = "";

    var li = document.createElement("li");
    var box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.setAttribute("aria-label", "Mark done: " + text);
    var span = document.createElement("span");
    span.textContent = text;
    var remove = document.createElement("button");
    remove.setAttribute("type", "button");
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove: " + text);

    box.addEventListener("change", function () {
      li.classList.toggle("done", box.checked);
      updateCount();
    });
    remove.addEventListener("click", function () {
      list.removeChild(li);
      updateCount();
      input.focus();
    });

    li.appendChild(box);
    li.appendChild(span);
    li.appendChild(remove);
    list.appendChild(li);

    input.value = "";
    input.focus();
    updateCount();
  }

  document.getElementById("log-add").addEventListener("click", addItem);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { addItem(); }
  });
  document.getElementById("log-clear").addEventListener("click", function () {
    while (list.firstChild) { list.removeChild(list.firstChild); }
    updateCount();
  });
})();

// Weather: call a free API with fetch and show part of the JSON it returns.
(function () {
  var button = document.getElementById("weather-btn");
  var output = document.getElementById("weather-result");
  var url = "https://api.open-meteo.com/v1/forecast?latitude=53.38&longitude=-1.47" +
    "&current=temperature_2m,wind_speed_10m,weather_code&timezone=Europe%2FLondon";

  // The API sends a number (a WMO code) for the conditions, so I translate the common ones.
  var conditions = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "fog", 48: "fog", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 71: "light snow", 73: "snow",
    75: "heavy snow", 80: "rain showers", 81: "rain showers", 82: "heavy rain showers",
    95: "thunderstorm"
  };

  async function getWeather() {
    button.disabled = true;
    output.textContent = "Loading the weather...";
    try {
      var response = await fetch(url);
      if (!response.ok) {
        throw new Error("The weather service replied with status " + response.status);
      }
      var data = await response.json();
      var now = data.current;
      var text = conditions[now.weather_code] || "conditions not listed (code " + now.weather_code + ")";
      output.textContent = "Sheffield now: " + now.temperature_2m + " " + data.current_units.temperature_2m +
        ", wind " + now.wind_speed_10m + " " + data.current_units.wind_speed_10m + ", " + text + ".";
    } catch (problem) {
      output.textContent = "Sorry, the weather could not be loaded. Please try again later.";
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener("click", getWeather);
})();
