const animals = {
  // wolf: { STR: 15, SPE: 12, INT: 10, weights: { STR: 0.6, SPE: 0.3, INT: 0.1 } },
  // rabbit: { STR: 5, SPE: 15, INT: 10, weights: { STR: 0.2, SPE: 0.7, INT: 0.1 } },
  // dolphin: { STR: 12, SPE: 14, INT: 16, weights: { STR: 0.3, SPE: 0.3, INT: 0.4 } },
  // elephant: { STR: 20, SPE: 5, INT: 14, weights: { STR: 0.7, SPE: 0.1, INT: 0.2 } },
  // fox: { STR: 10, SPE: 14, INT: 13, weights: { STR: 0.3, SPE: 0.5, INT: 0.2 } },
  // dog: { STR: 13, SPE: 13, INT: 12, weights: { STR: 0.4, SPE: 0.4, INT: 0.2 } },
  // cat: { STR: 11, SPE: 14, INT: 11, weights: { STR: 0.3, SPE: 0.5, INT: 0.2 } },
  // owl: { STR: 8, SPE: 12, INT: 18, weights: { STR: 0.1, SPE: 0.3, INT: 0.6 } },
  // lion: { STR: 18, SPE: 15, INT: 11, weights: { STR: 0.7, SPE: 0.2, INT: 0.1 } },
  // eagle: { STR: 14, SPE: 18, INT: 12, weights: { STR: 0.3, SPE: 0.6, INT: 0.1 } },
  // bear: { STR: 20, SPE: 10, INT: 10, weights: { STR: 0.7, SPE: 0.2, INT: 0.1 } },
  // shark: { STR: 19, SPE: 16, INT: 9, weights: { STR: 0.6, SPE: 0.3, INT: 0.1 } },
  // horse: { STR: 15, SPE: 17, INT: 11, weights: { STR: 0.4, SPE: 0.5, INT: 0.1 } },
  // snake: { STR: 10, SPE: 18, INT: 14, weights: { STR: 0.2, SPE: 0.6, INT: 0.2 } },
  // frog: { STR: 7, SPE: 14, INT: 11, weights: { STR: 0.2, SPE: 0.6, INT: 0.2 } },
  tiger: { STR: 19, SPE: 14, INT: 12, weights: { STR: 0.7, SPE: 0.2, INT: 0.1 } },
  penguin: { STR: 8, SPE: 10, INT: 13, weights: { STR: 0.2, SPE: 0.3, INT: 0.5 } },
  gorilla: { STR: 18, SPE: 11, INT: 14, weights: { STR: 0.6, SPE: 0.1, INT: 0.3 } },
  butterfly: { STR: 3, SPE: 18, INT: 12, weights: { STR: 0.1, SPE: 0.7, INT: 0.2 } },
  kangaroo: { STR: 14, SPE: 16, INT: 12, weights: { STR: 0.4, SPE: 0.5, INT: 0.1 } }
};

let fusedName = null;

// Player class to manage deck, hand, and drawing cards
class Player {
  constructor(name, deck) {
    this.name = name;
    this.deck = [...deck]; // copy
    this.hand = [];
    this.points = 0;
  }

  drawCards() {
    while (this.hand.length < 5 && this.deck.length > 0) {
      const card = this.deck.shift();
      this.hand.push(card);
    }
  }

  removeFromHand(cardsToRemove) {
    this.hand = this.hand.filter(card => !cardsToRemove.includes(card));
  }
}

// Fuse two animals using weights and stat formula
function fuseAnimals(animalNames) {
  if (animalNames.length !== 2) throw new Error('Can only fuse 2 animals');

  const [a1, a2] = animalNames.map(name => animals[name]);

  let resultStats = {};

  for (let stat of ['STR', 'SPE', 'INT']) {
    const weightSum = a1.weights[stat] + a2.weights[stat];
    // Weighted stat fusion formula
    resultStats[stat] =
      Math.round(
        (a1[stat] * a1.weights[stat] + a2[stat] * a2.weights[stat]) / weightSum
      );
  }

  return resultStats;
}

function averageStat(stats) {
  return (stats.STR + stats.SPE + stats.INT) / 3;
}

// --- Initialization ---

// Create a random deck of 25 cards (animal names)
function createRandomDeck() {
  const animalKeys = [...Object.keys(animals)];
  // Shuffle the array
  for (let i = animalKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [animalKeys[i], animalKeys[j]] = [animalKeys[j], animalKeys[i]];
  }
  return animalKeys.slice(0, 25); // up to 25 unique cards
}


const player1 = new Player("Player 1", createRandomDeck());
player1.drawCards();

// Selected cards and fused result state
let selectedCards = [];
let fusedAnimalStats = null;

// DOM elements
const p1CardsDiv = document.getElementById('p1-cards');
const fuseBtn = document.getElementById('fuse-btn');
const fusionResultDiv = document.getElementById('fusion-result');
const decisionArea = document.getElementById('decision-area');
const roundResultDiv = document.getElementById('round-result');
const compareAvgBtn = document.getElementById('compare-average');
const compareAttrBtn = document.getElementById('compare-attribute');
const attributeChoiceDiv = document.getElementById('attribute-choice');

