let button = document.getElementById('run');
let input = document.getElementById("pokemon");
let pokemonImage = document.getElementById('pokeImg');
let evoImage = document.getElementById('evoImg');
let shinyImage = document.getElementById('shinyImg');
let nextImage = document.getElementById('nextImg');

button.addEventListener('click', function () {
    doTheThing()
});
input.addEventListener('keyup', function (e) {

    if (e.key === 'Enter') {
        e.preventDefault();
        doTheThing();
    }
});


function doTheThing() {
    //loads function for previous evo
    getPrevo();
    //loads function for next evo
    getShiny();


    //Fetch for the pokemons BASE form
    fetch('https://pokeapi.co/api/v2/pokemon/' + input.value.toLowerCase() + '')
        .then(link => link.json())
        .then(data => {
            let pokeImageSource = (data.sprites.front_default);
            pokemonImage.setAttribute('src', pokeImageSource);

            //sets ID number
            let id = data.id;
            document.getElementById("pokeId").innerHTML = id;

            //Name
            let pokeName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            document.getElementById('pokeName').innerHTML = pokeName;
            let pokemonId = document.getElementById("pokeId").innerText;

            // poke moves
            let pokeMovesNewArray = []; // empty array for poke moves

            for (let i = 0; i < data.moves.length; i++) {
                pokeMovesNewArray.push(data.moves[i].move.name);
            }

            let randomMove;
            let randomFourMoves;

            for (let i = 0; i < 4; i++) {
                randomMove = Math.floor(Math.random() * pokeMovesNewArray.length);
                randomFourMoves = pokeMovesNewArray[randomMove];
                // console.log(randomFourMoves);
                document.getElementById('pokeMove' + (i + 1) + '').innerHTML = randomFourMoves;
            }

            let pokeWeight = data.weight;
            document.getElementById('weightPoke').innerHTML = ('Weight: ' + pokeWeight);


            // abilities
            let abilitiesNewArray = [];
            let pokeAbilities;

            for (let i = 0; i < data.abilities.length; i++) { // to get all elements from the array
                pokeAbilities = abilitiesNewArray.push(data.abilities[i].ability.name); // to add new array + to select abilities specifically from the array
                pokeAbilities = abilitiesNewArray[Math.floor(Math.random() * abilitiesNewArray.length)]; // to make the selection randomly
                document.getElementById('abilitiesPoke').innerHTML = ('Ability: ' + pokeAbilities); // to get element id from the html and display new array
            }

            // types

            var pokeTypes1 = data.types[0].type.name;

            if (data.types.length === 1) {
                document.getElementById("pokeTypes1").innerHTML = pokeTypes1;
                document.getElementById("pokeTypes2").innerHTML = " ";
            } else {
                var pokeTypes2 = data.types[1].type.name;
                document.getElementById("pokeTypes1").innerHTML = pokeTypes1;
                document.getElementById("pokeTypes2").innerHTML = pokeTypes2;
            }


            //checking for ID
            if (isNaN(input.value) == false) {
                input.value = data.name;
            }
            console.log(input.value);
        })
}


// DISCLAIMER I forgot that I could just print the entire chain so I wrote this madness instead


async function getPrevo() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + input.value.toLowerCase() + "");
    // let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${input.value.toLowerCase()}`);
    let evolutionData = await response.json();

    console.log(evolutionData);
    if (evolutionData.evolves_from_species == null) {
        document.getElementById('prevEvolution').innerHTML = "";
        evoImage.setAttribute("src", "")
    } else {
        const preName = evolutionData.evolves_from_species.name;
        document.getElementById('prevEvolution').innerHTML = "Previous Evolution: " + preName;
        preForm(preName);
    }

    nextEvo = evolutionData.evolution_chain.url;
    getNext(nextEvo);
}

async function preForm(prevolution) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${prevolution}`);
    let preData = await response.json();
    console.log(preData);
    let pokemonSprite = preData.sprites.front_default;

    evoImage.setAttribute("src", pokemonSprite);
    // console.log(pokemonSprite);
}


async function getShiny() {


    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input.value.toLowerCase()}`);
    let shinyData = await response.json();
    let shinySprite = shinyData.sprites.front_shiny;
    shinyImage.setAttribute("src", shinySprite);


}

async function getNext(speciesUrl) {
    //console.log(speciesUrl);

    let nextForm;
    let response = await fetch(speciesUrl);
    let nextData = await response.json();
    //console.log(nextData);
    console.log(nextData.chain.evolves_to[0]);


    if (nextData.chain.evolves_to[0] == undefined) {
        nextForm = "";
    }
    //checks for BABY pokemon
    else if (input.value == nextData.chain.species.name) {
        console.log("sameName");
        nextForm = nextData.chain.evolves_to[0].species.name;
        console.log(nextForm);
    }

    //checks for NO NEXT evolution in 2FORM pokemon
    else if (nextData.chain.evolves_to[0].evolves_to[0] == undefined) {
        console.log("no next");
        nextForm = "";
    } else if (input.value == nextData.chain.evolves_to[0].species.name) {
        nextForm = nextData.chain.evolves_to[0].evolves_to[0].species.name;
    } else {

        nextForm = "";
    }

    setNext(nextForm)
}

async function setNext(nextName) {

    if (nextName == "") {
        nextImage.setAttribute("src", "");
        document.getElementById("nextEvolution").innerHTML = "Next Evolution: none";
    }

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextName.toLowerCase()}`);
    let setNextData = await response.json();
    let nextSprite = setNextData.sprites.front_default;
    nextImage.setAttribute("src", nextSprite);
    document.getElementById("nextEvolution").innerHTML = "Next Evolution: " + nextName;


}
