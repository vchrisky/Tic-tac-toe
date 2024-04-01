'use strict';

const domElement = (() => {
  const restart = document.querySelector('#restart');
  const text = document.querySelector(".text");
  return {restart, text};
})();

const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  
  const getBoard = () => board;
  
  const markCell = (index, symbol) => {
    if (board[index] === '') {
      board[index] = symbol;
      return true; // Cell marked successfully
    }
    return false; // Cell already marked
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };
  
  return { getBoard, markCell, resetBoard };
})();

const Player = (Name, Mark) => {
  const name = Name;
  const mark = Mark;
  const score = {
    won: 0,
    lost: 0,
  };

  const getName = () => name;

  const getMark = () => mark;

  const getScore = () => {
    return [score.won, score.lost];
  };

  const won = function (wonOrNot) {
    wonOrNot ? score.won++ : score.lost++;
  };
  
  return { getName, getMark, getScore, won };
};
let player1 = Player('Player 1', 'X');
let player2 = Player('Player 2', 'O');

/**
 * The `gameController` function is responsible for managing the game logic in the tic-tac-toe application.
 * It handles checking for win conditions, determining the next player, and making moves for the computer player.
 */
const gameController = (() => {
  let board = Gameboard.getBoard();
  let isGameOver = false;
  let whoIsNextIndex = 0;
  const gameBoardDisplay = document.querySelector('#gameboard');
  const turnDisplay = document.querySelector('.turns');

  /**
   * Checks if a win condition has been met for a given player mark by iterating through all possible winning combinations.
   * @param {Array} tempBoard - An array representing the current state of the game board.
   * @param {string} playerMark - A string representing the mark ('X' or 'O') of the player.
   * @returns {boolean} - Returns true if a win condition has been met, false otherwise.
   */
  const checkWin = (tempBoard, playerMark) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (tempBoard[a] === playerMark && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
        return true; // Win condition met
      }
    }
    return false; // No win condition met
  };

  /**
   * Checks if the game board is full and no win condition has been met.
   * @param {Array} board - An array representing the current state of the game board.
   * @returns {boolean} - Returns true if the game is a draw, false otherwise.
   */
  const checkDraw = (board) => {
    return board.every(cell => cell !== '');
  };

  /**
   * Makes a move for the computer player based on the game strategy.
   * @param {Array} board - An array representing the current state of the game board.
   */
  const intelligentComputerMove = (board) => {
    let availableMoves = board.reduce((acc, cell, index) => {
      if (cell === '') acc.push(index);
      return acc;
    }, []);

    // Prioritize winning move
    let winningMove = findWinningMove('O', availableMoves);
    if (winningMove !== -1) {
      board[winningMove] = 'O';
      setTimeout(() => { displayController.renderDisplay() }, 700);
      console.log('winningMove');
      return;
    }

    // Block opponent's winning move
    let blockingMove = findWinningMove('X', availableMoves);
    if (blockingMove !== -1) {
      board[blockingMove] = 'O';
      setTimeout(() => { displayController.renderDisplay() }, 700);
      console.log('block');
      return;
    }

    // Stop searching if a winning or blocking move is found
    if (winningMove === -1 && blockingMove === -1) {
      // Fallback to random move if no strategic move found
      let randomIndex = Math.floor(Math.random() * availableMoves.length);
      let move = availableMoves[randomIndex];
      Gameboard.markCell(move, 'O');
      setTimeout(() => { displayController.renderDisplay() }, 700);
      console.log('random');
    }
  };

  /**
   * Finds a winning or blocking move by trying each available move on a temporary board.
   * @param {string} playerMark - A string representing the mark ('X' or 'O') of the player.
   * @param {Array} availableMoves - An array of available moves on the game board.
   * @returns {number} - Returns the index of a winning or blocking move, or -1 if no such move is found.
   */
  const findWinningMove = (playerMark, availableMoves) => {
    for (let move of availableMoves) {
      let tempBoard = [...board]; // Copy current board state
      tempBoard[move] = playerMark; // Try placing player mark on each available move
      if (checkWin(tempBoard, playerMark)) {
        return move; // Return the move if it results in a win
      }
    }
    return -1; // Return -1 if no winning/blocking move found
  };

  /**
   * Makes a random move for the computer player.
   * @param {Array} board - An array representing the current state of the game board.
   */
  const computerMove = (board) => {
    let availableMoves = board.reduce((acc, cell, index) => {
      if (cell === '') acc.push(index);
      return acc;
    }, []);

    let randomIndex = Math.floor(Math.random() * availableMoves.length);
    let move = availableMoves[randomIndex];
    Gameboard.markCell(move, 'O');
    setTimeout(() => { displayController.renderDisplay() }, 700);
  };

  /**
   * Gets the current player.
   * @returns {Object} - Returns the current player object.
   */
  const getCurrPlayer = () => {
    const player = [player1, player2][whoIsNextIndex];
    return player;
  };

  /**
   * Gets the next player and updates the game board display and turn display.
   * @returns {Object} - Returns the next player object.
   */
  const getNextPlayer = () => {
    whoIsNextIndex = whoIsNextIndex === 0 ? 1 : 0;
    const player = [player1, player2][whoIsNextIndex];
    gameBoardDisplay.setAttribute('data-turn', player.getMark().toLowerCase());
    turnDisplay.textContent = `${player.getName()}'s Turn`;
    return player;
  };

  /**
   * Gets the game over status.
   * @returns {boolean} - Returns true if the game is over, false otherwise.
   */
  const getGameOver = () => isGameOver;

  return {
    checkWin,
    checkDraw,
    computerMove,
    intelligentComputerMove,
    getCurrPlayer,
    getNextPlayer,
    getGameOver
  };
})();
  
