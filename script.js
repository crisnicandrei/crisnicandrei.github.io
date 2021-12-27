const fish = document.getElementsByClassName("fish");
const fishByClass = document.querySelector(".fish-container");
const finishLine = document.getElementById("finish-line");
const timer = document.getElementById("timer");
const timerCounter = document.createElement("img");
const raceTrack = document.querySelector(".race-track");
const votingSection = document.getElementsByClassName("fish-section");
const scoreDisplay = document.getElementById("score");
const startGameButton = document.getElementById("start-game");
const info = document.getElementById("info");
const infoBody = document.getElementById("info-body");
const store = document.getElementById("store");
const storeIcon = document.getElementById("store-icon");
const inventory = document.getElementById("inventory");
const inventoryIcon = document.getElementById("inventory-icon");
const inventoryItems = document.getElementsByClassName("inventory-item");

Array.from(fish).forEach((fishInstance, index) => {
  //Start fish with 0 margin so they start right at the beggining

  fishInstance.style.left = `0%`;
  fishInstance.style.transition = "left 0.5s linear";
});

let voted;
const votedText = document.createElement("p");
votedText.classList.add("voted");
votedText.innerText = "⭐️";
let displayHelp = false;

timerCounter.classList.add("timer-image");

let counter = 1;
let win = false;
let winners = [];
let winner;
let score = 100;
let notVoted = true;
let shouldHaveListener = true;
let date = new Date();
let emptyInventory = {};
const selectedItems = {
  glasses: "",
  hats: "",
  glassesElement: "",
  hatsElement: "",
};

Object.entries(STORE).forEach((entry) => {
  emptyInventory[entry[1]["category"]] = [];
});

startGameButton.style.display = "none";

const shoppingCart = getValueFromStore("shoppingCart")
  ? JSON.parse(getValueFromStore("shoppingCart"))
  : emptyInventory;

scoreDisplay.innerText = getValueFromStore("score")
  ? getValueFromStore("score")
  : score;

const countDown = (val) => {
  startGameButton.style.display = "none";
  infoBody.style.display = "none";
  timer.style.opacity = 1;

  const countDownInterval = setInterval(() => {
    timerCounter.src = timerValues[val];

    timer.append(timerCounter);
    val++;
    if (val > 5) {
      handleLoadingAquarium(countDownInterval);
    }
  }, 1000);
};

//Reset the local storage after a day
(function () {
  var lastclear = localStorage.getItem("lastclear"),
    time_now = new Date().getTime();

  // .getTime() returns milliseconds so 1000 * 60 * 60  = 1 days
  if (time_now - lastclear > 1000 * 60 * 60) {
    localStorage.removeItem("score");

    localStorage.setItem("lastclear", time_now);
  }
})();

const playGame = () => {
  shouldHaveListener = false;
  let votedGlasses;
  let votedHat;
  console.log(voted.childNodes[1]);

  const votedDressedupFish = voted ? voted.childNodes[1].src : null;
  console.log(votedDressedupFish);
  if (document.getElementById("glasses-equip")) {
    votedGlasses = document.getElementById("glasses-equip").cloneNode(true);
    votedGlasses.classList.add("racing-glasses");
  }
  if (document.getElementById("hat-equip")) {
    votedHat = document.getElementById("hat-equip").cloneNode(true);
    votedHat.classList.add("racing-hat");
  }

  const gameInterval = setInterval(() => {
    Array.from(fish).forEach((fishInstance, index) => {
      //Start fish with 0 margin so they start right at the beggining

      if (votedDressedupFish === fishInstance.childNodes[1].src) {
        if (votedGlasses) {
          fishInstance.append(votedGlasses);
        }
        if (votedHat) {
          fishInstance.append(votedHat);
        }
        //Dress up the fish on the race track
      }

      const fishFarestPoint = fishInstance.getBoundingClientRect().right;
      const finishLineCoord = finishLine.getBoundingClientRect().right;

      calculateNewMargin(fishInstance, index);

      if (fishFarestPoint > finishLineCoord) {
        clearInterval(gameInterval);

        win = true;
        /*
      Add all the fish that pass the finish line to an array, 
      because there might be a chance that more of them will pass the finish line until the logic ends
      so I always get the fish that enters the array first
      */
        winners.push(fishInstance);
      }
    });
    if (win) {
      winner = winners[0];
      fishByClass.style.display = "none";

      displayKing(winner);
      displayPlayAgainButton(votedHat, votedGlasses);
    }
  }, 20);
};

