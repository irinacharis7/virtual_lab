
function runExperiment() {

    const voltage =
        Number(document.getElementById("voltage").value);

    const resistance =
        Number(document.getElementById("resistance").value);

    const currentElement =
        document.getElementById("current");

    const resultMessage =
        document.getElementById("resultMessage");

    const resultBox =
        document.getElementById("resultBox");


    /* Validate input */

    if (voltage < 0 || resistance <= 0) {

        currentElement.innerText = "0.00";

        resultMessage.innerText =
            "Please enter a valid voltage and resistance.";

        return;
    }


    /* Ohm's Law */

    const current = voltage / resistance;


    /* Display result */

    currentElement.innerText =
        current.toFixed(2);


    /* Educational feedback */

    if (current < 0.2) {

        resultMessage.innerText =
            "Low current detected. Try increasing the voltage.";

    } else if (current < 1) {

        resultMessage.innerText =
            "Good! You are observing a moderate current.";

    } else {

        resultMessage.innerText =
            "High current detected. Observe how resistance affects it.";
    }


    /* Animation */

    resultBox.classList.remove("active");

    setTimeout(() => {

        resultBox.classList.add("active");

    }, 50);
}
