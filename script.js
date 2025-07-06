// Game state variables
const nameInputSection = document.getElementById('nameInputSection');
const gameSection = document.getElementById('gameSection');
const playerXNameInput = document.getElementById('playerXNameInput');
const playerONameInput = document.getElementById('playerONameInput');
const startGameButton = document.getElementById('startGameButton');
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const resultModal = document.getElementById('resultModal');
const modalMessage = document.getElementById('modalMessage');
const modalImage = document.getElementById('modalImage');
const modalCloseButton = document.getElementById('modalCloseButton');

let board = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 board
let currentPlayer = 'X'; // 'X' or 'O'
let gameActive = true; // True if game is ongoing, false if won or drawn
let playerXName = 'Player X';
let playerOName = 'Player O';
let isSinglePlayerMode = false; // New variable to track single player vs. two players

// Win conditions (indices of cells that form a win)
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Image/GIF URLs for win/draw states
const winGifUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2Z0N25vOWZ0NnF3a3RucG91bHk4a2Zxd213eW95N2Q1a3FwZ2VqMSZlcD12MV9pbnRlcm5uYWxfZ2lmX2J5X2lkJmN0PWc/o75V72v5xN45j2x8bK/giphy.gif"; // Dancing kid GIF
const drawGifUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2Z0N25vOWZ0NnF3a3RucG91bHk4a2Zxd213eW95N2Q1a3FwZ2VqMSZlcD12MV9pbnRlcm5uYWxfZ2lmX2J5X2lkJmN0PWc/o75V72v5xN45j2x8bK/giphy.gif"; // Placeholder for draw GIF (can be same or different)

// Function to initialize the game board and start the game
function startGame() {
    // Get player names from input fields
    playerXName = playerXNameInput.value.trim() || 'Player X';
    playerOName = playerONameInput.value.trim();

    // Determine single-player mode
    if (playerOName === '') {
        playerOName = 'Narendra';
        isSinglePlayerMode = true;
    } else {
        isSinglePlayerMode = false;
    }

    // Hide name input section and show game section
    nameInputSection.style.display = 'none';
    gameSection.style.display = 'block';

    // Reset game state
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    // Clear existing cells and create new ones
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-cell-index', index);
        cellElement.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellElement);
    });
    updateGameStatus(); // Update status with player names
}

// Function to handle a cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // If cell is already filled or game is not active, or it's Narendra's turn in single player, do nothing
    if (board[clickedCellIndex] !== '' || !gameActive || (isSinglePlayerMode && currentPlayer === 'O')) {
        return;
    }

    // Process human player's move
    processMove(clickedCellIndex);
}

// Function to process a move (either human or AI)
function processMove(index) {
    board[index] = currentPlayer;
    const cellElement = gameBoard.children[index];
    cellElement.textContent = currentPlayer;
    cellElement.classList.add(currentPlayer.toLowerCase()); // Add class for styling (x or o)

    checkGameResult(); // Check if game has ended
}

// Function to check for win, draw, or continue game
function checkGameResult() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; // Skip if any cell in the condition is empty
        }
        if (a === b && b === c) {
            roundWon = true;
            break; // A winner is found
        }
    }

    if (roundWon) {
        const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
        gameStatus.textContent = `${winnerName} Wins!`;
        gameActive = false;
        showModal(`${winnerName} Wins!`, winGifUrl);
        return;
    }

    // Check for a draw (if no empty cells and no winner)
    let roundDraw = !board.includes('');
    if (roundDraw) {
        gameStatus.textContent = 'It\'s a Draw!';
        gameActive = false;
        showModal('It\'s a Draw!', drawGifUrl);
        return;
    }

    // If no win or draw, switch players
    switchPlayer();
}

// Function to switch current player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus();

    // If it's single-player mode and Narendra's turn, make an AI move
    if (isSinglePlayerMode && currentPlayer === 'O' && gameActive) {
        // Add a slight delay for AI move to make it feel more natural
        setTimeout(makeNarendraMove, 700);
    }
}

// Function to update the game status text with current player's name
function updateGameStatus() {
    const currentPlayersName = currentPlayer === 'X' ? playerXName : playerOName;
    gameStatus.textContent = `${currentPlayersName}'s Turn`;
}

// AI logic for Narendra (Player O)
function makeNarendraMove() {
    // 1. Check for winning move for Narendra
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        // Check if Narendra can win in the next move
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') { processMove(c); return; }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') { processMove(b); return; }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') { processMove(a); return; }
    }

    // 2. Block human player's winning move
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        // Check if Player X can win in the next move and block them
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') { processMove(c); return; }
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') { processMove(b); return; }
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') { processMove(a); return; }
    }

    // 3. Take the center if available
    if (board[4] === '') {
        processMove(4);
        return;
    }

    // 4. Take a corner if available
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (board[corners[i]] === '') {
            processMove(corners[i]);
            return;
        }
    }

    // 5. Take any available side
    const sides = [1, 3, 5, 7];
    for (let i = 0; i < sides.length; i++) {
        if (board[sides[i]] === '') {
            processMove(sides[i]);
            return;
        }
    }
}


// Function to reset the game (back to name input)
function resetGame() {
    hideModal(); // Hide the modal if it's open
    nameInputSection.style.display = 'flex'; // Show name input
    gameSection.style.display = 'none'; // Hide game section
    playerXNameInput.value = ''; // Clear input fields
    playerONameInput.value = '';
    playerXName = 'Player X'; // Reset names
    playerOName = 'Player O';
    isSinglePlayerMode = false; // Reset single player mode
    board = ['', '', '', '', '', '', '', '', '']; // Reset board state
    currentPlayer = 'X';
    gameActive = true;
}

// Function to show the result modal
function showModal(message, imageUrl) {
    modalMessage.textContent = message;
    modalImage.src = imageUrl;
    resultModal.style.display = 'flex'; // Ensure modal is displayed as flex to center content
}

// Function to hide the result modal
function hideModal() {
    resultModal.style.display = 'none'; // Hide the modal
}

// Event listeners
startGameButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
modalCloseButton.addEventListener('click', resetGame); // Close modal and reset game
