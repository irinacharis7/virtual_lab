const labs = [
    {
        name: "Bubble Sort",
        path: "COMPUTER SCIENCE/bubble-sort/index.html"
    },
    {
        name: "Linear Search",
        path: "COMPUTER SCIENCE/linear-search/index.html"
    },
    {
        name: "Binary Search",
        path: "COMPUTER SCIENCE/binary-search/index.html"
    },
    {
        name: "Biology Lab",
        path: "SCIENCE/biology-lab/index.html"
    },
    {
        name: "Chemistry Lab",
        path: "SCIENCE/chemistry-lab/index.html"
    },
    {
        name: "Physics Lab",
        path: "SCIENCE/physics-lab/index.html"
    },
    {
        name: "Circuit Connection Lab",
        path: "ELECTRONICS/circuit-lab/index.html"
    }
];


// ===============================
// CONTINUE LEARNING
// ===============================

const continueButton =
    document.getElementById("continueButton");

continueButton.addEventListener("click", function () {

    const completed =
        JSON.parse(
            localStorage.getItem("eduvateLabProgress") || "{}"
        );

    const nextLab =
        labs.find(lab => !completed[lab.name]);

    if (nextLab) {

        window.location.href =
            nextLab.path;

    } else {

        alert(
            "🎉 Amazing! You have completed all the labs!"
        );

    }

});


// ===============================
// RANDOM LAB
// ===============================

const randomButton =
    document.getElementById("randomLabButton");

randomButton.addEventListener("click", function () {

    const randomIndex =
        Math.floor(Math.random() * labs.length);

    const randomLab =
        labs[randomIndex];

    window.location.href =
        randomLab.path;

});


// ===============================
// UPDATE HERO
// ===============================

const heroLabName =
    document.getElementById("heroLabName");

const heroLabText =
    document.getElementById("heroLabText");


const completed =
    JSON.parse(
        localStorage.getItem("eduvateLabProgress") || "{}"
    );


const nextLab =
    labs.find(lab => !completed[lab.name]);


if (nextLab) {

    heroLabName.innerText =
        nextLab.name;

    heroLabText.innerText =
        "Ready to experiment...";

}


// ===============================
// SAVE LAST OPENED LAB
// ===============================

document.querySelectorAll(".lab-button")
    .forEach(button => {

        button.addEventListener("click", function () {

            localStorage.setItem(
                "lastLab",
                this.href
            );

        });

    });