const pokemonSelection = document.querySelector("#pokemon-selection");
const confirmButton = document.querySelector("#confirm");
const history = document.querySelector("#history");
const randomSelectionCOM = document.querySelector("#random-selection");
const score = document.querySelector("#stars");
const scoreCOM = document.querySelector("#stars-com");

const FIRE = {
  name: "Charmander",
  experience: 0,
  evolveStage: 1,
  type: "Fire",
  win: "Grass",
  evolve () {
    if (this.evolveStage === 1) {
      this.name = "Charmeleon";
      this.experience -= 200;
      this.evolveStage ++;
    } else if (this.evolveStage === 2) {
      this.name = "Charizard";
      this.evolveStage ++;
    }
  }
};

const WATER = {
  name: "Squirtle",
  experience: 0,
  evolveStage: 1,
  type: "Water",
  win: "Fire",
  evolve () {
    if (this.evolveStage === 1) {
      this.name = "Wartortle";
      this.experience -= 200;
      this.evolveStage ++;
    } else if (this.evolveStage === 2) {
      this.name = "Blastoise";
      this.evolveStage ++;
      this.win = FIRE;
    }
  }
};

const GRASS = {
  name: "Bulbasaur",
  experience: 0,
  evolveStage: 1,
  type: "Grass",
  win: "Water",
  evolve () {
    if (this.evolveStage === 1) {
      this.name = "Ivysaur";
      this.experience -= 200;
      this.evolveStage ++;
    } else if (this.evolveStage === 2) {
      this.name = "Venusaur";
      this.evolveStage ++;
    }
  }
};

const FIRECOM = Object.assign({}, FIRE);
const WATERCOM = Object.assign({}, WATER);
const GRASSCOM = Object.assign({}, GRASS);
const pokemonArray = [FIRE, WATER, GRASS];
const pokemonArrayCOM = [FIRECOM, WATERCOM, GRASSCOM];

updatePokemonSelection();


let battleWon = 0;
let battleWonCOM = 0;

//  UPDATING POKEMON
function updatePokemonSelection() {
  // The child are removed:
  clearElement(pokemonSelection)
  // New childs are added:
  for(pokemon of pokemonArray) {
    let pokemonSelector = document.createElement("img");
    pokemonSelector.classList.add("pokemon-selector");
    pokemonSelector.src = `./assets/${pokemon.name}.png`;
    pokemonSelector.name = pokemon.name;
    pokemonSelection.appendChild(pokemonSelector);
  addSelectors()
  }
}

// POKEMON SELECTION
function addSelectors() {
  document.querySelectorAll(".pokemon-selector").forEach(pokemon => {
    pokemon.addEventListener("click", () => {
      pokemon.classList.add("selected")
      document.querySelectorAll(".pokemon-selector").forEach(otherPokemon => {
        if (otherPokemon !== pokemon) { otherPokemon.classList.remove("selected"); }
      })
    })
  })
}


// CONFIRM BUTTON
confirmButton.addEventListener("click", () => {
  clearElement(history)
  if (selectedPokemon()) {
    var currentPokemonName = selectedPokemon();
    var currentPokemon = findPokemon(currentPokemonName)
    appendHistory("p", `You have selected ${currentPokemonName}.`);
    appendHistory("hr");
  } else {
    appendHistory("p", "No pokemon has been selected.");
    appendHistory("hr");
    return;
  }
  let randomPokemonCOM = pokemonArrayCOM[randomSelection()];
  appendHistory("p", `Your opponent has selected ${randomPokemonCOM.name}.`);
  appendHistory("hr");
  randomSelectionCOM.removeChild(randomSelectionCOM.firstChild);
  let pokemonCOM = document.createElement("img");
  pokemonCOM.classList.add("pokemon-selector");
  pokemonCOM.src = `./assets/${randomPokemonCOM.name}.png`;
  pokemonCOM.name = randomPokemonCOM.name;
  randomSelectionCOM.appendChild(pokemonCOM);
  battle(currentPokemon, randomPokemonCOM)
  checkEvolve(pokemonArray)
  checkEvolve(pokemonArrayCOM)
  randomSelectionCOM.removeChild(randomSelectionCOM.firstChild);
  pokemonCOM.src = `./assets/${randomPokemonCOM.name}.png`;
  pokemonCOM.name = randomPokemonCOM.name;
  randomSelectionCOM.appendChild(pokemonCOM);
  updateStars(score, battleWon)
  updateStars(scoreCOM, battleWonCOM)
  updatePokemonSelection()
  if (battleWon == 5 || battleWonCOM == 5) {
    alert("The game is over ! Thank you for playing!")
    location.reload(); 
  }
})


