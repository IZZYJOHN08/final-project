// =========================================================
// ORDER CONFIRMATION
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const orderNumberElement =
        document.getElementById("order-number");


    if (!orderNumberElement) return;


    // Generate a temporary order number
    const orderNumber =
        "BHF-" +
        Date.now().toString().slice(-6);


    orderNumberElement.textContent =
        orderNumber;


    // Save it
    localStorage.setItem(
        "lastOrderNumber",
        orderNumber
    );

});