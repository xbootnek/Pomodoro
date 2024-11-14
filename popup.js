let breakTime = 4; // 6 seconds
let workTime = 6; // 6 second
let timeLeft = workTime;
let isWorkSession = true;
let timerInterval;
let isRunning = false;
let isPaused = false; // New variable to track pause state
const startHour = 9;
const endHour = 18;

const timerDisplay = document.getElementById("timer");
const startStopButton = document.getElementById("startStopButton");
const messageDisplay = document.getElementById("message");

// Function to check if current time is within the specified active hours
function isWithinActiveHours() {
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour >= startHour && currentHour < endHour;
}

// Update display to show remaining time in MM:SS format
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  isWorkSession ? (document.getElementById("startStopButton").style.backgroundColor = 'lightgreen' , startStopButton.textContent = "Work now") :
	  (document.getElementById("startStopButton").style.backgroundColor = 'red' , startStopButton.textContent = "Break now");
  
/*  // Update the message only when the timer reaches zero and is paused
  if (timeLeft === 0 && isPaused) {
    messageDisplay.textContent = isWorkSession ? "Back to work!" : "Time for a break!";
    messageDisplay.style.visibility = "visible";
  } else {
    messageDisplay.style.visibility = "hidden";
  }
*/
}


// Start timer if within active hours
function startTimer() {
  if (isRunning || !isWithinActiveHours()) return;

  isRunning = true;
  isPaused = false;
//  startStopButton.textContent = "Stop"; // Set button text to "Stop"
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        isWorkSession = !isWorkSession;
        timeLeft = isWorkSession ? workTime : breakTime;
		startStopButton.classList.add('flashing');
        setTimeout(() => {
          startStopButton.classList.remove('flashing');
        }, 5000); // Adjust the timeout as needed
		  
        flashMessage();
        isPaused = true;
//        startStopButton.textContent = "Break now"; // Set button text to "Break now" when paused
		updateDisplay();
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;
  messageDisplay.textContent = "";
  messageDisplay.style.visibility = "hidden";
//  startStopButton.textContent = "Start";
}

function flashMessage() {
  messageDisplay.style.visibility = "visible";
  const audio = new Audio('Beep.mp3');
  audio.play();
  startStopButton.classList.add('flashing');
  setTimeout(() => {
    messageDisplay.style.visibility = "hidden";
    startStopButton.classList.remove('flashing');
  }, 5000); // Adjust the timeout as needed
}
// Schedule the timer to start at 09:00 if not already running
function checkStartTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Start immediately if past 09:00 but before 18:00
  if (hours >= startHour && hours < endHour) {
//      startStopButton.textContent = "Work now"; // Set button text to "Work now" when paused
	  startTimer();
  } else if (hours < startHour) {
    // Calculate time until 09:00 and set timeout
    const millisUntilStart =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0) -
      now;
    setTimeout(startTimer, millisUntilStart);
  }
}

// Stop the timer at 18:00 if running
function checkStopTime() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= endHour && isRunning) {
    stopTimer();
  }
}
  startStopButton.addEventListener("click", () => {
    if (isRunning) {
      // Stop the timer
      clearInterval(timerInterval);
      isRunning = false;
//      startStopButton.textContent = "Start";
    } else {
      // Start the timer
      startTimer();
//      startStopButton.textContent = "Stop";
    }
  });

// Check if we need to start the timer at 09:00 each day or stop it at 18:00
setInterval(() => {
  if (!isRunning && isWithinActiveHours()) {
    startTimer();
  }
  checkStopTime();
}, 500); // Check every minute to start/stop

// Initialize display with work time and set start time

updateDisplay();
checkStartTime();
												  