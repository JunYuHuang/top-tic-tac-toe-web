"use strict";

// `Gameboard` module
const gameBoard = (function () {
  let rows = 3;
  let cols = 3;
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  const getBoard = function () {
    return board;
  };

  const setBoard = function (newBoard) {
    board = newBoard;
  };

  const getDefaultBoard = function () {
    let res = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        row.push(".");
      }
      res.push(row);
    }
    return res;
  };

  const resetBoard = function () {
    board = getDefaultBoard();
  };

  const didPieceWinHorizontal = function (piece) {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      count = 0;
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === piece) count++;
        else count = 0;
      }
      if (count === cols) return true;
    }
    return false;
  };

  const didPieceWinVertical = function (piece) {
    let count = 0;
    for (let c = 0; c < cols; c++) {
      count = 0;
      for (let r = 0; r < rows; r++) {
        if (board[r][c] === piece) count++;
        else count = 0;
      }
      if (count === rows) return true;
    }
    return false;
  };

  const didPieceWinPosDiagonal = function (piece) {
    let count = 0;
    let r = rows - 1;
    let c = 0;
    while (r >= 0 && c < cols) {
      if (board[r][c] === piece) count++;
      else count = 0;
      r--;
      c++;
    }
    return count === rows;
  };

  const didPieceWinNegDiagonal = function (piece) {
    let count = 0;
    let r = 0;
    let c = 0;
    while (r < rows && c < cols) {
      if (board[r][c] === piece) count++;
      else count = 0;
      r++;
      c++;
    }
    return count === rows;
  };

  const didPieceWin = function (piece) {
    if (didPieceWinHorizontal(piece)) return true;
    if (didPieceWinVertical(piece)) return true;
    if (didPieceWinPosDiagonal(piece)) return true;
    if (didPieceWinNegDiagonal(piece)) return true;
    return false;
  };

  const isFilledBoard = function () {
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (board[r][c] === ".") return false;
      }
    }
    return true;
  };

  const didTie = function () {
    if (didPieceWin("X")) return false;
    if (didPieceWin("O")) return false;
    return isFilledBoard();
  };

  const canPlaceAt = function (piece, position, turnPiece = "X") {
    if (turnPiece !== piece) return false;
    if (!Array.isArray(position)) return false;
    if (position.length !== 2) return false;
    const [row, col] = position;
    if (!Number.isInteger(row)) return false;
    if (!Number.isInteger(col)) return false;
    if (row < 0 || row >= rows) return false;
    if (col < 0 || col >= cols) return false;
    return board[row][col] === ".";
  };

  const placeAt = function (piece, position) {
    const [row, col] = position;
    board[row][col] = piece;
  };

  return {
    getBoard,
    setBoard,
    getDefaultBoard,
    resetBoard,
    didPieceWinHorizontal,
    didPieceWinVertical,
    didPieceWinPosDiagonal,
    didPieceWinNegDiagonal,
    didPieceWin,
    didTie,
    canPlaceAt,
    placeAt,
  };
})();

// `Player` factory
class Player {
  #name;
  #piece;
  #type;

  constructor(options = {}) {
    this.#name = options["name"] ? options["name"] : "Player";
    this.#piece = options["piece"] ? options["piece"] : "X";
    this.#type = options["type"] ? options["type"] : "human";
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    this.#name = newName;
  }

  get piece() {
    return this.#piece;
  }

  set piece(newPiece) {
    this.#piece = newPiece;
  }

  get type() {
    return this.#type;
  }

  set type(newType) {
    this.#type = newType;
  }

  getRandomMove(board) {
    const emptyCells = [];
    const rows = board.length;
    const cols = board[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === ".") emptyCells.push([r, c]);
      }
    }
    if (emptyCells.length === 0) throw new Error("No available moves!");
    const randomPos = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomPos];
  }
}

