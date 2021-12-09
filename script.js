const fish = document.getElementsByClassName("fish");
const finishLine = document.getElementById("finish-line");

let countDown = true;
let startGame = false;

let currentMargin = 0;
let counter = 0;
let win = false;
const winners = [];
let winner;

const scrollOffsets = (function () {
  const w = window;

  // This works for all browsers except IE versions 8 and before
  if (w.pageXOffset != null) return { x: w.pageXOffset, y: w.pageYOffset };
  // For IE (or any browser) in Standards mode
  const d = w.document;
  if (document.compatMode == "CSS1Compat")
    return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };
  // For browsers in Quirks mode
  return { x: d.body.scrollLeft, y: d.body.scrollTop };
})();

const finishLineOffset =
  finishLine.getBoundingClientRect().left + scrollOffsets.x;

if (startGame) {
  const gameInterval = setInterval(() => {
    Array.from(fish).forEach((fishInstance) => {
      //Start fish with 0 margin so they start right at the beggining
      fishInstance.style.marginLeft = `${currentMargin}px`;

      calculateNewMargin(fishInstance);

      const currentLeftMargin = parseFloat(fishInstance.style["margin-left"]);
      const { offsetWidth } = fishInstance;
      if (currentLeftMargin + offsetWidth >= finishLine.offsetLeft) {
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
      clearInterval(gameInterval);
      winner = winners[0];
      crownKing(winner);
    }
  }, 500);
}

const crownKing = (winnerFish) => {
  const crownImage = document.createElement("img");
  crownImage.src = "./assets/crown.png";
  crownImage.classList.add("crown");
  winnerFish.insertBefore(crownImage, winnerFish.firstChild);
};

const calculateNewMargin = (fish) => {
  let random = Math.random();
  if (random < 0.5) {
    currentMargin -= 60;
  }
  currentMargin += 40;
  fish.style.marginLeft = `${currentMargin}px`;
};
