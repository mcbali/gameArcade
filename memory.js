const turnLabel = document.getElementById("turnLabel");
let turnCount = 0;

// pairs of fruits that are associated with cards
const fruits = ["🍎", "🍎", "🍒", "🍒", "🍓", "🍓", "🍇", "🍇", "🍉", "🍉", "🫐", "🫐", "🍊", "🍊", "🍋", "🍋"]
console.log(fruits);

// easy mode has 8 cards/4 pairs of fruit
const easyFruits = fruits.slice(0, -8);
console.log(easyFruits);
// medium mode has 12 cards/6 pairs of fruit
const mediumFruits = fruits.slice(0, -4);
console.log(mediumFruits);

let randomizedFruits;
let gameActive = true;
const cells = document.querySelectorAll(".cell");

// make sure page loads when executing js
document.addEventListener('DOMContentLoaded', () => {
    setupGame();
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

// check radios to get difficulty selection
function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

// shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setupGame() {
    let rows;
    let cols;
    const difficulty = getDifficulty();
    // set up game board based on difficulty
    switch (difficulty) { 
        case 'easy':
            rows = 2;
            cols = 4;
            randomizedFruits = shuffle(easyFruits);
            break;
        case 'medium':
            rows = 3;
            cols = 4;
            randomizedFruits = shuffle(mediumFruits);
            break;
        case 'hard':
            rows = 4;
            cols = 4;
            randomizedFruits = shuffle(fruits);
            break;
        default:
            rows = 4;
            cols = 4;
            randomizedFruits = shuffle(fruits);
            break;
    }
    console.log(randomizedFruits);

    // display blank cards initially
    gameState = new Array(rows * cols).fill("");
    console.log(gameState);
    //turn count is always 0 at start
    turnCount = 0;
    turnLabel.textContent = "Number of Turns: 0";

    const board = document.querySelector('.board');
    board.innerHTML = ''; // erase initial cells

    // create new cells. amount of cells depends on difficulty.
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        cell.setAttribute('data-cell-index', i);
        board.appendChild(cell);
    }
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

// reinitialize the game state when restart button is clicked
function restartGame() {
    gameActive = true;
    randomizedFruits = shuffle(fruits);
    turnCount = 0;
    pickNumber = 0;
    turnLabel.textContent = "Number of Turns: 0";
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = 'cell'; // Reset classes
    setupGame();
    timeActive = false;
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // reset timer
    clearInterval(time);
    startTime = 0;
    elapsedTime = 0;
    timeActive = false;
    timer.textContent = "Timer: 00:00:00";
    });
}

let pickNumber = 0;
let pickHistory = "";
let cellHistory;
let indexHistory;
let timeActive = false;

function handleCellPlayed(clickedCell, clickedCellIndex) {
    clickedCell.innerHTML = randomizedFruits[clickedCellIndex];
    if (pickNumber == 0){ // first fruit selected of turn
        pickHistory = randomizedFruits[clickedCellIndex]; // store first fruit that is clicked during a turn
        cellHistory = clickedCell; // store the cell
        indexHistory = clickedCellIndex; // store the index
        gameState[clickedCellIndex] = randomizedFruits[clickedCellIndex]; // update clicked cell in game state
        pickNumber++; // increment for second pick
        if (timeActive == false) {
            startTimer(); // timer begins when first cell is clicked
            timeActive = true;
        }
        
    } else if (pickNumber == 1){ // second pick of a turn
        pickNumber = 0; // reset pick for next turn
        turnCount++; // increment turn count
        turnLabel.textContent = `Number of Turns: ${turnCount}`; // display turn count
        if (pickHistory == randomizedFruits[clickedCellIndex]) { // check if pair of fruit matches
            clickedCell.innerHTML = randomizedFruits[clickedCellIndex];
            cellHistory.innerHTML = randomizedFruits[clickedCellIndex];
            gameState[clickedCellIndex] = randomizedFruits[clickedCellIndex]; // fruits remain revealed if match
        } else { // if mismatch, cells flip back to blank side
            gameState[indexHistory] = ""; 
            gameState[clickedCellIndex] = "";
            gameActive = false; // prevent beginning another turn while mismatched cells are in the middle of flipping back.
            setTimeout(function(){
                cellHistory.innerHTML = "";
                clickedCell.innerHTML = "";
                cellHistory.className = 'cell'; // reset class/flip back
                clickedCell.className = 'cell'; // reset class/flip back
                gameActive = true;
              }, 1000);
        }
    }
    if (gameState.every(cell => cell != "")) { // if all pairs of fruits have been matched, stop the game
        turnLabel.textContent = `YOU WON IN ${turnCount} TURNS!`;
        stopTimer();
        timeActive = false;
    }
}

// initialize timer
const timer = document.getElementById("timer");
let time = null;
let startTime = 0;
let elapsedTime = 0;
function startTimer() {
    startTime = Date.now() - elapsedTime;
    time = setInterval(update, 10);
}

// update timer
function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime; // calculates elapsed time
    let min = Math.floor(elapsedTime / (1000 * 60) % 60); // calculates minutes elapsed
    let sec = Math.floor(elapsedTime / 1000 % 60); // calculates seconds elapsed
    let ms = Math.floor(elapsedTime % 1000 / 10); // calculates milliseoncds elapsed
    // pad with 0 if time is single digit
    min = String(min).padStart(2, "0");
    sec = String(sec).padStart(2, "0");
    ms = String(ms).padStart(2, "0");
    // display time
    timer.textContent = `Timer: ${min}:${sec}:${ms}`;
}

// pauses timer
function stopTimer() {
    clearInterval(time);
    elapsedTime = Date.now() - startTime;
}

// flips cards when clicked
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    this.classList.add('cellOpen');
    handleCellPlayed(clickedCell, clickedCellIndex);
}
