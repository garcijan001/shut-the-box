console.log ('hi');

// Dices
const firstDice = document.getElementById("first-dice");
const secondDice = document.getElementById("second-dice");

// Buttons
const rollBtn = document.getElementById("rollBtn");
const individualBtn = document.getElementById("individualBtn");
const sumBtn = document.getElementById("sumBtn");
const endTurnBtn = document.getElementById("endTurnBtn");
const startBtn = document.getElementById("startBtn");
const playAgainButton = document.getElementById("playAgainBtn");

// Inputs
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");

//Variables
let currentPlayer = 1;
let round = 1;
let die1 = 0;
let die2 = 0;
let p1Total = 0;
let p2Total = 0;
const maxRounds = 5;
let boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];




// Start Button
startBtn.addEventListener('click', () => {
  const player1Name = player1NameInput.value.trim();
  const player2Name = player2NameInput.value.trim();

  if (player1Name === "" || player2Name === "") {
    alert("Please fill in both player names!!");
    return;
  }

  document.getElementById('currentPlayer').textContent = player1Name;
  rollBtn.disabled = false;

  document.getElementById('gameSection').style.display = "block";
  document.getElementById('playerSection').style.display = "none";
  document.getElementById('scorecard').style.display = "block";
  document.getElementById('winner').style.display = "none";
});

// Roll Dice Btn
rollBtn.addEventListener('click', () => {
  die1 = Math.floor(Math.random() * 6) + 1;
  die2 = Math.floor(Math.random() * 6) + 1;

  firstDice.className = `bi bi-dice-${die1}`;
  secondDice.className = `bi bi-dice-${die2}`;

  individualBtn.disabled = false;
  sumBtn.disabled = false;
  endTurnBtn.disabled = false;
});

// Individual Button
individualBtn.addEventListener('click', () => {
  if (die1 !== die2 && boxes[die1 - 1] !== "X" && boxes[die2 - 1] !== "X") {
    shut(die1);
    shut(die2);
    boxes[die1 - 1] = "X";
    boxes[die2 - 1] = "X";
    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
  }
});

//Sum Button
sumBtn.addEventListener('click', () => {
  const diceSum = die1 + die2;
  if (diceSum <= 9 && boxes[diceSum - 1] !== "X") {
    shut(diceSum);
    boxes[diceSum - 1] = "X";
    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
  }
});

// End Turn Btn
endTurnBtn.addEventListener('click', () => {
  rollBtn.disabled = true;
  individualBtn.disabled = true;
  sumBtn.disabled = true;
  endTurnBtn.disabled = true;

  let points = calculatePoints();
  if (currentPlayer === 1) {
    p1Total += points;
    buildRow(round, points, '');
    currentPlayer = 2;
    document.getElementById("currentPlayer").textContent = player2NameInput.value;
  } else {
    p2Total += points;
    updatePlayer2Points(round, points);
    currentPlayer = 1;
    document.getElementById("currentPlayer").textContent = player1NameInput.value;
    round++;
    if (round > maxRounds) {
      gameOver(p1Total, p2Total);
    }
  }

  resetBoard();
  rollBtn.disabled = false;

});


//function to shut box
function shut(boxNumber) {
  const box = document.getElementById(`box${boxNumber}`);
  if (box) {
    box.classList.add('shut');
    box.textContent = 'X';
  }
}

// Function to Calculate Points
function calculatePoints() {
  let total = 0;
  for (let i = 0; i < 9; i++) {
    if (boxes[i] !== "X") {
      total += i + 1;
    }
  }
  return 45 - total;
}

function buildRow(currentRound, player1Points, player2Points) {
  const row = document.createElement("tr");
  row.id = `Round${currentRound}`;

  const roundCell = document.createElement("th");
  roundCell.textContent = `Round ${currentRound}`;

  const player1Cell = document.createElement("td");
  player1Cell.className = "p1Pts";
  player1Cell.textContent = player1Points;

  const player2Cell = document.createElement("td");
  player2Cell.className = "p2Pts";
  player2Cell.textContent = player2Points;

  // Inserting cells before appending the row
  row.insertAdjacentElement('beforeend', roundCell);
  row.insertAdjacentElement('beforeend', player1Cell);
  row.insertAdjacentElement('beforeend', player2Cell);

  document.querySelector("#tBody").insertAdjacentElement('beforeend', row);
}


//Update Player 2 Points in the Table
function updatePlayer2Points(currentRound, player2Points) {
  const row = document.getElementById(`Round${currentRound}`);
  if (row) {
    row.querySelector('.p2Pts').textContent = player2Points;
  }
}

//function to reset the Board
function resetBoard() {
  boxes.fill(0);
  document.querySelectorAll(".box").forEach((box, i) => {
    box.classList.remove("shut");
    box.textContent = i + 1;
  });
}

//Ending the Game
function gameOver() {
  // hiding all sections except for scorecard and winner
  document.getElementById('gameSection').style.display = 'none';
  document.getElementById('playerSection').style.display = 'none';
  document.getElementById('winner').style.display = 'block';
  document.getElementById('scorecard').style.display = 'block';

  const player1Name = player1NameInput.value;
  const player2Name = player2NameInput.value;


  let winnerMessage = '';
  if (p1Total > p2Total) {
    winnerMessage = `${player1Name} wins with ${p1Total} points! ${player2Name} had ${p2Total} points.`;
  } else if (p2Total > p1Total) {
    winnerMessage = `${player2Name} wins with ${p2Total} points! ${player1Name} had ${p1Total} points.`;
  } else {
    winnerMessage = `It's a tie! Both players have ${p1Total} points.`;
  }

  //display th winner
  document.getElementById('winnerMessage').textContent = winnerMessage;
}

//play again btn
playAgainButton.addEventListener('click', () => {
  // Reset variables
  currentPlayer = 1;
  round = 1;
  die1 = 0;
  die2 = 0;
  p1Total = 0;
  p2Total = 0;
  boxes.fill(0);

  document.getElementById('tBody').innerHTML = '';

  document.getElementById('playerSection').style.display = 'block';
  document.getElementById('gameSection').style.display = 'none';
  document.getElementById('winner').style.display = 'none';
  document.getElementById('scorecard').style.display = 'none';


  rollBtn.disabled = true;
  individualBtn.disabled = true;
  sumBtn.disabled = true;
  endTurnBtn.disabled = true;

  resetBoard();

  player1NameInput.value = '';
  player2NameInput.value = '';
});

