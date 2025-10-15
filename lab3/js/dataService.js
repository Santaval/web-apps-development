/**
 * Data Service for SPA
 * Manages application data and provides data for different routes
 */
class DataService {
    constructor() {
        this.data = {};
        this.cache = new Map();
        this.subscribers = new Map();
        
        // Initialize data
        this.initializeData();
    }

    /**
     * Initialize sample data for the application
     */
    initializeData() {
        // Sample user data
        this.data.user = {
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            preferences: {
                theme: 'light',
                language: 'es'
            }
        };

        // Technologies data for About page
        this.data.technologies = [
            {
                name: 'HTML5',
                icon: 'fab fa-html5',
                description: 'Estructura semántica y moderna',
                version: '5'
            },
            {
                name: 'CSS3',
                icon: 'fab fa-css3-alt',
                description: 'Estilos avanzados y responsivos',
                version: '3'
            },
            {
                name: 'JavaScript',
                icon: 'fab fa-js-square',
                description: 'Interactividad y templating',
                version: 'ES6+'
            },
            {
                name: 'Font Awesome',
                icon: 'fas fa-icons',
                description: 'Iconografía profesional',
                version: '6.0'
            },
            {
                name: 'Responsive Design',
                icon: 'fas fa-mobile-alt',
                description: 'Adaptable a todos los dispositivos',
                version: null
            },
            {
                name: 'SPA Architecture',
                icon: 'fas fa-sitemap',
                description: 'Navegación fluida sin recargas',
                version: null
            }
        ];

        // Project statistics
        this.data.stats = {
            linesOfCode: 2847,
            components: 12,
            templates: 5,
            features: 25
        };

        // Team members
        this.data.teamMembers = [
            {
                name: 'Ana García',
                role: 'Frontend Developer',
                bio: 'Especialista en interfaces de usuario modernas y experiencia del usuario.',
                skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js']
            },
            {
                name: 'Carlos Rodríguez',
                role: 'Full Stack Developer',
                bio: 'Desarrollador con experiencia en frontend y backend, apasionado por las SPAs.',
                skills: ['JavaScript', 'Node.js', 'MongoDB', 'Express', 'Vue.js']
            }
        ];

        // Services data
        this.data.services = [
            {
                id: 'web-development',
                title: 'Desarrollo Web',
                description: 'Creamos sitios web modernos y funcionales adaptados a tus necesidades específicas.',
                icon: 'fas fa-code',
                category: 'web',
                features: [
                    'Diseño responsivo',
                    'Optimización SEO',
                    'Integración de APIs',
                    'Panel administrativo',
                    'Mantenimiento incluido'
                ],
                price: 250000,
                popular: true
            },
            {
                id: 'spa-development',
                title: 'Single Page Applications',
                description: 'Aplicaciones web dinámicas con navegación fluida y experiencia de usuario superior.',
                icon: 'fas fa-window-maximize',
                category: 'web',
                features: [
                    'Navegación sin recargas',
                    'Templating avanzado',
                    'Estado centralizado',
                    'Optimización de rendimiento',
                    'PWA compatible'
                ],
                price: 400000
            },
            {
                id: 'mobile-apps',
                title: 'Aplicaciones Móviles',
                description: 'Apps nativas e híbridas para iOS y Android con las últimas tecnologías.',
                icon: 'fas fa-mobile-alt',
                category: 'mobile',
                features: [
                    'Desarrollo nativo',
                    'Apps híbridas',
                    'Integración con servicios web',
                    'Publicación en stores',
                    'Soporte técnico'
                ],
                price: 600000,
                popular: true
            },
            {
                id: 'ui-ux-design',
                title: 'Diseño UI/UX',
                description: 'Diseño de interfaces intuitivas y experiencias de usuario excepcionales.',
                icon: 'fas fa-paint-brush',
                category: 'web',
                features: [
                    'Investigación de usuarios',
                    'Prototipado interactivo',
                    'Testing de usabilidad',
                    'Guías de estilo',
                    'Diseño responsive'
                ],
                price: 180000
            },
            {
                id: 'consulting',
                title: 'Consultoría Técnica',
                description: 'Asesoramiento especializado para optimizar tus proyectos tecnológicos.',
                icon: 'fas fa-lightbulb',
                category: 'consulting',
                features: [
                    'Auditoría de código',
                    'Optimización de rendimiento',
                    'Arquitectura de software',
                    'Mejores prácticas',
                    'Capacitación del equipo'
                ],
                price: null
            },
            {
                id: 'ecommerce',
                title: 'Tiendas Online',
                description: 'Plataformas de comercio electrónico completas y seguras.',
                icon: 'fas fa-shopping-cart',
                category: 'web',
                features: [
                    'Catálogo de productos',
                    'Carrito de compras',
                    'Procesamiento de pagos',
                    'Gestión de inventario',
                    'Analytics integrado'
                ],
                price: 500000
            }
        ];

        // Testimonials
        this.data.testimonials = [
            {
                content: 'El equipo entregó exactamente lo que necesitábamos. La SPA es rápida y fácil de usar.',
                author: {
                    name: 'María González',
                    position: 'Gerente de Marketing',
                    company: 'TechSoft CR'
                },
                rating: [1, 1, 1, 1, 1] // 5 stars
            },
            {
                content: 'Profesionalismo y calidad excepcional. Recomiendo sus servicios sin dudarlo.',
                author: {
                    name: 'Roberto Jiménez',
                    position: 'Director de IT',
                    company: 'Innovate Solutions'
                },
                rating: [1, 1, 1, 1, 1] // 5 stars
            },
            {
                content: 'La aplicación superó nuestras expectativas. El soporte post-entrega es excelente.',
                author: {
                    name: 'Laura Castillo',
                    position: 'CEO',
                    company: 'Digital Dreams'
                },
                rating: [1, 1, 1, 1, 1] // 5 stars
            }
        ];

        // Products data
        this.data.categories = [
            { id: 'templates', name: 'Templates', icon: 'fas fa-layer-group' },
            { id: 'themes', name: 'Temas', icon: 'fas fa-palette' },
            { id: 'plugins', name: 'Plugins', icon: 'fas fa-puzzle-piece' },
            { id: 'tools', name: 'Herramientas', icon: 'fas fa-tools' }
        ];

        this.data.products = [
            {
                id: 'spa-template-pro',
                name: 'SPA Template Pro',
                description: 'Template avanzado para Single Page Applications con todas las características modernas incluidas.',
                category: 'templates',
                icon: 'fas fa-file-code',
                price: 45000,
                originalPrice: 60000,
                discount: 25,
                rating: [1, 1, 1, 1, 1],
                emptyStars: [],
                reviews: 47,
                features: [
                    'Templating engine incluido',
                    'Router avanzado',
                    'Componentes reutilizables',
                    'Documentación completa'
                ],
                isNew: true,
                releaseDate: '2024-10-01'
            },
            {
                id: 'responsive-dashboard',
                name: 'Dashboard Responsivo',
                description: 'Panel administrativo completo con gráficos, tablas y componentes interactivos.',
                category: 'templates',
                icon: 'fas fa-tachometer-alt',
                price: 38000,
                rating: [1, 1, 1, 1, 0],
                emptyStars: [1],
                reviews: 32,
                features: [
                    'Gráficos interactivos',
                    'Tablas de datos',
                    'Autenticación incluida',
                    'Modo oscuro'
                ],
                releaseDate: '2024-09-15'
            },
            {
                id: 'minimalist-theme',
                name: 'Tema Minimalista',
                description: 'Tema elegante y limpio para sitios web modernos con enfoque en el contenido.',
                category: 'themes',
                icon: 'fas fa-paint-brush',
                price: 25000,
                rating: [1, 1, 1, 1, 1],
                emptyStars: [],
                reviews: 68,
                features: [
                    'Diseño minimalista',
                    'Tipografía cuidada',
                    'Colores personalizables',
                    'Animaciones suaves'
                ],
                releaseDate: '2024-08-20'
            },
            {
                id: 'animation-plugin',
                name: 'Plugin de Animaciones',
                description: 'Biblioteca de animaciones CSS3 y JavaScript para mejorar la experiencia de usuario.',
                category: 'plugins',
                icon: 'fas fa-magic',
                price: 18000,
                rating: [1, 1, 1, 1, 0],
                emptyStars: [1],
                reviews: 124,
                features: [
                    '50+ animaciones',
                    'API fácil de usar',
                    'Compatible con frameworks',
                    'Documentación detallada'
                ],
                releaseDate: '2024-09-01'
            },
            {
                id: 'form-validator',
                name: 'Validador de Formularios',
                description: 'Herramienta completa para validación de formularios con reglas personalizables.',
                category: 'tools',
                icon: 'fas fa-check-circle',
                price: 22000,
                rating: [1, 1, 1, 1, 1],
                emptyStars: [],
                reviews: 89,
                features: [
                    'Validación en tiempo real',
                    'Reglas personalizadas',
                    'Múltiples idiomas',
                    'Estilos personalizables'
                ],
                releaseDate: '2024-07-10'
            },
            {
                id: 'dark-theme-pack',
                name: 'Pack de Temas Oscuros',
                description: 'Colección de temas oscuros elegantes para diferentes tipos de sitios web.',
                category: 'themes',
                icon: 'fas fa-moon',
                price: 35000,
                originalPrice: 50000,
                discount: 30,
                rating: [1, 1, 1, 1, 1],
                emptyStars: [],
                reviews: 156,
                features: [
                    '5 temas incluidos',
                    'Modo oscuro automático',
                    'Personalización avanzada',
                    'Actualizaciones gratuitas'
                ],
                isNew: true,
                releaseDate: '2024-10-10'
            }
        ];

        // Add featured products to home page
        this.data.featuredProducts = this.data.products.slice(0, 3);

        // Contact information
        this.data.contactInfo = [
            {
                icon: 'fas fa-map-marker-alt',
                title: 'Ubicación',
                content: 'San José, Costa Rica',
                link: 'https://maps.google.com',
                linkText: 'Ver en Google Maps'
            },
            {
                icon: 'fas fa-phone',
                title: 'Teléfono',
                content: '+506 2234-5678',
                link: 'tel:+50622345678',
                linkText: 'Llamar ahora'
            },
            {
                icon: 'fas fa-envelope',
                title: 'Email',
                content: 'info@spalab3.com',
                link: 'mailto:info@spalab3.com',
                linkText: 'Enviar email'
            },
            {
                icon: 'fas fa-globe',
                title: 'Sitio Web',
                content: 'www.spalab3.com',
                link: 'https://www.spalab3.com',
                linkText: 'Visitar sitio'
            }
        ];

        // Business hours
        this.data.businessHours = [
            { day: 'Lunes - Viernes', hours: '8:00 AM - 6:00 PM' },
            { day: 'Sábados', hours: '9:00 AM - 2:00 PM' },
            { day: 'Domingos', hours: 'Cerrado' }
        ];

        // Social links
        this.data.socialLinks = [
            {
                name: 'Facebook',
                icon: 'fab fa-facebook',
                url: 'https://facebook.com/spalab3'
            },
            {
                name: 'Twitter',
                icon: 'fab fa-twitter',
                url: 'https://twitter.com/spalab3'
            },
            {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                url: 'https://linkedin.com/company/spalab3'
            },
            {
                name: 'GitHub',
                icon: 'fab fa-github',
                url: 'https://github.com/spalab3'
            },
            {
                name: 'Instagram',
                icon: 'fab fa-instagram',
                url: 'https://instagram.com/spalab3'
            }
        ];

        // Office locations
        this.data.officeLocations = [
            {
                name: 'Oficina Principal',
                address: 'Avenida Central, San José, Costa Rica',
                phone: '+506 2234-5678',
                email: 'sanjose@spalab3.com',
                mapUrl: 'https://maps.google.com'
            },
            {
                name: 'Oficina Cartago',
                address: 'Centro de Cartago, Costa Rica',
                phone: '+506 2551-9876',
                email: 'cartago@spalab3.com',
                mapUrl: 'https://maps.google.com'
            }
        ];

        // FAQ data
        this.data.faq = [
            {
                question: '¿Qué es una Single Page Application?',
                answer: 'Una SPA es una aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido sin recargar toda la página, proporcionando una experiencia más fluida al usuario.'
            },
            {
                question: '¿Cuáles son las ventajas del client-side templating?',
                answer: 'Permite generar HTML dinámicamente en el navegador, reduce la carga del servidor, mejora el rendimiento y proporciona una mejor experiencia de usuario con navegación más rápida.'
            },
            {
                question: '¿Es compatible con dispositivos móviles?',
                answer: 'Sí, nuestra SPA utiliza diseño responsivo que se adapta automáticamente a diferentes tamaños de pantalla, desde móviles hasta computadoras de escritorio.'
            },
            {
                question: '¿Qué navegadores son compatibles?',
                answer: 'Es compatible con todos los navegadores modernos incluyendo Chrome, Firefox, Safari, Edge y Opera. También funciona en versiones recientes de navegadores móviles.'
            },
            {
                question: '¿Incluye optimización SEO?',
                answer: 'Sí, implementamos técnicas de SEO específicas para SPAs, incluyendo meta tags dinámicos, structured data y server-side rendering cuando es necesario.'
            }
        ];
    }

