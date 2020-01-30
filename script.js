// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script adds "play" button which creates a playlist from videos on page feed/subscriptions
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
    const makeIdsList = links => links.map(link => getVideoId(link)); // return youtube video ids[]
    const createPlaylistLink = ids => baseUrl + ids.join(','); // return youtube playlist link
    const scan = DOM => scanStrategies.map(makeItems => makeItems(DOM)).flatMap(e => e); // return htmlElements: NodeList
    const getYtUrls = htmlElements => htmlElements.map(htmlEl => htmlEl.querySelector('a').href); // return youtube video urls[]
    const placePlaylistLink = link => console.log(link);
    const addExtraBtn = (btn, DOM) => DOM.querySelector('#buttons').appendChild(btn);

    function getVideoId(link) {
        let startIndex = link.indexOf('=') + 1;
        return link.substring(startIndex).substr(0, 11); // id
    }

    const toPlaylistBtn = document.createElement('span')
    toPlaylistBtn.innerHTML = `<img style = 'width: 30px; height: 30px; cursor: pointer' src = 'https://pngimage.net/wp-content/uploads/2018/06/play-button-white-png-2.png'>`;
    toPlaylistBtn.addEventListener('click', e => {
        let htmlElements = Array.from(scan(document)[0]);
        let ytLinks = getYtUrls(htmlElements);
        let ids = makeIdsList(ytLinks);
        let playlistLink = createPlaylistLink(ids);
        window.location.href = playlistLink;
    });

    addExtraBtn(toPlaylistBtn, document);

    const scanStrategies = [
        dom => dom.querySelectorAll('.style-scope ytd-grid-video-renderer')
    ];
}
)();