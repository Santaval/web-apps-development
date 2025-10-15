/**
 * Simple Client-Side Template Engine
 * Supports data binding, loops, conditionals, and nested templates
 */
class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.cache = new Map();
        this.helpers = new Map();
        this.partials = new Map();
        
        // Register default helpers
        this.registerHelper('formatDate', this.formatDate);
        this.registerHelper('capitalize', this.capitalize);
        this.registerHelper('truncate', this.truncate);
        this.registerHelper('currency', this.currency);
    }

    /**
     * Load template from URL or cache
     */
    async loadTemplate(name, url) {
        if (this.templates.has(name)) {
            return this.templates.get(name);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            
            const templateContent = await response.text();
            this.templates.set(name, templateContent);
            return templateContent;
        } catch (error) {
            console.error(`Error loading template ${name}:`, error);
            throw error;
        }
    }

    /**
     * Register a template directly
     */
    registerTemplate(name, content) {
        this.templates.set(name, content);
    }

    /**
     * Register a helper function
     */
    registerHelper(name, func) {
        this.helpers.set(name, func);
    }

    /**
     * Register a partial template
     */
    registerPartial(name, content) {
        this.partials.set(name, content);
    }

    /**
     * Render template with data
     */
    render(templateName, data = {}) {
        const template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }

        return this.processTemplate(template, data);
    }

    /**
     * Process template string with data
     */
    processTemplate(template, data) {
        let result = template;

        // Process partials first
        result = this.processPartials(result, data);
        
        // Process loops
        result = this.processLoops(result, data);
        
        // Process conditionals
        result = this.processConditionals(result, data);
        
        // Process variable interpolation
        result = this.processVariables(result, data);
        
        // Process helpers
        result = this.processHelpers(result, data);

        return result;
    }

    /**
     * Process partial templates {{>partialName}}
     */
    processPartials(template, data) {
        return template.replace(/\{\{>\s*(\w+)\s*\}\}/g, (match, partialName) => {
            const partial = this.partials.get(partialName);
            if (partial) {
                return this.processTemplate(partial, data);
            }
            return match;
        });
    }

    /**
     * Process loops {{#each array}}...{{/each}}
     */
    processLoops(template, data) {
        return template.replace(/\{\{#each\s+(\w+)\s*\}\}([\s\S]*?)\{\{\/each\}\}/g, 
            (match, arrayName, content) => {
                const array = this.getNestedValue(data, arrayName);
                if (!Array.isArray(array)) {
                    return '';
                }

                return array.map((item, index) => {
                    const itemData = {
                        ...data,
                        this: item,
                        '@index': index,
                        '@first': index === 0,
                        '@last': index === array.length - 1,
                        '@length': array.length
                    };
                    return this.processTemplate(content, itemData);
                }).join('');
            }
        );
    }

    /**
     * Process conditionals {{#if condition}}...{{/if}} and {{#unless condition}}...{{/unless}}
     */
    processConditionals(template, data) {
        // Process if statements
        template = template.replace(/\{\{#if\s+(.+?)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g,
            (match, condition, content) => {
                if (this.evaluateCondition(condition, data)) {
                    return this.processTemplate(content, data);
                }
                return '';
            }
        );

        // Process unless statements
        template = template.replace(/\{\{#unless\s+(.+?)\s*\}\}([\s\S]*?)\{\{\/unless\}\}/g,
            (match, condition, content) => {
                if (!this.evaluateCondition(condition, data)) {
                    return this.processTemplate(content, data);
                }
                return '';
            }
        );

        // Process if-else statements
        template = template.replace(/\{\{#if\s+(.+?)\s*\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
            (match, condition, ifContent, elseContent) => {
                if (this.evaluateCondition(condition, data)) {
                    return this.processTemplate(ifContent, data);
                } else {
                    return this.processTemplate(elseContent, data);
                }
            }
        );

        return template;
    }

    /**
     * Process variable interpolation {{variable}} and {{{rawVariable}}}
     */
    processVariables(template, data) {
        // Process raw variables (unescaped) {{{variable}}}
        template = template.replace(/\{\{\{(.+?)\}\}\}/g, (match, variable) => {
            const value = this.getNestedValue(data, variable.trim());
            return value != null ? String(value) : '';
        });

        // Process escaped variables {{variable}}
        template = template.replace(/\{\{([^#/>].+?)\}\}/g, (match, variable) => {
            const value = this.getNestedValue(data, variable.trim());
            return value != null ? this.escapeHtml(String(value)) : '';
        });

        return template;
    }

    /**
     * Process helper functions {{helper argument}}
     */
    processHelpers(template, data) {
        return template.replace(/\{\{(\w+)\s+(.+?)\}\}/g, (match, helperName, args) => {
            const helper = this.helpers.get(helperName);
            if (helper) {
                const argValues = this.parseArguments(args, data);
                try {
                    return helper(...argValues);
                } catch (error) {
                    console.error(`Error in helper ${helperName}:`, error);
                    return match;
                }
            }
            return match;
        });
    }

    /**
     * Parse helper arguments
     */
    parseArguments(argsString, data) {
        const args = argsString.split(/\s+/);
        return args.map(arg => {
            // If argument is in quotes, return as string
            if ((arg.startsWith('"') && arg.endsWith('"')) || 
                (arg.startsWith("'") && arg.endsWith("'"))) {
                return arg.slice(1, -1);
            }
            
            // If argument is a number
            if (!isNaN(arg)) {
                return parseFloat(arg);
            }
            
            // Otherwise, treat as variable
            return this.getNestedValue(data, arg);
        });
    }

    /**
     * Get nested value from object using dot notation
     */
    getNestedValue(obj, path) {
        if (!path || typeof path !== 'string') return undefined;
        
        const keys = path.split('.');
        let value = obj;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    /**
     * Evaluate conditional expression
     */
    evaluateCondition(condition, data) {
        // Simple condition evaluation
        // Supports: variable, !variable, variable operator value
        condition = condition.trim();
        
        if (condition.startsWith('!')) {
            const variable = condition.substring(1).trim();
            const value = this.getNestedValue(data, variable);
            return !this.isTruthy(value);
        }
        
        // Check for operators
        const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];
        for (const op of operators) {
            if (condition.includes(op)) {
                const [left, right] = condition.split(op).map(s => s.trim());
                const leftValue = this.getNestedValue(data, left);
                const rightValue = this.parseValue(right, data);
                
                switch (op) {
                    case '===': return leftValue === rightValue;
                    case '!==': return leftValue !== rightValue;
                    case '==': return leftValue == rightValue;
                    case '!=': return leftValue != rightValue;
                    case '>=': return leftValue >= rightValue;
                    case '<=': return leftValue <= rightValue;
                    case '>': return leftValue > rightValue;
                    case '<': return leftValue < rightValue;
                }
            }
        }
        
        // Simple truthiness check
        const value = this.getNestedValue(data, condition);
        return this.isTruthy(value);
    }

    /**
     * Parse value (string, number, or variable)
     */
    parseValue(value, data) {
        value = value.trim();
        
        // String literal
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }
        
        // Number literal
        if (!isNaN(value)) {
            return parseFloat(value);
        }
        
        // Boolean literal
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        if (value === 'undefined') return undefined;
        
        // Variable
        return this.getNestedValue(data, value);
    }

    /**
     * Check if value is truthy
     */
    isTruthy(value) {
        if (value === false || value === null || value === undefined || value === '') {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        if (typeof value === 'object') {
            return Object.keys(value).length > 0;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        return true;
    }

    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Default helper functions
    formatDate(date, format = 'short') {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d)) return date;
        
        switch (format) {
            case 'short':
                return d.toLocaleDateString();
            case 'long':
                return d.toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            case 'time':
                return d.toLocaleTimeString();
            case 'datetime':
                return d.toLocaleString();
            default:
                return d.toLocaleDateString();
        }
    }

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    truncate(str, length = 100, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + suffix;
    }

    currency(amount, currency = 'CRC') {
        if (isNaN(amount)) return amount;
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
}

// Export for use in other modules
window.TemplateEngine = TemplateEngine;