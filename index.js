const body = document.body;
const textgraph = document.querySelector("p");
const btn = document.querySelector("#bodyButton");
const container = document.querySelector("#container");

btn.addEventListener("click", () => {
  const randRGBArray = getRandomColor();
  const randRGBFormatString = `RGB(${randRGBArray[0]}, ${randRGBArray[1]}, ${randRGBArray[2]})`;
  body.style.backgroundColor = randRGBFormatString;
  textgraph.textContent = randRGBFormatString;

  const divs = container.childNodes;
  for (let div of divs) {
    updateContrast(div.lastChild, getContrast(getBackgroundColor(div), getBackgroundColor(body)));
  }

  if (getContrastYIQ(...randRGBArray) === "white") {
    textgraph.classList.add("white-text");
  } else {
    textgraph.classList.remove("white-text");
  }
});

for (let i = 0; i < 9; i++) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("box-button");
  newDiv.textContent = "Generate Color";
  newDiv.addEventListener("click", changeColor);
  container.appendChild(newDiv);
}

function updateContrast(elem, newContrast) {
  elem.textContent = `Contrast(${Math.round(newContrast * 1000) / 1000})`;
}

function getBackgroundColor(elem) {
  const elemBGColor = window.getComputedStyle(elem).getPropertyValue("background-color");
  return elemBGColor.replaceAll(/\D/g, " ").trim().split("  ");
}


function changeColor() {
  const randRGBArray = getRandomColor();
  const randRGBFormatString = `RGB(${randRGBArray[0]}, ${randRGBArray[1]}, ${randRGBArray[2]})`;
  this.style.backgroundColor = randRGBFormatString;

  const bodyRGBArray = getBackgroundColor(body);
  console.log(bodyRGBArray);
  const contrast = getContrast(randRGBArray, bodyRGBArray);
  const rgbText = document.createElement("p");
  rgbText.textContent = randRGBFormatString;
  const contrastText = document.createElement("p");
  updateContrast(contrastText, contrast);

  this.textContent = "";
  this.appendChild(rgbText);
  this.appendChild(contrastText);

  if (getContrastYIQ(...randRGBArray) === "white") {
    this.classList.add("white-text");
  } else {
    this.classList.remove("white-text");
  }
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 255) + 1;
  const g = Math.floor(Math.random() * 255) + 1;
  const b = Math.floor(Math.random() * 255) + 1;
  return [r, g, b];
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(function (value) {
    value /= 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// https://24ways.org/2010/calculating-color-contrast/
// https://en.wikipedia.org/wiki/YIQ
function getContrastYIQ(r, g, b) {
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}
