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
const shoppingCart = getValueFromStore("shoppingCart")
  ? Array.from(getValueFromStore("shoppingCart")).filter(
      (value) => value != ","
    )
  : [];

scoreDisplay.innerText = getValueFromStore("score")
  ? getValueFromStore("score")
  : score;

console.log(getValueFromStore("score"));
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
STORE.forEach(({ emoji, price, name }) => {
  const li = document.createElement("li");
  li.classList.add("list-item");
  const titleEl = document.createElement("h3");
  titleEl.classList.add("list-heading");
  titleEl.innerText = `Name: ${name}`;

  const info = document.createElement("div");
  info.classList.add("info");

  const emojiEl = document.createElement("span");
  emojiEl.innerText = emoji;
  emojiEl.classList.add("emoji");

  const priceEl = document.createElement("p");
  priceEl.innerText = shoppingCart.includes(emoji)
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
        const priceItemToBuy = parseFloat(
          item.childNodes[0].childNodes[1].innerText.split(" ")[1]
        );
        if (!shoppingCart.includes(itemToBuy) && score >= priceItemToBuy) {
          shoppingCart.push(itemToBuy);
          score = score - priceItemToBuy;
          setScoreInStore(score);
          window.localStorage.setItem("shoppingCart", shoppingCart);
          item.childNodes[0].childNodes[1].innerText = "OWNED";
        }
      });
    });
  }
});

const setScoreInStore = (value) => {
  window.localStorage.setItem("score", value);
  scoreDisplay.innerText = window.localStorage.getItem("score");
};