// `Game` module
const game = (function () {
  let players = [];
  let turnPiece = "X";
  let isPlaying = false;

  const getPlayers = () => players;

  const getPlayerByPiece = function (piece) {
    if (players.length === 0) return;
    const res = players.filter((player) => player.piece === piece);
    return res[0];
  };

  const getComputerPlayer = function () {
    if (players.length === 0) return;
    const res = players.filter((player) => player.type === "computer");
    if (res.size === 0) return;
    return res[0];
  };

  const setPlayers = function (newPlayers) {
    players = newPlayers;
  };

  const getTurnPiece = () => turnPiece;

  const setTurnPiece = (newTurnPiece) => {
    turnPiece = newTurnPiece;
  };

  const switchTurns = function () {
    turnPiece = turnPiece === "X" ? "O" : "X";
  };

  const getIsPlaying = () => isPlaying;

  const setIsPlaying = function (newIsPlaying) {
    isPlaying = newIsPlaying;
  };

  const update = function (options = {}) {
    if (options["players"]) {
      const newPlayers = [];
      for (let player of options["players"]) {
        newPlayers.push(
          new Player({
            name: player.name,
            piece: player.piece,
            type: player.type ? player.type : "human",
          })
        );
      }
      setPlayers(newPlayers);
    }
    if (options["startPiece"]) setTurnPiece(options["startPiece"]);
    if (options["isPlaying"]) setIsPlaying(options["isPlaying"]);
  };

  const reset = function () {
    players = [];
    turnPiece = "X";
    isPlaying = false;
  };

  return {
    getPlayers,
    getPlayerByPiece,
    getComputerPlayer,
    setPlayers,
    getTurnPiece,
    setTurnPiece,
    switchTurns,
    getIsPlaying,
    setIsPlaying,
    update,
    reset,
  };
})();

