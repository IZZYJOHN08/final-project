/* =========================================================
   BHEE FASHION HOME
   PAYMENT PAGE
========================================================= */
const PAYSTACK_PUBLIC_KEY = "pk_test_f08eed7bd82ef78195a560a44d841365d7c7aaf7";

// =========================================================
// GET CART
// =========================================================

let paymentCart =
    JSON.parse(localStorage.getItem("cart")) || [];
// =========================================================
// COUPON
// =========================================================

const paymentCoupon =
    localStorage.getItem("appliedCoupon") || null;

const paymentDiscountPercent =
    Number(
        localStorage.getItem("discountPercent")
    ) || 0;


// =========================================================
// FORMAT PRICE
// =========================================================

function paymentFormatPrice(price) {

    return "₦" + Number(price).toLocaleString();

}


// =========================================================
// LOAD CUSTOMER INFORMATION
// =========================================================

function loadCustomerInformation() {

    const customer =
        JSON.parse(
            localStorage.getItem("checkoutCustomer")
        );


    // If customer information doesn't exist,
    // send the customer back to checkout.

    if (!customer) {

        window.location.href = "checkout.html";

        return;

    }


    const nameElement =
        document.getElementById(
            "payment-customer-name"
        );

    const phoneElement =
        document.getElementById(
            "payment-customer-phone"
        );

    const emailElement =
        document.getElementById(
            "payment-customer-email"
        );

    const addressElement =
        document.getElementById(
            "payment-customer-address"
        );


    if (nameElement) {

        nameElement.textContent =
            `${customer.firstName} ${customer.lastName}`;

    }


    if (phoneElement) {

        phoneElement.textContent =
            customer.phone;

    }


    if (emailElement) {

        emailElement.textContent =
            customer.email;

    }


    if (addressElement) {

        addressElement.textContent =
            `${customer.address}, ${customer.city}, ${customer.state}`;

    }

}


// =========================================================
// DISPLAY PRODUCTS
// =========================================================

function displayPaymentProducts() {

    const container =
        document.getElementById("payment-items");


    if (!container) return;


    container.innerHTML = "";


    // Empty cart

    if (paymentCart.length === 0) {

        container.innerHTML = `

            <div class="checkout-empty">

                <i class="fas fa-shopping-bag"></i>

                <h4>Your cart is empty</h4>

                <p>
                    Please add products before making a payment.
                </p>

                <a href="shop.html" class="normal">
                    Continue Shopping
                </a>

            </div>

        `;

        updatePaymentTotals();

        return;

    }


    // Display products

    paymentCart.forEach(product => {

        const quantity =
            Number(product.quantity);


        const price =
            Number(product.price);


        const subtotal =
            price * quantity;


        container.innerHTML += `

            <div class="payment-product">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="payment-product-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        Qty: ${quantity}
                    </p>

                </div>

                <strong>
                    ${paymentFormatPrice(subtotal)}
                </strong>

            </div>

        `;

    });


    updatePaymentTotals();

}


// =========================================================
// UPDATE TOTALS
// =========================================================

