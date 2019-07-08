// function to get strength and weakness

const summarize_abiltiy = (abilities) => {
    const sortedValues = Object.values(abilities).flatMap(Object.entries).sort(([, a], [, b]) => b - a);
    const fiveHighest = sortedValues.slice(0, 5);
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
chrome.storage.sync.get(['player_info'], (data) => {
    document.getElementById("player_age").innerHTML = data.player_info[0].age;
    document.getElementById("player_foot").innerHTML = data.player_info[0].foot;
    document.getElementById("player_nation").innerHTML = data.player_info[0].nationality;
    document.getElementById("player_name").innerHTML = data.player_info[0].name;
    document.getElementById("player_img").src = data.player_info[0].profile_img;
    document.getElementById("player_pos").innerHTML = data.player_info[0].position;
    let abilities = data.player_info[0].abilities
    let summary = summarize_abiltiy(abilities)
    console.log(summary)

    for (let i = 0; i < 5; i++) {
        document.getElementById("strength").innerHTML +=
            `<span class="label label-success"> ${summary.strength[i][0]}: ${summary.strength[i][1]} </span>`;
        document.getElementById("weakness").innerHTML +=
            `<span class="label label-danger"> ${summary.weakness[i][0]}: ${summary.weakness[i][1]} </span>`;
    }
});
