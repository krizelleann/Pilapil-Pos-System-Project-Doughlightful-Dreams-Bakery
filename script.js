const menuItems = [
  { name: "🍫Chocolate Lava Cake", price: 120, img: "images/pic 2.jpg" },
  { name: "🍋Lemon Burst Danish", price: 130, img: "images/pic 4.jpg" },
  { name: "🥜Pistachio Dream Bar", price: 155, img: "images/pic 7.jpg" },
  { name: "🍯Honey Lavender Scone", price: 125, img: "images/pic 3.jpg" },
  { name: "🫐Blackberry Jewel Tart", price: 150, img: "images/pic 8.jpg" },
  { name: "Classic Éclair", price: 175, img: "images/pic 10.jpg" },
  { name: "🍎Cinnamon Apple Turnover", price: 125, img: "images/pic 5.jpg" },
  { name: "🌿Matcha Red Bean Roll", price: 145, img: "images/pic 6.jpg" },
  { name: "🥐Almond Croissant Supreme", price: 140, img: "images/pic 9.jpg" }
];

let order = [];

const menuGrid = document.getElementById("menuGrid");
const orderList = document.getElementById("orderList");
const totalAmount = document.getElementById("totalAmount");
const cashInput = document.getElementById("cashInput");
const changeText = document.getElementById("changeText");
const searchInput = document.getElementById("searchInput");
const printBtn = document.getElementById("printBtn");

function safeKey(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function renderMenu(items) {
  menuGrid.innerHTML = items.map((item) => {
    const key = safeKey(item.name);
    return `
      <div class="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
        <div>
          <img src="${item.img}" alt="${item.name}" class="w-full h-44 object-cover">
          <div class="p-4 pb-0">
            <h4 class="menu-item-title text-lg font-bold text-gray-800 leading-tight">${item.name}</h4>
            <p class="text-pink-500 font-bold mt-1 text-sm">₱ ${item.price}</p>
          </div>
        </div>
        <div class="p-4 pt-2">
          <input id="qty-${key}" type="number" min="1" value="1"
            class="w-full border rounded-lg px-3 py-1.5 text-sm">
          <button onclick="addToOrder('${item.name}')"
            class="w-full mt-2 bg-pink-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            Add to order
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function addToOrder(name) {
  const item = menuItems.find(x => x.name === name);
  const key = safeKey(name);
  const qtyEl = document.getElementById(`qty-${key}`);
  const qty = parseInt(qtyEl.value) || 1;

  const existing = order.find(x => x.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    order.push({ name, price: item.price, qty });
  }

  if (changeText) changeText.textContent = "";
  renderOrder();
}

function renderOrder() {
  orderList.innerHTML = order.length ? order.map((item, i) => `
    <div class="border rounded-xl p-3 flex items-center justify-between gap-3 bg-white shadow-sm">
      <div>
        <h4 class="font-semibold text-gray-800 text-sm">${item.name}</h4>
        <p class="text-xs text-gray-500 mt-0.5">₱ ${item.price} x ${item.qty}</p>
      </div>
      <div class="flex items-center gap-1.5">
        <button onclick="changeQty(${i}, -1)" class="w-7 h-7 rounded bg-gray-100 font-bold hover:bg-gray-200 text-xs">-</button>
        <button onclick="changeQty(${i}, 1)" class="w-7 h-7 rounded bg-gray-100 font-bold hover:bg-gray-200 text-xs">+</button>
        <button onclick="removeItem(${i})" class="w-7 h-7 rounded bg-red-500 text-white hover:bg-red-600 text-xs">×</button>
      </div>
    </div>
  `) : `<p class="text-gray-400 text-center mt-10 text-sm">No ordered items yet.</p>`;

  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalAmount.textContent = `₱ ${total}`;
}

function changeQty(index, delta) {
  order[index].qty += delta;
  if (order[index].qty <= 0) order.splice(index, 1);
  if (changeText) changeText.textContent = "";
  renderOrder();
}

function removeItem(index) {
  order.splice(index, 1);
  if (changeText) changeText.textContent = "";
  renderOrder();
}

document.getElementById("payBtn").addEventListener("click", () => {
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cash = parseFloat(cashInput.value) || 0;

  if (order.length === 0) {
    changeText.className = "text-sm font-bold text-center text-red-600 mt-2";
    changeText.textContent = "Your cart is empty.";
    return;
  }

  if (cash < total) {
    changeText.className = "text-sm font-bold text-center text-red-600 mt-2";
    changeText.textContent = "Insufficient cash.";
    return;
  }

  const change = cash - total;
  
  changeText.className = "text-sm font-bold text-center text-green-600 mt-2";
  changeText.textContent = `Change: ₱ ${change}`;
  
  alert(`Thanks for ordering! Here's your ${change} pesos change`);

  order = [];
  cashInput.value = "";
  changeText.textContent = ""; 
  renderOrder();
});

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    renderMenu(filteredItems);
  });
}

if (printBtn) {
  printBtn.addEventListener("click", () => {
    if (order.length === 0) {
      alert("Cannot print an empty receipt! Please add items to your cart first.");
      return;
    }
    window.print();
  });
}

renderMenu(menuItems);
renderOrder();