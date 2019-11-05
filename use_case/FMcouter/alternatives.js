chrome.storage.sync.get(['selected_player_info', 'close', 'upper', 'lower'], (data) => {
    // data = list of possible players
    document.getElementById("alternative-page-profile").innerHTML +=
        `
        <center>
            <div class="card-img">
                <a href="#">
                    <img src="${data.selected_player_info.profile_img}" id="player_img" class="img-responsive">
                </a>
            </div>
        </center>
        <div class="card-body">
            <div id="player_name" class="price">${data.selected_player_info.name}</div>
        </div>
        `

    let close_player_arr = data.close
    if (close_player_arr.length == 0) {
        document.getElementById("close-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div class="similar-player-elem">
                <div id="player-name" class="player-name-small">
                    NONE
                </div>
            </div>
            `
    }
    for (let i = 0; i < close_player_arr.length; i++) {
        document.getElementById("close-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div id="player-id-${close_player_arr[i][1]}" class="similar-player-elem">
                <img class="small-img img-responsive" src="${close_player_arr[i][2]}">
                <div id="player-name" class="player-name-small">
                    ${close_player_arr[i][0]}
                </div>
            </div> 
            `
    }
    for (let i = 0; i < close_player_arr.length; i++) {
        document.getElementById(`player-id-${close_player_arr[i][1]}`).addEventListener("click", () => {
            fetchById(`${close_player_arr[i][1]}`)
        })
    }
    let upper_player_arr = data.upper
    if (upper_player_arr.length == 0) {
        document.getElementById("upper-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div class="similar-player-elem">
                <div id="player-name" class="player-name-small">
                    NONE
                </div>
            </div>
            `
    }
    for (let i = 0; i < upper_player_arr.length; i++) {
        document.getElementById("upper-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div id="player-id-${upper_player_arr[i][1]}" class="similar-player-elem">
                <img class="small-img img-responsive" src="${upper_player_arr[i][2]}">
                <div id="player-name" class="player-name-small">
                    ${upper_player_arr[i][0]}
                </div>
            </div>
            `
    }
    for (let i = 0; i < upper_player_arr.length; i++) {
        document.getElementById(`player-id-${upper_player_arr[i][1]}`).addEventListener("click", () => {
            fetchById(`${upper_player_arr[i][1]}`)
        })
    }
    let lower_player_arr = data.lower
    if (lower_player_arr.length == 0) {
        document.getElementById("lower-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div class="similar-player-elem">
                <div id="player-name" class="player-name-small">
                    NONE
                </div>
            </div>
            `
    }
    for (let i = 0; i < lower_player_arr.length; i++) {
        document.getElementById("lower-player-wrapper").innerHTML +=
            // structure A[0]: name, A[1]: _id, A[2]: profile_img
            `
            <div id="player-id-${lower_player_arr[i][1]}" class="similar-player-elem">
                <img class="small-img img-responsive" src="${lower_player_arr[i][2]}">
                <div id="player-name" class="player-name-small">
                    ${lower_player_arr[i][0]}
                </div>
            </div>
            `
    }
    for (let i = 0; i < lower_player_arr.length; i++) {
        document.getElementById(`player-id-${lower_player_arr[i][1]}`).addEventListener("click", () => {
            fetchById(`${lower_player_arr[i][1]}`)
        })
    }

})

const fetchById = (id) => {
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

    url = 'https://fm-api-heroku.herokuapp.com/api/v1/player/' + id

    return new Promise((reslove, reject) => {
        fetch(url, myInit)
            .then(response => response.json())
            .then(responseText => {
                // Store user data into a temp storage
                chrome.storage.sync.set({ 'player_info': responseText.result }, function () {});
                chrome.storage.sync.set({ 'selected_player_info': responseText.result }, function () {
                    window.location.replace("popup.html");
                });

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