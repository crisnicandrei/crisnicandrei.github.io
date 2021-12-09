const createPlayAgainButton = () => {
  const playAgainButton = document.createElement("button");
  playAgainButton.innerText = PLAYAGAIN;
  playAgainButton.classList.add("play-again");
  return playAgainButton;
};

const crownKing = (winnerFish) => {
  const crownImage = document.createElement("img");
  crownImage.src = "./assets/crown.png";
  crownImage.classList.add("crown");
  winnerFish.insertBefore(crownImage, winnerFish.firstChild);
};
