
/* =========================================
   EDUVATE
   DRAG & DROP CIRCUIT LAB
========================================= */


/* ================= ELEMENTS ================= */

const breadboard =
    document.getElementById("breadboard");

const wireLayer =
    document.getElementById("wireLayer");

const dropMessage =
    document.getElementById("dropMessage");

const checkButton =
    document.getElementById("checkButton");

const resetButton =
    document.getElementById("resetButton");

const hintButton =
    document.getElementById("hintButton");

const hintBox =
    document.getElementById("hintBox");

const closeHint =
    document.getElementById("closeHint");

const feedback =
    document.getElementById("feedback");

const feedbackIcon =
    document.getElementById("feedbackIcon");

const feedbackTitle =
    document.getElementById("feedbackTitle");

const feedbackText =
    document.getElementById("feedbackText");

const scoreElement =
    document.getElementById("score");

const attemptsElement =
    document.getElementById("attempts");

const successOverlay =
    document.getElementById("successOverlay");

const finalScore =
    document.getElementById("finalScore");

const finalAttempts =
    document.getElementById("finalAttempts");

const continueButton =
    document.getElementById("continueButton");


/* ================= DATA ================= */

let components = [];

let connections = [];

let score = 0;

let attempts = 0;

let completed = false;

let draggedType = null;

let selectedTerminal = null;


/* ================= LOAD SAVED DATA ================= */

const savedData =
    JSON.parse(
        localStorage.getItem(
            "eduvateCircuitLab"
        )
    );


if (savedData) {

    score =
        savedData.score || 0;

    attempts =
        savedData.attempts || 0;

    completed =
        savedData.completed || false;

}


/* ================= DISPLAY ================= */

updateStats();


/* ================= COMPONENT DRAGGING ================= */

const componentItems =
    document.querySelectorAll(
        ".component"
    );


componentItems.forEach(
    component => {

        component.addEventListener(
            "dragstart",
            event => {

                draggedType =
                    component.dataset.component;

                event.dataTransfer.effectAllowed =
                    "copy";

            }
        );

    }
);


/* ================= DROP ================= */

breadboard.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
            "copy";

    }
);


breadboard.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        if (!draggedType) {

            return;

        }


        const rect =
            breadboard.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;

        const y =
            event.clientY -
            rect.top;


        addComponent(
            draggedType,
            x,
            y
        );


        draggedType = null;

    }
);


/* ================= ADD COMPONENT ================= */

function addComponent(
    type,
    x,
    y
) {

    /*
        Only one of each component
        is allowed.
    */

    if (
        components.some(
            component =>
                component.type === type
        )
    ) {

        showFeedback(
            "⚠️",
            "Already added",
            `You already placed the ${getComponentName(type)}.`
        );

        return;

    }


    const id =
        type + "_" + Date.now();


    const element =
        document.createElement("div");


    element.className =
        `board-component ${type}`;


    element.id =
        id;


    element.style.left =
        Math.max(
            55,
            Math.min(
                x - 55,
                breadboard.clientWidth - 160
            )
        ) + "px";


    element.style.top =
        Math.max(
            70,
            Math.min(
                y - 35,
                breadboard.clientHeight - 100
            )
        ) + "px";


    /*
        Component content
    */

    let icon = "";


    if (type === "battery") {

        icon = "🔋";

    }

    else if (type === "resistor") {

        icon = "▬";

    }

    else if (type === "led") {

        icon = `<div class="led-bulb">💡</div>`;

    }

    else if (type === "ground") {

        icon = "⏚";

    }


    element.innerHTML = `

        <div class="terminal left"
             data-component="${id}"
             data-side="left">
        </div>

        ${icon}

        <strong>
            ${getComponentName(type)}
        </strong>

        <div class="terminal right"
             data-component="${id}"
             data-side="right">
        </div>

    `;


    breadboard.appendChild(
        element
    );


    /*
        Save component
    */

    components.push({

        id: id,

        type: type,

        element: element

    });


    /*
        Hide drop message
    */

    dropMessage.style.display =
        "none";


    /*
        Enable moving
    */

    makeMovable(element);


    /*
        Add terminal listeners
    */

    const terminals =
        element.querySelectorAll(
            ".terminal"
        );


    terminals.forEach(
        terminal => {

            terminal.addEventListener(
                "mousedown",
                startConnection
            );

        }
    );


    updateRequired();

}


/* ================= COMPONENT NAME ================= */

function getComponentName(type) {

    const names = {

        battery: "Battery",

        resistor: "Resistor",

        led: "LED",

        ground: "Ground"

    };


    return names[type];

}


/* ================= MAKE MOVABLE ================= */