    /**
     * Get data for a specific route
     */
    async getDataForRoute(routeName) {
        // Simulate API delay
        await this.delay(100);

        switch (routeName) {
            case 'home':
                return {
                    user: this.data.user,
                    currentDate: new Date(),
                    featuredProducts: this.data.featuredProducts
                };

            case 'about':
                return {
                    technologies: this.data.technologies,
                    stats: this.data.stats,
                    teamMembers: this.data.teamMembers
                };

            case 'services':
                return {
                    services: this.data.services,
                    testimonials: this.data.testimonials
                };

            case 'products':
                return {
                    products: this.data.products,
                    categories: this.data.categories
                };

            case 'contact':
                return {
                    contactInfo: this.data.contactInfo,
                    businessHours: this.data.businessHours,
                    socialLinks: this.data.socialLinks,
                    officeLocations: this.data.officeLocations,
                    faq: this.data.faq
                };

            default:
                return {};
        }
    }

    /**
     * Get specific data by key
     */
    getData(key) {
        return this.data[key];
    }

    /**
     * Set data
     */
    setData(key, value) {
        this.data[key] = value;
        this.notifySubscribers(key, value);
    }

    /**
     * Subscribe to data changes
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, []);
        }
        this.subscribers.get(key).push(callback);
    }

    /**
     * Unsubscribe from data changes
     */
    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            const callbacks = this.subscribers.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Notify subscribers of data changes
     */
    notifySubscribers(key, value) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => callback(value));
        }
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Search products
     */
    searchProducts(query, category = 'all') {
        let results = this.data.products;

        // Filter by category
        if (category !== 'all') {
            results = results.filter(product => product.category === category);
        }

        // Filter by search query
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.features.some(feature => feature.toLowerCase().includes(searchTerm))
            );
        }

        return results;
    }

    /**
     * Sort products
     */
    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating.length - a.rating.length);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            default:
                return sorted;
        }
    }

    /**
     * Get product by ID
     */
    getProduct(id) {
        return this.data.products.find(product => product.id === id);
    }

    /**
     * Get service by ID
     */
    getService(id) {
        return this.data.services.find(service => service.id === id);
    }
}

// Export for use in other modules
window.DataService = DataService;