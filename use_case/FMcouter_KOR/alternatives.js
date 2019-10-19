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

const fixedEncodeURI = (str) => {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

chrome.storage.sync.get(['selected_player_info'], (data) => {
    // data = list of possible players

    console.log('DATA', fixedEncodeURI(data.selected_player_info.name))
    console.log('DATA', data )

    url = 'http://localhost:5000/api/v1/alternatives/' + fixedEncodeURI(data.selected_player_info.name)
    return new Promise((reslove, reject) => {
        fetch(url, myInit)
            .then(response => response.json())
            .then(responseText => {

                // If no search result 
                if (responseText.count === 0) {
                    chrome.storage.sync.set({ 'result_count': 'empty' }, function () {
                        window.location.replace("search.html");
                    });
                } else {
                    // Store user data into a temp storage
                    chrome.storage.sync.set({ 'result_count': 'non-empty' }, function () { });
                    chrome.storage.sync.set({ 'player_info': responseText.result }, function () { });
                    chrome.storage.sync.set({ 'selected_player_info': responseText.result[0] }, function () {
                        window.location.replace("search.html");
                    });
                }






                
                console.log(responseText, '<===========')
                responseText.result.close
            }).catch(err => {
                reject(err);
            });
    }).catch(err => {
        console.log(err);
    });

})