/* This file will provide the functionality of the GUI
 for displaying updated register values, memory values,
 and any related the to GUI */

// Boolean logic
let paused = true, programRunning = false, runPressed = false;
let debug = false, reset = false, finished = false;
let interval = null;
const INTERVAL_LENGTH = 5;

const runButton = document.getElementById('runBtn');
const pauseButton = document.getElementById('pauseBtn');
const resetButton = document.getElementById('restartBtn');
const debugButton = document.getElementById('debugBtn');

// Button event listeners
runButton.addEventListener('click', function() {
    if (!fileUploaded) {
        alert('Please upload a file to begin execution');
        return;
    } else if (finished) {
        alert('Please press \'Restart\' to reset the program');
        return;
    }
    if (debug) {
        runProgram();
    } else if (paused && interval === null) {
        paused = false;
        programRunning = true;
        runPressed = true;
        runButton.innerHTML = 'Running';
        runProgram();
    }
});

pauseButton.addEventListener('click', function() {
    if (!paused) {
        paused = true;
        programRunning = false;
    }
    if (paused) {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }
        runButton.innerHTML = 'Resume';
        if (reset) alert('Program reset');
        else alert('Program paused');
        reset = false;
    }
});

resetButton.addEventListener('click', function() {
    reset = true;
    pauseButton.click();
    if (debug) runButton.innerHTML = 'Step';
    else runButton.innerHTML = 'Run';
    resetGui();
});

debugButton.addEventListener('click', function () {
    if (interval === null && paused) {
        debug = !debug;
        if (debug) {
            runButton.innerHTML = 'Step';
        } else {
            runButton.innerHTML = 'Run';
        }
    }
});

// Main gui functions
function runProgram() {
    if (debug) {
        let condition = main();
        checkCondition(condition);
    } else {
        interval = setInterval(function () {
            let condition = main();
            checkCondition(condition);
        }, INTERVAL_LENGTH);
    }
}

function checkCondition(condition) {
    if (condition === 'end program') {
        finished = true;
        if (debug) runButton.innerHTML = 'Step';
        else runButton.innerHTML = 'Run';
        alert('Program Execution Complete');
    }
    updateMemoryTable();
    updateRegisterTable();
}

function resetGui() {
    finished = false;
    memoryInit();
    updateRegisterTable();
    updateMemoryTable();
    if (newUpload) {
        labels.clear();
    }
}

switch1.addEventListener('click', function () {
    if (interval === null && paused) {
        debug = !debug;
        if (debug) {
            runButton.innerHTML = 'Step';
        } else {
            runButton.innerHTML = 'Run';
        }
    }
});