// Páginas
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Página de apresentação
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Página de contagem regressiva
const countdown = document.querySelector('.countdown');
// Página do jogo
const itemContainer = document.querySelector('.item-container');
// Página de pontuação
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equações
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Página do jogo
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Tempo
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Rolagem
let valueY = 0;

// Atualizar as melhores pontuações da página inicial
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Verifique o armazenamento local para obter as melhores pontuações, defina melhor matriz de pontuação
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Atualizar matriz de melhores pontuações
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Selecione a melhor pontuação correta para atualizar
    if (questionAmount == score.questions) {
      // Retorna a melhor pontuação como número com uma casa decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      //Atualize se a nova pontuação final for menor ou substituir zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Atualizar página inicial
  bestScoresToDOM();
  // Salvar no armazenamento local
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reiniciar jogo
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Mostrar página de pontuação
function showScorePage() {
  // Mostrar o botão Reproduzir novamente após 1 segundo de atraso
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Formatar e exibir tempo no DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Hora base: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalidade: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Role até o topo, vá para a página de pontuação
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// Pare o cronômetro, processe os resultados, vá para a página de pontuação
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Verifique se há palpite errado, adicione tempo de penalidade
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Suposição correta, sem penalidade
      } else {
        // Suposição incorreta, adicionar penalidade
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('tempo:', timePlayed, 'penalidade:', penaltyTime, 'final:', finalTime);
    scoresToDOM();
  }
}

// Adicione um décimo de segundo ao tempo Reproduzido
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Iniciar o cronômetro quando a página do jogo for clicada
function startTimer() {
  // Redefinir tempos
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// Role, armazene a seleção do usuário no player Guess Array
function select(guessedTrue) {
  // Role mais 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Adicionar palpite do jogador à matriz
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Exibe a página do jogo
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Obtenha um número aleatório até um determinado valor
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Criar equações aleatórias corretas/incorretas
function createEquations() {
  // Escolha aleatoriamente quantas equações corretas devem existir
  const correctEquations = getRandomInt(questionAmount);
  console.log('equações corretas:', correctEquations);
  // Definir quantidade de equações erradas
  const wrongEquations = questionAmount - correctEquations;
  console.log('equações erradas:', wrongEquations);
  // Faça um loop para cada equação correta, multiplique números aleatórios até 9, pressione para a matriz
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Faça um loop para cada equação errada, mexa com os resultados da equação, pressione para a matriz
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Adicionar equações ao DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Texto da equação
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Acrescentar
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Adicionando dinamicamente equações corretas/incorretas
function populateGamePage() {
  // Redefinir DOM, definir espaço em branco acima
  itemContainer.textContent = '';
  // Espaço
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Item selecionado
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Acrescentar
  itemContainer.append(topSpacer, selectedItem);

  // Crie equações, construa elementos no DOM
  createEquations();
  equationsToDOM();

  // Definir espaço em branco abaixo
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!
function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2';
  }, 1000);
  setTimeout(() => {
    countdown.textContent = '1';
  }, 2000);
  setTimeout(() => {
    countdown.textContent = 'VAMOS!';
  }, 3000);
}

// Navegue da página inicial para a página de contagem regressiva para a página do jogo
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Obtenha o valor do botão de opção selecionado
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Formulário que decide quantidade de perguntas
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('valor da pergunta:', questionAmount);
  if (questionAmount) {
      showCountdown();
  }
}

// Alternar o estilo de entrada selecionado
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remover Estilo de Rótulo Selecionado
    radioEl.classList.remove('selected-label');
    // Adicione-o de volta se a entrada de rádio estiver marcada
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners
gamePage.addEventListener('click', startTimer);
startForm.addEventListener('submit', selectQuestionAmount);

// On Load
getSavedBestScores();
