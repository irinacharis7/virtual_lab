function mixChemicals() {

    let acid = Number(document.getElementById("acid").value);
    let base = Number(document.getElementById("base").value);

    let ph;

    if (acid === base) {
        ph = 7;
    } else if (acid > base) {
        ph = 7 - Math.min((acid - base) / 10, 6);
    } else {
        ph = 7 + Math.min((base - acid) / 10, 6);
    }

    document.getElementById("ph").innerText = ph.toFixed(2);

    if (ph === 7) {
        document.getElementById("message").innerText =
            "Neutralization achieved! The solution is neutral.";
    } else if (ph < 7) {
        document.getElementById("message").innerText =
            "The solution is acidic because more HCl is present.";
    } else {
        document.getElementById("message").innerText =
            "The solution is basic because more NaOH is present.";
    }
}