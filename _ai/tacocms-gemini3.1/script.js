"use strict";

document.addEventListener("DOMContentLoaded", () => {
	// Smooth scrolling for navigation links
	const navLinks = document.querySelectorAll(".nav-links a");

	navLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			const targetId = link.getAttribute("href");

			// Only handle internal # links
			if (targetId.startsWith("#")) {
				e.preventDefault();
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					window.scrollTo({
						top: targetElement.offsetTop - 80, // Offset for fixed headers if any
						behavior: "smooth",
					});
				}
			}
		});
	});

	// Simple interaction for Dashboard Mockup buttons
	const previewBtn = document.querySelector(".dashboard-header .btn-outline");
	const saveBtn = document.querySelector(".dashboard-header .btn-primary");

	if (previewBtn) {
		previewBtn.addEventListener("click", () => {
			previewBtn.textContent = "Loading...";
			setTimeout(() => {
				previewBtn.textContent = "Previewing!";
				setTimeout(() => (previewBtn.textContent = "Preview"), 2000);
			}, 800);
		});
	}

	if (saveBtn) {
		saveBtn.addEventListener("click", () => {
			const originalText = saveBtn.textContent;
			saveBtn.textContent = "Saving...";
			setTimeout(() => {
				saveBtn.textContent = "Saved!";
				saveBtn.style.backgroundColor = "#4caf50"; // Green color
				setTimeout(() => {
					saveBtn.textContent = originalText;
					saveBtn.style.backgroundColor = ""; // Revert to default
				}, 2000);
			}, 1000);
		});
	}
});
