const renderSelectedPlayer = (idx) => {
    chrome.storage.sync.get(['player_info'], (data) => {
        // data = list of possible players
        let player_item = data.player_info[idx]
        chrome.storage.sync.set({ 'selected_player_info': player_item }, function () {
        window.location.replace("popup.html");
        });
    })
}

chrome.storage.sync.get(['player_info'], (data) => {
    console.log('search')
    console.log(data)
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
    for (let i = 0; i < player_arr.length; i++) {
        document.getElementById(`selected_player_${i}`).addEventListener("click", function() {
            renderSelectedPlayer(i)
        })
    }
})

