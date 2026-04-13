"use strict";

(function () {
	const menuButton = document.querySelector(".menu-toggle");
	const primaryNav = document.querySelector("#primary-nav");
	const scrollButtons = document.querySelectorAll("[data-scroll-target]");
	const revealBlocks = document.querySelectorAll(".reveal");
	const yearNode = document.querySelector("[data-year]");

	if (yearNode) {
		yearNode.textContent = String(new Date().getFullYear());
	}

	if (menuButton && primaryNav) {
		const closeMenu = function () {
			menuButton.setAttribute("aria-expanded", "false");
			primaryNav.classList.remove("is-open");
		};

		const openMenu = function () {
			menuButton.setAttribute("aria-expanded", "true");
			primaryNav.classList.add("is-open");
		};

		menuButton.addEventListener("click", function () {
			const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
			if (isExpanded) {
				closeMenu();
				return;
			}

			openMenu();
		});

		primaryNav.addEventListener("click", function (event) {
			const target = event.target;
			if (!(target instanceof Element)) {
				return;
			}

			if (!target.closest("a")) {
				return;
			}

			closeMenu();
		});

		document.addEventListener("click", function (event) {
			const target = event.target;
			if (!(target instanceof Element)) {
				return;
			}

			if (!primaryNav.classList.contains("is-open")) {
				return;
			}

			if (target.closest(".site-header")) {
				return;
			}

			closeMenu();
		});

		window.addEventListener("resize", function () {
			if (window.innerWidth >= 1024) {
				closeMenu();
			}
		});
	}

	scrollButtons.forEach(function (button) {
		button.addEventListener("click", function (event) {
			const targetSelector = button.getAttribute("data-scroll-target");
			if (!targetSelector) {
				return;
			}

			const targetSection = document.querySelector(targetSelector);
			if (!targetSection) {
				return;
			}

			event.preventDefault();
			targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	});

	revealBlocks.forEach(function (block, index) {
		block.style.setProperty("--reveal-order", String(index + 1));
	});

	if (!("IntersectionObserver" in window)) {
		revealBlocks.forEach(function (block) {
			block.classList.add("is-visible");
		});
		return;
	}

	const revealObserver = new IntersectionObserver(
		function (entries, observer) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
	);

	revealBlocks.forEach(function (block) {
		revealObserver.observe(block);
	});
})();
