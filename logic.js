// variables

let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// var for touch input
let startX = 0;
let startY = 0;


//function to set the game board
function setGame() {

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {

      // This is to create a tile through creating div elements
      let tile = document.createElement("div");

      // Each tile will have an id based on its row position and column position. 
      // Imagine students in a room who are given an id, but their id number is based on their seat row and column position.
      tile.id = r.toString() + "-" + c.toString();

      // Get the number of a tile from a backend board
      let num = board[r][c];

      // Use the number to update the tile's appearance through updateTile() function
      updateTile(tile, num);

      // Add the created tile with id to the frontend game board container.
      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();

}

//update tile appearance based on its no. 
function updateTile(tile, num) {

  tile.innerText = "";
  tile.classList.value = "";

  tile.classList.add("tile");

  if (num > 0) {
    // This will display the number of the tile 
    tile.innerText = num.toString();

    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      // Then if the num value is greater than 4096, it will use class x8192 to color the tile
      tile.classList.add("x8192");
    }
  }
}

window.onload = function () {
  setGame();
}

function handleSlide(e) {
  console.log(e.code);

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    
    if (e.code == "ArrowLeft") {
      slideLeft();
      setTwo();
    }
    else if (e.code == "ArrowRight") {
      slideRight();
      setTwo();
    }
    else if (e.code == "ArrowUp") {
      slideUp();
      setTwo();
    }
    else if (e.code == "ArrowDown") {
      slideDown();
      setTwo();
    }
  }

  document.getElementById("score").innerText = score;

  setTimeout(() => {
    checkWin();
  }, 300)

  if (hasLost() == true) {
    setTimeout(() => {
      alert("Game Over!");
      alert("Click any arrow to restart");
      restartGame();
    }, 100)
  }
  
}

document.addEventListener("keydown", handleSlide);

// removes the zeroes from the rows/col
function filterZero(row) {
  return row.filter(num => num != 0);
}

// merge the adjacent tiles
function slide(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;

      //this adds the merged tile value to the score
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = row.slice();

    row = slide(row);
    board[r] = row;

    // After merge, pos and val might change, so it follows the id, no, color of the tile must be change.
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      
      //line for animation
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-from-right 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300)
      }

      updateTile(tile, num);

    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = row.slice();

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    // After merge, pos and val might change, so it follows the id, no, color of the tile must be change.
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-from-left 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300)
      }

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalCol = col.slice();

    col = slide(col);

    //will record the current position of tiles that have changed
    let changedIndices = [];
    for (let r = 0; r < rows; r++) {
      if(originalCol[r] !== col[r]) {
        changedIndices.push(r);
      }
    }

    // After merge, pos and val might change, so it follows the id, no, color of the tile must be change.
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r]
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (changedIndices.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-bottom 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300)
      }

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalCol = col.slice();

    col.reverse();
    col = slide(col);
    col.reverse();

    let changedIndices = [];
    for (let r = 0; r < rows; r++) {
      if(originalCol[r] !== col[r]) {
        changedIndices.push(r);
      }
    }

    // After merge, pos and val might change, so it follows the id, no, color of the tile must be change.
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r]
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (changedIndices.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300)
      }

      updateTile(tile, num);
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (hasEmptyTile() == false) {
    return;
  }

  let found = false;

  while (found == false) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;

      let tile = document.getElementById(r.toString() + "-" + c.toString());

      tile.innerText = "2";
      tile.classList.add("x2");

      found = true;
    }
  }
}

function checkWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 2048 && is2048Exist == false) {
        alert("You win! You got 2048");
        is2048Exist = true;
      }

      else if (board[r][c] == 4096 && is4096Exist == false) {
        alert("You win! You got 4096");
        is4096Exist = true;
      }

      else if (board[r][c] == 8192 && is8192Exist == false) {
        alert("You have reached 8192! Congrats!");
        is8192Exist = true;
      }
    }
  }
}

function hasLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return false;
      }

      const currentTile = board[r][c];

      if (
        r > 0 && board[r-1][c] === currentTile ||
        r < rows - 1 && board[r+1][c] === currentTile ||

        c > 0 && board[r][c-1] === currentTile ||
        c < columns - 1 && board[r][c+1] === currentTile
      ) {
        // tiles are full but still have mergeable tiles
        return false;
      }
    }
  }
  // no mergeable tiles, and already full
  return true;
}

function restartGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c] = 0;
    }
  }
  score = 0;

  setTwo();
}

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
  if (!e.target.className.includes("tile")) {
    return
  }

  //prevent scroll
  e.preventDefault()
}, {passive: false}) //use passive property to make sure that the preventDefault() method will work

document.addEventListener('touchend', (e) => {
  if (!e.target.className.includes("tile")) {
    return
  }

  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
        slideLeft(); // Call a function for sliding left
        setTwo(); // Call a function named "setTwo"
    } else {
        slideRight(); // Call a function for sliding right
        setTwo(); // Call a function named "setTwo"
    }
} else {
  // Vertical swipe
  if (diffY > 0) {
      slideUp(); // Call a function for sliding up
      setTwo(); // Call a function named "setTwo"
  } else {
      slideDown(); // Call a function for sliding down
      setTwo(); // Call a function named "setTwo"
  }
}

  document.getElementById("score").innerText = score;

  checkWin();
  // Call hasLost() to check for game over conditions
	if (hasLost()) {
    // Use setTimeout to delay the alert
    setTimeout(() => {
    alert("Game Over! You have lost the game. Game will restart");
    restartGame();
    alert("Click any key to restart");
    }, 100); 
  }
  
})