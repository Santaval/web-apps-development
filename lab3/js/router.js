/**
 * Simple SPA Router for Client-Side Navigation
 * Handles hash-based routing and page transitions
 */
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.isNavigating = false;
        this.middlewares = [];
        
        // Bind event handlers
        this.handleHashChange = this.handleHashChange.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        
        // Set up event listeners
        window.addEventListener('hashchange', this.handleHashChange);
        window.addEventListener('popstate', this.handleHashChange);
        document.addEventListener('click', this.handleLinkClick);
        
        // Default configuration
        this.config = {
            defaultRoute: 'home',
            loadingTimeout: 5000,
            enableTransitions: true,
            transitionDuration: 300
        };
    }

    /**
     * Register a route with its configuration
     */
    addRoute(path, config) {
        if (typeof config === 'string') {
            // Simple template path
            config = { template: config };
        }
        
        const route = {
            path: path,
            template: config.template || null,
            templateUrl: config.templateUrl || `templates/${path}.html`,
            handler: config.handler || null,
            beforeEnter: config.beforeEnter || null,
            afterEnter: config.afterEnter || null,
            title: config.title || this.capitalizeFirst(path),
            data: config.data || {}
        };
        
        this.routes.set(path, route);
        return this;
    }

    /**
     * Add middleware function
     */
    use(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push(middleware);
        }
        return this;
    }

    /**
     * Start the router
     */
    start() {
        // Navigate to initial route
        const initialRoute = this.getRouteFromHash() || this.config.defaultRoute;
        this.navigate(initialRoute, { replace: true });
        return this;
    }

    /**
     * Navigate to a specific route
     */
    async navigate(path, options = {}) {
        if (this.isNavigating) {
            return false;
        }

        try {
            this.isNavigating = true;
            
            // Show loading indicator
            if (this.config.enableTransitions) {
                this.showLoading();
            }

            // Get route configuration
            const route = this.routes.get(path);
            if (!route) {
                throw new Error(`Route '${path}' not found`);
            }

            // Run middlewares
            for (const middleware of this.middlewares) {
                const result = await middleware(route, this.currentRoute);
                if (result === false) {
                    return false;
                }
            }

            // Execute beforeEnter hook
            if (route.beforeEnter) {
                const canEnter = await route.beforeEnter(route, this.currentRoute);
                if (canEnter === false) {
                    return false;
                }
            }

            // Load and render template
            await this.loadAndRenderTemplate(route);

            // Update browser history
            if (!options.replace) {
                window.location.hash = path;
            } else {
                history.replaceState(null, '', `#${path}`);
            }

            // Update current route
            const previousRoute = this.currentRoute;
            this.currentRoute = route;

            // Update page title
            document.title = route.title + ' - SPA Lab 3';

            // Update navigation state
            this.updateNavigation(path);

            // Execute afterEnter hook
            if (route.afterEnter) {
                await route.afterEnter(route, previousRoute);
            }

            // Trigger route change event
            this.triggerEvent('routeChanged', {
                current: route,
                previous: previousRoute
            });

            return true;

        } catch (error) {
            console.error('Navigation error:', error);
            this.showError(`Error loading page: ${error.message}`);
            return false;
            
        } finally {
            this.isNavigating = false;
            
            // Hide loading indicator
            if (this.config.enableTransitions) {
                this.hideLoading();
            }
        }
    }

    /**
     * Load and render template for route
     */
    async loadAndRenderTemplate(route) {
        const templateEngine = window.app?.templateEngine;
        if (!templateEngine) {
            throw new Error('Template engine not available');
        }

        let templateContent;

        // Use inline template or load from URL
        if (route.template) {
            templateContent = route.template;
        } else {
            await templateEngine.loadTemplate(route.path, route.templateUrl);
            templateContent = templateEngine.templates.get(route.path);
        }

        // Prepare template data
        const templateData = await this.prepareTemplateData(route);

        // Render template
        const renderedContent = templateEngine.render(route.path, templateData);

        // Update page content with transition
        await this.updatePageContent(renderedContent);

        // Execute route handler
        if (route.handler) {
            await route.handler(route, templateData);
        }
    }

    /**
     * Prepare data for template rendering
     */
    async prepareTemplateData(route) {
        const dataService = window.app?.dataService;
        let data = { ...route.data };

        // Load dynamic data if data service is available
        if (dataService) {
            try {
                const routeData = await dataService.getDataForRoute(route.path);
                data = { ...data, ...routeData };
            } catch (error) {
                console.warn(`Could not load data for route ${route.path}:`, error);
            }
        }

        // Add common data
        data.currentRoute = route.path;
        data.currentDate = new Date();

        return data;
    }

    /**
     * Update page content with optional transition
     */
    async updatePageContent(content) {
        const contentElement = document.getElementById('page-content');
        if (!contentElement) {
            throw new Error('Page content element not found');
        }

        if (this.config.enableTransitions) {
            // Fade out
            contentElement.style.opacity = '0';
            await this.delay(this.config.transitionDuration / 2);
            
            // Update content
            contentElement.innerHTML = content;
            
            // Fade in
            contentElement.style.opacity = '1';
            await this.delay(this.config.transitionDuration / 2);
        } else {
            contentElement.innerHTML = content;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Handle hash change events
     */
    handleHashChange() {
        const route = this.getRouteFromHash();
        if (route && route !== this.currentRoute?.path) {
            this.navigate(route);
        }
    }

    /**
     * Handle navigation link clicks
     */
    handleLinkClick(event) {
        const link = event.target.closest('[data-page]');
        if (!link) return;

        const page = link.getAttribute('data-page');
        if (page && this.routes.has(page)) {
            event.preventDefault();
            this.navigate(page);
        }
    }

    /**
     * Get route from current hash
     */
    getRouteFromHash() {
        const hash = window.location.hash.slice(1);
        return hash || null;
    }

    /**
     * Update navigation active states
     */
    updateNavigation(currentPath) {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update footer links
        document.querySelectorAll('footer [data-page]').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorModal && errorMessage) {
            errorMessage.textContent = message;
            errorModal.classList.remove('hidden');
        } else {
            // Fallback to alert
            alert(message);
        }
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
     * Utility: Capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Check if route exists
     */
    hasRoute(path) {
        return this.routes.has(path);
    }

    /**
     * Get all registered routes
     */
    getRoutes() {
        return Array.from(this.routes.keys());
    }

    /**
     * Remove a route
     */
    removeRoute(path) {
        return this.routes.delete(path);
    }

    /**
     * Update route configuration
     */
    updateRoute(path, config) {
        if (this.routes.has(path)) {
            const existingRoute = this.routes.get(path);
            this.routes.set(path, { ...existingRoute, ...config });
            return true;
        }
        return false;
    }

    /**
     * Navigate back in history
     */
    back() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigate(this.config.defaultRoute);
        }
    }

    /**
     * Navigate forward in history
     */
    forward() {
        window.history.forward();
    }

    /**
     * Replace current route
     */
    replace(path) {
        return this.navigate(path, { replace: true });
    }

    /**
     * Destroy router and clean up
     */
    destroy() {
        window.removeEventListener('hashchange', this.handleHashChange);
        window.removeEventListener('popstate', this.handleHashChange);
        document.removeEventListener('click', this.handleLinkClick);
        
        this.routes.clear();
        this.middlewares = [];
        this.currentRoute = null;
    }
}

// Export for use in other modules
window.Router = Router;