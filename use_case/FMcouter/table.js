import { key_attributes } from './attributes.js'

let highlight_on = false

// Retrieve player data and display
chrome.storage.sync.get(['selected_player_info'], (data) => {
    const abilities = data.selected_player_info.abilities
    const abilities_arr = ['technical', 'mental', 'physical'];
    const pos_arr = data.selected_player_info.position.split(',')
    let important_abilities = []
    document.getElementById("player_name").innerHTML = data.selected_player_info.name;
    document.getElementById("player_img").src = data.selected_player_info.profile_img;
    document.getElementById("highlight-attribute").innerHTML +=
        `            
         <button id="on-highlight" class="btn btn-default btn-margin2 float-right">
            <span class="glyphicon glyphicon-star" aria-hidden="true"></span> Highlight Key Attributes
        </button>
        `
    pos_arr.forEach((pos) => {
        let trim_pos = pos.trimLeft()
        let player_key_attributes = key_attributes[trim_pos]
        player_key_attributes.forEach((attr) => {
            important_abilities.push(attr)
        })
    });
    abilities_arr.forEach((ab) => {
        Object.entries(abilities[ab]).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            document.getElementById(`${ab}-ability`).innerHTML += `<a id="attr-${key}" class="list-group-item">${key}: ${value}</a>`
        });
    });
    document.getElementById(`on-highlight`).addEventListener("click", () => {
        if (highlight_on) {
            highlight_on = false
            important_abilities.forEach((attr) => {
                document.getElementById(`attr-${attr}`).setAttribute("style", "");
            })
            document.getElementById(`on-highlight`).classList.remove('btn-danger')
            document.getElementById(`on-highlight`).classList.add('btn-default')
            document.getElementById(`on-highlight`).innerHTML = `<span class="glyphicon glyphicon-star" aria-hidden="true"></span> Highlight Key Attributes`
        } else {
            highlight_on = true
            important_abilities.forEach((attr) => {
                document.getElementById(`attr-${attr}`).setAttribute("style", "background-color: #ddffcf;");
            })
            document.getElementById(`on-highlight`).classList.remove('btn-default')
            document.getElementById(`on-highlight`).classList.add('btn-danger')
            document.getElementById(`on-highlight`).innerHTML = `<span class="glyphicon glyphicon-star" aria-hidden="true"></span> Turn Off Key Attributes`
        }
    })
});