const gameBoard = document.querySelector('#game-board');
const colors = ['red', 'green', 'blue', 'yellow'];
const numRows = 10;
const numCols = 10;
let score = 0;
let board = [];
let gameStarted = false;
let scoreTable = document.getElementById("scoreTable");
document.getElementById('time').innerHTML = `Az eltelt idő: 0 másodperc`;

let success  = new Audio("click2.mp3");



const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

function startGame() {
    gameStarted = true;
    let startTime = Date.now();
    let timer = setInterval(function() {
        let elapsedTime = Date.now() - startTime;
        document.getElementById('time').innerHTML = `Az eltelt idő: ${elapsedTime / 1000} másodperc`;
    }, 1000);
    interval = setInterval(addRow, 3000);
}
function restartGame() {
    score = 0;
    scoreTable.textContent = score;
    board = [];
    gameBoard.innerHTML = '';
    createBoard();
    clearInterval(timer);
    clearInterval(interval);
    document.getElementById('time').innerHTML = '';
    gameStarted = false;
}


scoreTable.textContent = score;
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
    if (!gameStarted) return;
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
    if (!gameStarted) return;
  for (let i = 0; i < numCols; i++) {
    let cell = board[0][i];
    if (cell.style.backgroundColor !== 'white') {
        gameStarted = false;
      alert('Game Over!');
      clearInterval(interval);
      clearInterval(timer);
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

createBoard();
gameBoard.addEventListener('click', handleClick);

let interval = setInterval(addRow, 6000);
setInterval(dropCells, 600);
