
/* ========================================
   EDUVATE
   BUBBLE SORT VIRTUAL LAB
======================================== */


const arrayInput =
    document.getElementById("arrayInput");

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

const pointerArea =
    document.getElementById("pointerArea");

const explanation =
    document.getElementById("explanation");

const stepCounter =
    document.getElementById("stepCounter");

const resultText =
    document.getElementById("resultText");

const comparisonText =
    document.getElementById("comparisonText");


/* ========================================
   VARIABLES
======================================== */

let numbers = [];

let i = 0;

let j = 0;

let comparisons = 0;

let swaps = 0;

let searching = false;

let timer;


/* ========================================
   SPEED
======================================== */

const speeds = {

    1: {
        name: "Slow",
        time: 1300
    },

    2: {
        name: "Normal",
        time: 750
    },

    3: {
        name: "Fast",
        time: 300
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
   GET ARRAY
======================================== */

function getArray() {

    const raw =
        arrayInput.value.trim();


    if (!raw) {

        alert(
            "Please enter some numbers."
        );

        return null;

    }


    const values =
        raw.split(",")
            .map(value => value.trim())
            .map(Number);


    if (
        values.some(
            value => Number.isNaN(value)
        )
    ) {

        alert(
            "Please enter valid numbers."
        );

        return null;

    }


    if (values.length < 2) {

        alert(
            "Enter at least 2 numbers."
        );

        return null;

    }


    if (values.length > 10) {

        alert(
            "Please use 10 elements or fewer."
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
   START
======================================== */

function startSorting() {

    if (searching) {

        return;

    }


    numbers = getArray();


    if (!numbers) {

        return;

    }


    i = 0;

    j = 0;

    comparisons = 0;

    swaps = 0;

    searching = true;


    renderArray();


    resultText.textContent =
        "Sorting...";


    comparisonText.textContent =
        "0";


    stepCounter.textContent =
        "Pass 1";


    startButton.disabled = true;

    startButton.textContent =
        "Sorting...";


    bubbleSortStep();

}



/* ========================================
   BUBBLE SORT STEP
======================================== */

function bubbleSortStep() {


    /*
       If all passes are completed
    */

    if (i >= numbers.length - 1) {

        finishSorting();

        return;

    }


    /*
       If this pass is complete,
       move to the next pass.
    */

    if (
        j >= numbers.length - 1 - i
    ) {

        markSortedElement(
            numbers.length - 1 - i
        );


        i++;

        j = 0;


        stepCounter.textContent =
            `Pass ${i + 1}`;


        timer = setTimeout(
            bubbleSortStep,
            speeds[speedSlider.value].time / 2
        );


        return;

    }


    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    /*
       Remove old comparison styling
    */

    boxes.forEach(box => {

        box.classList.remove(
            "comparing",
            "swapping"
        );

    });


    /*
       Get two neighbouring elements
    */

    const first =
        boxes[j];

    const second =
        boxes[j + 1];


    first.classList.add(
        "comparing"
    );

    second.classList.add(
        "comparing"
    );


    comparisons++;


    comparisonText.textContent =
        comparisons;


    pointerArea.innerHTML = `

        ↑ Comparing
        ${numbers[j]}
        and
        ${numbers[j + 1]}

    `;



    /*
       CASE 1:
       Need to swap
    */

    if (
        numbers[j] >
        numbers[j + 1]
    ) {

        first.classList.remove(
            "comparing"
        );

        second.classList.remove(
            "comparing"
        );


        first.classList.add(
            "swapping"
        );

        second.classList.add(
            "swapping"
        );


        explanation.innerHTML = `

            <div class="explanation-icon">
                🔄
            </div>

            <div>

                <strong>
                    Swap required
                </strong>

                <p>
                    ${numbers[j]} is greater than
                    ${numbers[j + 1]}, so they swap.
                </p>

            </div>

        `;


        /*
           Swap the values
        */

        const temp =
            numbers[j];


        numbers[j] =
            numbers[j + 1];


        numbers[j + 1] =
            temp;


        swaps++;


        /*
           Update visual values
        */

        setTimeout(
            () => {

                updateVisualValues();

                j++;

                bubbleSortStep();

            },

            speeds[speedSlider.value].time
        );


    } else {


        /*
           CASE 2:
           No swap
        */

        explanation.innerHTML = `

            <div class="explanation-icon">
                ✓
            </div>

            <div>

                <strong>
                    No swap needed
                </strong>

                <p>
                    ${numbers[j]} is already smaller
                    than ${numbers[j + 1]}.
                </p>

            </div>

        `;


        j++;


        timer = setTimeout(
            bubbleSortStep,
            speeds[speedSlider.value].time
        );

    }

}



/* ========================================
   UPDATE VISUAL VALUES
======================================== */

function updateVisualValues() {

    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    boxes.forEach(
        (box, index) => {

            box.querySelector(
                ".value"
            ).textContent =
                numbers[index];

        }
    );

}



/* ========================================
   MARK SORTED
======================================== */

function markSortedElement(index) {

    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    if (boxes[index]) {

        boxes[index].classList.remove(
            "comparing",
            "swapping"
        );


        boxes[index].classList.add(
            "sorted"
        );

    }

}



/* ========================================
   FINISH
======================================== */

function finishSorting() {

    clearTimeout(timer);


    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    boxes.forEach(box => {

        box.classList.remove(
            "comparing",
            "swapping"
        );


        box.classList.add(
            "sorted"
        );

    });


    resultText.textContent =
        "Array Sorted ✓";


    pointerArea.innerHTML =
        "✓ Sorting complete";


    explanation.innerHTML = `

        <div class="explanation-icon">
            🎉
        </div>

        <div>

            <strong>
                Array successfully sorted!
            </strong>

            <p>
                Bubble Sort completed
                ${comparisons} comparisons
                and ${swaps} swaps.
            </p>

        </div>

    `;


    searching = false;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Sorting";


    /*
       Save EDUVATE progress
    */

    saveProgress(
        true,
        comparisons
    );

}



/* ========================================
   RESET
======================================== */

function resetExperiment() {

    clearTimeout(timer);


    searching = false;


    i = 0;

    j = 0;

    comparisons = 0;

    swaps = 0;


    numbers =
        getArray() || [];


    renderArray();


    resultText.textContent =
        "Not started";


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
                Ready to sort
            </strong>

            <p>
                Press "Start Sorting" to
                begin the experiment.
            </p>

        </div>

    `;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Sorting";

}



/* ========================================
   SAVE PROGRESS
======================================== */

function saveProgress(
    success,
    comparisonCount
) {

    const progress =
        JSON.parse(
            localStorage.getItem(
                "eduvateProgress"
            )
        ) || {

            experiments: 0,

            successful: 0,

            comparisons: 0

        };


    progress.experiments++;

    progress.comparisons +=
        comparisonCount;


    if (success) {

        progress.successful++;

    }


    localStorage.setItem(
        "eduvateProgress",
        JSON.stringify(progress)
    );

}



/* ========================================
   EVENTS
======================================== */

startButton.addEventListener(
    "click",
    startSorting
);


resetButton.addEventListener(
    "click",
    resetExperiment
);



/* ========================================
   INITIAL LOAD
======================================== */

numbers =
    getArray() || [];

renderArray();


speedValue.textContent =
    speeds[speedSlider.value].name;
