const fish = document.getElementsByClassName("fish");
const fishByClass = document.querySelector(".fish-container");
const finishLine = document.getElementById("finish-line");
const timer = document.getElementById("timer");
const timerCounter = document.createElement("img");
const raceTrack = document.querySelector(".race-track");

timerCounter.classList.add("timer-image");

let currentMargin = 0;
let counter = 1;
let win = false;
let winners = [];
let winner;

const countDown = (val) => {
  const countDownInterval = setInterval(() => {
    timerCounter.src = timerValues[val];

    timer.append(timerCounter);
    val++;
    if (val > 5) {
      handleLoadingAquarium(countDownInterval);
    }
  }, 1000);
};

window.onload = () => {
  countDown(counter);
};

const playGame = () => {
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
  let random1 = Math.round(Math.random() * 100);
  let random2 = Math.round(Math.random() * 100);

  if (random1 * random2 > 5000) {
    if (window.innerWidth < 500) {
      currentMargin -= 3;
    } else {
      currentMargin -= 5;
    }
  } else {
    if (window.innerWidth < 500) {
      currentMargin += 1;
    } else {
      currentMargin += 3;
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
  timerCounter.src = timerValues[counter];

  //Hide racetrack, reset winners array and restart the counter
  raceTrack.style.display = "none";
  winners = [];
  countDown(counter + 1);
};
const displayKing = (winner) => {
  const heading = document.createElement("h2");
  heading.classList.add("king-header");
  heading.innerText = "Winner";
  let kingClone = winner.cloneNode(true);

  kingClone = crownKing(kingClone);

  kingClone.classList.add("king");
  kingClone.classList.remove("fish");

  kingClone.insertBefore(heading, kingClone.firstChild);
  kingClone.style.position = "absolute";
  kingClone.style.left = "33%";
  kingClone.style.top = "33%";
  kingClone.style.marginLeft = 0;
  raceTrack.appendChild(kingClone);
};
