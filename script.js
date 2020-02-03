// ==UserScript==
// @name         YouTube Playlist Maker
// @namespace    YouTubePlaylistMaker
// @version      0.2
// @description  It adds extra button to create a youtube playlist from videos on YouTube page
// @author       Emil Mordarski
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("YouTube Playlist Maker START!");

    const baseUrl = "https://www.youtube.com/watch_videos?video_ids=";
    const makeIdsList = links => links.map(link => getVideoId(link)); // return youtube video ids[]
    const createPlaylistLink = ids => baseUrl + ids.join(','); // return youtube playlist link
    const scan = DOM => scanStrategies[getLocation()].map(selector => Array.from(DOM.querySelectorAll(selector))).flat(1); // return array of HTML elements
    const getYtUrls = htmlElements => htmlElements.map(htmlEl => htmlEl.querySelector('a').href); // return youtube video urls[]
    const addExtraBtn = (btn, DOM) => DOM.querySelector('ytd-app').querySelector('#buttons').appendChild(btn);
    const getLocation = () => location.pathname;


    function getVideoId(link) {
        let startIndex = link.indexOf('=') + 1;
        return link.substring(startIndex).substr(0, 11); // id
    }

    function goToPlaylist() {
        let htmlElements = scan(document);
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
