// ==UserScript==
// @name         YouTube Playlist Maker
// @namespace    YouTubePlaylistMaker
// @version      0.21
// @description  It adds extra button to create a youtube playlist from videos on YouTube page
// @author       Emil Mordarski
// @match        https://www.youtube.com/*
// @grant        none
//
// ==/UserScript==

(function () {
	"use strict";

	const pageSelectionStrategy = {
		// page path : selector
		"/": "#video-title-link",
		default: "#video-title",
	}

	const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
	const makeIdsList = (links) => links.map((link) => getVideoId(link)); // return youtube video ids[]
	const createPlaylistLink = (ids) => baseUrl + ids.join(","); // return youtube playlist link

	const scan = (DOM, locationSelector) =>
		Array.from(DOM.querySelectorAll(pageSelectionStrategy[locationSelector])); // return array of HTML elements
	const getYtUrls = (htmlElements) => htmlElements.map((htmlEl) => htmlEl.href); // return youtube video urls[]

	const addExtraBtn = (btn, DOM) =>
		DOM.querySelector("ytd-app").querySelector("#buttons").appendChild(btn);

	function getVideoId(link) {
		let startIndex = link.indexOf("=") + 1;
		return link.substring(startIndex).substr(0, 11); // id
	}

	function makePlaylist(dom, locationName) {
		let htmlElements = scan(document, locationName);
		console.log(htmlElements)
		let ytLinks = getYtUrls(htmlElements);
		let ids = makeIdsList(ytLinks);
		let playlistLink = createPlaylistLink(ids);
		window.location.href = playlistLink;
	}

	function goToPlaylist() {
		console.log(`location.pathname = ${location.pathname}`)
		if (pageSelectionStrategy[location.pathname]) {
			makePlaylist(document, location.pathname);
		} else {
			makePlaylist(document, "default");
		}
	}

	main();

	const prepareBtn = () => {
		const toPlaylistBtn = document.createElement("span");
		toPlaylistBtn.id = "youtube-playlist-maker";
		toPlaylistBtn.innerHTML = `<img style = 'width: 30px; height: 30px; cursor: pointer' src = 'https://pngimage.net/wp-content/uploads/2018/06/play-button-white-png-2.png'>`;
		toPlaylistBtn.addEventListener("click", (e) => {
			goToPlaylist();
		});
		return toPlaylistBtn;
	};

	function main() {
		setInterval(() => {
			const ypmBtn = document.getElementById("youtube-playlist-maker");
			if (!ypmBtn) {
				const newToPlaylistBtn = prepareBtn();
				addExtraBtn(newToPlaylistBtn, document);
			}
		}, 1500);
	}
})();

