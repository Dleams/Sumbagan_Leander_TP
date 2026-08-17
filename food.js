/* =========================
   SHOPPING CART
========================= */

let cart = [];


/* =========================
   ELEMENTS
========================= */

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");

const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

const checkoutForm = document.getElementById("checkoutForm");
const checkoutTotal = document.getElementById("checkoutTotal");

const notification = document.getElementById("notification");

const searchInput = document.getElementById("searchInput");

const foodCards = document.querySelectorAll(".food-card");

const categoryButtons =
    document.querySelectorAll(".category-button");


/* =========================
   ADD TO CART
========================= */

const addButtons =
    document.querySelectorAll(".add-button");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem =
            cart.find(item => item.id === id);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });

        }

        updateCart();

        showNotification(
            `${name} added to your cart!`
        );

    });

});


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let itemCount = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    }


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        itemCount += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>
                    ₱${itemTotal.toLocaleString()}
                </p>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity('${item.id}', -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity('${item.id}', 1)">
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-button"
                onclick="removeItem('${item.id}')">

                Remove

            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = itemCount;

    cartTotal.textContent =
        `₱${total.toLocaleString()}`;

    checkoutTotal.textContent =
        `₱${total.toLocaleString()}`;

}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);

    if (!item) {
        return;
    }

    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

        showNotification(
            "Item removed from cart."
        );

    }


    updateCart();
}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(id) {

    const item =
        cart.find(item => item.id === id);

    if (!item) {
        return;
    }


    cart =
        cart.filter(item => item.id !== id);


    updateCart();

    showNotification(
        `${item.name} removed from cart.`
    );
}


/* =========================
   OPEN CART
========================= */

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("open");

    cartOverlay.classList.add("show");

});


/* =========================
   CLOSE CART
========================= */

function closeCartSidebar() {

    cartSidebar.classList.remove("open");

    cartOverlay.classList.remove("show");

}


closeCart.addEventListener(
    "click",
    closeCartSidebar
);


cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* =========================
   CHECKOUT
========================= */

checkoutButton.addEventListener("click", () => {

    /*
        ERROR PREVENTION

        Do not allow checkout
        if cart is empty.
    */

    if (cart.length === 0) {

        showNotification(
            "Please add food to your cart first."
        );

        return;
    }


    closeCartSidebar();

    modalOverlay.classList.add("show");

});


/* =========================
   CLOSE CHECKOUT MODAL
========================= */

closeModal.addEventListener("click", () => {

    modalOverlay.classList.remove("show");

});


/* =========================
   CHECKOUT FORM
========================= */

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const address =
            document.getElementById(
                "customerAddress"
            ).value.trim();


        const payment =
            document.getElementById(
                "paymentMethod"
            ).value;


        /*
            ERROR PREVENTION
        */

        if (
            name === "" ||
            address === "" ||
            payment === ""
        ) {

            showNotification(
                "Please complete all fields."
            );

            return;
        }


        /*
            FEEDBACK
        */

        showNotification(
            `Thank you, ${name}! Your order has been placed.`
        );


        /*
            CLEAR CART
        */

        cart = [];

        updateCart();

        checkoutForm.reset();

        modalOverlay.classList.remove("show");

    }
);


/* =========================
   NOTIFICATION
========================= */

function showNotification(message) {

    notification.textContent = message;

    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);

}


/* =========================
   CATEGORY FILTER
========================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        /*
            CONSISTENCY

            Only one category button
            appears selected.
        */

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        const category =
            button.dataset.category;


        foodCards.forEach(card => {

            const cardCategory =
                card.dataset.category;


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    () => {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        foodCards.forEach(card => {

            const foodName =
                card.dataset.name.toLowerCase();


            if (
                foodName.includes(searchTerm)
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    }
);


/* =========================
   INITIAL CART UPDATE
========================= */

updateCart();