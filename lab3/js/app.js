/**
 * Main Application Class
 * Initializes and coordinates all application components
 */
class SPAApp {
    constructor() {
        this.templateEngine = null;
        this.router = null;
        this.dataService = null;
        this.isInitialized = false;
        
        // Shopping cart state
        this.cart = JSON.parse(localStorage.getItem('spa-cart') || '[]');
        
        // Initialize methods
        this.handleError = (error) => this.handleErrorImpl(error);
        this.handleFormSubmit = (event) => this.handleFormSubmitImpl(event);
        this.handleCartUpdate = () => this.updateCartDisplay();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing SPA Application...');

            // Initialize core services
            await this.initializeServices();
            
            // Setup routing
            this.setupRoutes();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI components
            this.initializeUIComponents();
            
            // Start the router
            this.router.start();
            
            this.isInitialized = true;
            console.log('SPA Application initialized successfully!');
            
            // Trigger app ready event
            this.triggerEvent('appReady');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.handleError('Error al inicializar la aplicación. Recarga la página.');
        }
    }

    /**
     * Initialize core services
     */
    async initializeServices() {
        // Initialize template engine
        this.templateEngine = new TemplateEngine();
        
        // Register custom helpers
        this.registerTemplateHelpers();
        
        // Initialize data service
        this.dataService = new DataService();
        
        // Initialize router
        this.router = new Router();
        
        // Make services globally available
        window.app = this;
    }

    /**
     * Register custom template helpers
     */
    registerTemplateHelpers() {
        // Helper for displaying price ranges
        this.templateEngine.registerHelper('priceRange', (min, max) => {
            const formatter = new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: 'CRC'
            });
            return `${formatter.format(min)} - ${formatter.format(max)}`;
        });

        // Helper for generating star ratings
        this.templateEngine.registerHelper('stars', (rating) => {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        });

        // Helper for formatting relative time
        this.templateEngine.registerHelper('timeAgo', (date) => {
            const now = new Date();
            const diff = now - new Date(date);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) return 'Hoy';
            if (days === 1) return 'Ayer';
            if (days < 7) return `Hace ${days} días`;
            if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
            return `Hace ${Math.floor(days / 30)} meses`;
        });
    }

    /**
     * Setup application routes
     */
    setupRoutes() {
        this.router
            .addRoute('home', {
                title: 'Inicio',
                afterEnter: () => this.initializeHomePage()
            })
            .addRoute('about', {
                title: 'Acerca de'
            })
            .addRoute('services', {
                title: 'Servicios',
                afterEnter: () => this.initializeServicesPage()
            })
            .addRoute('products', {
                title: 'Productos',
                afterEnter: () => this.initializeProductsPage()
            })
            .addRoute('contact', {
                title: 'Contacto',
                afterEnter: () => this.initializeContactPage()
            });

        // Add middleware for analytics (example)
        this.router.use(async (route) => {
            console.log(`Navigating to: ${route.path}`);
            // Here you could send analytics data
            return true;
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu);
        }

        // Handle modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-modal, #closeModal, #closeErrorBtn')) {
                this.closeModal();
            }
        });

        // Handle error events
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handleError);

        // Handle cart events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-product');
                this.addToCart(productId);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', this.handleFormSubmit);

        // Handle route changes
        window.addEventListener('routeChanged', (e) => {
            this.onRouteChanged(e.detail);
        });
    }

    /**
     * Initialize UI components
     */
    initializeUIComponents() {
        // Update cart display
        this.updateCartDisplay();
        
        // Set current year in footer
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('.current-year').forEach(el => {
            el.textContent = currentYear;
        });
    }

    /**
     * Initialize home page specific functionality
     */
    initializeHomePage() {
        // Add any home page specific logic here
        console.log('Home page initialized');
    }

    /**
     * Initialize services page specific functionality
     */
    initializeServicesPage() {
        // Service filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterServices(filter);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Service details modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.service-details-btn')) {
                const serviceId = e.target.getAttribute('data-service');
                this.showServiceDetails(serviceId);
            }
        });
    }

    /**
     * Initialize products page specific functionality
     */
    initializeProductsPage() {
        // Product search
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Product sorting
        const sortSelect = document.getElementById('sortProducts');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Category filtering
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterProducts(category);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.classList.add('btn-secondary');
                });
                e.target.classList.add('active');
                e.target.classList.remove('btn-secondary');
            });
        });

        // Product details modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.view-details-btn')) {
                const productId = e.target.getAttribute('data-product');
                this.showProductDetails(productId);
            }
        });
    }

    /**
     * Initialize contact page specific functionality
     */
    initializeContactPage() {
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', (e) => {
                const faqIndex = e.currentTarget.getAttribute('data-faq');
                this.toggleFAQ(faqIndex);
            });
        });

        // Form validation will be handled in handleFormSubmit
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const navList = document.querySelector('.nav-list');
        if (navList) {
            navList.classList.toggle('active');
        }
    }

    /**
     * Filter services by category
     */
    filterServices(category) {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    /**
     * Search products
     */
    searchProducts(query) {
        const productCards = document.querySelectorAll('.product-card');
        const searchTerm = query.toLowerCase();
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    /**
     * Sort products
     */
    sortProducts(sortBy) {
        const grid = document.getElementById('productsGrid');
        const cards = Array.from(grid.querySelectorAll('.product-card'));
        
        cards.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.querySelector('.product-title').textContent.localeCompare(
                        b.querySelector('.product-title').textContent
                    );
                case 'price-low':
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                case 'price-high':
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                case 'rating':
                    return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                default:
                    return 0;
            }
        });
        
        cards.forEach(card => grid.appendChild(card));
    }

    /**
     * Filter products by category
     */
    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    /**
     * Add product to cart
     */
    addToCart(productId) {
        const product = this.dataService.getProduct(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showToast(`${product.name} agregado al carrito`);
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem('spa-cart', JSON.stringify(this.cart));
    }

    /**
     * Update cart display
     */
    updateCartDisplay() {
        const cartSummary = document.getElementById('cartSummary');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartSummary || !cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartSummary.style.display = 'none';
            return;
        }

        cartSummary.style.display = 'block';
        
        // Update items
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <span>${item.name} (${item.quantity})</span>
                <span>${this.formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');

        // Update total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = this.formatCurrency(total);
    }

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC'
        }).format(amount);
    }

    /**
     * Show service details modal
     */
    showServiceDetails(serviceId) {
        const service = this.dataService.getService(serviceId);
        if (!service) return;

        const modal = document.getElementById('serviceModal');
        const title = document.getElementById('serviceModalTitle');
        const body = document.getElementById('serviceModalBody');

        if (modal && title && body) {
            title.textContent = service.title;
            body.innerHTML = `
                <div class="service-details">
                    <p><strong>Descripción:</strong> ${service.description}</p>
                    <h4>Características incluidas:</h4>
                    <ul>
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <p><strong>Precio:</strong> ${service.price ? this.formatCurrency(service.price) : 'Consultar'}</p>
                </div>
            `;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Show product details modal
     */
    showProductDetails(productId) {
        const product = this.dataService.getProduct(productId);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const body = document.getElementById('productModalBody');

        if (modal && title && body) {
            title.textContent = product.name;
            body.innerHTML = `
                <div class="product-details">
                    <p>${product.description}</p>
                    <h4>Características:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <p><strong>Precio:</strong> ${this.formatCurrency(product.price)}</p>
                    <p><strong>Calificación:</strong> ${product.rating.length}/5 estrellas (${product.reviews} reseñas)</p>
                </div>
            `;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Toggle FAQ item
     */
    toggleFAQ(index) {
        const question = document.querySelector(`[data-faq="${index}"]`);
        const answer = document.getElementById(`faq-${index}`);
        
        if (question && answer) {
            question.classList.toggle('active');
            answer.classList.toggle('show');
        }
    }

    /**
     * Handle form submissions
     */
    handleFormSubmitImpl(e) {
        if (e.target.id === 'contactForm') {
            e.preventDefault();
            this.handleContactForm(e.target);
        }
    }

    /**
     * Handle contact form submission
     */
    async handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateContactForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('#submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.delay(2000);
            
            // Show success message
            form.style.display = 'none';
            document.getElementById('formSuccess').classList.remove('hidden');
            
            this.showToast('Mensaje enviado exitosamente');
            
        } catch (error) {
            this.showToast('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
            
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Validate contact form
     */
    validateContactForm(data) {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
        });

        // Validate required fields
        if (!data.fullName.trim()) {
            this.showFieldError('fullNameError', 'El nombre es requerido');
            isValid = false;
        }

        if (!data.email.trim()) {
            this.showFieldError('emailError', 'El email es requerido');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showFieldError('emailError', 'El email no es válido');
            isValid = false;
        }

        if (!data.subject) {
            this.showFieldError('subjectError', 'Selecciona un asunto');
            isValid = false;
        }

        if (!data.message.trim()) {
            this.showFieldError('messageError', 'El mensaje es requerido');
            isValid = false;
        }

        if (!data.privacy) {
            this.showFieldError('privacyError', 'Debes aceptar la política de privacidad');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Close modal
     */
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show with animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Handle application errors
     */
    handleErrorImpl(error) {
        console.error('Application error:', error);
        
        let message = 'Ha ocurrido un error inesperado.';
        if (typeof error === 'string') {
            message = error;
        } else if (error && error.message) {
            message = error.message;
        }

        // Show error modal
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorModal && errorMessage) {
            errorMessage.textContent = message;
            errorModal.classList.remove('hidden');
        }
    }

    /**
     * Handle route changes
     */
    onRouteChanged(detail) {
        // Close mobile menu if open
        const navList = document.querySelector('.nav-list');
        if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
        }

        // Close any open modals
        this.closeModal();
    }

    /**
     * Trigger custom event
     */
    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { 
            detail,
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(event);
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get application state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            currentRoute: this.router?.getCurrentRoute()?.path,
            cartItems: this.cart.length
        };
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new SPAApp();
    await app.init();
});

// Add toast styles
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #38a169;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
}

.toast.show {
    transform: translateX(0);
}

.toast.toast-error {
    background: #e53e3e;
}

.toast i {
    font-size: 1.2rem;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);