// Render player's hand with selection ability
function renderHand() {
  p1CardsDiv.innerHTML = '';
  player1.hand.forEach(animal => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    const stats = animals[animal];
    cardDiv.innerHTML = `
    <img src="assets/images/${animal}.png" alt="${animal}" style="width:100px; height:auto; display:block; margin:0 auto 5px;">
    <strong>${animal}</strong><br>
    STR: ${stats.STR}, SPE: ${stats.SPE}, INT: ${stats.INT}
  `;
  

    if (selectedCards.includes(animal)) {
      cardDiv.classList.add('selected');
    }
    cardDiv.onclick = () => {
      if (selectedCards.includes(animal)) {
        selectedCards = selectedCards.filter(a => a !== animal);
      } else if (selectedCards.length < 2) {
        selectedCards.push(animal);
      }
      fuseBtn.disabled = selectedCards.length !== 2;
      renderHand();
    };
    p1CardsDiv.appendChild(cardDiv);
  });
}

function generateFusedName(name1, name2) {
  const half1 = name1.slice(0, Math.ceil(name1.length / 2));
  const half2 = name2.slice(Math.floor(name2.length / 2));
  return (half1 + half2).charAt(0).toUpperCase() + (half1 + half2).slice(1);
}

function tryFusionImage(name1, name2, callback) {
  const tryOrder = [`${name1}${name2}`, `${name2}${name1}`];
  let index = 0;

  function tryNext() {
    if (index >= tryOrder.length) {
      callback(null); // both failed
      return;
    }

    const imagePath = `assets/images/${tryOrder[index]}.png`;
    const testImg = new Image();

    testImg.onload = () => callback(imagePath);
    testImg.onerror = () => {
      index++;
      tryNext();
    };

    testImg.src = imagePath;
  }

  tryNext();
}

// Fuse button handler
fuseBtn.onclick = () => {
  if (selectedCards.length !== 2) return;
  fusedAnimalStats = fuseAnimals(selectedCards);
  playerFusedName = generateFusedName(selectedCards[0], selectedCards[1]);

  fusionResultDiv.innerHTML = '';

  tryFusionImage(selectedCards[0], selectedCards[1], (imagePath) => {
    if (imagePath) {
      const img = document.createElement('img');
      img.src = imagePath;
      img.style.width = '150px';
      img.style.display = 'block';
      img.style.marginBottom = '10px';
      fusionResultDiv.appendChild(img);
    } else {
      // Optional: fallback silhouette
      fusionResultDiv.innerHTML += `<em>No image found for fusion.</em><br>`;
    }

    fusionResultDiv.innerHTML += `
      <strong>Fused Animal: ${playerFusedName}</strong><br>
      STR: ${fusedAnimalStats.STR}, SPE: ${fusedAnimalStats.SPE}, INT: ${fusedAnimalStats.INT}
    `;
  });

  // Remove fused cards from hand
  player1.removeFromHand(selectedCards);
  selectedCards = [];
  fuseBtn.disabled = true;
  renderHand();

  decisionArea.style.display = 'block';
  roundResultDiv.textContent = '';
};


// Decision buttons handlers
compareAvgBtn.onclick = () => {
  resolveRound('average');
};

compareAttrBtn.onclick = () => {
  attributeChoiceDiv.style.display = 'block';
};

attributeChoiceDiv.querySelectorAll('.attr-btn').forEach(btn => {
  btn.onclick = () => {
    const attr = btn.getAttribute('data-attr');
    attributeChoiceDiv.style.display = 'none';
    resolveRound('attribute', attr);
  };
});

// Round resolution function
function resolveRound(mode, attribute = null) {
  // Opponent fuses two random animals
  const animalKeys = Object.keys(animals);
  function randomAnimal() {
    return animalKeys[Math.floor(Math.random() * animalKeys.length)];
  }

  const oppCard1 = randomAnimal();
  const oppCard2 = randomAnimal();
  const oppFuse = fuseAnimals([oppCard1, oppCard2]);
  const oppFusedName = generateFusedName(oppCard1, oppCard2);

  // Determine winner
  let winner;
  if (mode === 'average') {
    const playerAvg = averageStat(fusedAnimalStats);
    const oppAvg = averageStat(oppFuse);
    winner = playerAvg >= oppAvg ? 'Player 1' : 'Opponent';
  } else {
    winner = fusedAnimalStats[attribute] >= oppFuse[attribute] ? 'Player 1' : 'Opponent';
  }

  // Show round result including both fusions
  roundResultDiv.innerHTML = `
    <strong>You chose ${mode}${attribute ? ' (' + attribute + ')' : ''}.</strong><br><br>
    <strong>Your Fused Animal (${playerFusedName}):</strong> ${fusedAnimalStats ? `STR: ${fusedAnimalStats.STR}, SPE: ${fusedAnimalStats.SPE}, INT: ${fusedAnimalStats.INT}` : 'None'}<br>
    <strong>Opponent's Fused Animal (${oppFusedName}):</strong> STR: ${oppFuse.STR}, SPE: ${oppFuse.SPE}, INT: ${oppFuse.INT}<br><br>
    <strong>Result:</strong> You ${winner === 'Player 1' ? 'win!' : 'lose.'}
  `;

  // Reset UI for next turn
  fusedAnimalStats = null;
  fusionResultDiv.textContent = '';
  decisionArea.style.display = 'none';

  // Draw cards back up to 5
  player1.drawCards();
  renderHand();
}


// Initial render
renderHand();
fuseBtn.disabled = true;
decisionArea.style.display = 'none';
attributeChoiceDiv.style.display = 'none';
roundResultDiv.textContent = '';
fusionResultDiv.textContent = '';