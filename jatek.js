const gameBoard = document.querySelector('#game-board');
const colors = ['red', 'green', 'blue', 'yellow', 'orange'];
const numRows = 10;
const numCols = 10;
let score = 0;
let board = [];
let addRowTimer = 3000;
let elapsedTime;
let scoreTable = document.getElementById("scoreTable");
let levelText = document.getElementById("level");
let gameOverScreen = document.getElementById("game-over");
let startGameScreen = document.getElementById("startGameScreen");
let gameScreen = document.getElementById("gameScreen");
let startButton = document.getElementById("startButton");
let tryAgainButton = document.getElementById("tryAgainButton");
let level = 0;
let startTime = Date.now();

let interval;
let levelInterval;
let dropCellInterval;



let success  = new Audio("click2.mp3");


gameOverScreen.style.display = "none";
gameScreen.style.display = "none";
startGameScreen.style.display = "block";

function onClickStart() {
    startGame();

}

function onClickTryAgain() {
    startGameScreen.style.display = "block";
    gameScreen.style.display = "none";
    gameOverScreen.style.display ="none";
    console.log("lefut");
}

function endGame(){
    clearInterval(dropCellInterval);
    clearInterval(interval);
    clearInterval(timer);
    clearInterval(levelInterval);
    gameScreen.style.display ="none";
    gameOverScreen.style.display = "block"
    gameBoard.innerHTML = '';
}
function startGame(){
    addRowTimer = 3000;
    createBoard();
    document.getElementById('time').innerHTML = `Az eltelt idő: 0 másodperc`;
    document.getElementById('level').innerHTML = `Szint: ` + level;
    startTime = Date.now();
    elapsedTime = 0;
    timer = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        document.getElementById('time').innerHTML = `Az eltelt idő: ${Math.floor(elapsedTime / 1000)} másodperc`;
    }, 1000);
    level = 0;
    startGameScreen.style.display = "none";
    gameScreen.style.display = "block";
    interval = setInterval(addRow, addRowTime());
    dropCellInterval = setInterval(dropCells, 600);
    levelInterval = setInterval(addRowTime, 20000 );
}





function addRowTime(){
    if(addRowTimer > 1000){
        addRowTimer -= 500;
        console.log("Játék gyorsítva!");
        level++;
        console.log("Szint Növelve");
        document.getElementById('level').innerHTML = `Szint: ` + level;
    }
    return addRowTimer;
}

scoreTable.textContent = score;
levelText.textContent = level;
function createBoard() {

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (i >= numRows - 3) {
        let colorIndex = Math.floor(Math.random() * colors.length);
        cell.style.backgroundColor = colors[colorIndex];
      } else {
        cell.style.backgroundColor = 'white';
      }
      row.push(cell);
      gameBoard.appendChild(cell);
    }
    board.push(row);
  }
}
function handleClick(event) {
        let row = parseInt(event.target.dataset.row);
        let col = parseInt(event.target.dataset.col);
        let color = event.target.style.backgroundColor;
        if (color === 'white') return;
        let visited = new Array(numRows).fill(false).map(() => new Array(numCols).fill(false));
        let cellsToRemove = getCellsToRemove(row, col, color, visited);
        if (cellsToRemove.length >= 3) {
            cellsToRemove.forEach(cell => {
                cell.style.backgroundColor = 'white';
                score++;
                scoreTable.textContent = score;
                success.currentTime = 0;
                success.play();
            });
        }
}


function dropCells() {
    for (let i = numRows - 2; i >= 0; i--) {
        for (let j = 0; j < numCols; j++) {
            let cell1 = board[i][j];
            let cell2 = board[i + 1][j];
            if (cell1.style.backgroundColor !== 'white' && cell2.style.backgroundColor === 'white') {
                cell2.style.backgroundColor = cell1.style.backgroundColor;
                cell1.style.backgroundColor = 'white';
            }
        }
    }
}
function getCellsToRemove(row, col, color, visited) {
    if (row < 0 || row >= numRows || col < 0 || col >= numCols) return [];
    if (visited[row][col]) return [];
    let cell = board[row][col];
    if (cell.style.backgroundColor !== color) return [];
    visited[row][col] = true;
    let cellsToRemove = [cell];
    cellsToRemove.push(...getCellsToRemove(row - 1, col, color, visited));
    cellsToRemove.push(...getCellsToRemove(row + 1, col, color, visited));
    cellsToRemove.push(...getCellsToRemove(row, col - 1, color, visited));
    cellsToRemove.push(...getCellsToRemove(row, col + 1, color, visited));
    return cellsToRemove;
}


function addRow() {
  for (let i = 0; i < numCols; i++) {
    let cell = board[0][i];
    if (cell.style.backgroundColor !== 'white') {
        console.log("bajok vannak");
      endGame();
      return;
    }
  }

  for (let i = 0; i < numRows - 1; i++) {
    for (let j = 0; j < numCols; j++) {
      let cell1 = board[i][j];
      let cell2 = board[i + 1][j];
      cell1.style.backgroundColor = cell2.style.backgroundColor;
    }
  }

  for (let i = 0; i < numCols; i++) {
    let cell = board[numRows - 1][i];
    let colorIndex = Math.floor(Math.random() * colors.length);
    cell.style.backgroundColor = colors[colorIndex];
  }
}

//createBoard();
gameBoard.addEventListener('click', handleClick);
startButton.addEventListener('click', onClickStart);
tryAgainButton.addEventListener('click', onClickTryAgain);

/*interval = setInterval(addRow, addRowTime());
dropCellInterval = setInterval(dropCells, 600);
levelInterval = setInterval(addRowTime, 20000 );*/
