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

const gameController = (() => {
    let board = Gameboard.getBoard();
    let isGameOver = false;
    let whoIsNextIndex = 0;
    
    // Helper function to check win condition for a given board state and player mark
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

    // Function to check if the board is full
    const checkDraw = (board) => {
      for (let cell of board) {
        if (cell === '') {
          return false; // Stop checking as soon as an empty cell is found
        }
      }
      return true;
    };

    // Function for intelligent Computer Move
    const intelligentComputerMove = (board) => {
      let availableMoves = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
      }, []);
    
      // Prioritize winning move
      let winningMove = findWinningMove('O', availableMoves);
      if (winningMove !== -1) {
        board[winningMove] = 'O';
        // gameController.getNextPlayer();
        setTimeout(() => {displayController.renderDisplay()}, 700);
        console.log('winningMove');
        return;
      }
    
      // Block opponent's winning move
      let blockingMove = findWinningMove('X', availableMoves);
      if (blockingMove !== -1) {
        board[blockingMove] = 'O';
        // gameController.getNextPlayer();
        setTimeout(() => {displayController.renderDisplay()}, 700);
        console.log('block');
        return;
      }
      
      // Stop searching if a winning or blocking move is found
      if (winningMove === -1 && blockingMove === -1) {
        // Fallback to random move if no strategic move found
        let randomIndex = Math.floor(Math.random() * availableMoves.length);
        let move = availableMoves[randomIndex];
        // board[move] = 'O';
        Gameboard.markCell(move, 'O');
        // gameController.getNextPlayer();
        setTimeout(() => {displayController.renderDisplay()}, 700);
        console.log('random');
      }
    };
    
    // Helper function to find a winning or blocking move
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
    

    // Function to make computer move randomly
    const computerMove = (board) => {
      let availableMoves = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
      }, []);
      
      let randomIndex = Math.floor(Math.random() * availableMoves.length);
      let move = availableMoves[randomIndex];
      Gameboard.markCell(move, 'O');
      setTimeout(() => {displayController.renderDisplay()}, 700);
    };

    const getCurrPlayer = () => {
      const player = [player1, player2][whoIsNextIndex];
      return player;
    };
    
    const getNextPlayer = () => {
      whoIsNextIndex = whoIsNextIndex === 0 ? 1 : 0;
      const player = [player1, player2][whoIsNextIndex];
      return player;
    };
    
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

    const setDisplayStyle = (value, ...elements) => {
      elements.forEach((element) => (element.style.display = value));
    };


    const navigateTo = (screen) => {
      prepareScreen(screen);
      hideAllScreens();
      showScreen(screen);
    };


    navigationBtns.forEach((button) => {
      button.addEventListener('click', () => {
        navigateTo(button.dataset.target);
        // console.log(gameController.getGameOver());
      });
    });

    const prepareScreen = (screen) => {
      switch (screen) {
        case 'game-menu':
          removeBoardListener(cells);
          Gameboard.resetBoard();
          board = Gameboard.getBoard();
          resetGame();
          break;
    
        case 'game-pvp':
          // setEnemyAttributes(playerTwoPicture, playerTwoColor, playerTwoSymbol);
          gameMode = 'pvp';
          break;
    
        case 'game-pvc':
          // setEnemyAttributes(robotPicture, robotColor, robotSymbol);
          player1 = Player('Human', 'X');
          player2 = Player('Robot', 'O');
          gameMode = 'pvc';
          break;
    
        case 'game-board':
          addBoardListener(cells);
          // board = ['','','','','','','','',''];
          // createPlayers();
          // refreshScores();
          // fillBoardCards();
          // animatePlayerCard('x'); // When starting a new match, X always goes first
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
        button.classList.remove('current-difficulty');
        // button.classList.add('animate-bob', 'animate-grayscale');
      });
      clickedButton.classList.add('current-difficulty');
      // clickedButton.classList.remove('animate-bob', 'animate-grayscale');
    };

    difficultyBtns.forEach((button) =>
      button.addEventListener('click', () => {
        toggleDifficultyBtn(button);
        gameDifficulty = button.dataset.difficulty;
        console.log(gameDifficulty);
      })
    );

    const clearBoard = () => {
      cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('X','O');
      });
      // setDisplayStyle('none', roundResult, boardNextRoundBtn, boardResetScoreBtn);
    };

    const resetGame = () => {
      clearBoard();
      // playerOneInput.value = '';
      // playerTwoInput.value = '';
      // boardDifficultyTag.classList.remove(gameDifficulty); // Prevents DifficultyTag from stacking styles when difficulty is changed
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
        cell.textContent = board[index];
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


// Start the game
// displayController.renderDisplay();
