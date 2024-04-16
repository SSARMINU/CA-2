function generateAndSolveSudoku() {
    timer();
    const grid = generateSudoku();
    const solvedGrid = JSON.parse(JSON.stringify(grid)); // Make a deep copy of the generated grid
    solveSudoku(solvedGrid); // Solve the generated Sudoku grid
    displayGrid(grid, 'sudoku-board'); // Display the generated Sudoku grid
    //displayGrid(solvedGrid, 'sudoku-solution'); // Display the solved Sudoku grid
}


function generateSudoku() {
    const grid = [];
    
    // Initialize an empty 9x9 grid
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }

    // Fill the grid with valid numbers
    fillGrid(grid);

    return grid; // Return the generated grid
}
function fillGrid(grid) {
    // Helper function to check if a number is already in a row
    function isInRow(row, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) {
                return true;
            }
        }
        return false;
    }

    // Helper function to check if a number is already in a column
    function isInCol(col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return true;
            }
        }
        return false;
    }

    // Helper function to check if a number is already in a 3x3 box
    function isInBox(boxStartRow, boxStartCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row + boxStartRow][col + boxStartCol] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    // Helper function to check if a number can be placed at a certain position
    function isValidPlacement(row, col, num) {
        return !isInRow(row, num) && !isInCol(col, num) &&
            !isInBox(row - row % 3, col - col % 3, num);
    }

    // Shuffle numbers from 1 to 9
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Randomly select cells to leave empty
    const emptyCells = 5; // Adjust the number of empty cells as desired
    let emptyCount = 0;

    // Recursive function to fill the grid
    function fillNextCell(row, col) {
        // Base case: if we've reached the end of the grid, return true
        if (row === 9) {
            return true;
        }

        // Calculate the next row and column indices
        let nextRow = col === 8 ? row + 1 : row;
        let nextCol = (col + 1) % 9;

        // If the current cell is already filled, move to the next cell
        if (grid[row][col] !== 0) {
            return fillNextCell(nextRow, nextCol);
        }

        // Try shuffled numbers from 1 to 9
        for (let i = 0; i < 9; i++) {
            const num = numbers[i];
            // Check if the current number can be placed at the current position
            if (isValidPlacement(row, col, num)) {
                // Place the number and move to the next cell
                grid[row][col] = num;

                // Check if this cell should be left empty
                if (emptyCount < emptyCells && Math.random() < 0.4) {
                    grid[row][col] = 0; // Empty the cell
                    emptyCount++;
                }

                if (fillNextCell(nextRow, nextCol)) {
                    return true;
                }
                // If the number couldn't be placed at the current position, backtrack
                grid[row][col] = 0;
            }
        }
        // If no number can be placed at the current position, return false
        return false;
    }

    // Start filling the grid from the top-left corner (0, 0)
    fillNextCell(0, 0);
}
const enteredValues = [];

function displayGrid(grid, boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = ''; // Clear previous content
    
    // Get the width and height of the first non-empty cell
    let cellWidth = 0;
    let cellHeight = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                const tempCell = document.createElement('div');
                tempCell.textContent = grid[i][j];
                tempCell.style.visibility = 'hidden';
                board.appendChild(tempCell);
                const rect = tempCell.getBoundingClientRect();
                cellWidth = rect.width;
                cellHeight = rect.height;
                board.removeChild(tempCell);
                break;
            }
        }
        if (cellWidth !== 0 && cellHeight !== 0) {
            break;
        }
    }
    
    // Create grid cells
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.display = 'inline-block';
            cell.style.border = '1px solid black';
            if (grid[i][j] === 0) {
                // Create an input field for empty cells
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.pattern = '[0-9]*'; 
                input.style.width = '100%';
                input.style.height = '100%';
                input.style.textAlign = 'center';
                input.style.fontSize = 'inherit'; // Use the same font size as numbers
                input.addEventListener('input', function() {
                    // Update the grid with user input
                    grid[i][j] = parseInt(input.value) || 0;
                    // Store the entered value
                    enteredValues.push(grid[i][j]);
                });
                cell.appendChild(input);
            } else {
                // Display the pre-filled number
                cell.textContent = grid[i][j];
                cell.style.textAlign = 'center';
                cell.style.lineHeight = cellHeight + 'px';
                // Store the pre-filled value
                enteredValues.push(grid[i][j]);
            }
            board.appendChild(cell);
        }
    }
}
function getEnteredGrid() {
    const enteredGrid = [];
    const board = document.getElementById('sudoku-board');
    const cells = board.querySelectorAll('.board > div');
    let cellIndex = 0;

    for (let i = 0; i < 9; i++) {
        enteredGrid[i] = [];
        for (let j = 0; j < 9; j++) {
            const cellContent = cells[cellIndex];
            if (cellContent.querySelector('input')) {
                // If the cell contains an input element, get its value
                const inputValue = cellContent.querySelector('input').value.trim();
                enteredGrid[i][j] = inputValue !== '' ? parseInt(inputValue) : 0;
            } else {
                // If the cell contains a div element, get its inner text
                const divText = cellContent.textContent.trim();
                enteredGrid[i][j] = divText !== '' ? parseInt(divText) : 0;
            }

            cellIndex++;
        }
    }
    console.log(enteredGrid)
    return enteredGrid;
}



