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

function createFusedAnimal(animal1, animal2, size) {
  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Load images asynchronously with promises
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(`Failed to load image: ${src}`);
      img.src = src;
    });
  }

  // Use image paths based on animal names
  const img1Path = `assets/images/${animal1}.png`;
  const img2Path = `assets/images/${animal2}.png`;

  return Promise.all([loadImage(img1Path), loadImage(img2Path)])
    .then(([img1, img2]) => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw first image on left half
      ctx.drawImage(img1, 0, 0, size / 2, size);

      // Draw second image on right half
      ctx.drawImage(img2, size / 2, 0, size / 2, size);

      // Return the canvas
      return canvas;
    })
    .catch(err => {
      console.error(err);
      return canvas;  // return empty canvas on failure
    });
}


function generateFusedName(name1, name2) {
  const half1 = name1.slice(0, Math.ceil(name1.length / 2));
  const half2 = name2.slice(Math.floor(name2.length / 2));
  return (half1 + half2).charAt(0).toUpperCase() + (half1 + half2).slice(1);
}

function tryFusionImagePromise(name1, name2) {
  return new Promise((resolve) => {
    tryFusionImage(name1, name2, (imagePath) => {
      resolve(imagePath); // imagePath or null
    });
  });
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

let lastFusedAnimalNames = [];

fuseBtn.onclick = () => {
  if (selectedCards.length !== 2) return;
  fusedAnimalStats = fuseAnimals(selectedCards);
  playerFusedName = generateFusedName(selectedCards[0], selectedCards[1]);

  lastFusedAnimalNames = [...selectedCards];  // store for later drawing

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
      fusionResultDiv.innerHTML += `<em>No image found for fusion.</em><br>`;
    }

    fusionResultDiv.innerHTML += `
      <strong>Fused Animal: ${playerFusedName}</strong><br>
      STR: ${fusedAnimalStats.STR}, SPE: ${fusedAnimalStats.SPE}, INT: ${fusedAnimalStats.INT}
    `;
  });

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
async function resolveRound(mode, attribute = null) {
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

  // Get fusion images paths (or null)
  const playerFusionImgPath = await tryFusionImagePromise(lastFusedAnimalNames[0], lastFusedAnimalNames[1]);
  const oppFusionImgPath = await tryFusionImagePromise(oppCard1, oppCard2);

  // Build HTML for images or fallback
  function buildAnimalHtml(name1, name2, fusedName, fusedStats, fusionImgPath, isWinner) {
    const imgHtml = fusionImgPath
      ? `<img src="${fusionImgPath}" alt="${fusedName}" style="width:150px; display:block; margin: 10px auto;">`
      : `<div style="display:flex; justify-content:center; gap:10px; margin: 10px 0;">
           <img src="assets/images/${name1}.png" alt="${name1}" style="width:70px;">
           <img src="assets/images/${name2}.png" alt="${name2}" style="width:70px;">
         </div>`;

    return `
      <div style="text-align: center; padding: 15px; background: ${isWinner ? '#e8f5e9' : '#ffebee'}; border-radius: 8px;">
        <h3>${fusedName}</h3>
        ${imgHtml}
        <p>STR: ${fusedStats.STR}<br>
           SPE: ${fusedStats.SPE}<br>
           INT: ${fusedStats.INT}</p>
        ${isWinner ? '<div style="color: green; font-weight: bold;">WINNER!</div>' : ''}
      </div>
    `;
  }

  roundResultDiv.innerHTML = `
    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
      ${buildAnimalHtml(lastFusedAnimalNames[0], lastFusedAnimalNames[1], playerFusedName, fusedAnimalStats, playerFusionImgPath, winner === 'Player 1')}
      ${buildAnimalHtml(oppCard1, oppCard2, oppFusedName, oppFuse, oppFusionImgPath, winner === 'Opponent')}
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
      <strong>Comparison Mode:</strong> ${mode}${attribute ? ' (' + attribute + ')' : ''}
    </div>
  `;

  // Reset UI for next turn
  fusedAnimalStats = null;
  fusionResultDiv.textContent = '';
  decisionArea.style.display = 'none';

  // Clear selection and disable fuse button
  selectedCards = [];
  fuseBtn.disabled = true;
  playerFusedName = null;  // optional

  // Draw cards back up to 5
  player1.drawCards();
  renderHand();

  // Draw opponent's fused animal canvas
  const oppCanvas = document.getElementById('opponent-fused-canvas');
  const oppCtx = oppCanvas.getContext('2d');
  createFusedAnimal(oppCard1, oppCard2, 150).then(oppFusedCanvas => {
    oppCtx.clearRect(0, 0, 150, 150);
    oppCtx.drawImage(oppFusedCanvas, 0, 0, 150, 150);
  });
}


// Initial render
renderHand();
fuseBtn.disabled = true;
decisionArea.style.display = 'none';
attributeChoiceDiv.style.display = 'none';
roundResultDiv.textContent = '';
fusionResultDiv.textContent = '';