// Helper: show a Bootstrap alert inside a container (textContent keeps typed text as plain text).
function showAlert(container, type, text) {
  var box = document.createElement("div");
  box.className = "alert alert-" + type + " mt-3 mb-0";
  box.textContent = text;
  container.replaceChildren(box);
}

// Feedback form: Bootstrap shows the error messages, this code runs the browser check and shows the result.
(function () {
  var form = document.getElementById("feedback");
  var nameInput = document.getElementById("name");
  var comments = document.getElementById("comments");
  var counter = document.getElementById("counter");
  var result = document.getElementById("result");

  comments.addEventListener("input", function () {
    counter.textContent = comments.value.length + " of 200 characters";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    result.replaceChildren();

    // minlength counts spaces, so check the trimmed name as well.
    nameInput.setCustomValidity(nameInput.value.trim().length < 2 ? "Too short" : "");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.querySelector(":invalid").focus();
      return;
    }
    form.classList.remove("was-validated");

    var topic = document.getElementById("topic");
    var readable = form.querySelector('input[name="readable"]:checked');
    var message = "Thank you, " + nameInput.value.trim() + ". Your favourite topic is " +
      topic.options[topic.selectedIndex].text + " and you said the page is " +
      (readable.value === "yes" ? "easy" : "not easy") + " to read on your device.";
    if (document.getElementById("updates").checked) {
      message += " I will tell you about new versions.";
    }
    if (comments.value.trim() !== "") {
      message += " You wrote: \"" + comments.value.trim() + "\"";
    }
    showAlert(result, "success", message);
    form.reset();
    counter.textContent = "0 of 200 characters";
  });
})();

// Learning log: DOM methods, with Bootstrap classes for the look.
(function () {
  var input = document.getElementById("log-input");
  var list = document.getElementById("log-list");
  var count = document.getElementById("log-count");
  var error = document.getElementById("log-error");

  function updateCount() {
    var total = list.children.length;
    var done = list.querySelectorAll("input:checked").length;
    count.textContent = total + (total === 1 ? " item, " : " items, ") + done + " done";
  }

  function addItem() {
    var text = input.value.trim();
    if (text === "") {
      error.textContent = "Please type something to add.";
      input.classList.add("is-invalid");
      input.focus();
      return;
    }
    error.textContent = "";
    input.classList.remove("is-invalid");

    var li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-2";
    var box = document.createElement("input");
    box.type = "checkbox";
    box.className = "form-check-input m-0";
    box.setAttribute("aria-label", "Mark done: " + text);
    var span = document.createElement("span");
    span.className = "flex-grow-1";
    span.textContent = text;
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-sm btn-outline-danger";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove: " + text);

    box.addEventListener("change", function () {
      span.classList.toggle("text-decoration-line-through", box.checked);
      span.classList.toggle("text-body-secondary", box.checked);
      updateCount();
    });
    remove.addEventListener("click", function () {
      li.remove();
      updateCount();
      input.focus();
    });

    li.append(box, span, remove);
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
    list.replaceChildren();
    updateCount();
  });
})();

// Weather: the same fetch code as the original page, with a Bootstrap spinner and alerts.
(function () {
  var button = document.getElementById("weather-btn");
  var output = document.getElementById("weather-result");
  var url = "https://api.open-meteo.com/v1/forecast?latitude=53.38&longitude=-1.47" +
    "&current=temperature_2m,wind_speed_10m,weather_code&timezone=Europe%2FLondon";
  var conditions = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "fog", 48: "fog", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 71: "light snow", 73: "snow",
    75: "heavy snow", 80: "rain showers", 81: "rain showers", 82: "heavy rain showers",
    95: "thunderstorm"
  };

  async function getWeather() {
    button.disabled = true;
    showAlert(output, "secondary", "Loading the weather...");
    try {
      var response = await fetch(url);
      if (!response.ok) {
        throw new Error("The weather service replied with status " + response.status);
      }
      var data = await response.json();
      var now = data.current;
      var text = conditions[now.weather_code] || "conditions not listed (code " + now.weather_code + ")";
      showAlert(output, "info", "Sheffield now: " + now.temperature_2m + " " + data.current_units.temperature_2m +
        ", wind " + now.wind_speed_10m + " " + data.current_units.wind_speed_10m + ", " + text + ".");
    } catch (problem) {
      showAlert(output, "warning", "Sorry, the weather could not be loaded. Please try again later.");
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener("click", getWeather);
})();
