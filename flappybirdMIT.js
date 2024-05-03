/*
  Flappy Bird Game
  Adapted from code by Author: assebc on GitHub
  GitHub Repository: https://github.com/assebc/flappy-bird/tree/main/assets
  Licensed under the MIT License
*/

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy-bird.png';

// just defines game parameters
const FLAP_SPEED = -3; 
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// these are the initial positions/velocity of the bird
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

let pipeX = 400;
let pipeY = canvas.height - 200;

// elements for displaying the score
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;


/*
document.body.onkeyup = function(e) {
  if (e.code == 'Space') {
    birdVelocity = FLAP_SPEED;
  }
}
*/

// ascend upon click instead because space scrolls down
document.addEventListener('click', function() {
    birdVelocity = FLAP_SPEED;
  });
  
document.getElementById('restart-button').addEventListener('click', function() {
  hideEndMenu();
  resetGame();
  loop();
})

function increaseScore() {
  // increase now our counter when our flappy passes the pipes
  if(birdX > pipeX + PIPE_WIDTH && 
    (birdY < pipeY + PIPE_GAP || 
      birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
      !scored) {
    score++;
    scoreDiv.innerHTML = `SCORE: ${score}`; // added the string "SCORE: "
    scored = true;
  }

  // reset the flag, if bird passes the pipes
  if (birdX < pipeX + PIPE_WIDTH) {
      scored = false;
  }
}

// function that checks if bird collides with pipe/boundaries
function collisionCheck() {
    // creates hitbox for the bird
  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT
  }

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY
  }

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP
  }

  // check for collision with upper pipe box
  if (birdBox.x + birdBox.width > topPipeBox.x &&
      birdBox.x < topPipeBox.x + topPipeBox.width &&
      birdBox.y < topPipeBox.y) {
        return true;
  }

  // check for collision with lower pipe box
  if (birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
  }

  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }


  return false;
}

function hideEndMenu () {
  document.getElementById('end-menu').style.display = 'none';
  gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
  document.getElementById('end-menu').style.display = 'block';
  gameContainer.classList.add('backdrop-blur');
  document.getElementById('end-score').innerHTML = score;
  // This way we update always our highscore at the end of our game
  // if we have a higher high score than the previous
  if (highScore < score) {
      highScore = score;
  }
  document.getElementById('best-score').innerHTML = highScore;
}

// we reset the values to the beginning so we start 
// with the bird at the beginning
function resetGame() {
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;

  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
}

function endGame() {
  showEndMenu();
}

// this is the game loop function
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // this draws the bird
  ctx.drawImage(flappyImg, birdX, birdY);

  // this draws the pipes
  ctx.fillStyle = '#333';
  ctx.fillRect(pipeX, -50, PIPE_WIDTH, pipeY); // improves the accuracy of the upper column against collision
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  // if collide, game over
  if (collisionCheck()) {
    endGame();
    return;
  }


  pipeX -= 1.5;
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  // updates bird velocity and positions
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  increaseScore()
  requestAnimationFrame(loop);
}

loop();