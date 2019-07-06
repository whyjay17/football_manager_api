chrome.storage.sync.get(['player_info'], (data) => {
    console.log('search')
    console.log(data)
    // data = list of possible players 
    let player_arr = data.player_info
    for (let i = 0; i < player_arr.length; i++) {
        document.getElementById("card-wrapper").innerHTML +=
            `<div class="player_option">
                <center>
                    <div class="card-img-small">
                        <a href="#">
                            <img id=\"player_img\" src="${player_arr[i].profile_img}" class="img-responsive">
                        </a>
                    </div>
                </center>
                <div class="card-body">
                    <div id="player-name" class="price-small">
                        ${player_arr[i].name}
                    </div>`
    }
})