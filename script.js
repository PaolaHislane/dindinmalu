document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartCount = document.querySelector('.cart-count');
    const checkoutButton = document.querySelector('.checkout-button');

    let cart = [];

    // Mostrar/ocultar carrinho
    cartButton.addEventListener('click', function() {
        cartDropdown.classList.toggle('active');
    });

    // Adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            cartDropdown.classList.add('active');
        });
    });

    // Atualizar carrinho
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-name">${item.name} (${item.quantity})</div>
                <div class="cart-item-price">R$ ${itemTotal.toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
        cartCount.textContent = count;
    }

    // Finalizar pedido via WhatsApp
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let message = 'Olá, gostaria de fazer um pedido:\n\n';
        
        cart.forEach(item => {
            message += `${item.name} - Quantidade: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal: R$ ${total.toFixed(2)}`;
        
        const whatsappUrl = `https://wa.me/5561991965570?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Limpar carrinho
        cart = [];
        updateCart();
        cartDropdown.classList.remove('active');
    });
    // Configuração do botão do WhatsApp
function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-link');
    
    whatsappBtn.addEventListener('click', function(e) {
        // Se houver itens no carrinho, sugere enviar o pedido
        if (cart.length > 0) {
            e.preventDefault();
            const confirmSend = confirm('Você tem itens no carrinho. Deseja enviar o pedido agora?');
            
            if (confirmSend) {
                checkoutButton.click(); // Dispara o processo de checkout
            } else {
                window.open(this.href, '_blank'); // Abre o WhatsApp normal
            }
        }
        // Se não houver itens, abre o WhatsApp normalmente
    });
}

// Chame esta função no DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupWhatsAppButton();
    // ... o resto do seu código existente
});
});