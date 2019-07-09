const fixedEncodeURI = (str) => {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

chrome.storage.sync.get(['result_count', 'player_info'], (data) => {
    // data = list of possible players
    let count = data.result_count
    if (count === 'empty' || data.player_info === 'failure') {
        document.getElementById(`player_name`).innerHTML = "선수를 찾지 못했습니다"

        document.getElementById(`search-button`).addEventListener("click", () => {
            fetchPlayerInfo(document.getElementById(`input-text`).value)
        })
    } else {
        document.getElementById(`player_name`).innerHTML = "다음 선수를 찾으십니까?"

        // Renders all player info included in the search result
        chrome.storage.sync.get(['player_info'], (data) => {
            // data = list of possible players
            let player_arr = data.player_info
            for (let i = 0; i < player_arr.length; i++) {
                document.getElementById("card-wrapper").innerHTML +=
                    `<div id="selected_player_${i}" class="player_option">
                <center>
                    <div class="card-img-small">
                        <img id=\"player_img\" src="${player_arr[i].profile_img}" class="img-responsive">
                    </div>
                </center>
                <div class="card-body">
                    <div id="player-name" class="price-small">
                        ${player_arr[i].name}
                    </div>`
            }
            // Bind eventListeners to each item
            for (let i = 0; i < player_arr.length; i++) {
                document.getElementById(`selected_player_${i}`).addEventListener("click", () => {
                    renderSelectedPlayer(i)
                })
            }
            document.getElementById(`search-button`).addEventListener("click", () => {
                fetchPlayerInfo(document.getElementById(`input-text`).value)
            })
        })
    }
})


// TODO: Refactor - move to a different file since it already has duplicate in eventPage.js
const fetchPlayerInfo = (name) => {
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

    url = 'https://fm-api-heroku.herokuapp.com/api/v1/players/' + fixedEncodeURI(name)

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
            }).catch(err => {
                reject(err);
            });
    }).catch(err => {
        console.log(err);
    });
}

// Renders a new profile page based on the selected player
const renderSelectedPlayer = (idx) => {
    chrome.storage.sync.get(['player_info'], (data) => {
        // data = list of possible players
        let player_item = data.player_info[idx]
        chrome.storage.sync.set({ 'selected_player_info': player_item }, function () {
            window.location.replace("popup.html");
        });
    })
}
