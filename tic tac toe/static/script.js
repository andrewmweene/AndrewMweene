document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDiv = document.getElementById('status');
    const restartButton = document.getElementById('restart');

    // Initialize the state of the board.
    let gameEnded = false;

    // Event listeners for cells and restart button.
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetGame);

    function handleCellClick(event) {
        const index = parseInt(event.target.getAttribute('data-index'));

        if (gameEnded || event.target.textContent) {
            return; // Ignore clicks on occupied cells or finished games.
        }

        event.target.textContent = 'O'; // Human move
        makeMove(index, 'O'); // Call the API to make move
    }

    function makeMove(square, letter) {
        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ square, letter }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.winner) {
                statusDiv.textContent = `${data.winner} wins!`;
                gameEnded = true;
            } else if (data.result === 'tie') {
                statusDiv.textContent = "It's a tie!";
                gameEnded = true;
            } else {
                // Update the board if the game continues
                data.board.forEach((cell, index) => {
                    cells[index].textContent = cell === ' ' ? '' : cell;
                });

                // Update the status for the next player's turn
                statusDiv.textContent = `Player ${data.current_player}'s turn`;
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function resetGame() {
        fetch('/restart', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            gameEnded = false;
            cells.forEach(cell => {
                cell.textContent = '';
            });
            statusDiv.textContent = `Player O's turn`;
        });
    }
});