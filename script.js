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

let voted;
const votedText = document.createElement("p");
votedText.classList.add("voted");
votedText.innerText = "⭐️";
let displayHelp = false;

timerCounter.classList.add("timer-image");

scoreDisplay.innerText = window.localStorage.getItem("score")
  ? window.localStorage.getItem("score")
  : 0;

let currentMargin = 0;
let counter = 1;
let win = false;
let winners = [];
let winner;
let score = 0;
let notVoted = false;
let shouldHaveListener = true;
let date = new Date();

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

// window.onload = () => {
//   countDown(counter);
// };

//Reset the local storage after a day
(function () {
  var lastclear = localStorage.getItem("lastclear"),
    time_now = new Date().getTime();

  // .getTime() returns milliseconds so 1000 * 60 * 60  = 1 days
  if (time_now - lastclear > 1000 * 60 * 60) {
    localStorage.clear();

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
    window.localStorage.setItem("score", score);
    scoreDisplay.innerText = window.localStorage.getItem("score");
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
  let text = displayHelp
    ? "You can start the game by voting for a fish then clicking the button below, or you can start it without voting if you don't feel like gambling"
    : "Need help ?";

  info.innerText = text;
});