const calculateNewMargin = (fish, index) => {
  let currentMargin = parseFloat(fish.style.left);
  let random = Math.floor(Math.random() * 100);
  let forward = Math.floor(Math.random() * 2);
  if (random < 40) {
    currentMargin -= forward;
    if (currentMargin < 0) {
      currentMargin = 0;
    }
  } else {
    currentMargin += forward;
  }
  if (index === 0) {
  }

  fish.style.left = `${currentMargin}%`;
};

const handleLoadingAquarium = (interval) => {
  timer.style.display = "none";
  fishByClass.style.display = "block";

  raceTrack.style.display = "block";
  clearInterval(interval);
  playGame();
};

const displayPlayAgainButton = (hat, glasses) => {
  const button = createPlayAgainButton();
  raceTrack.appendChild(button);
  button.addEventListener("click", () => {
    raceTrack.removeChild(button);
    playAgain(hat, glasses);
  });
};

const playAgain = (hat, glasses) => {
  Array.from(fish).forEach((f) => {
    f.style.left = `0%`;
    if (f.childNodes.length >= 4) {
      if (hat) {
        f.removeChild(hat);
      }
      if (glasses) {
        f.removeChild(glasses);
      }
    }
  });
  win = false;
  //Remove the king display
  const king = document.querySelector(".king");
  raceTrack.removeChild(king); //Removes the winner from the screen

  //Reappear timer
  timer.style.display = "block";
  timer.style.opacity = 0;
  timerCounter.src = timerValues[counter];
  counter = 2;

  //Hide racetrack, reset winners array and restart the counter
  raceTrack.style.display = "none";
  winners = [];
  if (voted) {
    realignFish(voted);
    voted = undefined;
    notVoted = true;
  }
  shouldHaveListener = true;
  infoBody.style.display = "block";
  info.style.display = "block";
};
const displayKing = (winner) => {
  const heading = document.createElement("h2");
  const prize = document.createElement("h3");
  const scoreResultText = document.createElement("h3");
  scoreResultText.classList.add("score-result");

  heading.classList.add("king-header");
  heading.classList.add("winner");

  prize.classList.add("king-header");
  prize.classList.add("king-header-medal");

  prize.innerText = PRIZE;
  heading.innerText = WINNER;
  let kingClone = winner.cloneNode(true);

  kingClone = crownKing(kingClone);

  const glasses = kingClone.querySelector("#glasses-equip");
  const hat = kingClone.querySelector("#hat-equip");

  if (hat) {
    hat.classList.remove(...hat.classList);
    hat.classList.add("hat-king");
  }
  if (glasses) {
    glasses.classList.remove(...glasses.classList);
    glasses.classList.add("glasses-king");
  }
  //Get the image of the winner fish and the voted one
  if (!notVoted) {
    const kingCloneImage = kingClone.childNodes[2].src;
    const votedImage = voted.childNodes[1].src;

    if (votedImage && votedImage === kingCloneImage) {
      scoreResultText.innerText = `You have added 40 points to your total score by winning this round. Your previous score was ${score}, your new score is ${
        score + 40
      }`;

      score += 40;
    } else {
      scoreResultText.innerText = `You have lost 10 points from your total score by losing this round. Your previous score was ${score}, your new score is ${
        score - 10
      }`;
      score -= 10;
    }
    setScoreInStore(score);
  }

  kingClone.classList.add("king");
  kingClone.classList.remove("fish");

  kingClone.insertBefore(prize, kingClone.firstChild);

  kingClone.insertBefore(heading, kingClone.firstChild);
  kingClone.append(scoreResultText);

  kingClone.style = "none";
  raceTrack.appendChild(kingClone);
};

Array.from(votingSection).forEach((section) => {
  section.addEventListener("click", (e) => {
    if (shouldHaveListener) {
      if (voted) {
        realignFish(voted);
      }
      section.append(votedText);
      section.style.justifyContent = "space-between";
      startGameButton.style.display = "block";
      info.style.display = "none";
      voted = section;
      notVoted = false;
      equipClothing(selectedItems["hats"], selectedItems["glasses"], voted);
    }
  });
});

startGameButton.addEventListener("click", () => {
  countDown(counter);
});

info.innerText = INSTRUCTION;

