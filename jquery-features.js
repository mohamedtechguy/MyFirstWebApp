// jQuery: hide and show the list of what I have used, with a slide effect.
$(function () {
  $("#toggle-list").on("click", function () {
    var button = $(this);
    var list = $("#used-list");

    list.slideToggle(300, function () {
      // Read the real state after the slide has finished, so the button always matches the list.
      var open = list.is(":visible");
      button.text(open ? "Hide list" : "Show list");
      button.attr("aria-expanded", open ? "true" : "false");
    });
  });
});
