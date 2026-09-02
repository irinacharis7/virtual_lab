
/* ========================================
   EDUVATE
   LINEAR SEARCH EXPERIMENT
======================================== */


const arrayInput =
    document.getElementById("arrayInput");

const targetInput =
    document.getElementById("targetInput");

const speedSlider =
    document.getElementById("speedSlider");

const speedValue =
    document.getElementById("speedValue");

const startButton =
    document.getElementById("startButton");

const resetButton =
    document.getElementById("resetButton");

const visualArray =
    document.getElementById("visualArray");

const explanation =
    document.getElementById("explanation");

const stepCounter =
    document.getElementById("stepCounter");

const resultText =
    document.getElementById("resultText");

const comparisonText =
    document.getElementById("comparisonText");

const pointerArea =
    document.getElementById("pointerArea");



let numbers = [];

let target = null;

let currentIndex = 0;

let comparisons = 0;

let searching = false;

let timer = null;



/* ========================================
   SPEED
======================================== */

const speeds = {

    1: {
        name: "Slow",
        time: 1400
    },

    2: {
        name: "Normal",
        time: 800
    },

    3: {
        name: "Fast",
        time: 350
    }

};


speedSlider.addEventListener(
    "input",
    () => {

        speedValue.textContent =
            speeds[speedSlider.value].name;

    }
);



/* ========================================
   PARSE ARRAY
======================================== */

function getArray() {

    const raw =
        arrayInput.value.trim();


    if (!raw) {

        showToast(
            "Please enter an array."
        );

        return null;

    }


    const values =
        raw.split(",")
            .map(value => value.trim())
            .filter(value => value !== "")
            .map(Number);


    if (
        values.length === 0 ||
        values.some(value => Number.isNaN(value))
    ) {

        showToast(
            "Please enter valid numbers."
        );

        return null;

    }


    if (values.length > 12) {

        showToast(
            "Please use 12 elements or fewer."
        );

        return null;

    }


    return values;

}



/* ========================================
   RENDER ARRAY
======================================== */

function renderArray() {

    visualArray.innerHTML = "";

    pointerArea.innerHTML = "";


    numbers.forEach(
        (number, index) => {

            const box =
                document.createElement("div");


            box.className =
                "array-box";


            box.dataset.index =
                index;


            box.innerHTML = `

                <span class="index">
                    ${index}
                </span>

                <span class="value">
                    ${number}
                </span>

            `;


            visualArray.appendChild(box);

        }
    );

}



/* ========================================
   START EXPERIMENT
======================================== */

function startExperiment() {

    if (searching) {

        return;

    }


    numbers = getArray();


    if (!numbers) {

        return;

    }


    target =
        Number(targetInput.value);


    if (
        targetInput.value === "" ||
        Number.isNaN(target)
    ) {

        showToast(
            "Please enter a target value."
        );

        return;

    }


    searching = true;

    currentIndex = 0;

    comparisons = 0;


    resultText.textContent =
        "Searching...";


    comparisonText.textContent =
        "0";


    startButton.disabled = true;

    startButton.textContent =
        "Searching...";


    renderArray();


    stepCounter.textContent =
        "Step 0";


    explanation.innerHTML = `

        <div class="explanation-icon">
            🔎
        </div>

        <div>

            <strong>
                Search started
            </strong>

            <p>
                Looking for ${target} in the array.
            </p>

        </div>

    `;


    searchStep();

}



/* ========================================
   SEARCH STEP
======================================== */

