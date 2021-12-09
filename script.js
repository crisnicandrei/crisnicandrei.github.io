const fish = document.getElementsByClassName("fish");
const finishLine = document.getElementById("finish-line");
const timer = document.getElementById("timer");
const timerCounter = document.createElement("img");
const raceTrack = document.querySelector(".race-track");
timerCounter.classList.add("timer-image");

let currentMargin = 0;
let counter = 1;
let win = false;
const winners = [];
let winner;

const countDownInterval = setInterval(() => {
  timerCounter.src = timerValues[counter];
  timer.append(timerCounter);
  counter++;
  if (counter > 5) {
    handleLoadingAquarium(countDownInterval);
  }
}, 1000);

const playGame = () => {
  const gameInterval = setInterval(() => {
    Array.from(fish).forEach((fishInstance) => {
      //Start fish with 0 margin so they start right at the beggining
      fishInstance.style.marginLeft = `${currentMargin}px`;

      const src = fishInstance.childNodes[1].src;

      const fishFarestPoint = fishInstance.getBoundingClientRect().right;
      const finishLineCoord = finishLine.getBoundingClientRect().left;

      console.log({
        fishFarestPoint,
        finishLineCoord,
        src,
      });

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
        if (win) {
          winner = winners[0];
          crownKing(winner);
          displayPlayAgainButton();
        }
      }
    });
  }, 100);
};

const crownKing = (winnerFish) => {
  const crownImage = document.createElement("img");
  crownImage.src = "./assets/crown.png";
  crownImage.classList.add("crown");
  winnerFish.insertBefore(crownImage, winnerFish.firstChild);
};

const calculateNewMargin = (fish) => {
  let random = Math.random();
  if (random < 0.4) {
    currentMargin -= 20;
  }
  currentMargin += 10;
  fish.style.marginLeft = `${currentMargin}px`;
};

const handleLoadingAquarium = (interval) => {
  timer.style.display = "none";
  raceTrack.style.display = "block";
  clearInterval(interval);
  playGame();
};
