const snakeGameBoard = document.querySelector("#SnakeGame")
const ctx = snakeGameBoard.getContext("2d");
const restartButton = document.querySelector("#RestartButton");
const gameWidth = SnakeGame.width;
const gameHeight = SnakeGame.height;
const gameBackGround = "black";
const scoreText = document.querySelector("#Score");
const highScoreText = document.querySelector("#HighScore");
const snakeColor = "black";
const body = document.body;
const snakeBorderColor = "white";
const orangeColor = "orange";
const pxObjSize = 25;
let thisTick = 0;
let lastTick = 0;
let running = false;
let speedX = pxObjSize;
let speedY= 0;
let orangeX;
let orangeY;
let scorePoints = 0;
let highScorePoints = 0;
let updateFramesSpeed = 125;
let snakeMoving = true;
let isFading = false;
var Timeout;
var snake = [];

window.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", restartGame);

gameStart();

function gameStart(){
    running = true;
    createOrange();
    drawOrange();
    createSnake();
    nextFrame();
};

function nextFrame(){
    if(running){
        Timeout = setTimeout(() => {
            thisTick++;
            clearGame();
            drawOrange();
            move();
            drawSnake();
            checkGameOver();
            nextFrame();
            updateHighScore();
        }, updateFramesSpeed)
    }
    else {
        gameOver();
    }
};
function clearGame(){
    ctx.fillStyle = gameBackGround;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createOrange(){
    function randomPosition(min, max){
        const randomPos = Math.round((Math.random() * (max - min) + min) / pxObjSize) * pxObjSize;
        return randomPos;
    }
    orangeX = randomPosition(0, gameWidth - pxObjSize);
    orangeY = randomPosition(0, gameHeight - pxObjSize);
};
function drawOrange(){
    ctx.fillStyle = orangeColor;
    ctx.fillRect(orangeX, orangeY, pxObjSize, pxObjSize);
};
function move(){
    if(!snakeMoving || isFading) {
        return;
    } else {
        const snakeHead = {x: snake[0].x + speedX, y: snake[0].y + speedY}
        snake.unshift(snakeHead);

        if(snake[0].x === orangeX && snake[0].y === orangeY){
            scorePoints++;
            while(updateFramesSpeed > 50) {
                updateFramesSpeed -= 3;
                break;
            }
            Score.textContent = scorePoints;
            createOrange();
        }
        else {
            snake.pop(); 
        }
    }
}

function createSnake() {
    const snakeLength = 3;
    const snakeHeadX = Math.floor(Math.random() * (gameWidth / pxObjSize)) * pxObjSize;
    const snakeHeadY = Math.floor(Math.random() * (gameHeight / pxObjSize)) * pxObjSize;
  
    snake = [];
  
    for (let i = 0; i < snakeLength; i++) {
      const snakePart = { x: snakeHeadX - i * pxObjSize, y: snakeHeadY };
      snake.push(snakePart);
        }
    }

    function drawSnake(){
        ctx.fillStyle = snakeColor;
        ctx.strokeStyle = snakeBorderColor;
        snake.forEach(snakePart => {
            ctx.fillRect(snakePart.x, snakePart.y, pxObjSize, pxObjSize)
            ctx.strokeRect(snakePart.x, snakePart.y, pxObjSize, pxObjSize)
        }); 
    };
    function changeDirection(event){
    const ButtonPressed = event.keyCode;
    const arrowUp = 38;
    const arrowDown = 40;
    const arrowLeft = 37;
    const arrowRight = 39;
    const Up = 87;
    const Down = 83;
    const Left = 65;
    const Right = 68;
    const Restart = 82;

    const goUp = (speedY == -pxObjSize);
    const goDown = (speedY == pxObjSize);
    const goLeft = (speedX == -pxObjSize);
    const goRight = (speedX == pxObjSize);

    switch(true){
        case((ButtonPressed == arrowLeft || ButtonPressed == Left) && !goRight && thisTick > lastTick):
            lastTick = thisTick;
            speedX = -pxObjSize;
            speedY = 0;
            break;
        case((ButtonPressed == arrowRight || ButtonPressed == Right) && !goLeft):
            speedX = pxObjSize;
            speedY = 0;
            break;
        case((ButtonPressed == arrowUp || ButtonPressed == Up) && !goDown):
            speedX = 0;
            speedY = -pxObjSize;
            break;
        case((ButtonPressed == arrowDown || ButtonPressed == Down) && !goUp):
            speedX = 0;
            speedY = pxObjSize;
            break;
        case(ButtonPressed == Restart):
            running = false;
            restartGame();
            break;
        default:
                break;        
    }
};

function checkGameOver() {
    switch (true) {
      case snake[0].x < 0:
        snake[0].x = gameWidth - pxObjSize;
        break;
      case snake[0].x >= gameWidth:
        snake[0].x = 0;
        break;
      case snake[0].y >= gameHeight:
        snake[0].y = 0;
        break;
      case snake[0].y < 0:
        snake[0].y = gameHeight - pxObjSize;
        break;
    }
  
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        running = false;
      }
    }
  }

  function gameOver() {
    ctx.font = "48px Quicksand";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Игра Окончена!", gameWidth / 2, gameHeight / 2);
    running = false;
  }

function updateHighScore() {
    if (scorePoints > highScorePoints) {
      highScorePoints = scorePoints;
      highScoreText.textContent = highScorePoints;
    }
  }

function restartGame() {
    scorePoints = 0;
    speedX = pxObjSize;
    speedY = 0;
    snake = [
      {x: pxObjSize * 2, y: 0},
      {x: pxObjSize, y: 0},
      {x: 0, y: 0}
    ];
    clearTimeout(Timeout);
    scoreText.textContent = 0;
    updateFramesSpeed = 125;
    gameStart();
  }