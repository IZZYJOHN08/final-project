/* =========================================================
   BHEE FASHION HOME
   CHECKOUT
========================================================= */


// Get cart
let checkoutCart =
    JSON.parse(localStorage.getItem("cart")) || [];


// Format price
function checkoutFormatPrice(price) {

    return "₦" + Number(price).toLocaleString();

}

// =========================================================
// COUPON
// =========================================================

const checkoutCoupon =
    localStorage.getItem("appliedCoupon") || null;

const checkoutDiscountPercent =
    Number(
        localStorage.getItem("discountPercent")
    ) || 0;

// =========================================================
// DISPLAY CHECKOUT PRODUCTS
// =========================================================

function displayCheckoutProducts() {

    const container =
        document.getElementById("checkout-items");

    if (!container) return;


    container.innerHTML = "";


    if (checkoutCart.length === 0) {

        container.innerHTML = `

            <div class="checkout-empty">

                <i class="fas fa-shopping-bag"></i>

                <h4>Your cart is empty</h4>

                <p>Add products before checking out.</p>

                <a href="shop.html" class="normal">
                    Continue Shopping
                </a>

            </div>

        `;

        updateCheckoutTotals();

        return;
    }


    checkoutCart.forEach(product => {

        const subtotal =
            Number(product.price) *
            Number(product.quantity);


        container.innerHTML += `

            <div class="checkout-product">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="checkout-product-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        ${product.brand}
                    </p>

                    <p>
                        Quantity: ${product.quantity}
                    </p>

                </div>

                <strong>
                    ${checkoutFormatPrice(subtotal)}
                </strong>

            </div>

        `;

    });


    updateCheckoutTotals();

}


// =========================================================
// TOTALS
// =========================================================

function updateCheckoutTotals() {

    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const discountElement =
        document.getElementById("checkout-discount");

    const discountPercentElement =
        document.getElementById(
            "checkout-discount-percent"
        );

    const discountRow =
        document.getElementById(
            "checkout-discount-row"
        );

    const totalElement =
        document.getElementById("checkout-total");


    if (!subtotalElement || !totalElement) {
        return;
    }


    // =====================================
    // SUBTOTAL
    // =====================================

    let subtotal = 0;


    checkoutCart.forEach(product => {

        subtotal +=
            Number(product.price) *
            Number(product.quantity);

    });


    // =====================================
    // DISCOUNT
    // =====================================

    let discount = 0;


    if (checkoutDiscountPercent > 0) {

        discount =
            subtotal *
            (checkoutDiscountPercent / 100);

    }


    // =====================================
    // SHIPPING
    // =====================================

    const shipping = 3000;


    // =====================================
    // TOTAL
    // =====================================

    const total =
        subtotal -
        discount +
        shipping;


    // =====================================
    // DISPLAY
    // =====================================

    subtotalElement.innerText =
        checkoutFormatPrice(subtotal);


    // Discount
    if (
        discount > 0 &&
        discountRow &&
        discountElement
    ) {

        discountRow.style.display = "flex";

        discountElement.innerText =
            "-" + checkoutFormatPrice(discount);


        if (discountPercentElement) {

            discountPercentElement.innerText =
                ` (${checkoutDiscountPercent}%)`;

        }

    }

    else if (discountRow) {

        discountRow.style.display = "none";

    }


    // Total
    totalElement.innerText =
        checkoutFormatPrice(total);

}


// =========================================================
// PLACE ORDER
// =========================================================

function handlePlaceOrder() {

    // Check cart
    if (checkoutCart.length === 0) {

        alert(
            "Your cart is empty. Please add a product before checking out."
        );

        window.location.href = "shop.html";

        return;
    }


    // Get fields
    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const firstName =
        document.getElementById("first-name");

    const lastName =
        document.getElementById("last-name");

    const address =
        document.getElementById("address");

    const state =
        document.getElementById("state");

    const city =
        document.getElementById("city");

    const instructions =
        document.getElementById("instructions");


    // Check required fields
    if (
        !email.value.trim() ||
        !phone.value.trim() ||
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !address.value.trim() ||
        !state.value ||
        !city.value.trim()
    ) {

        alert(
            "Please fill in all required delivery information."
        );

        return;
    }


    // Validate email
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email.value.trim())) {

        alert(
            "Please enter a valid email address."
        );

        email.focus();

        return;
    }


    // Payment method
    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    const customerDetails = {

        email:
            email.value.trim(),

        phone:
            phone.value.trim(),

        firstName:
            firstName.value.trim(),

        lastName:
            lastName.value.trim(),

        address:
            address.value.trim(),

        state:
            state.value,

        city:
            city.value.trim(),

        instructions:
            instructions
                ? instructions.value.trim()
                : "",

        paymentMethod:
            selectedPayment
                ? selectedPayment.value
                : "online"

    };


    // Save customer details
    localStorage.setItem(
        "checkoutCustomer",
        JSON.stringify(customerDetails)
    );


    // Go to payment page
    window.location.href =
    "payment.html";

}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    displayCheckoutProducts();


    const placeOrderButton =
        document.getElementById("place-order");


    if (placeOrderButton) {

        placeOrderButton.addEventListener(
            "click",
            handlePlaceOrder
        );

    }

});