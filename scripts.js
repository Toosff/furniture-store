document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    const clock = document.getElementById('clock');
    if (clock) {
        setInterval(() => {
            const now = new Date();
            clock.innerText = now.toLocaleTimeString();
        }, 1000);
    }

    // Обработка изменения количества
    document.querySelectorAll('.quantity-controls').forEach(controls => {
        const input = controls.querySelector('.quantity-input');
        const minusBtn = controls.querySelector('.minus');
        const plusBtn = controls.querySelector('.plus');

        function updateButtons() {
            const value = parseInt(input.value);
            minusBtn.classList.toggle('disabled', value <= 1);
            plusBtn.classList.toggle('disabled', value >= 10);
        }

        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateButtons();
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
                updateButtons();
            }
        });

        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            input.value = value;
            updateButtons();
        });

        // Инициализация состояния кнопок
        updateButtons();
    });

    // Shopping cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Обновляем счетчик в шапке сайта
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push({
                ...product,
                id: Date.now()
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Показать уведомление
        showNotification(`${product.name} (${product.quantity} шт.) добавлен в корзину!`);
    }

    // Add to cart button handlers
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const quantity = parseInt(card.querySelector('.quantity-input').value);
            const product = {
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                quantity: quantity
            };
            addToCart(product);
        });
    });

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize cart count
    updateCartCount();

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').split('#')[1];
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = 100; // Отступ от верха страницы
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});