function makeMovable(element) {

    let moving = false;

    let offsetX = 0;

    let offsetY = 0;


    element.addEventListener(
        "mousedown",
        event => {

            if (
                event.target.classList.contains(
                    "terminal"
                )
            ) {

                return;

            }


            moving = true;


            const rect =
                element.getBoundingClientRect();


            offsetX =
                event.clientX -
                rect.left;

            offsetY =
                event.clientY -
                rect.top;


            element.style.zIndex =
                "30";

        }
    );


    document.addEventListener(
        "mousemove",
        event => {

            if (!moving) {

                return;

            }


            const boardRect =
                breadboard.getBoundingClientRect();


            let x =
                event.clientX -
                boardRect.left -
                offsetX;


            let y =
                event.clientY -
                boardRect.top -
                offsetY;


            x =
                Math.max(
                    45,
                    Math.min(
                        x,
                        breadboard.clientWidth -
                        element.offsetWidth -
                        45
                    )
                );


            y =
                Math.max(
                    55,
                    Math.min(
                        y,
                        breadboard.clientHeight -
                        element.offsetHeight -
                        30
                    )
                );


            element.style.left =
                x + "px";

            element.style.top =
                y + "px";


            redrawWires();

        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            moving = false;

            element.style.zIndex =
                "20";

        }
    );

}


/* ================= START CONNECTION ================= */

function startConnection(event) {

    event.stopPropagation();

    const terminal =
        event.currentTarget;


    /*
        First terminal
    */

    if (!selectedTerminal) {

        selectedTerminal =
            terminal;

        terminal.style.background =
            "#6844d8";

        terminal.style.transform =
            "scale(1.3)";

        showFeedback(
            "🔌",
            "Terminal selected",
            "Now click another terminal to connect the wire."
        );

        return;

    }


    /*
        Same terminal
    */

    if (
        selectedTerminal ===
        terminal
    ) {

        resetSelectedTerminal();

        return;

    }


    /*
        Same component
    */

    if (
        selectedTerminal.dataset.component ===
        terminal.dataset.component
    ) {

        showFeedback(
            "⚠️",
            "Invalid connection",
            "You cannot connect a component to itself."
        );

        resetSelectedTerminal();

        return;

    }


    /*
        Create connection
    */

    createConnection(
        selectedTerminal,
        terminal
    );


    resetSelectedTerminal();

}


/* ================= RESET TERMINAL ================= */

function resetSelectedTerminal() {

    if (selectedTerminal) {

        selectedTerminal.style.background =
            "";

        selectedTerminal.style.transform =
            "";

    }

    selectedTerminal = null;

}


/* ================= CREATE CONNECTION ================= */

function createConnection(
    terminalOne,
    terminalTwo
) {

    const connection = {

        from:
            terminalOne.dataset.component,

        fromSide:
            terminalOne.dataset.side,

        to:
            terminalTwo.dataset.component,

        toSide:
            terminalTwo.dataset.side

    };


    /*
        Prevent duplicate wire
    */

    const exists =
        connections.some(
            item =>
                (
                    item.from === connection.from &&
                    item.to === connection.to
                )
                ||
                (
                    item.from === connection.to &&
                    item.to === connection.from
                )
        );


    if (exists) {

        showFeedback(
            "⚠️",
            "Wire already exists",
            "These terminals are already connected."
        );

        return;

    }


    connections.push(
        connection
    );


    drawWire(
        terminalOne,
        terminalTwo
    );


    showFeedback(
        "🔌",
        "Connection created",
        "Keep connecting the components."
    );

}


/* ================= DRAW WIRE ================= */

function drawWire(
    terminalOne,
    terminalTwo
) {

    const boardRect =
        breadboard.getBoundingClientRect();


    const rectOne =
        terminalOne.getBoundingClientRect();

    const rectTwo =
        terminalTwo.getBoundingClientRect();


    const x1 =
        rectOne.left +
        rectOne.width / 2 -
        boardRect.left;


    const y1 =
        rectOne.top +
        rectOne.height / 2 -
        boardRect.top;


    const x2 =
        rectTwo.left +
        rectTwo.width / 2 -
        boardRect.left;


    const y2 =
        rectTwo.top +
        rectTwo.height / 2 -
        boardRect.top;


    /*
        Create curved path
    */

    const middleX =
        (x1 + x2) / 2;


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.setAttribute(
        "d",
        `M ${x1} ${y1}
         C ${middleX} ${y1},
           ${middleX} ${y2},
           ${x2} ${y2}`
    );


    path.classList.add(
        "wire"
    );


    wireLayer.appendChild(
        path
    );

}


/* ================= REDRAW WIRES ================= */

function redrawWires() {

    wireLayer.innerHTML = "";


    connections.forEach(
        connection => {

            const from =
                document.querySelector(
                    `[data-component="${connection.from}"][data-side="${connection.fromSide}"]`
                );


            const to =
                document.querySelector(
                    `[data-component="${connection.to}"][data-side="${connection.toSide}"]`
                );


            if (
                from &&
                to
            ) {

                drawWire(
                    from,
                    to
                );

            }

        }
    );

}


/* ================= CHECK CIRCUIT ================= */

checkButton.addEventListener(
    "click",
    checkCircuit
);


