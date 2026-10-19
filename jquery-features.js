// jQuery: hide and show the list of what I have used, with a slide effect.
$(function () {
  $("#toggle-list").on("click", function () {
    var button = $(this);
    var list = $("#used-list");
    var willHide = list.is(":visible");

    list.slideToggle(300, function () {
      button.text(willHide ? "Show list" : "Hide list");
      button.attr("aria-expanded", willHide ? "false" : "true");
    });
  });
});