const displayController = (() => {
    let board = Gameboard.getBoard();
    let gameDifficulty = 'easy';
    let gameMode;
    
    const cells = document.querySelectorAll('.cell');
    const navigationBtns = document.querySelectorAll('.navigation');
    const gameScreens = document.querySelectorAll('.screen');
    const difficultyBtns = document.querySelectorAll('.difficulty');
    const turnDisplay = document.querySelector('.turns');
    const gameBoardDisplay = document.querySelector('#gameboard');
    const playerOneInput = document.querySelector('#player-1');
    const playerTwoInput = document.querySelector('#player-2');

    const setDisplayStyle = (value, ...elements) => {
      elements.forEach((element) => (element.style.display = value));
    };


    const navigateTo = (screen) => {
      prepareScreen(screen);
      hideAllScreens();
      showScreen(screen);
    };


    navigationBtns.forEach((button) => {
      button.setAttribute('role', 'button');
      button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => {
          navigateTo(button.dataset.target)
          button.classList.remove('clicked');
        }, 500);
      });
    });

    const prepareScreen = (screen) => {
      switch (screen) {
        case 'game-menu':
          Gameboard.resetBoard();
          board = Gameboard.getBoard();
          resetGame();
          turnDisplay.textContent = '';
          gameBoardDisplay.setAttribute('data-turn', 'x');
          break;
    
        case 'game-pvp':
          gameMode = 'pvp';
          break;
    
        case 'game-pvc':
          player1 = Player('Human', 'X');
          player2 = Player('Robot', 'O');
          gameMode = 'pvc';
          break;
    
        case 'game-board':
          addBoardListener(cells);
          if (gameMode == 'pvp') {
            player1 = Player( playerOneInput.value || 'Player 1', 'X');
            player2 = Player( playerTwoInput.value || 'Player 2', 'O');
          }
          break;
        }
      };

    const hideAllScreens = () => {
      gameScreens.forEach((screen) => setDisplayStyle('none', screen));
    };

    const showScreen = (screen) => {
      setDisplayStyle('grid', document.querySelector(`.${screen}`));
    };

    const toggleDifficultyBtn = (clickedButton) => {
      difficultyBtns.forEach((button) => {
        button.classList.remove('clicked');
        button.classList.remove('current-difficulty');
      });
      clickedButton.classList.add('current-difficulty');
      clickedButton.classList.add('clicked');
    };

    difficultyBtns.forEach((button) => {
      button.setAttribute('role', 'button');
      button.addEventListener('click', () => {
        toggleDifficultyBtn(button);
        gameDifficulty = button.dataset.difficulty;
        console.log(gameDifficulty);
      })
    });

    const clearBoard = () => {
      cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('X','O');
      });
    };

    const resetGame = () => {
      clearBoard();
      playerOneInput.value = '';
      playerTwoInput.value = '';
    };

    function gameOver(gameStatus, winner) {  
      if (gameStatus == 'draw') {
          domElement.text.innerText = "It\'s a draw!";
      } else if (gameStatus = 'win'){
          domElement.text.innerText = winner + " Wins!";
      }
      document.querySelector(".finish").style.display = "flex";
    }

    const renderDisplay = () => {
      board = Gameboard.getBoard();
      
      cells.forEach((cell) => {
        let index = cell.getAttribute('data-index');
        if (board[index]) {
          cell.classList.add(board[index]);
        }
      });

      let currMark = gameController.getCurrPlayer().getMark();
      
      if (gameController.checkWin(board, currMark)) {
        let winner = gameController.getCurrPlayer().getName();
        console.log(winner + ' wins!');
        setTimeout(() => gameOver('win', winner), 700);
      } else if (gameController.checkDraw(board)) {
        console.log('It\'s a draw!');
        setTimeout(() => gameOver('draw'), 700);
      } else if (displayController.getGameMode() == 'pvc'){
        gameController.getNextPlayer();
        
        if (gameController.getCurrPlayer().getMark() == 'O') {
          //remove the click event listener so the player cant click on the board while the computer is playing the insert it when the computer is done playing
          
          displayController.getGameDifficulty() == 'hard' ? 
          gameController.intelligentComputerMove(board) : 
          gameController.computerMove(board);

        }
        
        return;
      }
      gameController.getNextPlayer();
    };
    
    
    // Function to handle player's move
    function playerMove(index) {
      if (!gameController.getGameOver() && board[index] === '') {
        // this is to prevent player clicking on the board while it is the computer's turn
        if (displayController.getGameMode() == 'pvc' && gameController.getCurrPlayer().getMark() == 'O') {
          return;
        }
        let mark = gameController.getCurrPlayer().getMark();
        Gameboard.markCell(index, mark);
        renderDisplay();
        console.log('playermove');
      }
    }
    
    const addBoardListener = (cells) => {
      cells.forEach((cell) => {
        cell.addEventListener('click', () => playerMove(cell.getAttribute('data-index')));
      });
    }

    const removeBoardListener = (cells) => {
      cells.forEach((cell) => {
        cell.removeEventListener('click', () => playerMove(cell.getAttribute('data-index')))
      });
    }
    
    domElement.restart.addEventListener("click", () => {
      location.reload();
      return false;
    });

    const getGameMode = () => gameMode;
    const getGameDifficulty = () => gameDifficulty;

    return {
      getGameMode,
      getGameDifficulty,
      renderDisplay
    }
})();

