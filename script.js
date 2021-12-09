const fish = document.getElementsByClassName("fish");
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

const countDown = () => {
  const countDownInterval = setInterval(() => {
    timerCounter.src = timerValues[counter];
    timer.append(timerCounter);
    counter++;
    if (counter > 5) {
      handleLoadingAquarium(countDownInterval);
    }
  }, 1000);
};

window.onload = () => {
  countDown();
};

const playGame = () => {
  const gameInterval = setInterval(() => {
    Array.from(fish).forEach((fishInstance) => {
      //Start fish with 0 margin so they start right at the beggining
      fishInstance.style.marginLeft = `${currentMargin}rem`;

      const fishFarestPoint = fishInstance.getBoundingClientRect().right;
      const finishLineCoord = finishLine.getBoundingClientRect().right;

      const { offsetWidth } = fishInstance;

      calculateNewMargin(fishInstance);

      if (fishFarestPoint > finishLineCoord + offsetWidth / 4) {
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
      crownKing(winner);
      displayPlayAgainButton();
    }
  }, 300);
};

const calculateNewMargin = (fish) => {
  let random = Math.round(Math.random() * 100);

  if (random > 40) {
    if (window.innerWidth < 500) {
      currentMargin -= 0.3;
    } else {
      currentMargin -= 0.5;
    }
  } else {
    if (window.innerWidth < 500) {
      currentMargin += 0.4;
    } else {
      currentMargin += 2.5;
    }
  }
  fish.style.marginLeft = `${currentMargin}rem`;
};

const handleLoadingAquarium = (interval) => {
  timer.style.display = "none";
  raceTrack.style.display = "block";
  clearInterval(interval);
  playGame();
};

const displayPlayAgainButton = () => {
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
    f.style.marginLeft = `${currentMargin}rem`;
  });
  win = false;
  counter = 1;
  winner.removeChild(winner.childNodes[0]); //Removes the crown
  timer.style.display = "block";
  raceTrack.style.display = "none";
  winners = [];
  countDown();
};
