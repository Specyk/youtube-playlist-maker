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

  const scanStrategies = new Map(
    Object.entries(
      // page path : selector
      {
        "/": "#video-title-link",
        default: "#video-title",
      }
    )
  );

  const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
  const makeIdsList = (links) => links.map((link) => getVideoId(link)); // return youtube video ids[]
  const createPlaylistLink = (ids) => baseUrl + ids.join(","); // return youtube playlist link

  const scan = (DOM, locationSelector) =>
    Array.from(DOM.querySelectorAll(scanStrategies.get(locationSelector))); // return array of HTML elements
  const getYtUrls = (htmlElements) => htmlElements.map((htmlEl) => htmlEl.href); // return youtube video urls[]

  const addExtraBtn = (btn, DOM) =>
    DOM.querySelector("ytd-app").querySelector("#buttons").appendChild(btn);

  function getVideoId(link) {
    let startIndex = link.indexOf("=") + 1;
    return link.substring(startIndex).substr(0, 11); // id
  }

  function makePlaylist(dom, location) {
    let htmlElements = scan(dom, location);
    let ytLinks = getYtUrls(htmlElements);
    let ids = makeIdsList(ytLinks);
    let playlistLink = createPlaylistLink(ids);
    window.location.href = playlistLink;
  }

  function goToPlaylist() {
    if (scanStrategies.get(location.pathname)) {
      makePlaylist(document, location.pathname);
    } else {
      makePlaylist(document, "default");
    }
  }

  setTimeout(() => {
    main();
  }, 500);

  function main() {
    const toPlaylistBtn = document.createElement("span");
    toPlaylistBtn.innerHTML = `<img style = 'width: 30px; height: 30px; cursor: pointer' src = 'https://pngimage.net/wp-content/uploads/2018/06/play-button-white-png-2.png'>`;
    toPlaylistBtn.addEventListener("click", (e) => {
      goToPlaylist();
    });

    addExtraBtn(toPlaylistBtn, document);

    document.querySelector("ytd-app").addEventListener("yt-navigate", () => {
      // Issue: button doesn't append, rpobably assosiated with DOM reload
      addExtraBtn(toPlaylistBtn, document);
      console.log("@@@ App navigated");
      console.log(document.querySelector("ytd-app").querySelector("#buttons"));
    });
  }
})();