function updatePaymentTotals() {

    const subtotalElement =
        document.getElementById(
            "payment-subtotal"
        );

    const discountElement =
        document.getElementById(
            "payment-discount"
        );

    const discountPercentElement =
        document.getElementById(
            "payment-discount-percent"
        );

    const discountRow =
        document.getElementById(
            "payment-discount-row"
        );

    const shippingElement =
        document.getElementById(
            "payment-shipping"
        );

    const totalElement =
        document.getElementById(
            "payment-total"
        );


    if (!subtotalElement || !totalElement) {
        return;
    }


    // =====================================
    // SUBTOTAL
    // =====================================

    let subtotal = 0;


    paymentCart.forEach(product => {

        subtotal +=
            Number(product.price) *
            Number(product.quantity);

    });


    // =====================================
    // DISCOUNT
    // =====================================

    let discount = 0;


    if (paymentDiscountPercent > 0) {

        discount =
            subtotal *
            (paymentDiscountPercent / 100);

    }


    // =====================================
    // SHIPPING
    // =====================================

    const shipping = 3000;


    // =====================================
    // FINAL TOTAL
    // =====================================

    const total =
        subtotal -
        discount +
        shipping;


    // =====================================
    // DISPLAY
    // =====================================

    subtotalElement.textContent =
        paymentFormatPrice(subtotal);


    // Shipping
    if (shippingElement) {

        shippingElement.textContent =
            paymentFormatPrice(shipping);

    }


    // =====================================
    // DISCOUNT DISPLAY
    // =====================================

    if (
        discount > 0 &&
        discountRow &&
        discountElement
    ) {

        discountRow.style.display = "flex";


        discountElement.textContent =
            "-" + paymentFormatPrice(discount);


        if (discountPercentElement) {

            discountPercentElement.textContent =
                ` (${paymentDiscountPercent}%)`;

        }

    }

    else if (discountRow) {

        discountRow.style.display = "none";

    }


    // =====================================
    // TOTAL
    // =====================================

    totalElement.textContent =
        paymentFormatPrice(total);

}


// =========================================================
// PAY NOW
// =========================================================

function handlePayNow() {

    if (paymentCart.length === 0) {

        alert("Your cart is empty.");

        window.location.href = "shop.html";

        return;
    }


    const customer =
        JSON.parse(
            localStorage.getItem("checkoutCustomer")
        );


    if (!customer) {

        alert("Your checkout information is missing.");

        window.location.href = "checkout.html";

        return;
    }


    // Calculate the exact amount displayed on Payment page

    let subtotal = 0;

    paymentCart.forEach(product => {

        subtotal +=
            Number(product.price) *
            Number(product.quantity);

    });


    const discount =
        subtotal *
        (paymentDiscountPercent / 100);


    const shipping = 3000;


    const total =
        subtotal -
        discount +
        shipping;


    // Paystack expects the amount in kobo

    const amountInKobo =
        Math.round(total * 100);


    const payButton =
        document.getElementById("pay-now");


    if (payButton) {

        payButton.disabled = true;

        payButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Processing...';

    }


    const popup =
        new PaystackPop();


    popup.newTransaction({

        key: PAYSTACK_PUBLIC_KEY,

        email: customer.email,

        amount: amountInKobo,

        currency: "NGN",

        firstName: customer.firstName,

        lastName: customer.lastName,

        phone: customer.phone,


        metadata: {

            custom_fields: [

                {
                    display_name: "Coupon",
                    variable_name: "coupon",
                    value: paymentCoupon || "None"
                },

                {
                    display_name: "Discount",
                    variable_name: "discount",
                    value: `${paymentDiscountPercent}%`
                },

                {
                    display_name: "Delivery Address",
                    variable_name: "delivery_address",
                    value:
                        `${customer.address}, ${customer.city}, ${customer.state}`
                }

            ]

        },


        onSuccess: (transaction) => {

            console.log(
                "Payment successful:",
                transaction
            );


            localStorage.setItem(
                "paymentReference",
                transaction.reference
            );


            localStorage.setItem(
                "paymentStatus",
                "successful"
            );


            // Clear cart ONLY after successful payment

            localStorage.removeItem("cart");


            window.location.href =
                "order-confirmation.html";

        },


        onCancel: () => {

            if (payButton) {

                payButton.disabled = false;

                payButton.innerHTML =
                    '<i class="fas fa-lock"></i> Pay Now';

            }

        },


        onError: (error) => {

            console.error(
                "Paystack error:",
                error
            );


            alert(
                "There was a problem starting the payment. Please try again."
            );


            if (payButton) {

                payButton.disabled = false;

                payButton.innerHTML =
                    '<i class="fas fa-lock"></i> Pay Now';

            }

        }

    });

}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCustomerInformation();

        displayPaymentProducts();


        const payButton =
            document.getElementById("pay-now");


        if (payButton) {

            payButton.addEventListener(
                "click",
                handlePayNow
            );

        }

    }
);