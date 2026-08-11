/* ============================================================
   BHEE FASHION HOME
   Shopping Cart System
   Part 1 - Setup & Add to Cart
============================================================ */

// ----------------------------
// CART STORAGE
// ----------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Format money
function formatPrice(price) {
    return "₦" + Number(price).toLocaleString();
}


// ----------------------------
// GET PRODUCT DETAILS
// ----------------------------
function getProductDetails(productCard) {

    const image = productCard.querySelector("img").getAttribute("src");

    const brand =
        productCard.querySelector(".des span").innerText.trim();

    const name =
        productCard.querySelector(".des h5").innerText.trim();

    let priceText =
        productCard.querySelector(".des h4").innerText;

    // Remove everything except numbers
    let price = parseFloat(
        priceText.replace(/[^\d.]/g, "")
    );

    return {
        id: image, // image path used as unique id
        image,
        brand,
        name,
        price,
        quantity: 1
    };
}


// ----------------------------
// ADD PRODUCT TO CART
// ----------------------------
function addToCart(product) {

    const existingProduct =
        cart.find(item => item.id === product.id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(product);

    }

    saveCart();

    updateCartBadge();
}



/* ============================================================
   PART 2 - Display Cart & Remove Products
============================================================ */

// ----------------------------
// RENDER CART
// ----------------------------
function renderCart() {

    const cartTable = document.getElementById("cart-items");

    // Exit if we're not on cart.html
    if (!cartTable) return;

    cartTable.innerHTML = "";

    // Empty cart
    if (cart.length === 0) {

        cartTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px;">
                    <h3>Your cart is empty.</h3>
                </td>
            </tr>
        `;

        updateCartTotals();

        return;
    }

    // Display products
    cart.forEach((product, index) => {

        const subtotal = product.price * product.quantity;

        cartTable.innerHTML += `

        <tr>

            <td>
                <a href="#" class="remove-item" data-index="${index}">
                    <i class="fas fa-times-circle"></i>
                </a>
            </td>

            <td>
                <img src="${product.image}" alt="${product.name}">
            </td>

            <td>
                ${product.brand}<br>
                <strong>${product.name}</strong>
            </td>

            <td>
                ${formatPrice(product.price)}
            </td>

            <td>
                <input
                    type="number"
                    min="1"
                    value="${product.quantity}"
                    class="quantity"
                    data-index="${index}">
            </td>

            <td>
                ${formatPrice(subtotal)}
            </td>

        </tr>

        `;

    });

    attachRemoveEvents();

    attachQuantityEvents();

    updateCartTotals();

}



// ----------------------------
// REMOVE PRODUCT
// ----------------------------
function attachRemoveEvents() {

    const removeButtons =
        document.querySelectorAll(".remove-item");

    removeButtons.forEach(button => {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const index =
                this.dataset.index;

            cart.splice(index, 1);

            saveCart();

            renderCart();

        });

    });

}
/* ============================================================
   PART 3 - Quantity & Cart Totals
============================================================ */

// ----------------------------
// QUANTITY EVENTS
// ----------------------------
function attachQuantityEvents() {

    const quantityInputs =
        document.querySelectorAll(".quantity");

    quantityInputs.forEach(input => {

        input.addEventListener("change", function () {

            const index = this.dataset.index;

            let quantity = parseInt(this.value);

            // Prevent invalid quantity
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
                this.value = 1;
            }

            cart[index].quantity = quantity;

            saveCart();

            renderCart();

        });

    });

}



// ----------------------------
// UPDATE CART TOTALS
// ----------------------------
function updateCartTotals() {

    const subtotalElement =
        document.getElementById("cart-subtotal");

    const discountElement =
        document.getElementById("cart-discount");

    const discountRow =
        document.getElementById("discount-row");

    const discountPercentElement =
        document.getElementById("discount-percent");

    const shippingElement =
        document.getElementById("cart-shipping");

    const totalElement =
        document.getElementById("cart-total");


    if (!subtotalElement || !totalElement) {
        return;
    }


    // =====================================
    // CALCULATE CART SUBTOTAL
    // =====================================

    let subtotal = 0;

    cart.forEach(product => {

        subtotal +=
            Number(product.price) *
            Number(product.quantity);

    });


    // =====================================
    // SHIPPING
    // =====================================

    const shipping = 3000;


    // =====================================
    // CALCULATE DISCOUNT
    // =====================================

    let discount = 0;

    if (discountPercent > 0) {

        discount =
            subtotal * (discountPercent / 100);

    }


    // =====================================
    // FINAL TOTAL
    // =====================================

    const total =
        subtotal - discount + shipping;


    // =====================================
    // DISPLAY VALUES
    // =====================================

    subtotalElement.innerText =
        formatPrice(subtotal);


    shippingElement.innerText =
        formatPrice(shipping);


    totalElement.innerText =
        formatPrice(total);


    // =====================================
    // DISPLAY DISCOUNT
    // =====================================

    if (discount > 0) {

        discountRow.style.display = "table-row";

        discountPercentElement.innerText =
            ` (${discountPercent}%)`;

        discountElement.innerText =
            "-" + formatPrice(discount);

    }

    else {

        discountRow.style.display = "none";

        discountElement.innerText =
            "-₦0";

    }

}


// ----------------------------
// CART ITEM COUNT
// ----------------------------
function updateCartBadge() {

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    const desktop =
        document.getElementById("cart-count");

    const mobile =
        document.getElementById("mobile-cart-count");

    if (desktop)
        desktop.innerText = total;

    if (mobile)
        mobile.innerText = total;

}


// ----------------------------
// SAVE EVERYTHING
// ----------------------------
function refreshCart() {

    saveCart();

    updateCartTotals();

    updateCartBadge();

}
/* ============================================================
   PART 4 - Initialization & Final Functions
============================================================ */

// ----------------------------
// INITIALIZE SHOP PAGE
// ----------------------------
function initializeShopPage() {

    const cartButtons = document.querySelectorAll(".cart");

    if (cartButtons.length === 0) return;

    cartButtons.forEach(button => {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const productCard = this.closest(".pro");

            const product = getProductDetails(productCard);

            addToCart(product);

            updateCartBadge();
            showCartToast(product);

        });

    });

}



// ----------------------------
// INITIALIZE CART PAGE
// ----------------------------
function initializeCartPage() {

    const cartTable = document.getElementById("cart-items");

    if (!cartTable) return;

    renderCart();

}



// ----------------------------
// CLEAR CART (Optional)
// ----------------------------
function clearCart() {

    if (confirm("Are you sure you want to clear your cart?")) {

        cart = [];

        saveCart();

        renderCart();

        updateCartBadge();

    }

}



// ----------------------------
// PAGE LOAD
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {

    initializeShopPage();

    initializeCartPage();

    updateCartBadge();


});
// ===============================
// SINGLE PRODUCT PAGE
// ===============================

const singleButton = document.querySelector(".add-to-cart-btn");

if (singleButton) {

    singleButton.addEventListener("click", function () {

        const image =
            document.querySelector("#MainImg").getAttribute("src");

        const brand =
            document.querySelector(".single-pro-details span").innerText.trim();

        const name =
            document.querySelector(".single-pro-details h4").innerText.trim();

        const price =
            parseFloat(
                document.querySelector(".single-pro-details h2")
                    .innerText.replace(/[^\d.]/g, "")
            );

        const quantity =
            parseInt(
                document.querySelector(".single-pro-details input").value
            ) || 1;

        const product = {

            id: name,

            image,

            brand,

            name,

            price,

            quantity

        };

        const existing =
            cart.find(item => item.id === product.id);

        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push(product);

        }

        saveCart();

        updateCartBadge();

        showCartToast(product);

        updateCartBadge();

        // Optional: Go directly to cart
        // window.location.href = "cart.html";

    });

}
// ============================================
// BHEE FASHION HOME
// COUPON / DISCOUNT SYSTEM
// ============================================

const couponCodes = {

    "BHEE10": 10,
    "BHEE15": 15,
    "BHEE20": 20,
    "FASHION25": 25

};

let appliedCoupon = null;
let discountPercent = 0;


// ============================================
// APPLY COUPON
// ============================================

function applyCoupon() {

    const input = document.getElementById("coupon-code");

    const message = document.getElementById("coupon-message");

    if (!input || !message) return;

    const code = input.value.trim().toUpperCase();

    if (code === "") {

        message.innerText = "Please enter a coupon code.";

        message.style.color = "red";

        return;
    }


    // Check whether coupon exists

    if (couponCodes.hasOwnProperty(code)) {

        discountPercent = couponCodes[code];

        appliedCoupon = code;

        message.innerText =
            `Coupon applied! You saved ${discountPercent}%.`;

        message.style.color = "#088178";

        updateCartTotals();

    }

    else {

        appliedCoupon = null;

        discountPercent = 0;

        message.innerText =
            "Invalid coupon code.";

        message.style.color = "red";

        updateCartTotals();

    }

}


// ============================================
// APPLY BUTTON
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const applyButton =
        document.getElementById("apply-coupon");

    if (applyButton) {

        applyButton.addEventListener(
            "click",
            applyCoupon
        );

    }

});


/* ============================================================
   END OF CART.JS
============================================================ */