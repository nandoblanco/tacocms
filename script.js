"use strict";

(function () {
	const menuButton = document.querySelector(".menu-toggle");
	const primaryNav = document.querySelector("#primary-nav");
	const scrollButtons = document.querySelectorAll("[data-scroll-target]");
	const revealBlocks = document.querySelectorAll(".reveal");
	const yearNode = document.querySelector("[data-year]");
	const videoTriggers = document.querySelectorAll("[data-lightbox-youtube]");
	const videoLightbox = document.querySelector('[data-video-lightbox="container"]');
	const videoBackdrop = document.querySelector('[data-video-lightbox="backdrop"]');
	const videoFrame = document.querySelector('[data-video-lightbox="frame"]');
	const videoCloseButton = document.querySelector('[data-video-lightbox="close"]');
	const videoDialog = videoLightbox ? videoLightbox.querySelector(".video-lightbox-dialog") : null;

	let lastFocusedElement = null;

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
	} else {
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
	}

	const getYouTubeEmbedUrl = function (urlValue) {
		if (!urlValue) {
			return "";
		}

		const normalizedSourceUrl = String(urlValue).trim();
		if (!normalizedSourceUrl) {
			return "";
		}

		let parsedUrl = null;
		try {
			parsedUrl = new URL(normalizedSourceUrl);
		} catch {
			const fallbackMatch = normalizedSourceUrl.match(
				/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{6,})/i,
			);
			if (!fallbackMatch || !fallbackMatch[1]) {
				return "";
			}

			const fallbackEmbedUrl = new URL("https://www.youtube.com/embed/" + fallbackMatch[1]);
			fallbackEmbedUrl.searchParams.set("autoplay", "1");
			fallbackEmbedUrl.searchParams.set("playsinline", "1");
			fallbackEmbedUrl.searchParams.set("rel", "0");
			return fallbackEmbedUrl.toString();
		}

		const hostName = parsedUrl.hostname.replace(/^www\./i, "").toLowerCase();
		const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
		let videoId = "";

		if (hostName === "youtu.be") {
			videoId = pathParts[0] || "";
		}

		if ((hostName === "youtube.com" || hostName.endsWith(".youtube.com")) && !videoId) {
			videoId = parsedUrl.searchParams.get("v") || "";
			if (!videoId && pathParts[0] === "embed") {
				videoId = pathParts[1] || "";
			}

			if (!videoId && pathParts[0] === "shorts") {
				videoId = pathParts[1] || "";
			}
		}

		const safeVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
		if (!safeVideoId) {
			return "";
		}

		const embedUrl = new URL("https://www.youtube.com/embed/" + safeVideoId);
		embedUrl.searchParams.set("autoplay", "1");
		embedUrl.searchParams.set("playsinline", "1");
		embedUrl.searchParams.set("rel", "0");
		return embedUrl.toString();
	};

	const getFocusableElements = function () {
		if (!videoDialog) {
			return [];
		}

		const focusableSelector = [
			"a[href]",
			"button:not([disabled])",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"[tabindex]:not([tabindex='-1'])",
		].join(",");

		return Array.from(videoDialog.querySelectorAll(focusableSelector)).filter(function (node) {
			return node instanceof HTMLElement && !node.hasAttribute("hidden");
		});
	};

	const closeVideoLightbox = function () {
		if (!videoLightbox || !videoFrame) {
			return;
		}

		videoLightbox.classList.remove("is-open");
		videoLightbox.hidden = true;
		videoLightbox.setAttribute("hidden", "hidden");
		videoLightbox.setAttribute("aria-hidden", "true");
		videoFrame.setAttribute("src", "");
		document.body.classList.remove("is-video-lightbox-open");

		if (lastFocusedElement instanceof HTMLElement) {
			lastFocusedElement.focus();
		}
	};

	const handleLightboxKeydown = function (event) {
		if (!videoLightbox || videoLightbox.hidden) {
			return;
		}

		if (event.key === "Escape") {
			event.preventDefault();
			closeVideoLightbox();
			return;
		}

		if (event.key !== "Tab") {
			return;
		}

		const focusableElements = getFocusableElements();
		if (focusableElements.length < 2) {
			return;
		}

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
			return;
		}

		if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	};

	document.addEventListener("keydown", handleLightboxKeydown);

	if (videoLightbox && videoBackdrop && videoFrame && videoCloseButton) {
		const openVideoLightboxFromTrigger = function (triggerNode, event) {
			const sourceUrl =
				triggerNode.getAttribute("data-lightbox-youtube") || triggerNode.getAttribute("href") || "";
			const embedUrl = getYouTubeEmbedUrl(sourceUrl);
			if (!embedUrl) {
				return;
			}

			if (event) {
				event.preventDefault();
			}
			lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			videoFrame.setAttribute("src", embedUrl);
			videoLightbox.hidden = false;
			videoLightbox.removeAttribute("hidden");
			videoLightbox.classList.add("is-open");
			videoLightbox.setAttribute("aria-hidden", "false");
			document.body.classList.add("is-video-lightbox-open");
			videoCloseButton.focus();
		};

		videoTriggers.forEach(function (triggerNode) {
			triggerNode.addEventListener("click", function (event) {
				openVideoLightboxFromTrigger(triggerNode, event);
			});
		});

		document.addEventListener("click", function (event) {
			const target = event.target;
			const clickElement =
				target instanceof Element
					? target
					: target instanceof Node && target.parentElement instanceof Element
						? target.parentElement
						: null;

			if (!clickElement) {
				return;
			}

			const triggerNode = clickElement.closest("[data-lightbox-youtube]");
			if (!(triggerNode instanceof Element)) {
				return;
			}

			openVideoLightboxFromTrigger(triggerNode, event);
		});

		videoBackdrop.addEventListener("click", closeVideoLightbox);
		videoCloseButton.addEventListener("click", closeVideoLightbox);
	}
})();
