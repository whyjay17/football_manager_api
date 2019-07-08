var menuItem = {
    "id": "FMit",
    "title": "FMit",
    "contexts": ["selection"]
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
                var popup_url = 'popup.html'
                var createData = {
                    "url": popup_url,
                    "type": "popup",
                    "top": 5,
                    "left": 5,
                    "width": 570,
                    "height": 535
                };
                chrome.windows.create(createData, function () {

                });
                // Store user data into a temp storage
                console.log(responseText.result)
                chrome.storage.sync.set({ 'player_info': responseText.result }, function () { });


                /* test */
                var popup_url = 'table.html'
                var createData = {
                    "url": popup_url,
                    "type": "popup",
                    "top": 5,
                    "left": 5,
                    "width": 570,
                    "height": 535
                };
                chrome.windows.create(createData, function () { });

                /**** */
            }).catch(err => {
                reject(err);
            });
    }).catch(err => {
        console.log(err);
    });
});
