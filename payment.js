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


        onSuccess: async (transaction) => {

            console.log(
                "Paystack payment successful:",
                transaction
            );


            const reference =
                transaction.reference;


            if (!reference) {

                alert(
                    "Payment was completed, but the transaction reference was not received."
                );

                if (payButton) {

                    payButton.disabled = false;

                    payButton.innerHTML =
                        '<i class="fas fa-lock"></i> Pay Now';

                }

                return;
            }


            // Show verification status

            if (payButton) {

                payButton.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i> Verifying Payment...';

            }


            try {

                const response =
                    await fetch(
                        "verify-payment.php",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                reference: reference

                            })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Verification result:",
                    result
                );


                // ==========================================
                // PAYMENT VERIFIED
                // ==========================================

                if (
                    response.ok &&
                    result.status === true
                ) {

                    localStorage.setItem(
                        "paymentReference",
                        reference
                    );


                    localStorage.setItem(
                        "paymentStatus",
                        "successful"
                    );


                    // ==========================================
                    // GENERATE ORDER NUMBER
                    // ==========================================

                    const randomNumber =
                        Math.floor(
                            100000 +
                            Math.random() * 900000
                        );

                    const orderNumber =
                        "BHF-" + randomNumber;


                    localStorage.setItem(
                        "orderNumber",
                        orderNumber
                    );


                    // ==========================================
                    // SAVE ORDER TO DATABASE
                    // ==========================================

                    if (payButton) {

                        payButton.innerHTML =
                            '<i class="fas fa-spinner fa-spin"></i> Saving Order...';

                    }


                    const orderData = {

                        orderNumber:
                            orderNumber,

                        paymentReference:
                            reference,

                        paymentStatus:
                            "successful",

                        customer:
                            customer,

                        items:
                            paymentCart,

                        subtotal:
                            subtotal,

                        discount:
                            discount,

                        shipping:
                            shipping,

                        total:
                            total

                    };


                    const saveResponse =
                        await fetch(
                            "save-order.php",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(orderData)

                            }
                        );


                    const saveResult =
                        await saveResponse.json();


                    console.log(
                        "Order save result:",
                        saveResult
                    );


                    // ==========================================
                    // ORDER SAVED SUCCESSFULLY
                    // ==========================================

                    if (
                        saveResponse.ok &&
                        saveResult.status === true
                    ) {


                        // Clear cart ONLY after
                        // order has been saved successfully

                        localStorage.removeItem(
                            "cart"
                        );


                        window.location.href =
                            "order-confirmation.html";


                        return;

                    }


                    // ==========================================
                    // ORDER SAVE FAILED
                    // ==========================================

                    console.error(
                        "Order could not be saved:",
                        saveResult
                    );


                    alert(
                        saveResult.message ||
                        "Payment was verified, but we could not save your order. Please contact support."
                    );


                    if (payButton) {

                        payButton.disabled = false;

                        payButton.innerHTML =
                            '<i class="fas fa-lock"></i> Pay Now';

                    }

                }


                // ==========================================
                // PAYMENT NOT VERIFIED
                // ==========================================

                alert(
                    result.message ||
                    "Payment could not be verified. Please contact support."
                );


                if (payButton) {

                    payButton.disabled = false;

                    payButton.innerHTML =
                        '<i class="fas fa-lock"></i> Pay Now';

                }

            }

            catch (error) {

                console.error(
                    "Payment verification error:",
                    error
                );


                alert(
                    "We couldn't verify your payment. Please check your connection and try again."
                );


                if (payButton) {

                    payButton.disabled = false;

                    payButton.innerHTML =
                        '<i class="fas fa-lock"></i> Pay Now';

                }

            }

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