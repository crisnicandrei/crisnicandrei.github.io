const fish = document.getElementsByClassName("fish");
const finishLine = document.getElementById("finish-line");
let currentMargin = 0;
let counter = 0;
let win = false;

console.log(finishLine);

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

const gameInterval = setInterval(() => {
  Array.from(fish).forEach((fishInstance) => {
    //Start fish with 0 margin so they start right at the beggining
    fishInstance.style.marginLeft = `${currentMargin}px`;
    let random = Math.random();
    if (random < 0.5) {
      currentMargin -= 60;
    }
    currentMargin += 50;
    fishInstance.style.marginLeft = `${currentMargin}px`;

    const currentLeftMargin = parseFloat(fishInstance.style["margin-left"]);
    const naturalWidth = fishInstance.naturalWidth;
    if (currentLeftMargin + naturalWidth > finishLineOffset) {
      win = true;
    }
  });
  if (win) {
    clearInterval(gameInterval);
  }
}, 500);
