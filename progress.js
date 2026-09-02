const labProgress = {

    "Bubble Sort": "bubbleSort",

    "Linear Search": "linearSearch",

    "Binary Search": "binarySearch",

    "Biology Lab": "biologyLab",

    "Chemistry Lab": "chemistryLab",

    "Physics Lab": "physicsLab",

    "Circuit Connection Lab": "circuitLab"

};


function getProgress() {

    return JSON.parse(
        localStorage.getItem("eduvateLabProgress") || "{}"
    );

}


function saveProgress(progress) {

    localStorage.setItem(
        "eduvateLabProgress",
        JSON.stringify(progress)
    );

}


// ===============================
// MARK LAB COMPLETE
// ===============================

function markLabComplete(labName) {

    const progress =
        getProgress();

    progress[labName] = true;

    saveProgress(progress);

}


// ===============================
// UPDATE MAIN PAGE
// ===============================

function updateProgress() {

    const progress =
        getProgress();

    const labNames =
        Object.keys(labProgress);

    let completed = 0;


    labNames.forEach(name => {

        const key =
            labProgress[name];

        const status =
            document.getElementById(
                key + "Status"
            );

        const statusText =
            document.getElementById(
                key + "StatusText"
            );


        if (progress[name]) {

            completed++;


            if (status) {

                status.classList.add("completed");

            }


            if (statusText) {

                statusText.innerText =
                    "Completed";

            }

        }

    });


    const percentage =
        Math.round(
            (completed / labNames.length) * 100
        );


    const percentageElement =
        document.getElementById(
            "overallPercentage"
        );


    const progressBar =
        document.getElementById(
            "overallProgress"
        );


    const message =
        document.getElementById(
            "progressMessage"
        );


    if (percentageElement) {

        percentageElement.innerText =
            percentage + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (message) {

        if (percentage === 0) {

            message.innerText =
                "Start your first experiment to begin your journey.";

        }

        else if (percentage < 50) {

            message.innerText =
                "Great start! Keep experimenting.";

        }

        else if (percentage < 100) {

            message.innerText =
                "You're doing great! Keep going.";

        }

        else {

            message.innerText =
                "🎉 All labs completed! Amazing work.";

        }

    }

}


// ===============================
// RUN
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    updateProgress
);