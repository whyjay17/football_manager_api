var menuItem = {
    "id": "FMit",
    "title": "FMit",
    "contexts": ["selection"]
};

var popup_url = 'popup.html'
var popupWindow = {
    "url": popup_url,
    "type": "popup",
    "top": 0,
    "left": 0,
    "width": 590,
    "height": 585
};

var search_url = 'search.html'
var searchWindow = {
    "url": search_url,
    "type": "popup",
    "top": 0,
    "left": 0,
    "width": 590,
    "height": 585
};

chrome.contextMenus.create(menuItem);

const fixedEncodeURI = (str) => {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

chrome.contextMenus.onClicked.addListener(function (clickData) {
    let header = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    let myInit = {
        method: 'GET',
        headers: header,
        mode: 'cors',
        cache: 'default'
    };

    url = 'https://fm-api-heroku.herokuapp.com/api/v1/players/' + fixedEncodeURI(clickData.selectionText)

    return new Promise((reslove, reject) => {
        fetch(url, myInit)
            .then(response => response.json())
            .then(responseText => {
                // If no search result
                if (responseText.count === 0) {
                    chrome.storage.sync.set({ 'result_count': 'empty' }, function () {
                        chrome.windows.create(searchWindow, function () { });
                    });
                } else {
                    // Store user data into a temp storage
                    chrome.storage.sync.set({ 'result_count': 'non-empty' }, function () { });
                    chrome.storage.sync.set({ 'player_info': responseText.result }, function () { });
                    chrome.storage.sync.set({ 'selected_player_info': responseText.result[0] }, function () {
                        chrome.windows.create(popupWindow, function () { });
                    });
                }
            }).catch(err => {
                reject(err);
            });
    }).catch(err => {
        console.log(err);
    });
});
