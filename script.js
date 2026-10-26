const WORDS = [
  "java", "computer", "program", "keyboard", "hangman",
  "variable", "function", "network", "developer", "algorithm"
];
const MAX_WRONG = 6;

let word = "";
let guessed = new Set();
let wrong = 0;
let gameOver = false;

const wordEl = document.getElementById("word");
const messageEl = document.getElementById("message");
const livesEl = document.getElementById("lives");
const keyboardEl = document.getElementById("keyboard");
const parts = document.querySelectorAll("#figure .part");

function startGame() {
  word = WORDS[Math.floor(Math.random() * WORDS.length)];
  guessed = new Set();
  wrong = 0;
  gameOver = false;

  messageEl.textContent = "";
  messageEl.className = "message";
  parts.forEach(p => p.classList.remove("show"));
  buildKeyboard();
  render();
}

function buildKeyboard() {
  keyboardEl.innerHTML = "";
  for (let code = 97; code <= 122; code++) {
    const letter = String.fromCharCode(code);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.dataset.letter = letter;
    btn.addEventListener("click", () => guess(letter));
    keyboardEl.appendChild(btn);
  }
}

function render() {
  wordEl.textContent = word
    .split("")
    .map(ch => (guessed.has(ch) ? ch : "_"))
    .join(" ");
  livesEl.textContent = MAX_WRONG - wrong;
}

function guess(letter) {
  if (gameOver || guessed.has(letter)) return;

  guessed.add(letter);
  const btn = keyboardEl.querySelector(`[data-letter="${letter}"]`);
  btn.disabled = true;

  if (word.includes(letter)) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    if (wrong < parts.length) parts[wrong].classList.add("show");
    wrong++;
  }

  render();
  checkEnd();
}

function checkEnd() {
  const won = word.split("").every(ch => guessed.has(ch));

  if (won) {
    messageEl.textContent = "You won! 🎉";
    messageEl.className = "message win";
    endGame();
  } else if (wrong >= MAX_WRONG) {
    messageEl.textContent = "You lost! The word was: " + word;
    messageEl.className = "message lose";
    endGame();
  }
}

function endGame() {
  gameOver = true;
  keyboardEl.querySelectorAll("button").forEach(b => (b.disabled = true));
}

document.addEventListener("keydown", e => {
  if (/^[a-z]$/i.test(e.key)) guess(e.key.toLowerCase());
});

document.getElementById("restart").addEventListener("click", startGame);

startGame();