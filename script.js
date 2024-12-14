// Sound effects
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');

// Debounce variables
let lastPlayTime = 0;
const debounceTime = 100; // in milliseconds

// Function to play sound with debouncing
function playSound(sound) {
    const now = Date.now();
    if (now - lastPlayTime > debounceTime) {
        sound.play();
        lastPlayTime = now;
    }
}

// Typing test logic
const displayText = document.getElementById('display-text');
const inputArea = document.getElementById('input-area');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartButton = document.getElementById('restart');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "Typing is a skill that improves with consistent practice."
];

let startTime = null;
let timerInterval = null;
let typedText = "";
let correctChars = 0;
let totalChars = 0;
let testCompleted = false; // Flag to prevent multiple Enter key presses

// Display a random text
function setRandomText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    displayText.textContent = sampleTexts[randomIndex];
}

// Start the timer
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 100);
}

// Update timer display
function updateTimer() {
    if (!startTime) return;
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timeDisplay.textContent = elapsedTime;
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Calculate Words Per Minute (WPM)
function calculateWPM() {
    const timeInMinutes = (parseInt(timeDisplay.textContent) / 60);
    const wpm = Math.round((typedText.length / 5) / timeInMinutes);
    wpmDisplay.textContent = wpm;
}

// Calculate Accuracy
function calculateAccuracy() {
    const accuracy = Math.round((correctChars / totalChars) * 100);
    accuracyDisplay.textContent = accuracy;
}

// Reset the test
function resetTest() {
    inputArea.value = "";
    typedText = "";
    correctChars = 0;
    totalChars = 0;
    startTime = null;
    testCompleted = false; // Reset test completed flag

    timeDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";

    if (timerInterval) stopTimer();
    setRandomText();
}

// Handle typing input with sound effects and debouncing
inputArea.addEventListener('input', () => {
    if (!startTime) startTimer();

    typedText = inputArea.value;
    correctChars = 0;
    totalChars = typedText.length; // Update total characters typed

    const textArray = displayText.textContent.split('');
    const typedArray = typedText.split('');

    // Play sound and update correct characters count
    typedArray.forEach((char, index) => {
        if (char === textArray[index]) {
            correctChars++;
            playSound(correctSound); // Debounced correct key sound
        } else {
            playSound(wrongSound); // Debounced wrong key sound
        }
    });
});

// Handle Enter key to stop the test and calculate results
inputArea.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && !testCompleted) { // Enter key and prevent multiple submissions
        testCompleted = true; // Set the flag to true to prevent multiple submissions
        stopTimer(); // Stop the timer
        calculateWPM(); // Calculate WPM
        calculateAccuracy(); // Calculate accuracy

        // Auto reset after a short delay (2 seconds)
        setTimeout(() => {
            resetTest(); // Reset test for the next round
        }, 2000); // Delay in milliseconds
    }
});

// Restart button functionality
restartButton.addEventListener('click', resetTest);

// Initialize the test
resetTest();
