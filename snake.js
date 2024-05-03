let canvas = document.querySelector('#snakeGame');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('#scoreDisplay');

let score = 0; // score is initially 0
let speed = 100; // default speed is 100

canvas.width = 375; 
canvas.height = 375;
let squareSize = canvas.width / 15; // 15 rows 15 cols
let gameActive = false;

let snake = [{x:squareSize, y:8*squareSize},{x:2*squareSize, y:8*squareSize},{x:3*squareSize, y:8*squareSize},{x:4*squareSize, y:8*squareSize}]
let xd = squareSize; // difference in x positioning
let yd = 0; // difference in y positioning

// apple coordinates
let appleX; 
let appleY;

document.addEventListener('DOMContentLoaded', () => {
    setupGame();
    document.querySelector('#restartButton').addEventListener('click', restartGame);
    document.addEventListener('keydown', snakeMovement);
});

// check radios to get selected difficulty
function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}



// function to draw the checkered pattern
function drawCheckeredPattern() {
    // loop through rows and columns
    for (var row = 0; row < 15; row++) {
        for (var col = 0; col < 15; col++) {
            // alternate between white and beige squares
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = 'white'; 
            } else {
                ctx.fillStyle = 'beige'; 
            }
            // draws square
            ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }
}
drawCheckeredPattern();

function spawnApple() {
    // generate random coordinates for apple location
    appleX = Math.floor((Math.random()*(350)) / squareSize) * squareSize;
    appleY = Math.floor((Math.random()*(350)) / squareSize) * squareSize; 
}

function drawApple() {
    ctx.fillStyle = 'red'; // apple is indicated with red
    ctx.fillRect(appleX, appleY, squareSize, squareSize); // fill coordinates of apple generated from spawnApple function
}

function drawSnake(){
    // snake is distinguishable by its sky blue squares
    ctx.fillStyle = 'lightskyblue'; 
    snake.forEach(snakeSquare => { 
        ctx.fillRect(snakeSquare.x,snakeSquare.y, squareSize, squareSize);
    })
}

function moveSnake(){
    // head of snake is first element in array
    let head = {x: snake[0].x + xd, y: snake[0].y + yd};
    snake.unshift(head);

    if ((snake[0].x == appleX) && (snake[0].y == appleY)) { // snake eats apple
        score++;
        scoreDisplay.textContent = `SCORE: ${score}`;
        spawnApple();
    } else {
        snake.pop();
    }
}

function snakeMovement(event) {
    const usedKey = event.keyCode;
    // wasd input controls
    // a = move left
    let left = 65; // 65 is the keycode for a
    let moveLeft = (xd == -squareSize);

    // d = move right
    let right = 68; // 68 is keycode for d
    let moveRight = (xd == squareSize);

    // s = move down
    let down = 83; // 83 is keycode for s
    let moveDown = (yd == squareSize);

    // w = move up
    let up = 87; // 87 is keycode for w
    let moveUp = (yd == -squareSize);

    // moving conditions. ex: can't move left and right at the same time.
    if ((usedKey == left) && (!moveRight)) {
            xd = -squareSize;
            yd = 0;
    } else if ((usedKey == right) && (!moveLeft)) {
            xd = squareSize;
            yd = 0;
    } else if ((usedKey == down) && (!moveUp)) {
            xd = 0;
            yd = squareSize;
    } else if ((usedKey == up) && (!moveDown)) {
            xd = 0;
            yd = -squareSize;
    }
}


function isGameOver(){ 
    // snake is out of bounds
    if ((snake[0].x < 0) || (snake[0].x > 350) || (snake[0].y < 0) || (snake[0].y > 350)) {
        gameActive = false;
    }
    // snake eats itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            gameActive = false;
        }
    }
}

// display game over screen
function gameOver(){
    // define style attributes first
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(255, 170, 0)';
    ctx.font = '25px monospace'

    // draw game over screen
    ctx.fillText("GAME OVER", 375 / 2, 375 / 2);
}

let timeoutId;
function update(){
    if (gameActive){ // update game if game is active
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>{
            drawCheckeredPattern();
            drawApple();
            drawSnake();
            moveSnake();
            isGameOver();
            update();
        }, speed) // speed = how fast the game updates. also controls snake's movement speed
    }
    else{ // display game over if game is no longer active
        gameOver();
    }
}

// reset games
function restartGame(){
    // snake length is 4 again and spawns in the middle of the board
    snake = [{x:squareSize, y:8*squareSize},{x:2*squareSize, y:8*squareSize},{x:3*squareSize, y:8*squareSize},{x:4*squareSize, y:8*squareSize}]
    // snake is moving right
    xd = squareSize;
    yd = 0;
    // score resets to 0
    score = 0;
    setupGame();

}

function setupGame() {
    // get selected difficulty
    let difficulty = getDifficulty();
    switch (difficulty) {
        case 'easy':
            speed = 150; // snake moves slow on easy mode
            break;
        case 'medium':
            speed = 100; // snake moves with default speed on medium mode
            break;
        case 'hard':
            speed = 60; // snake moves fast on hard mode
            break;
        default:
            speed = 100;
            break;
    }
    gameActive = true;
    // call game functions
    moveSnake();
    spawnApple();
    drawApple();
    update();
    // display initial score of 0
    scoreDisplay.textContent = `SCORE: 0`;
}


