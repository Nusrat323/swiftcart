
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartClose = document.getElementById("cart-close");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");


function openCart() {
  cartSidebar.classList.remove("translate-x-full");
}
function closeCart() {
  cartSidebar.classList.add("translate-x-full");
}

cartBtn?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);



function updateCartCount() {
    if (!cartCount) return;
  
  
    const validItems = cart.filter(p => p && p.title && p.price);
    cartCount.innerText = validItems.length;
  }
  


function renderCart() {
    if (!cartItemsContainer) return;
  
    cartItemsContainer.innerHTML = "";
    let total = 0;
  
    
    const validCart = cart.filter(p => p && p.title && p.price);
  
    if (validCart.length === 0){
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
        if(removeIndex > -1) cart.splice(removeIndex, 1);
  
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart();
      });
  
      cartItemsContainer.appendChild(item);
    });
  
    if(cartTotal) cartTotal.innerText = "$" + total.toFixed(2);
  }

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}


updateCartCount();
renderCart();


window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;

