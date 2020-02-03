// ==UserScript==
// @name         YouTube Playlist Maker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("YouTube Playlist Maker START!");

    const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
    const makeIdsList = links => links.map(link => getVideoId(link)); // return youtube video ids[]
    const createPlaylistLink = ids => baseUrl + ids.join(','); // return youtube playlist link
    const scan = DOM => scanStrategies[getLocation()].map(selector => DOM.querySelectorAll(selector)).flatMap(e => e); // return htmlElements: NodeList
    const getYtUrls = htmlElements => htmlElements.map(htmlEl => htmlEl.querySelector('a').href); // return youtube video urls[]
    const placePlaylistLink = link => console.log(link);
    const addExtraBtn = (btn, DOM) => DOM.querySelector('ytd-app').querySelector('#buttons').appendChild(btn);
    const getLocation = () => location.pathname;


    function getVideoId(link) {
        let startIndex = link.indexOf('=') + 1;
        return link.substring(startIndex).substr(0, 11); // id
    }

    function goToPlaylist() {
        let htmlElements = Array.from(scan(document)[0]);
        console.log(htmlElements.length);
        let ytLinks = getYtUrls(htmlElements);
        let ids = makeIdsList(ytLinks);
        let playlistLink = createPlaylistLink(ids);
        window.location.href = playlistLink;
    }

    const toPlaylistBtn = document.createElement('span')
    toPlaylistBtn.innerHTML = `<img style = 'width: 30px; height: 30px; cursor: pointer' src = 'https://pngimage.net/wp-content/uploads/2018/06/play-button-white-png-2.png'>`;
    toPlaylistBtn.addEventListener('click', e => {
        try {
            goToPlaylist();
        } catch(e) {
            alert(`Page ${getLocation()} is not supported yet`);
        }
    });

    addExtraBtn(toPlaylistBtn, document);

    document.querySelector('ytd-app').addEventListener('yt-navigate', () => {
        // Issue: button doesn't append, rpobably assosiated with DOM reload
        addExtraBtn(toPlaylistBtn, document);
        console.log("@@@ App navigated");
        console.log(document.querySelector('ytd-app').querySelector('#buttons'));
    });

    const scanStrategies = { // page path : selector[]
        '/feed/subscriptions': [
            '.style-scope ytd-grid-video-renderer'
        ],
        '/': [
            '.ytd-rich-item-renderer'
        ],
        '/feed/trending': [ // doesn't work ?
            '.ytd-video-renderer'
        ]
    };
}
)();