// `DisplayController` module
const displayController = (function () {
  let statusElement;
  let boardRootElement;
  let newGameButton;
  let newGameDialog;
  let newGameForm;
  let startGameButton;
  let cancelButton;
  let gameBoard;
  let game;
  const pieceToChar = {
    X: "×",
    O: "○",
    ".": "",
  };

  const setDependencies = function (options) {
    statusElement = options["statusElement"];
    boardRootElement = options["boardRootElement"];
    newGameButton = options["newGameButton"];
    newGameDialog = options["newGameDialog"];
    newGameForm = options["newGameForm"];
    startGameButton = options["startGameButton"];
    cancelButton = options["cancelButton"];
    gameBoard = options["gameBoard"];
    game = options["game"];
  };

  const isMissingDependencies = function () {
    if (
      !statusElement ||
      !boardRootElement ||
      !newGameButton ||
      !newGameDialog ||
      !newGameForm ||
      !startGameButton ||
      !cancelButton ||
      !gameBoard ||
      !game
    ) {
      console.log("missing dependencies");
      return true;
    }
    return false;
  };

  const addEventListeners = function () {
    if (boardRootElement) {
      boardRootElement.removeEventListener("click", handleCellButton);
      boardRootElement.addEventListener("click", handleCellButton);
    }
    if (newGameButton) {
      newGameButton.removeEventListener("click", handleNewGameButton);
      newGameButton.addEventListener("click", handleNewGameButton);
    }
    if (startGameButton) {
      startGameButton.removeEventListener("click", handleGameForm);
      startGameButton.addEventListener("click", handleGameForm);
    }
    if (cancelButton) {
      cancelButton.removeEventListener("click", handleCancelButton);
      cancelButton.addEventListener("click", handleCancelButton);
    }
  };

  const getChar = function (piece) {
    return pieceToChar[piece];
  };

  const cellComponent = function (args) {
    const { row, col, piece } = args;

    return `
      <button class="board-cell bg-white w-20 h-20 text-6xl" data-row="${row}" data-col="${col}">
        ${getChar(piece)}
      </button>
    `;
  };

  const renderBoard = function (board) {
    if (!boardRootElement) return;

    boardRootElement.replaceChildren();
    const rows = board.length;
    const cols = board[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        boardRootElement.insertAdjacentHTML(
          "beforeend",
          cellComponent({ row: r, col: c, piece: board[r][c] })
        );
      }
    }
  };

  const renderStatus = function (status = "") {
    if (isMissingDependencies()) return;
    if (status !== "") {
      statusElement.textContent = status;
    } else if (!game.getIsPlaying()) {
      statusElement.textContent = "Game has not started yet.";
    } else if (game.getIsPlaying()) {
      const player = game.getPlayerByPiece(game.getTurnPiece());
      statusElement.textContent = `It is ${player.piece} (${player.name})'s turn to go.`;
    }
  };

  const handleCellButton = function (e) {
    if (isMissingDependencies()) return;
    if (!game.getIsPlaying()) return;

    const element = e.target;
    if (element.tagName !== "BUTTON") return;
    if (!element.classList.contains("board-cell")) return;
    if (!element.dataset.row || !element.dataset.col) return;

    const position = [
      parseInt(element.dataset.row),
      parseInt(element.dataset.col),
    ];
    const piece = game.getTurnPiece();
    if (!gameBoard.canPlaceAt(piece, position, piece)) return;

    console.log(`Placed piece '${piece}' at position ${position}`);
    gameBoard.placeAt(piece, position);
    const isWin = gameBoard.didPieceWin(piece);
    const isTie = gameBoard.didTie();
    let statusMsg = "";
    if (isWin || isTie) {
      const winner = game.getPlayerByPiece(piece);
      statusMsg = isWin
        ? `Game ended: ${winner.piece} (${winner.name}) won!`
        : "Game ended: Tie!";
      game.setIsPlaying(false);
    } else {
      game.switchTurns();
    }
    renderStatus(statusMsg);
    renderBoard(gameBoard.getBoard());
    logState();

    // computer player moves if it's its turn
    const computerPlayer = game.getComputerPlayer();
    if (computerPlayer && game.getTurnPiece() === computerPlayer.piece) {
      const botMove = computerPlayer.getRandomMove(gameBoard.getBoard());
      gameBoard.placeAt(computerPlayer.piece, botMove);
      const isWin = gameBoard.didPieceWin(computerPlayer.piece);
      const isTie = gameBoard.didTie();
      let statusMsg = "";
      if (isWin || isTie) {
        const winner = game.getPlayerByPiece(computerPlayer.piece);
        statusMsg = isWin
          ? `Game ended: ${winner.piece} (${winner.name}) won!`
          : "Game ended: Tie!";
        game.setIsPlaying(false);
      } else {
        game.switchTurns();
      }
      renderStatus(statusMsg);
      renderBoard(gameBoard.getBoard());
      console.log(
        `Computer Player placed its piece ${computerPlayer.piece} at position ${botMove}`
      );
      logState();
    }
  };

  const handleGameForm = function (e) {
    if (isMissingDependencies()) return;

    // reset game state
    gameBoard.resetBoard();
    game.reset();

    // update game state
    const formData = new FormData(newGameForm);
    game.update({
      players: [
        {
          name: formData.get("x-player-name"),
          piece: "X",
          type: formData.get("computer-enemy") === "X" ? "computer" : "human",
        },
        {
          name: formData.get("o-player-name"),
          piece: "O",
          type: formData.get("computer-enemy") === "O" ? "computer" : "human",
        },
      ],
      startPiece: formData.get("start-piece"),
      isPlaying: true,
    });
    renderStatus();
    renderBoard(gameBoard.getBoard());
    newGameDialog.close();
    console.log("Started new game!");
    logState();

    // computer player moves if it's its turn
    const computerPlayer = game.getComputerPlayer();
    if (computerPlayer && game.getTurnPiece() === computerPlayer.piece) {
      const botMove = computerPlayer.getRandomMove(gameBoard.getBoard());
      gameBoard.placeAt(computerPlayer.piece, botMove);
      game.switchTurns();
      renderStatus();
      renderBoard(gameBoard.getBoard());
      console.log(
        `Computer Player placed its piece ${computerPlayer.piece} at position ${botMove}`
      );
      logState();
    }
  };

  const handleNewGameButton = function (e) {
    if (!newGameButton || !newGameDialog) return;
    newGameDialog.showModal();
  };

  const handleCancelButton = function (e) {
    if (!cancelButton || !newGameDialog) return;
    newGameDialog.close();
  };

  const logState = function () {
    console.log("Current State:\n", {
      board: gameBoard.getBoard(),
      turnPiece: game.getTurnPiece(),
      isPlaying: game.getIsPlaying(),
      players: game.getPlayers(),
    });
  };

  const openDialog = function () {
    newGameDialog.showModal();
  };

  return {
    setDependencies,
    addEventListeners,
    renderBoard,
    renderStatus,
    openDialog,
  };
})();

window.addEventListener("load", function () {
  displayController.setDependencies({
    statusElement: document.querySelector("#status"),
    boardRootElement: document.querySelector("#board-root"),
    newGameButton: document.querySelector("#new-game-button"),
    newGameDialog: document.querySelector("#new-game-dialog"),
    newGameForm: document.querySelector("#new-game-form"),
    startGameButton: document.querySelector("#start-game-button"),
    cancelButton: document.querySelector("#cancel-button"),
    gameBoard: gameBoard,
    game: game,
  });
  displayController.addEventListeners();
  displayController.renderStatus();
  displayController.renderBoard(gameBoard.getBoard());
  displayController.openDialog();
});
