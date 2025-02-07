// Initialize cart from localStorage or create an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add an item to the cart
function addToCart(id, name, price) {
    // Get the corresponding product element using ID
    const productElement = document.querySelector(`.product[data-id="${id}"]`);

    if (!productElement) {
        console.error(`Product with ID ${id} not found!`);
        return;
    }

    // Retrieve image source from the product element
    const imageSrc = productElement.querySelector('.product-image')?.src || 'images/placeholder.png';

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1, image: imageSrc });
    }

    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show notification
    showNotification(`${name} added to cart!`);
}


// Function to display cart items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    if (!cartItemsDiv || !cartTotalSpan) return;

    cartItemsDiv.innerHTML = ''; // Clear previous content
    let totalAmount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        // Ensure valid image, fallback to placeholder if missing
        const productImage = item.image || 'images/placeholder.png';

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${productImage}" alt="${item.name}" class="cart-item-img">
            <div class="item-details p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col gap-4 w-full max-w-lg">
    
    <!-- Item Name & Price -->
    <div class="flex justify-between items-center border-b pb-3">
        <div class="flex items-center gap-4">
            
            <!-- Item Info -->
            <div>
                <span class="block item-name font-semibold text-xl text-gray-900 dark:text-gray-200">${item.name}</span>
                <span class="item-price text-gray-600 dark:text-gray-400 text-lg">₹${item.price.toFixed(2)}</span>
            </div>
        </div>
    </div>

    <!-- Quantity Controls -->
    <div class="flex justify-between items-center border-b pb-3">
        <span class="text-gray-700 dark:text-gray-300 font-medium">Quantity</span>
        <div class="flex items-center gap-4">
            <button onclick="updateQuantity(${index}, 'decrease')" 
                class="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-full text-lg font-bold">
                –
            </button>
            <span class="item-quantity text-lg font-semibold dark:text-gray-200">${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 'increase')" 
                class="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-full text-lg font-bold">
                +
            </button>
        </div>
    </div>

    <!-- Total Price -->
    <div class="flex justify-between items-center border-b pb-3">
        <span class="text-gray-700 dark:text-gray-300 font-medium">Total Price</span>
        <span class="item-total font-semibold text-xl text-gray-800 dark:text-gray-300">₹${itemTotal.toFixed(2)}</span>
    </div>

    <!-- Remove Button -->
    <div class="flex justify-end">
        <button onclick="removeItem(${index})" 
            class="remove-btn px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition shadow-md">
            Remove Item
        </button>
    </div>

</div>

        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    // Update total amount display
    cartTotalSpan.textContent = totalAmount.toFixed(2);
}

// Function to update item quantity
function updateQuantity(index, action) {
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeItem(index);
        return;
    }

    // Update cart in localStorage and refresh display
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    showNotification('Item removed from cart!');
}

// Function to show a notification
function showNotification(message) {
    const notificationDiv = document.getElementById('notification');
    if (notificationDiv) {
        notificationDiv.textContent = message;
        notificationDiv.style.display = 'block';
        setTimeout(() => {
            notificationDiv.style.display = 'none';
        }, 3000);
    }
}

// Display cart items when the cart page loads
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}

function filterProducts() {
    let input = document.getElementById('search').value.toLowerCase();
    let products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        let productName = product.textContent.toLowerCase();
        if (productName.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

document.getElementById("checkout-form").addEventListener("submit", function (event) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let orderSummary = "Order Summary:\n";

    cart.forEach(item => {
        orderSummary += `${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const totalAmount = document.getElementById("total-price").textContent;
    orderSummary += `Total: ₹${totalAmount}`;

    // Assign order summary to the hidden input
    document.getElementById("order-summary-input").value = orderSummary;
});



