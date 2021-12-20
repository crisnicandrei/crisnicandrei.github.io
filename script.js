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

let voted;
const votedText = document.createElement("p");
votedText.classList.add("voted");
votedText.innerText = "⭐️";
let displayHelp = false;

timerCounter.classList.add("timer-image");

let currentMargin = 0;
let counter = 1;
let win = false;
let winners = [];
let winner;
let score = 100;
let notVoted = false;
let shouldHaveListener = true;
let date = new Date();
let emptyInventory = {};
const selectedItems = {
  glasses: "",
  hats: "",
  shirts: "",
  glassesElement: "",
  hatsElement: "",
  shirtsElement: "",
};

Object.entries(STORE).forEach((entry) => {
  emptyInventory[entry[1]["category"]] = [];
});

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
  const gameInterval = setInterval(() => {
    Array.from(fish).forEach((fishInstance) => {
      //Start fish with 0 margin so they start right at the beggining
      fishInstance.style.marginLeft = `${currentMargin}%`;
      fishInstance.style.transition = "margin-left 0.5s linear";

      const fishFarestPoint = fishInstance.getBoundingClientRect().right;
      const finishLineCoord = finishLine.getBoundingClientRect().right;

      calculateNewMargin(fishInstance);

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
      displayPlayAgainButton();
    }
  }, 500);
};

const calculateNewMargin = (fish) => {
  let random = Math.round(Math.random() * 100);
  let forward = Math.round(Math.random() * 10);
  let backwards = Math.round(Math.random() * 10);

  if (random > 66) {
    if (window.innerWidth < 500) {
      currentMargin -= backwards - 2;
    } else {
      currentMargin -= backwards * 2;
    }
    if (currentMargin < 0) {
      currentMargin = 0;
    }
  } else {
    if (window.innerWidth < 500) {
      currentMargin += forward - 2;
    } else {
      currentMargin += forward;
    }
  }

  fish.style.marginLeft = `${currentMargin}%`;
};

const handleLoadingAquarium = (interval) => {
  timer.style.display = "none";
  fishByClass.style.display = "block";

  raceTrack.style.display = "block";
  clearInterval(interval);
  playGame();
};

const displayPlayAgainButton = (winner) => {
  const button = createPlayAgainButton();
  raceTrack.appendChild(button);
  button.addEventListener("click", () => {
    raceTrack.removeChild(button);
    playAgain();
  });
};

const playAgain = () => {
  currentMargin = 0;
  Array.from(fish).forEach((f) => {
    f.style.marginLeft = `${currentMargin}%`;
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
    notVoted = false;
  }
  shouldHaveListener = true;
  startGameButton.style.display = "block";
  infoBody.style.display = "block";
};
const displayKing = (winner) => {
  const heading = document.createElement("h2");
  const prize = document.createElement("h3");
  heading.classList.add("king-header");
  prize.classList.add("king-header");
  prize.innerText = PRIZE;
  heading.innerText = WINNER;
  let kingClone = winner.cloneNode(true);

  kingClone = crownKing(kingClone);

  //Get the image of the winner fish and the voted one
  if (notVoted) {
    const kingCloneImage = kingClone.childNodes[2].src;
    const votedImage = voted.childNodes[1].src;

    if (votedImage && votedImage === kingCloneImage) {
      score += 40;
    } else {
      score -= 10;
    }
    setScoreInStore(score);
  }

  kingClone.classList.add("king");
  kingClone.classList.remove("fish");

  kingClone.insertBefore(prize, kingClone.firstChild);

  kingClone.insertBefore(heading, kingClone.firstChild);

  kingClone.style.marginLeft = 0;
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
      voted = section;
      notVoted = true;
      equipClothing(
        selectedItems["hats"],
        selectedItems["glasses"],
        selectedItems["shirts"],
        voted
      );
    }
  });
});

startGameButton.addEventListener("click", () => {
  countDown(counter);
});
infoBody.addEventListener("click", () => {
  displayHelp = !displayHelp;
  let text = displayHelp ? INSTRUCTION : NEEDHELP;

  info.innerText = text;
});

const storeItems = document.createElement("ul");
storeItems.classList.add("list");
STORE.forEach(({ emoji, price, name, category }) => {
  const li = document.createElement("li");
  li.classList.add("list-item");
  li.id = category;
  const titleEl = document.createElement("h3");
  titleEl.classList.add("list-heading");
  titleEl.innerText = `Name: ${name}`;

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

const equipClothing = (hat, glasses, shirt, votedFish) => {
  const id = votedFish.childNodes[3].id;

  if (hat) {
    let hatElement = document.getElementById("hat-equip");
    if (!hatElement) {
      hatElement = document.createElement("span");
      hatElement.id = "hat-equip";
    }
    hatElement.innerText = hat;
    hatElement.classList.remove(...hatElement.classList);
    hatElement.classList.add(`hat-equip-${id}`);

    votedFish.append(hatElement);
  }
  if (glasses) {
    let glassesElement = document.getElementById("glasses-equip");
    if (!glassesElement) {
      glassesElement = document.createElement("span");
      glassesElement.id = "glasses-equip";
    }
    glassesElement.classList.remove(...glassesElement.classList);
    glassesElement.classList.add(`glasses-equip-${id}`);

    glassesElement.innerText = glasses;
    votedFish.append(glassesElement);
  }
  if (shirt) {
    let shirtElement = document.getElementById("shirt-equip");
    if (!shirtElement) {
      shirtElement = document.createElement("span");
      shirtElement.id = "shirt-equip";
    }
    shirtElement.classList.remove(...shirtElement.classList);
    shirtElement.classList.add(`shirt-equip-${id}`);

    shirtElement.innerText = shirt;
    votedFish.append(shirtElement);
  }
};

const handleEquipClothing = () =>
  Array.from(inventoryItems).forEach((item) => {
    item.addEventListener("click", () => {
      const { id, innerText } = item;

      if (innerText.indexOf("equipped") !== -1) return;

      /*Check to see if an item has been previously selected, if yes we remove the "equipped" text 
    then continue with appending the text to the clicked one :) */

      if (selectedItems[`${id}Element`]) {
        selectedItems[`${id}Element`].innerText =
          selectedItems[`${id}Element`].innerText.split(" ")[0];
      }

      selectedItems[id] = innerText;
      selectedItems[`${id}Element`] = item;
      selectedItems[`${id}Element`].innerText = `${innerText} equipped`;

      equipClothing(
        selectedItems["hats"],
        selectedItems["glasses"],
        selectedItems["shirts"],
        voted
      );
    });
  });