function searchStep() {

    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    /* Finished */

    if (
        currentIndex >= numbers.length
    ) {

        finishNotFound();

        return;

    }


    /* Remove previous checking */

    boxes.forEach(box => {

        box.classList.remove(
            "checking"
        );

    });


    const currentBox =
        boxes[currentIndex];


    currentBox.classList.add(
        "checking"
    );


    comparisons++;


    comparisonText.textContent =
        comparisons;


    stepCounter.textContent =
        `Step ${comparisons}`;


    pointerArea.innerHTML =
        `↑ Checking index ${currentIndex}`;


    /* MATCH */

    if (
        numbers[currentIndex] === target
    ) {

        setTimeout(
            () => {

                currentBox.classList.remove(
                    "checking"
                );


                currentBox.classList.add(
                    "found"
                );


                pointerArea.innerHTML =
                    "✓ Target found here";


                explanation.innerHTML = `

                    <div class="explanation-icon">
                        🎉
                    </div>

                    <div>

                        <strong>
                            Element found!
                        </strong>

                        <p>
                            ${target} is at index
                            ${currentIndex}.
                        </p>

                    </div>

                `;


                resultText.textContent =
                    `Found at index ${currentIndex}`;


                finishExperiment();

            },

            speeds[speedSlider.value].time
        );


        return;

    }


    /* NOT MATCH */

    explanation.innerHTML = `

        <div class="explanation-icon">
            🔍
        </div>

        <div>

            <strong>
                Not a match
            </strong>

            <p>
                ${numbers[currentIndex]}
                does not equal ${target}.
                Move to the next element.
            </p>

        </div>

    `;


    currentIndex++;


    timer =
        setTimeout(
            searchStep,
            speeds[speedSlider.value].time
        );

}



/* ========================================
   FINISH - FOUND
======================================== */

function finishExperiment() {

    searching = false;

    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";

}



/* ========================================
   FINISH - NOT FOUND
======================================== */

function finishNotFound() {

    searching = false;


    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    boxes.forEach(box => {

        box.classList.add(
            "not-found"
        );

    });


    resultText.textContent =
        "Not found";


    pointerArea.innerHTML =
        "✕ Target not found";


    explanation.innerHTML = `

        <div class="explanation-icon">
            ❌
        </div>

        <div>

            <strong>
                Element not found
            </strong>

            <p>
                The algorithm checked every
                element without finding ${target}.
            </p>

        </div>

    `;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";

}



/* ========================================
   RESET
======================================== */

function resetExperiment() {

    clearTimeout(timer);


    searching = false;

    currentIndex = 0;

    comparisons = 0;


    resultText.textContent =
        "—";


    comparisonText.textContent =
        "0";


    stepCounter.textContent =
        "Ready";


    pointerArea.innerHTML =
        "";


    explanation.innerHTML = `

        <div class="explanation-icon">
            💡
        </div>

        <div>

            <strong>
                Ready to search
            </strong>

            <p>
                Press "Start Experiment" to
                begin the linear search.
            </p>

        </div>

    `;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";


    numbers = getArray() || [];

    renderArray();

}



/* ========================================
   BUTTON EVENTS
======================================== */

startButton.addEventListener(
    "click",
    startExperiment
);


resetButton.addEventListener(
    "click",
    resetExperiment
);



/* ========================================
   QUICK CHALLENGE
======================================== */

function checkAnswer(button, answer) {

    const buttons =
        document.querySelectorAll(
            ".answers button"
        );


    buttons.forEach(btn => {

        btn.disabled = true;

    });


    const quizResult =
        document.getElementById(
            "quizResult"
        );


    if (answer === "O(n)") {

        button.classList.add(
            "correct"
        );


        quizResult.textContent =
            "✓ Correct! Linear Search may need to check every element, so its worst-case complexity is O(n).";

    } else {

        button.classList.add(
            "wrong"
        );


        quizResult.textContent =
            "Not quite. Try remembering that Linear Search may have to inspect every element.";

    }

}



/* ========================================
   TOAST
======================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    const text =
        toast.querySelector("p");


    text.textContent =
        message;


    toast.classList.add("show");


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}



/* ========================================
   INITIALIZE
======================================== */

numbers = getArray() || [];

renderArray();

speedValue.textContent =
    speeds[speedSlider.value].name;
