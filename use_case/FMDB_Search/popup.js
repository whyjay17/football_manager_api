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

const getLabelStyle = (stat) => {
    // return label color (str: poor, average, good) based on the stat number
    if (0 <= stat && stat < 11) {
        return 'label-danger'
    } else if (11 <= stat && stat < 15) {
        return 'label-warning'
    } else {
        return 'label-success'
    }
}

const getStarNumber = (stats) => {
    if (0 <= stats && stats <= 93) {
        return 1
    } else if (94 <= stats && stats <= 118) {
        return 2
    } else if (119 <= stats && stats <= 139) {
        return 3
    } else if (140 <= stats && stats <= 164) {
        return 4
    } else {
        return 5
    }
}

// Retrieve player data and display
window.onload = () => {
    chrome.storage.sync.get(['selected_player_info'], (data) => {
        let left_class = getLabelStyle(data.selected_player_info.foot.left)
        let right_class = getLabelStyle(data.selected_player_info.foot.right)
        document.getElementById("player_age").innerHTML = `${data.selected_player_info.age} (${data.selected_player_info.birth_date})`;
        document.getElementById("player_foot").innerHTML = `<span class="label ${left_class}">Left: ${data.selected_player_info.foot.left}</span>
            <span class="label ${right_class}">Right: ${data.selected_player_info.foot.right}</span>`
        document.getElementById("player_nation").innerHTML = data.selected_player_info.nationality;
        document.getElementById("player_name").innerHTML = data.selected_player_info.name;
        document.getElementById("player_img").src = data.selected_player_info.profile_img;
        document.getElementById("player_pos").innerHTML = data.selected_player_info.position;
        document.getElementById("player_team").innerHTML = data.selected_player_info.game_info.club;
        
        for (let i = 0; i < getStarNumber(data.selected_player_info.ca); i++) {
            document.getElementById("ca").innerHTML +=  `<span class="glyphicon glyphicon-star glyphicon-star-yellow"/ >`
        }
        
        for (let i = 0; i < getStarNumber(data.selected_player_info.pa); i++) {
            document.getElementById("pa").innerHTML +=  `<span class="glyphicon glyphicon-star glyphicon-star-yellow"/ >`
        }
         
        delete data.selected_player_info.abilities.hidden
        let abilities = data.selected_player_info.abilities
        let summary = summarize_abiltiy(abilities)
        // Render labels
        for (let i = 0; i < 5; i++) {
            let strength_label = getLabelStyle(summary.strength[i][1])
            let weak_label = getLabelStyle(summary.weakness[i][1])
            document.getElementById("strength").innerHTML +=
                `<span class="label ${strength_label}"> ${summary.strength[i][0]}: ${summary.strength[i][1]} </span>`;
            document.getElementById("weakness").innerHTML +=
                `<span class="label ${weak_label}"> ${summary.weakness[i][0]}: ${summary.weakness[i][1]} </span>`;
        }
        console.log('=========<', data.selected_player_info)
        url = 'https://fm-api-heroku.herokuapp.com/api/v2/alternatives/' + data.selected_player_info.player_id
        return new Promise((reslove, reject) => {
            fetch(url, myInit)
                .then(response => response.json())
                .then(responseText => {
                    console.log(responseText)
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