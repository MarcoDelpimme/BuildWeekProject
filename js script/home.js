document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.querySelector(".checkbox");
  const button = document.querySelector(".button-page1");
  function updateButtonState() {
    if (checkbox.checked) {
      button.disabled = false;
      button.style.backgroundColor = "cyan";
      button.addEventListener("click", goToBenchmarkPage);
    } else {
      button.disabled = true;
      button.style.backgroundColor = "";
      button.removeEventListener("click", goToBenchmarkPage);
    }
  }
  function goToBenchmarkPage(event) {
    event.preventDefault();
    window.location.href = "./benchmark.html";
  }

  checkbox.addEventListener("change", updateButtonState);

  updateButtonState();
});