function checkCircuit() {

    attempts++;

    updateStats();


    /*
        Required components
    */

    const required = [
        "battery",
        "resistor",
        "led",
        "ground"
    ];


    const placed =
        components.map(
            component =>
                component.type
        );


    const allPlaced =
        required.every(
            type =>
                placed.includes(type)
        );


    if (!allPlaced) {

        showFeedback(
            "⚠️",
            "Circuit incomplete",
            "Place the Battery, Resistor, LED and Ground on the board."
        );

        saveProgress();

        return;

    }


    /*
        Build graph
    */

    const graph = {};


    components.forEach(
        component => {

            graph[component.id] = [];

        }
    );


    connections.forEach(
        connection => {

            graph[
                connection.from
            ].push(
                connection.to
            );

            graph[
                connection.to
            ].push(
                connection.from
            );

        }
    );


    /*
        Get component IDs
    */

    const battery =
        getComponentByType(
            "battery"
        );

    const resistor =
        getComponentByType(
            "resistor"
        );

    const led =
        getComponentByType(
            "led"
        );

    const ground =
        getComponentByType(
            "ground"
        );


    /*
        Check all components
        are connected.
    */

    const visited =
        new Set();


    function traverse(id) {

        if (
            visited.has(id)
        ) {

            return;

        }


        visited.add(id);


        graph[id].forEach(
            next =>
                traverse(next)
        );

    }


    traverse(
        battery.id
    );


    const connected =
        visited.has(
            resistor.id
        )
        &&
        visited.has(
            led.id
        )
        &&
        visited.has(
            ground.id
        );


    if (!connected) {

        showFeedback(
            "❌",
            "Circuit not complete",
            "Some components are not connected to the main circuit."
        );

        saveProgress();

        return;

    }


    /*
        Check correct number of
        connections.
    */

    if (
        connections.length < 3
    ) {

        showFeedback(
            "⚠️",
            "Almost there!",
            "Each of the four components needs to be part of the circuit."
        );

        saveProgress();

        return;

    }


    /*
        SUCCESS
    */

    completed = true;


    /*
        Score calculation
    */

    if (attempts === 1) {

        score = 100;

    }

    else if (attempts <= 3) {

        score = 80;

    }

    else {

        score = 60;

    }


    updateStats();

    saveProgress();

    turnOnLED();

    showFeedback(
        "🎉",
        "Circuit works!",
        "Excellent! You successfully built the circuit."
    );


    setTimeout(
        showSuccess,
        700
    );

}


/* ================= GET COMPONENT ================= */

function getComponentByType(
    type
) {

    return components.find(
        component =>
            component.type === type
    );

}


/* ================= LED ================= */

function turnOnLED() {

    const led =
        document.querySelector(
            ".board-component.led .led-bulb"
        );


    if (led) {

        led.classList.add(
            "glowing"
        );

        led.textContent =
            "💡";

    }

}


/* ================= REQUIRED LIST ================= */

function updateRequired() {

    const types = [
        "battery",
        "resistor",
        "led",
        "ground"
    ];


    const items =
        document.querySelectorAll(
            ".required-item"
        );


    items.forEach(
        (item, index) => {

            const type =
                types[index];


            const check =
                item.querySelector(
                    ".required-check"
                );


            const exists =
                components.some(
                    component =>
                        component.type === type
                );


            if (exists) {

                check.textContent =
                    "✓";

                check.classList.add(
                    "done"
                );

            }

            else {

                check.textContent =
                    "○";

                check.classList.remove(
                    "done"
                );

            }

        }
    );

}


/* ================= FEEDBACK ================= */

function showFeedback(
    icon,
    title,
    message
) {

    feedbackIcon.textContent =
        icon;

    feedbackTitle.textContent =
        title;

    feedbackText.textContent =
        message;

}


/* ================= HINT ================= */

hintButton.addEventListener(
    "click",
    () => {

        hintBox.classList.add(
            "show"
        );

    }
);


closeHint.addEventListener(
    "click",
    () => {

        hintBox.classList.remove(
            "show"
        );

    }
);


/* ================= RESET ================= */

resetButton.addEventListener(
    "click",
    resetCircuit
);


function resetCircuit() {

    components.forEach(
        component => {

            component.element.remove();

        }
    );


    components = [];

    connections = [];

    wireLayer.innerHTML = "";

    dropMessage.style.display =
        "block";


    selectedTerminal = null;


    /*
        Reset LED
    */

    completed = false;

    updateRequired();


    showFeedback(
        "🔄",
        "Circuit reset",
        "Your workspace is ready for a new experiment."
    );

}


/* ================= STATS ================= */

function updateStats() {

    scoreElement.textContent =
        score;

    attemptsElement.textContent =
        attempts;

}


/* ================= SAVE PROGRESS ================= */

function saveProgress() {

    const data = {

        score: score,

        attempts: attempts,

        completed: completed

    };


    localStorage.setItem(
        "eduvateCircuitLab",
        JSON.stringify(data)
    );

}


/* ================= SUCCESS ================= */

function showSuccess() {

    finalScore.textContent =
        score;

    finalAttempts.textContent =
        attempts;


    successOverlay.classList.add(
        "show"
    );

}


/* ================= CONTINUE ================= */

continueButton.addEventListener(
    "click",
    () => {

        /*
            Change this later to the
            next EDUVATE lab/assessment.
        */

        window.location.href =
            "../index.html";

    }
);


/* ================= WINDOW RESIZE ================= */

window.addEventListener(
    "resize",
    redrawWires
);