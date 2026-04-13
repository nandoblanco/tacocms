"use strict";
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
if (navToggle && primaryNav) {
	navToggle.addEventListener("click", () => {
		const expanded = navToggle.getAttribute("aria-expanded") === "true";
		navToggle.setAttribute("aria-expanded", String(!expanded));
		primaryNav.classList.toggle("open");
	});
}
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		const targetId = link.getAttribute("href");
		if (targetId && targetId !== "#") {
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				event.preventDefault();
				targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	});
});
