// a function to get strength and weakness
const summarize_abiltiy = (abilities) => {
    const sortedValues = Object.values(abilities).flatMap(Object.entries).sort(([, a], [, b]) => b - a);
    console.log(sortedValues)
    const fiveHighest = sortedValues.slice(0, 5);
    fiveHighest.forEach(function (element) {
        element[0] = dict[element[0]]
    });
    // exclude abilities that are not significant in determining a player's weakness
    delete abilities.technical['Long Throws']
    delete abilities.technical['Free Kick']
    delete abilities.technical['Penalty Taking']
    delete abilities.technical['Corners']
    delete abilities.technical['Long Shots']
    delete abilities.technical['Eccentricity']
    delete abilities.mental['Leadership']
    const sortedValues2 = Object.values(abilities).flatMap(Object.entries).sort(([, a], [, b]) => b - a);
    const fiveLowest = sortedValues2.slice(-5);    console.log(fiveLowest)
    fiveLowest.forEach(function (element) {
        element[0] = dict[element[0]]
    });

    return { 'strength': fiveHighest, 'weakness': fiveLowest }
}

// Retrieve player data and display
window.onload = () => {
    chrome.storage.sync.get(['selected_player_info'], (data) => {
        console.log('>>>>>')
        console.log(data)
        document.getElementById("player_age").innerHTML = data.selected_player_info.age;
        document.getElementById("player_foot").innerHTML = dict[data.selected_player_info.foot];
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
    });
}