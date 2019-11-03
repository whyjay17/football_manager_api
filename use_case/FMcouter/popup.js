const header = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});

const myInit = {
    method: 'GET',
    headers: header,
    mode: 'cors',
    cache: 'default'
};

const fixedEncodeURI = (str) => {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

const format_birthdate = (bdate) => {
    let bdate_arr = bdate.split('/')
    let yr = bdate_arr[2]
    let month = bdate_arr[1]
    let day = bdate_arr[0]
    return `${month}/${day}/${yr}`
}

// a function to get strength and weakness
const summarize_abiltiy = (abilities) => {
    const sortedValues = Object.values(abilities).flatMap(Object.entries).sort(([, a], [, b]) => b - a);
    const fiveHighest = sortedValues.slice(0, 5);
    // exclude abilities that are not significant in determining a player's weakness
    delete abilities.technical['Long Throws']
    delete abilities.technical['Free Kick']
    delete abilities.technical['Penalty Taking']
    delete abilities.technical['Corners']
    delete abilities.technical['Long Shots']
    delete abilities.technical['Eccentricity']
    delete abilities.mental['Leadership']
    const sortedValues2 = Object.values(abilities).flatMap(Object.entries).sort(([, a], [, b]) => b - a);
    const fiveLowest = sortedValues2.slice(-5);

    return { 'strength': fiveHighest, 'weakness': fiveLowest }
}

// Retrieve player data and display
window.onload = () => {
    chrome.storage.sync.get(['selected_player_info'], (data) => {
        document.getElementById("player_age").innerHTML = `${data.selected_player_info.age} (${format_birthdate(data.selected_player_info.birth_date)})`;
        document.getElementById("player_foot").innerHTML = data.selected_player_info.foot;
        document.getElementById("player_nation").innerHTML = data.selected_player_info.nationality;
        document.getElementById("player_name").innerHTML = data.selected_player_info.name;
        document.getElementById("player_img").src = data.selected_player_info.profile_img;
        document.getElementById("player_pos").innerHTML = data.selected_player_info.position;
        let abilities = data.selected_player_info.abilities
        let summary = summarize_abiltiy(abilities)
        // Render labels
        for (let i = 0; i < 5; i++) {
            document.getElementById("strength").innerHTML +=
                `<span class="label label-success"> ${summary.strength[i][0]}: ${summary.strength[i][1]} </span>`;
            document.getElementById("weakness").innerHTML +=
                `<span class="label label-danger"> ${summary.weakness[i][0]}: ${summary.weakness[i][1]} </span>`;
        }
        url = 'https://fm-api-heroku.herokuapp.com/api/v1/alternatives/' + fixedEncodeURI(data.selected_player_info.name)
        return new Promise((reslove, reject) => {
            fetch(url, myInit)
                .then(response => response.json())
                .then(responseText => {
                    chrome.storage.sync.set({ 'close': responseText.result.close }, function () { });
                    chrome.storage.sync.set({ 'upper': responseText.result.upper }, function () { });
                    chrome.storage.sync.set({ 'lower': responseText.result.lower }, function () { });
                }).catch(err => {
                    reject(err);
                });
        }).catch(err => {
            console.log(err);
        });
    });
}