
const productContainer = document.getElementById("products");
const categoryContainer = document.getElementById("category-container");
const loading = document.getElementById("loading");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartClose = document.getElementById("cart-close");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");


function updateCartCount() {
  const validItems = cart.filter(p => p && p.title && p.price);
  if(cartCount) cartCount.innerText = validItems.length;
}

function renderCart() {
  if(!cartItemsContainer) return;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  const validCart = cart.filter(p => p && p.title && p.price);

  if(validCart.length === 0){
    cartItemsContainer.innerHTML = "<p class='text-gray-500 text-center'>Your cart is empty.</p>";
  }

  validCart.forEach((product, index) => {
    total += product.price;

    const item = document.createElement("div");
    item.className = "flex justify-between items-center border-b pb-2";

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${product.image}" class="w-16 h-16 object-contain rounded" />
        <div>
          <h4 class="font-semibold text-sm">${product.title.length > 25 ? product.title.slice(0,25)+"..." : product.title}</h4>
          <p class="text-orange-500 font-bold">$${product.price}</p>
        </div>
      </div>
      <button class="delete-item text-red-500 font-bold text-xl">✕</button>
    `;

    item.querySelector(".delete-item").addEventListener("click", () => {
      const removeIndex = cart.indexOf(product);
      if(removeIndex > -1) cart.splice(removeIndex,1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });

    cartItemsContainer.appendChild(item);
  });

  if(cartTotal) cartTotal.innerText = "$" + total.toFixed(2);
}

function addToCart(product){
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function buyNow(product){
    
    const exists = cart.some(p => p.id === product.id);
    if(!exists) cart.push(product);
  
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  
   
    cartSidebar.classList.remove("translate-x-full");
  }
  


cartBtn?.addEventListener("click", () => cartSidebar.classList.remove("translate-x-full"));
cartClose?.addEventListener("click", () => cartSidebar.classList.add("translate-x-full"));


modalClose.addEventListener("click", () => modal.classList.add("hidden"));

function showDetails(product){
  document.getElementById("modal-img").src = product.image;
  document.getElementById("modal-title").innerText = product.title;
  document.getElementById("modal-desc").innerText = product.description;
  document.getElementById("modal-price").innerText = "$"+product.price;
  document.getElementById("modal-rating").innerHTML = `<img src="assets/star.png" class="inline w-5 h-5 mr-1"/> ${product.rating.rate}`;

  document.getElementById("modal-cart-btn").onclick = () => addToCart(product);
  document.getElementById("modal-buy-btn").onclick = () => buyNow(product);
  modal.classList.remove("hidden");
}


async function fetchCategories(){
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();
  renderCategoryButtons(categories);
}

function renderCategoryButtons(categories){
  categoryContainer.innerHTML = "";
  categories.unshift("all");

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.className = "px-4 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition";
    btn.addEventListener("click", () => {
      document.querySelectorAll("#category-container button").forEach(b => b.classList.remove("bg-orange-500","text-white"));
      btn.classList.add("bg-orange-500","text-white");
      fetchProducts(cat);
    });
    categoryContainer.appendChild(btn);
  });
}


async function fetchProducts(category="all"){
  loading.classList.remove("hidden");
  productContainer.innerHTML = "";

  let url = "https://fakestoreapi.com/products";
  if(category !== "all") url += `/category/${category}`;

  const res = await fetch(url);
  const products = await res.json();
  products.forEach(p => productContainer.appendChild(createCard(p)));
  loading.classList.add("hidden");
}


function createCard(product){
  const card = document.createElement("div");
  card.className = "bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl hover:-translate-y-2 transition duration-300";

  card.innerHTML = `
    <img src="${product.image}" class="h-40 mx-auto object-contain mb-4">
    <span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">${product.category}</span>
    <h3 class="font-semibold mt-3 text-sm">${product.title.length > 40 ? product.title.slice(0,40)+"..." : product.title}</h3>
    <div class="flex justify-between items-center mt-2">
      <span class="text-orange-500 font-bold">$${product.price}</span>
      <span class="flex items-center gap-1"><img src="assets/star.png" class="w-4 h-4 inline"/> ${product.rating.rate}</span>
    </div>
    <div class="flex gap-2 mt-4">
      <button class="details-btn flex-1 border border-orange-500 text-orange-500 py-1 rounded-lg hover:bg-orange-500 hover:text-white transition">Details</button>
      <button class="add-btn flex-1 bg-orange-500 text-white py-1 rounded-lg hover:bg-orange-600 transition">Add</button>
    </div>
  `;

  card.querySelector(".details-btn").addEventListener("click", () => showDetails(product));
  card.querySelector(".add-btn").addEventListener("click", () => addToCart(product));

  return card;
}


updateCartCount();
renderCart();
fetchCategories();
fetchProducts();