function solveSudoku(grid) {
    function findEmptyCell() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return [row, col]; // Return the row and column indices of the empty cell
                }
            }
        }
        return null; // Return null if there are no empty cells
    }

    function isValidMove(row, col, num) {
        return !usedInRow(row, num) && !usedInCol(col, num) && !usedInBox(row - row % 3, col - col % 3, num);
    }

    function usedInRow(row, num) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === num) {
                return true;
            }
        }
        return false;
    }

    function usedInCol(col, num) {
        for (let row = 0; row < 9; row++) {
            if (grid[row][col] === num) {
                return true;
            }
        }
        return false;
    }

    function usedInBox(startRow, startCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (grid[row + startRow][col + startCol] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    function solve() {
        const emptyCell = findEmptyCell();
        if (!emptyCell) {
            return true; // If there are no empty cells, the puzzle is solved
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isValidMove(row, col, num)) {
                grid[row][col] = num; // Assign the number to the empty cell

                console.log(`Trying ${num} at (${row}, ${col})`);

                if (solve()) {
                    return true; // If the solution is found, return true
                }

                console.log(`Backtracking from (${row}, ${col})`);
                grid[row][col] = 0; // If the current assignment does not lead to a solution, backtrack
            }
        }

        return false; // If no number can be placed in the current cell, backtrack
    }

    // Start the solving process
    if (solve()) {
        // Print the solved grid
        console.log("Solved Sudoku Grid:");
        console.log(grid.map(row => row.join(" ")).join("\n"));
        return grid; // If the puzzle is solved, return the solved grid
    } else {
        console.log("No solution found for the Sudoku puzzle.");
        return null; // If no solution is found, return null
    }
}





function submitSudoku() {
    clearInterval(timerInterval); // Stop the timer
    
    const grid = getEnteredGrid(); // Get the entered Sudoku grid
    const isCorrect = checkSudoku(grid); // Check if the entered Sudoku grid is correct
    var audio = document.getElementById("submitSound");
    audio.play();
    if (isCorrect) {
        // Sudoku grid is correct
        alert("Congratulations! You solved the Sudoku puzzle correctly!");
        var audio = document.getElementById("submitSound");
        audio.play();
        window.location.href = "sudukover.html";

    } else {
        // Sudoku grid is incorrect
        alert("Oops! The Sudoku puzzle is not solved correctly. Please try again.");
        var audio = document.getElementById("submitSound");
        audio.play();
        window.location.href = "sudukover.html";
    }

    // Calculate and store the score
    const score = calculateScore();
    localStorage.setItem('sudokuScore', score);
    
}

function checkSudoku(grid) {
    // Check if every row, column, and 3x3 subgrid contains all digits from 1 to 9
    return checkRows(grid) && checkColumns(grid) && checkSubgrids(grid);
}

function checkRows(grid) {
    // Check each row
    for (let row = 0; row < 9; row++) {
        const rowSet = new Set(grid[row]);
        if (rowSet.size !== 9 || rowSet.has(0)) {
            return false; // Row is incorrect
        }
    }
    return true; // All rows are correct
}

function checkColumns(grid) {
    // Check each column
    for (let col = 0; col < 9; col++) {
        const colSet = new Set();
        for (let row = 0; row < 9; row++) {
            colSet.add(grid[row][col]);
        }
        if (colSet.size !== 9 || colSet.has(0)) {
            return false; // Column is incorrect
        }
    }
    return true; // All columns are correct
}

function checkSubgrids(grid) {
    // Check each 3x3 subgrid
    for (let startRow = 0; startRow < 9; startRow += 3) {
        for (let startCol = 0; startCol < 9; startCol += 3) {
            const subgridSet = new Set();
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    subgridSet.add(grid[startRow + row][startCol + col]);
                }
            }
            if (subgridSet.size !== 9 || subgridSet.has(0)) {
                return false; // Subgrid is incorrect
            }
        }
    }
    return true; // All subgrids are correct
}



function calculateScore() {
    // Calculate the score based on the time taken to solve the Sudoku puzzle
    const timeElapsed = 300 - parseInt(document.getElementById('timer').textContent.split(':')[0]);
    return timeElapsed * 10; // Assuming 10 points are awarded for each second saved
}

let timerInterval;

function timer() {
    var duration = 300; // 5 minutes
    clearInterval(timerInterval);

    timerInterval = setInterval(function() {
        duration--;
        updateTimer(duration);
        if (duration === 0) {
            clearInterval(timerInterval);
            window.location.href = "sudukover.html"; // Redirect to game over page
        }
    }, 1000);
}

function updateTimer(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById("timer").textContent = formattedTime;
   
}

// Start the timer when the page loads
window.onload = function() {
    generateAndSolveSudoku();
    
};