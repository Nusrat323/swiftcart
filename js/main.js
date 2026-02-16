async function fetchTrending() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    const trending = data.slice(0,3);
  
    const container = document.getElementById("trending");
  
    trending.forEach(product => {
      container.innerHTML += `
        <div class="bg-white p-6 rounded-xl shadow">
          <img src="${product.image}" class="h-40 mx-auto object-contain"/>
          <h3 class="font-bold mt-2">${product.title.slice(0,40)}</h3>
          <p class="text-indigo-600 font-bold">$${product.price}</p>
        </div>
      `;
    });
  }
  
  fetchTrending();
  