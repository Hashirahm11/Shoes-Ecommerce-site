// Mobile menu toggle
const toggleBtn = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (toggleBtn && navMenu) {
  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

function getCart() {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Unable to save cart', error);
  }
}

// --------- CART LOGIC ---------

// Add to Cart (for shop.html and file.html)
document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const card = btn.closest('.product-card');
    if (!card) return;

    const title = card.querySelector('.product-title')?.textContent?.trim();
    const priceText = card.querySelector('.product-price')?.textContent?.replace('$', '').trim() || '0';
    const price = parseFloat(priceText);
    const img = card.querySelector('.product-image')?.getAttribute('src');

    if (!title || !img) return;

    let cart = getCart();
    // If already in cart, increment quantity
    const existing = cart.find(item => item.title === title);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ title, price, img, quantity: 1 });
    }

    saveCart(cart);
    alert('Added to cart!');
  });
});

// Render Cart (for cart.html)
if (window.location.pathname.includes('cart.html')) {
  function renderCart() {
    const cart = getCart();
    const cartContent = document.querySelector('.cart-content');
    const grandTotal = document.getElementById('grand-total');
    let total = 0;

    if (!cartContent || !grandTotal) return;

    if (cart.length === 0) {
      cartContent.innerHTML = "<p style='text-align:center;'>Cart is empty</p>";
      grandTotal.textContent = '0';
      return;
    }

    cartContent.innerHTML = '';
    cart.forEach((item, idx) => {
      total += item.price * item.quantity;
      cartContent.innerHTML += `
        <div class="cart-product">
          <div class="img-section">
            <img src="${item.img}" alt="">
          </div>
          <div class="cart-content">
            <h3 class="cart-title">${item.title}</h3>
            <section style="display: flex;justify-content: space-between; padding: 20px;">
              <div class="cart-price">$${item.price}</div>
              <div class="del" style="color: #2e8b57;cursor: pointer;">
                <i class="fa-solid fa-trash cart-remove" data-idx="${idx}"></i>
              </div>
            </section>
            <div class="quantity">
              <button class="increment" data-idx="${idx}">+</button>
              <span class="num">${item.quantity}</span>
              <button class="decrement" data-idx="${idx}">-</button>
            </div>
          </div>
        </div>
      `;
    });

    grandTotal.textContent = total.toFixed(2);

    // Remove
    document.querySelectorAll('.cart-remove').forEach(btn => {
      btn.onclick = function () {
        const idx = +btn.dataset.idx;
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      };
    });

    // Increment
    document.querySelectorAll('.increment').forEach(btn => {
      btn.onclick = function () {
        const idx = +btn.dataset.idx;
        cart[idx].quantity++;
        saveCart(cart);
        renderCart();
      };
    });

    // Decrement
    document.querySelectorAll('.decrement').forEach(btn => {
      btn.onclick = function () {
        const idx = +btn.dataset.idx;
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
      };
    });
  }

  const buyNowBtn = document.querySelector('.buy-now');

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      saveCart([]);
      alert('Thanks for shopping!');
      renderCart();
    });
  }

  renderCart();
}


