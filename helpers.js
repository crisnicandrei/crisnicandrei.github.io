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
  return winnerFish;
};
const remove = (element) => {
  const voted = element.querySelector(".voted");
  const hat = element.querySelector("#hat-equip");
  const glasses = element.querySelector("#glasses-equip");
  if (voted) {
    element.removeChild(voted);
  }
  if (hat) element.removeChild(hat);
  if (glasses) element.removeChild(glasses);
  console.log(voted);
};
const realignFish = (fish) => {
  fish.style.justifyContent = "center";
  remove(fish);
};
const getValueFromStore = (item) => window.localStorage.getItem(item);

const createInventoryItem = (element, id) => {
  element = document.createElement("span");
  element.id = id;
  return element;
};

const dressUpFish = (element, classToAdd, clothingItem, fishToAppendTo) => {
  element.classList.remove(...element.classList);
  element.classList.add(classToAdd);

  element.innerText = clothingItem;
  fishToAppendTo.append(element);
};
