const body = document.body;
const textgraph = document.querySelector("p");
const btn = document.querySelector("#bodyButton");
const container = document.querySelector("#container");

btn.addEventListener("click", (event) => {
  console.log(event);
  const randRGBArray = getRandomColor();
  const randRGBFormatString = `RGB(${randRGBArray[0]}, ${randRGBArray[1]}, ${randRGBArray[2]})`;
  body.style.backgroundColor = randRGBFormatString;
  textgraph.textContent = randRGBFormatString;

  const divs = container.childNodes;
  for (let div of divs) {
    const textContainer = div.querySelector("#textContainer");
    if (!textContainer) continue;

    updateContrast(
      textContainer.querySelector("#contrastText"),
      getContrast(getBackgroundColor(div), getBackgroundColor(body))
    );
  }

  if (getContrastYIQ(...randRGBArray) === "white") {
    textgraph.classList.add("white-text");
    for (let div of divs) {
      if (div.childNodes.length === 1) {
        div.classList.add("white-text");
      }
    }
  } else {
    textgraph.classList.remove("white-text");
    for (let div of divs) {
      if (div.childNodes.length === 1) {
        div.classList.remove("white-text");
      }
    }
  }
});

for (let i = 0; i < 9; i++) {
  const newDiv = document.createElement("div");
  const newP = document.createElement("p");
  newP.id = "tempP";
  newP.textContent = "Generate Color";
  newDiv.classList.add("box-button");
  newDiv.appendChild(newP);
  container.appendChild(newDiv);

  newDiv.addEventListener("click", (event) => {
    initDivElements(event);
  }, { once: true });

}

function updateContrast(elem, newContrast) {
  elem.textContent = `Contrast(${Math.round(newContrast * 1000) / 1000})`;
}

function getBackgroundColor(elem) {
  const elemBGColor = window.getComputedStyle(elem).getPropertyValue("background-color");
  return elemBGColor.replaceAll(/\D/g, " ").trim().split("  ");
}


const changeBGColor = (event) => {
  console.log(event.bubbles);
  const elem = event.currentTarget;
  const randRGBArray = getRandomColor();
  const bodyRGBArray = getBackgroundColor(body);

  const randRGBFormatString = `RGB(${randRGBArray[0]}, ${randRGBArray[1]}, ${randRGBArray[2]})`;
  elem.style.backgroundColor = randRGBFormatString;


  const rgbText = elem.querySelector("#rgbText");
  rgbText.textContent = randRGBFormatString;

  const contrast = getContrast(randRGBArray, bodyRGBArray);
  const contrastText = elem.querySelector("#contrastText");
  updateContrast(contrastText, contrast);

  if (getContrastYIQ(...randRGBArray) === "white") {
    elem.classList.add("white-text");
  } else {
    elem.classList.remove("white-text");
  }
};

const initDivElements = (event) => {
  const rgbText = document.createElement("p");
  rgbText.id = "rgbText";
  const contrastText = document.createElement("p");
  contrastText.id = "contrastText";
  const textContainer = document.createElement("div");
  textContainer.id = "textContainer";
  const copyDiv = document.createElement("div");
  copyDiv.id = "copyDiv";

  copyDiv.classList.add("copy-button");
  copyDiv.textContent = "Copy";
  copyDiv.addEventListener("click", (event) => {
    event.stopPropagation();
    copyTextToClipboard(rgbText);
  });

  textContainer.appendChild(rgbText);
  textContainer.appendChild(contrastText);
  textContainer.classList.add("d-flex-column");

  event.currentTarget.removeChild(event.currentTarget.querySelector("#tempP"));
  event.currentTarget.appendChild(textContainer);
  event.currentTarget.appendChild(copyDiv);
  changeBGColor(event);
  event.currentTarget.addEventListener("click", changeBGColor);
};

function copyTextToClipboard(elem) {
  console.log(elem.textContent);
  navigator.clipboard.writeText(elem.textContent);
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
