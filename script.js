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