const storeItems = document.createElement("ul");
storeItems.classList.add("list");
STORE.forEach(({ emoji, price, name, category }) => {
  const li = document.createElement("li");
  li.classList.add("list-item");
  li.id = category;
  const titleEl = document.createElement("h3");
  titleEl.classList.add("list-heading");
  titleEl.innerText = `${name}`;

  const info = document.createElement("div");
  info.classList.add("info");

  const emojiEl = document.createElement("span");
  emojiEl.innerText = emoji;
  emojiEl.classList.add("emoji");

  const priceEl = document.createElement("p");
  priceEl.innerText = shoppingCart[category].includes(emoji)
    ? "OWNED"
    : `Price: ${price}`;
  priceEl.classList.add("price");

  info.append(titleEl, priceEl);

  li.append(info, emojiEl);
  storeItems.appendChild(li);
});

storeIcon.addEventListener("click", () => {
  if (store.classList.contains("open")) {
    store.classList.remove("open");
    store.removeChild(storeItems);
  } else {
    store.classList.add("open");
    store.appendChild(storeItems);
    const listItems = document.getElementsByClassName("list-item");

    Array.from(listItems).forEach((item) => {
      item.addEventListener("click", () => {
        const itemToBuy = item.childNodes[1].innerText;
        const { id } = item;
        const priceItemToBuy = parseFloat(
          item.childNodes[0].childNodes[1].innerText.split(" ")[1]
        );

        if (!shoppingCart[id].includes(itemToBuy) && score >= priceItemToBuy) {
          shoppingCart[id].push(itemToBuy);
          score = score - priceItemToBuy;
          setScoreInStore(score);
          window.localStorage.setItem(
            "shoppingCart",
            JSON.stringify(shoppingCart)
          );
          item.childNodes[0].childNodes[1].innerText = "OWNED";
          populateInventory();
        }
        handleEquipClothing();
      });
    });
  }
});

const setScoreInStore = (value) => {
  window.localStorage.setItem("score", value);
  scoreDisplay.innerText = window.localStorage.getItem("score");
};

inventoryIcon.addEventListener("click", () => {
  if (inventory.classList.contains("open")) {
    inventory.classList.remove("open");
  } else {
    inventory.classList.add("open");
  }
});
Object.keys(shoppingCart).forEach((key) => {
  const container = document.createElement("div");
  const header = document.createElement("h3");
  const inventoryList = document.createElement("ul");

  inventoryList.id = `inventory-list-${key}`;

  header.innerText = key;
  container.append(header, inventoryList);
  container.id = key;
  inventory.append(container);
});

const populateInventory = () =>
  Object.keys(shoppingCart).forEach((key) => {
    inventory.childNodes.forEach((child) => {
      if (child.id === key) {
        const inventoryList = document.getElementById(`inventory-list-${key}`);

        while (inventoryList.firstChild) {
          inventoryList.removeChild(inventoryList.lastChild);
        }

        shoppingCart[key].forEach((item) => {
          const inventoryItem = document.createElement("li");
          inventoryItem.id = key;
          inventoryItem.classList.add("inventory-item");
          inventoryItem.innerText = item;
          inventoryList.appendChild(inventoryItem);
        });
      }
    });
  });

window.addEventListener("load", () => {
  populateInventory();
  handleEquipClothing();
});

const equipClothing = (hat, glasses, votedFish) => {
  const id = votedFish.childNodes[1].id;

  if (hat) {
    let hatElement = document.getElementById("hat-equip");
    if (!hatElement) {
      hatElement = createInventoryItem(hatElement, "hat-equip");
    }
    dressUpFish(hatElement, `hat-equip-${id}`, hat, votedFish);
  }
  if (glasses) {
    let glassesElement = document.getElementById("glasses-equip");
    if (!glassesElement) {
      glassesElement = createInventoryItem(glassesElement, "glasses-equip");
    }
    dressUpFish(glassesElement, `glasses-equip-${id}`, glasses, votedFish);
  }
};

const handleEquipClothing = () =>
  Array.from(inventoryItems).forEach((item) => {
    item.addEventListener("click", () => {
      const { id, innerText } = item;

      if (innerText.indexOf("✅") !== -1) return;

      /*Check to see if an item has been previously selected, if yes we remove the "✅" text 
    then continue with appending the text to the clicked one :) */

      if (selectedItems[`${id}Element`]) {
        selectedItems[`${id}Element`].innerText =
          selectedItems[`${id}Element`].innerText.split(" ")[0];
      }

      selectedItems[id] = innerText;
      selectedItems[`${id}Element`] = item;
      selectedItems[`${id}Element`].innerText = `${innerText} ✅`;

      equipClothing(selectedItems["hats"], selectedItems["glasses"], voted);
    });
  });
