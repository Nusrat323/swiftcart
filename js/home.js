const productContainer = document.getElementById("products");

async function fetchTrending() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  const trending = data.slice(0, 4); 
  productContainer.innerHTML = "";
  trending.forEach(product => {
    productContainer.appendChild(createCard(product));
  });
}


function createCard(product) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl hover:-translate-y-2 transition duration-300";

  card.innerHTML = `
    <img src="${product.image}" class="h-40 mx-auto object-contain mb-4">
    <span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
      ${product.category}
    </span>
    <h3 class="font-semibold mt-3 text-sm">
      ${product.title.length > 40 ? product.title.slice(0,40)+"..." : product.title}
    </h3>
    <div class="flex justify-between items-center mt-2">
      <span class="text-orange-500 font-bold">$${product.price}</span>
      <span class="flex items-center gap-1">
        <img src="assets/star.png" class="w-4 h-4 inline"/> ${product.rating.rate}
      </span>
    </div>
    <div class="flex gap-2 mt-4">
      <button class="details-btn flex-1 border border-orange-500 text-orange-500 py-1 rounded-lg hover:bg-orange-500 hover:text-white transition">
        Details
      </button>
      <button class="add-btn flex-1 bg-orange-500 text-white py-1 rounded-lg hover:bg-orange-600 transition">
        Add
      </button>
    </div>
  `;

 
  card.querySelector(".details-btn").addEventListener("click", () => showDetails(product));
  card.querySelector(".add-btn").addEventListener("click", () => {
    window.addToCart(product, card); 
  });

  return card;
}


function showDetails(product) {
  document.getElementById("modal-img").src = product.image;
  document.getElementById("modal-title").innerText = product.title;
  document.getElementById("modal-desc").innerText = product.description;
  document.getElementById("modal-price").innerText = "$" + product.price;

  const ratingContainer = document.getElementById("modal-rating");
  ratingContainer.innerHTML = `<img src="assets/star.png" class="inline w-5 h-5 mr-1"/> ${product.rating.rate}`;

  document.getElementById("modal-cart-btn").onclick = () => window.addToCart(product);

  document.getElementById("modal").classList.remove("hidden");
}


const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-menu");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => mobileMenu.classList.remove("-translate-x-full"));
closeBtn.addEventListener("click", () => mobileMenu.classList.add("-translate-x-full"));


const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", () => modal.classList.add("hidden"));


fetchTrending();



