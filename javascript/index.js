let difficulty = 1;

const
  difficultySelection = document.querySelector('.js-difficulty'),
  generateButton = document.querySelector('.js-generate-button');

const init = async function () {

  difficultySelection.addEventListener('change', dropdownHandler);
  generateButton.addEventListener('click', generateHandler);

  let options = {
    type: ["static", "dynamic"],
    companies: companies,
    audience: audience,
    theme: [],
    design: design,
    features: features,
    skills: skills
  }

  const selectedOptions = selectOptions(options, difficulty);

  const
    stringSegments = [
      "Build a ",
      " website for a new ",
      " that has a target audience of ",
      ", and a color theme of ",
      ". The content of the site should align with the target audience, and has ",
      " design elements. Key features should include ",
      ". To incorporate the design elements, the project must use ",
      "."
    ];

  const paragraph = document.querySelector('.js-text');

  for (let i = 0; i < stringSegments.length; i++) {
    const segment = stringSegments[i];

    await print(paragraph, segment);

    let isTheme = false, hex;

    if (Object.keys(options)[i] === 'theme') {
      isTheme = true;
      hex = selectedOptions[i];
    }

    const span = createSpan(isTheme, hex);
    paragraph.appendChild(span);
    if (i < stringSegments.length - 1) {
      await print(span, selectedOptions[i].join(', '));
    }
  }

  function dropdownHandler(event) {
    const value = event.target.value;

    difficulty = Number(value);
  }
}

function generateHandler(event) {
  document.querySelector('.js-text').innerHTML = '';
  difficulty = difficultySelection.value;
  init();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function selectOptions(options, difficulty) {
  const selectedOptions = [];

  for (let key in options) {
    let multiplier = difficulty * 2;

    if (key === 'type' || key === 'companies' || key === 'audience') {
      multiplier = 1;
    }

    if (key === 'theme') {
      multiplier = 3;

      const themes = [];

      while (multiplier > 0) {
        themes.push(getRandomColor());
        multiplier--;
      }

      selectedOptions.push(themes);

      continue;
    }

    const otherOptions = [];

    while (multiplier > 0) {
      let
        randomIndex = Math.floor(Math.random() * options[key].length),
        randomItem = options[key][randomIndex];

      while (otherOptions.includes(randomItem)) {
        randomIndex = Math.floor(Math.random() * options[key].length);
        randomItem = options[key][randomIndex];
      }

      otherOptions.push(randomItem);

      --multiplier;
    }

    selectedOptions.push(otherOptions);
  }

  return selectedOptions;
}

async function print(target, text) {
  for (let i = 0; i < text.length; i++) {
    const character = text[i];

    target.innerHTML += character;

    // runs resolve() every x milliseconds in a set timeout (sleep)
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

function createSpan(isTheme, hex) {
  const span = document.createElement('span');

  span.classList.add('selected-option');

  if (isTheme) {
    span.style.color = hex;
  }

  return span;
}

init();