// Retrieve player data and display
chrome.storage.sync.get(['selected_player_info'], (data) => {
    const abilities = data.selected_player_info.abilities
    const abilities_arr = ['technical', 'mental', 'physical'];
    document.getElementById("player_name").innerHTML = data.selected_player_info.name;
    document.getElementById("player_img").src = data.selected_player_info.profile_img;
    abilities_arr.forEach(function (ab) {
        Object.entries(abilities[ab]).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            document.getElementById(`${ab}-ability`).innerHTML += `<a href="#" class="list-group-item">${key}: ${value}</a>`
        });
    });

});