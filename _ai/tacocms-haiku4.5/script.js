"use strict";

document.addEventListener("DOMContentLoaded", function () {
	const navItems = document.querySelectorAll(".nav-item");

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			navItems.forEach((el) => el.classList.remove("active"));
			this.classList.add("active");

			const section = this.getAttribute("data-section");
			console.log("Navigated to:", section);
		});
	});

	const ctaButton = document.querySelector(".cta-button");
	if (ctaButton) {
		ctaButton.addEventListener("click", function () {
			alert("Welcome to TacoCMS! Get your free website building tools now.");
		});
	}

	const closeBtn = document.querySelector(".close-btn");
	if (closeBtn) {
		closeBtn.addEventListener("click", function () {
			const preview = document.querySelector(".taco-editor-preview");
			if (preview) {
				preview.style.opacity = "0.5";
			}
		});
	}

	const headerLinks = document.querySelectorAll(".header-nav a");
	headerLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			const href = this.getAttribute("href");
			if (href && href.startsWith("#")) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					target.scrollIntoView({ behavior: "smooth" });
				}
			}
		});
	});
});
