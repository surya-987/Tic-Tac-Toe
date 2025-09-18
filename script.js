const board = document.getElementById("board");
const statusText = document.getElementById("status");

let gameState = Array(9).fill("");
let gameActive = true;
const player = "X";
const computer = "O";
const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard() {
  board.innerHTML = "";
  gameState = Array(9).fill("");
  gameActive = true;
  statusText.textContent = "Your turn (X)";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.dataset.value = "";
    cell.addEventListener("click", handlePlayerMove);
    board.appendChild(cell);
  }
}

function handlePlayerMove(e) {
  const index = e.target.dataset.index;
  if (gameState[index] || !gameActive) return;
  makeMove(index, player);
  if (gameActive) {
    statusText.textContent = "Computer's turn...";
    setTimeout(computerMove, 400);
  }
}

function makeMove(index, currentPlayer) {
  gameState[index] = currentPlayer;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = currentPlayer;
  cell.dataset.value = currentPlayer;
  cell.classList.add("taken");
  if (checkWinner(currentPlayer)) {
    statusText.textContent = currentPlayer === player ? "🎉 You win!" : "💻 Computer wins!";
    gameActive = false;
    return;
  }
  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }
  statusText.textContent = currentPlayer === player ? "Computer's turn..." : "Your turn (X)";
}

function computerMove() {
  if (!gameActive) return;
  function findBestMove(symbol) {
    for (let cond of winningConditions) {
      const [a,b,c] = cond;
      const values = [gameState[a], gameState[b], gameState[c]];
      if (values.filter(v => v === symbol).length === 2 && values.includes("")) {
        return cond[values.indexOf("")];
      }
    }
    return null;
  }
  let move = findBestMove(computer) || findBestMove(player);
  if (move === null) {
    const emptyCells = gameState.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    move = emptyCells[Math.floor(Math.random()*emptyCells.length)];
  }
  makeMove(move, computer);
}

function checkWinner(currentPlayer) {
  for (let cond of winningConditions) {
    const [a,b,c] = cond;
    if (gameState[a]===currentPlayer && gameState[b]===currentPlayer && gameState[c]===currentPlayer) {
      [a,b,c].forEach(i => document.querySelector(`.cell[data-index='${i}']`).classList.add("winner"));
      return true;
    }
  }
  return false;
}

function resetGame() {
  createBoard();
}

createBoard();