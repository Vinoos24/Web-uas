// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

if (toggle && navigation && main) {
toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
}