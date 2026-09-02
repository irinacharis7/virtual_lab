
/* =====================================
   EDUVATE VIRTUAL BIOLOGY LAB
   DRAG & DROP CELL LABELING
===================================== */


let score = 0;

let draggedLabel = null;

const totalParts = 3;


/* =====================================
   DRAG START
===================================== */

const labels =
    document.querySelectorAll(".drag-label");


labels.forEach(label => {

    label.addEventListener("dragstart", function (event) {

        draggedLabel = this;

        this.classList.add("dragging");

        event.dataTransfer.setData(
            "text/plain",
            this.dataset.label
        );

    });


    label.addEventListener("dragend", function () {

        this.classList.remove("dragging");

    });

});


/* =====================================
   DROP ZONES
===================================== */

const parts =
    document.querySelectorAll(".cell-part");


parts.forEach(part => {


    part.addEventListener("dragover", function (event) {

        event.preventDefault();

        this.style.transform = "scale(1.08)";

    });


    part.addEventListener("dragleave", function () {

        this.style.transform = "";

    });


    part.addEventListener("drop", function (event) {

        event.preventDefault();

        this.style.transform = "";


        if (!draggedLabel) {
            return;
        }


        const draggedType =
            draggedLabel.dataset.label;

        const correctType =
            this.dataset.part;


        /* =========================
           CORRECT
        ========================= */

        if (draggedType === correctType) {

            if (
                this.dataset.labeled === "true"
            ) {
                return;
            }


            this.dataset.labeled = "true";

            this.classList.add("correct");


            draggedLabel.classList.add("used");

            draggedLabel.draggable = false;


            score++;


            updateScore();


            showFeedback(
                "correct",
                "✓ Correct! " +
                capitalize(correctType) +
                " identified."
            );


            setTimeout(() => {

                this.classList.remove(
                    "correct"
                );

            }, 600);

        }


        /* =========================
           WRONG
        ========================= */

        else {

            this.classList.add("incorrect");


            showFeedback(
                "wrong",
                "✗ Not quite! Try another structure."
            );


            setTimeout(() => {

                this.classList.remove(
                    "incorrect"
                );

            }, 400);

        }


        draggedLabel = null;

    });

});


/* =====================================
   UPDATE SCORE
===================================== */

function updateScore() {

    document.getElementById(
        "score"
    ).innerText = score;


    const progress =
        (score / totalParts) * 100;


    document.getElementById(
        "progressFill"
    ).style.width =
        progress + "%";


    if (score === totalParts) {

        showFeedback(
            "correct",
            "🎉 Amazing! All cell parts are correctly labelled."
        );

    }

}


/* =====================================
   FEEDBACK
===================================== */

function showFeedback(type, message) {

    const feedback =
        document.getElementById("feedback");


    feedback.innerText = message;


    feedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );


    if (type === "correct") {

        feedback.classList.add(
            "correct-feedback"
        );

    }

    else {

        feedback.classList.add(
            "wrong-feedback"
        );

    }

}


/* =====================================
   CHECK COMPLETION
===================================== */

function checkCompletion() {

    if (score < totalParts) {

        showFeedback(
            "wrong",
            "⚠️ You still have " +
            (totalParts - score) +
            " label(s) to place."
        );

        return;

    }


    localStorage.setItem(
        "plantCellLabCompleted",
        "true"
    );


    localStorage.setItem(
        "plantCellLabXP",
        "100"
    );


    document
        .getElementById("successOverlay")
        .classList.add("show");

}


/* =====================================
   CLOSE SUCCESS
===================================== */

function closeSuccess() {

    document
        .getElementById("successOverlay")
        .classList.remove("show");

}


/* =====================================
   CAPITALIZE
===================================== */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}
