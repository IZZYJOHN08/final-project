let toastTimer;

function showCartToast(product) {

    const toast = document.getElementById("cart-toast");

    const image = document.getElementById("toast-image");

    const name = document.getElementById("toast-name");

    const brand = document.getElementById("toast-brand");

    const price = document.getElementById("toast-price");

    if (!toast) return;

    clearTimeout(toastTimer);

    image.src = product.image;

    name.innerText = product.name;

    brand.innerText = product.brand;

    price.innerText = "₦" + Number(product.price).toLocaleString();

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 5000);

}


// ===============================
// CONTINUE SHOPPING BUTTON
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const continueBtn = document.getElementById("continue-shopping");

    if (continueBtn) {

        continueBtn.addEventListener("click", function () {

            document.getElementById("cart-toast")
                .classList.remove("show");

        });

    }

});


// ===============================
// VIEW CART BUTTON
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const viewCart = document.getElementById("view-cart");

    if (viewCart) {

        viewCart.addEventListener("click", function () {

            window.location.href = "cart.html";

        });

    }

});