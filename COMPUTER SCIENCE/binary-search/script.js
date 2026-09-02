
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

let target;

let left;

let right;

let comparisons = 0;

let searching = false;

let timer;


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



/* SPEED */

speedSlider.addEventListener(
    "input",
    () => {

        speedValue.textContent =
            speeds[speedSlider.value].name;

    }
);



/* GET ARRAY */

function getArray() {

    const values =
        arrayInput.value
            .split(",")
            .map(x => Number(x.trim()));


    if (
        values.length === 0 ||
        values.some(x => Number.isNaN(x))
    ) {

        alert(
            "Please enter valid numbers."
        );

        return null;

    }


    const sorted = [...values]
        .sort((a, b) => a - b);


    return sorted;

}



/* RENDER */

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



/* START */

function startExperiment() {

    if (searching) return;


    numbers = getArray();


    if (!numbers) return;


    target =
        Number(targetInput.value);


    left = 0;

    right = numbers.length - 1;

    comparisons = 0;

    searching = true;


    renderArray();


    resultText.textContent =
        "Searching...";


    comparisonText.textContent =
        "0";


    startButton.disabled = true;

    startButton.textContent =
        "Searching...";


    binarySearchStep();

}



/* BINARY SEARCH */

function binarySearchStep() {

    if (left > right) {

        finishNotFound();

        return;

    }


    const boxes =
        document.querySelectorAll(
            ".array-box"
        );


    boxes.forEach(box => {

        box.classList.remove(
            "checking"
        );

    });


    const middle =
        Math.floor(
            (left + right) / 2
        );


    const middleBox =
        boxes[middle];


    middleBox.classList.add(
        "checking"
    );


    comparisons++;


    comparisonText.textContent =
        comparisons;


    stepCounter.textContent =
        `Step ${comparisons}`;


    pointerArea.innerHTML = `
        ↑ Checking middle index ${middle}
        | Range: ${left} → ${right}
    `;


    if (
        numbers[middle] === target
    ) {

        setTimeout(
            () => {

                middleBox.classList.remove(
                    "checking"
                );

                middleBox.classList.add(
                    "found"
                );


                resultText.textContent =
                    `Found at index ${middle}`;


                pointerArea.innerHTML =
                    "✓ Target found";


                explanation.innerHTML = `

                    <div class="explanation-icon">
                        🎉
                    </div>

                    <div>

                        <strong>
                            Target found!
                        </strong>

                        <p>
                            Binary Search found
                            ${target} at index ${middle}.
                        </p>

                    </div>

                `;


                finish();

            },

            speeds[speedSlider.value].time
        );


        return;

    }


    if (
        numbers[middle] < target
    ) {

        explanation.innerHTML = `

            <div class="explanation-icon">
                ➡️
            </div>

            <div>

                <strong>
                    Search the right half
                </strong>

                <p>
                    ${numbers[middle]}
                    is smaller than ${target}.
                    Ignore the left half.
                </p>

            </div>

        `;


        left = middle + 1;

    } else {

        explanation.innerHTML = `

            <div class="explanation-icon">
                ⬅️
            </div>

            <div>

                <strong>
                    Search the left half
                </strong>

                <p>
                    ${numbers[middle]}
                    is larger than ${target}.
                    Ignore the right half.
                </p>

            </div>

        `;


        right = middle - 1;

    }


    timer = setTimeout(
        binarySearchStep,
        speeds[speedSlider.value].time
    );

}



/* FINISH */

function finish() {

    searching = false;

    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";

}



/* NOT FOUND */

function finishNotFound() {

    searching = false;


    resultText.textContent =
        "Not found";


    pointerArea.innerHTML =
        "✕ Target does not exist";


    explanation.innerHTML = `

        <div class="explanation-icon">
            ❌
        </div>

        <div>

            <strong>
                Target not found
            </strong>

            <p>
                The search range became empty.
            </p>

        </div>

    `;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";

}



/* RESET */

function resetExperiment() {

    clearTimeout(timer);


    searching = false;

    comparisons = 0;


    numbers =
        getArray() || [];


    renderArray();


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
                Binary Search will repeatedly
                divide the range in half.
            </p>

        </div>

    `;


    startButton.disabled = false;

    startButton.textContent =
        "▶ Start Experiment";

}



startButton.addEventListener(
    "click",
    startExperiment
);


resetButton.addEventListener(
    "click",
    resetExperiment
);


numbers = getArray() || [];

renderArray();

speedValue.textContent =
    speeds[speedSlider.value].name;
