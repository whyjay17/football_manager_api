// Retrieve player data and display
chrome.storage.sync.get(['player_info'], (data) => {
    const abilities = data.player_info[0].abilities
    const abilities_arr = ['technical', 'mental', 'physical'];
    document.getElementById("player_name").innerHTML = data.player_info[0].name;
    document.getElementById("player_img").src = data.player_info[0].profile_img;
    abilities_arr.forEach(function (ab) {
        Object.entries(abilities[ab]).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            document.getElementById(`${ab}-ability`).innerHTML += `<a href="#" class="list-group-item">${key}: ${value}</a>`
        });
    });

});