// RANDOM COM SELECTION
function randomSelection() {
  return Math.floor(Math.random() * 3)
}

// Get selected pokemon:
function selectedPokemon() {
  try {return document.querySelector(".selected").name;}
  catch(error) {return null;}
}

// HISTORY PANNEL
function appendHistory(element, text = null) {
  let newElement = document.createElement(element);
  newElement.innerHTML = text;
  history.append(newElement);
}

// CLEAR CHILD ELEMENTS
function clearElement(element) {
  let childElement = element.lastElementChild;
  while (childElement) {
    element.removeChild(childElement);
    childElement = element.lastElementChild; 
  }
}

// RETRIEVE POKEMON USING NAME
function findPokemon(name) {
  for(pokemon of pokemonArray) {
    if (pokemon.name === name) {return pokemon;}}
  }

// BATTLE
function battle(pokemon, pokemonCOM) {
  // Victory outcomes: 
  if(pokemon.win === pokemonCOM.type) {
    pokemon.experience += 100;
    battleWon ++;
    appendHistory("p", "Your pokemon won the battle!")

    if (pokemonCOM.evolveStage > pokemon.evolveStage) {
      pokemon.experience += 100;
      appendHistory("p", "The fight was quite hard.")
    } else if(pokemonCOM.evolveStage < pokemon.evolveStage) {
      pokemon.experience -= 50;
      appendHistory("p", "The fight was easy.")
    }
    appendHistory("hr");
  // Draw outcomes:
  } else if (pokemon.type === pokemonCOM.type) {
    if (pokemonCOM.evolveStage > pokemon.evolveStage) {
      battleWonCOM++;
      pokemonCOM.experience += 50;
      appendHistory("p", "Your pokemon is weaker and lost the battle.")
    } else if (pokemonCOM.evolveStage < pokemon.evolveStage) {
      battleWon++;
      pokemon.experience += 50;
      appendHistory("p", "Your pokemon is stronger and won the battle.")
    } else {
      appendHistory("p", "It's a draw!")
    }
    appendHistory("hr");
  // Lost outcomes:
  } else {
    battleWonCOM ++;
    pokemonCOM.experience += 100;
    appendHistory("p", "Your pokemon lost the battle.");
    appendHistory("hr");
    if (pokemonCOM.evolveStage < pokemon.evolveStage) {
      pokemonCOM.experience += 100;
    } else if(pokemonCOM.evolveStage > pokemon.evolveStage) {
      pokemonCOM.experience -= 50;
    }
  }
}

// CHECK EVOLVE
function checkEvolve(pokemonArray) {
  for(pokemon of pokemonArray)
  if (pokemon.experience > 175 && !(pokemon.evolveStage === 3)) {
    pokemon.evolve();
    appendHistory("p", `A pokemon evolved to ${pokemon.name}!`)
    appendHistory("hr")
  }
}

// UPDATE SCORE
function updateStars(scoreElement, battleWon) {
  for (let iteration = 0; iteration < battleWon; iteration ++) {
    scoreElement.children[iteration].classList.remove("far")
    scoreElement.children[iteration].classList.add("fas")
  } 
}