let products = JSON.parse(localStorage.getItem("products")) || [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 999,
        image: "https://fakestoreapi.com/img/71li-UMk1SS._AC_UX679_.jpg"
    },
    {
        id: 3,
        name: "Laptop",
        price: 45000,
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let editingId = null;

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayProducts() {
    const container = document.getElementById("products");
    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    let filtered = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    if (category !== "all") {
        filtered = filtered.filter(product =>
            product.category === category
        );
    }

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No products found!</p>";
        return;
    }

    filtered.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
                <button onclick="editProduct(${product.id})">
                    Edit
                </button>
                <button onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            </div>
        `;
    });
}

function showAddForm() {
    editingId = null;
    document.getElementById("productForm").hidden = false;
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
}

function saveProduct() {
    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const image = document.getElementById("productImage").value.trim();

    if (!name || price <= 0 || !Number.isFinite(price)) {
        alert("Please enter valid product name and price!");
        return;
    }

    if (editingId !== null) {
        const product = products.find(p => p.id === editingId);
        product.name = name;
        product.price = price;
        if (image) product.image = image;
    } else {
        products.push({
            id: Date.now(),
            name,
            price,
            image: image || "https://via.placeholder.com/200"
        });
    }

    saveData();
    displayProducts();

    document.getElementById("productForm").hidden = true;
    document.getElementById("message").textContent =
        "Product saved successfully!";
}

function editProduct(id) {
    const product = products.find(p => p.id === id);

    editingId = id;
    document.getElementById("productForm").hidden = false;
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImage").value = product.image;
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    products = products.filter(p => p.id !== id);
    cart = cart.filter(item => item.id !== id);

    saveData();
    displayProducts();
    displayCart();
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveData();
    displayCart();
    alert("Product added to cart!");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveData();
    displayCart();
}

function displayCart() {
    const container = document.getElementById("cartItems");
    let total = 0;

    container.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price} × ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("total").textContent =
        "Total: ₹" + total.toFixed(2);
}

function showHome() {
    document.getElementById("homeSection").hidden = false;
    document.getElementById("cartSection").hidden = true;
    document.getElementById("loginSection").hidden = true;
}

function showCart() {
    document.getElementById("homeSection").hidden = true;
    document.getElementById("cartSection").hidden = false;
    document.getElementById("loginSection").hidden = true;
    displayCart();
}

function showLogin() {
    document.getElementById("homeSection").hidden = true;
    document.getElementById("cartSection").hidden = true;
    document.getElementById("loginSection").hidden = false;
}

function login() {
    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Enter username!");
        return;
    }

    localStorage.setItem("username", username);
    document.getElementById("userStatus").textContent =
        "Welcome, " + username + "!";
}

function logout() {
    localStorage.removeItem("username");
    document.getElementById("userStatus").textContent =
        "Logged out successfully!";
}

// Search, category and sorting
document.getElementById("search").addEventListener("input", displayProducts);
document.getElementById("category").addEventListener("change", displayProducts);
document.getElementById("sort").addEventListener("change", displayProducts);

// Initial load
displayProducts();
displayCart();
