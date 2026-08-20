/* =========================================================
   BHEE FASHION HOME
   ORDER CONFIRMATION
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    // ============================================
    // GET ORDER NUMBER
    // ============================================

    const orderNumber =
        localStorage.getItem("orderNumber");


    if (!orderNumber) {

        console.error(
            "Order number not found."
        );

        return;

    }


    // ============================================
    // GET ORDER FROM DATABASE
    // ============================================

    try {

        const response =
            await fetch(
                "get-order.php?order_number=" +
                encodeURIComponent(orderNumber)
            );


        const result =
            await response.json();


        console.log(
            "Order from database:",
            result
        );


        // =========================================
        // CHECK RESPONSE
        // =========================================

        if (
            !response.ok ||
            result.status !== true
        ) {

            console.error(
                result.message ||
                "Could not retrieve order."
            );

            return;

        }


        const order =
            result.order;

        const items =
            result.items || [];


        // =========================================
        // ORDER NUMBER
        // =========================================

        const orderNumberElement =
            document.getElementById(
                "order-number"
            );


        if (orderNumberElement) {

            orderNumberElement.textContent =
                order.order_number;

        }


        // =========================================
        // PAYMENT REFERENCE
        // =========================================

        const referenceElement =
            document.getElementById(
                "payment-reference"
            );


        if (referenceElement) {

            referenceElement.textContent =
                order.payment_reference;

        }


        // =========================================
        // PAYMENT STATUS
        // =========================================

        const statusElement =
            document.getElementById(
                "payment-status"
            );


        if (statusElement) {

            statusElement.textContent =
                order.payment_status ===
                    "successful"
                    ? "Paid"
                    : order.payment_status;

        }


        // =========================================
        // CUSTOMER NAME
        // =========================================

        const nameElement =
            document.getElementById(
                "customer-name"
            );


        if (nameElement) {

            nameElement.textContent =
                `${order.customer_first_name}
                 ${order.customer_last_name}`.trim();

        }


        // =========================================
        // CUSTOMER EMAIL
        // =========================================

        const emailElement =
            document.getElementById(
                "customer-email"
            );


        if (emailElement) {

            emailElement.textContent =
                order.customer_email;

        }


        // =========================================
        // CUSTOMER PHONE
        // =========================================

        const phoneElement =
            document.getElementById(
                "customer-phone"
            );


        if (phoneElement) {

            phoneElement.textContent =
                order.customer_phone;

        }


        // =========================================
        // DELIVERY ADDRESS
        // =========================================

        const addressElement =
            document.getElementById(
                "customer-address"
            );


        if (addressElement) {

            addressElement.textContent =
                [
                    order.delivery_address,
                    order.delivery_city,
                    order.delivery_state
                ]
                    .filter(Boolean)
                    .join(", ");

        }


        // =========================================
        // DISPLAY ORDER ITEMS
        // =========================================

        displayOrderItems(items);


        // =========================================
        // DISPLAY TOTALS
        // =========================================

        displayOrderTotals(order);

    }

    catch (error) {

        console.error(
            "Error loading order:",
            error
        );

    }

});


// =====================================================
// DISPLAY ORDER ITEMS
// =====================================================

function displayOrderItems(items) {

    const container =
        document.getElementById(
            "confirmation-items"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!items.length) {

        container.innerHTML =
            "<p>No products found for this order.</p>";

        return;

    }


    items.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "confirmation-item";


        const image =
            document.createElement("img");

        image.src =
            item.product_image;

        image.alt =
            item.product_name;


        const details =
            document.createElement("div");

        details.className =
            "confirmation-item-details";


        details.innerHTML = `

            <h4>
                ${item.product_name}
            </h4>

            <p>
                ${item.product_brand || ""}
            </p>

            <span>
                Qty: ${item.quantity}
            </span>

        `;


        const price =
            document.createElement("strong");

        price.textContent =
            "₦" +
            Number(item.price)
                .toLocaleString();


        row.appendChild(image);

        row.appendChild(details);

        row.appendChild(price);


        container.appendChild(row);

    });

}


// =====================================================
// DISPLAY ORDER TOTALS
// =====================================================

function displayOrderTotals(order) {

    const subtotal =
        document.getElementById(
            "confirmation-subtotal"
        );


    const discount =
        document.getElementById(
            "confirmation-discount"
        );


    const shipping =
        document.getElementById(
            "confirmation-shipping"
        );


    const total =
        document.getElementById(
            "confirmation-total"
        );


    if (subtotal) {

        subtotal.textContent =
            "₦" +
            Number(order.subtotal)
                .toLocaleString();

    }


    if (discount) {

        discount.textContent =
            "-₦" +
            Number(order.discount)
                .toLocaleString();

    }


    if (shipping) {

        shipping.textContent =
            "₦" +
            Number(order.shipping)
                .toLocaleString();

    }


    if (total) {

        total.textContent =
            "₦" +
            Number(order.total)
                .toLocaleString();

    }

}