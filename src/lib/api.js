/**
 * API Service for Backend Communication
 * Handles all HTTP requests to the backend with authentication
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// CSRF double-submit-cookie name set by the backend (middleware/csrf.js).
// Must match CSRF_COOKIE_NAME there (default: 'freedomains.csrf').
const CSRF_COOKIE_NAME = 'freedomains.csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Read a cookie value by name. The CSRF cookie is intentionally non-httpOnly
 * so the frontend can read it here and echo it back as a header the backend
 * verifies against the cookie (double-submit pattern). An attacker's
 * cross-site page cannot read this cookie itself (same-origin policy), so it
 * cannot forge a matching header even though the cookie is sent automatically
 * by the browser on cross-site requests.
 */
function getCookie(name) {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = {
        'Content-Type': 'application/json',
        // Custom header forces a CORS preflight on every request, which the
        // backend's origin allow-list then enforces; also required so simple
        // cross-site requests can't reach this API (2026-10-30 audit fix).
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
    };

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const csrfToken = getCookie(CSRF_COOKIE_NAME);
        if (csrfToken) {
            headers[CSRF_HEADER_NAME] = csrfToken;
        }
    }

    const config = {
        ...options,
        method,
        credentials: 'include', // Send cookies for session authentication
        headers,
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        // Handle authentication errors
        if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/login';
            throw new Error('Unauthorized - please log in');
        }

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.error || data.message || 'Request failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
    /**
     * Get current user info
     */
    getCurrentUser: async () => {
        return apiRequest('/auth/user');
    },

    /**
     * Logout current user
     */
    logout: async () => {
        return apiRequest('/auth/logout', { method: 'POST' });
    },
};

// ==================== SUBDOMAIN ENDPOINTS ====================

export const subdomainAPI = {
    /**
     * Get all subdomains for current user
     * @param {boolean} includeDeleted - Include soft-deleted subdomains
     */
    list: async (includeDeleted = false) => {
        const query = includeDeleted ? '?includeDeleted=true' : '';
        return apiRequest(`/subdomains${query}`);
    },

    /**
     * Check if a subdomain name is available
     * @param {string} name - The subdomain name to check
     * @param {string} domain - The root domain (indevs.in, sryze.cc, ryzedns.org, or nx.kg)
     */
    checkAvailability: async (name, domain = 'indevs.in') => {
        return apiRequest(`/subdomains/check/${name}?domain=${encodeURIComponent(domain)}`);
    },

    /**
     * Create new subdomain
     * @param {Object} data - { name, recordType, recordValue }
     */
    create: async (data) => {
        return apiRequest('/subdomains', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Renew a subdomain
     * @param {string} id - Subdomain ID
     */
    renew: async (id) => {
        return apiRequest(`/subdomains/${id}/renew`, {
            method: 'POST',
        });
    },

    /**
     * Soft delete a subdomain
     * @param {string} id - Subdomain ID
     */
    delete: async (id) => {
        return apiRequest(`/subdomains/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Restore a soft-deleted subdomain
     * @param {string} id - Subdomain ID
     */
    restore: async (id) => {
        return apiRequest(`/subdomains/${id}/restore`, {
            method: 'POST',
        });
    },

    /**
     * Update subdomain (if endpoint exists)
     * @param {string} id - Subdomain ID  
     * @param {Object} data - Update data
     */
    update: async (id, data) => {
        return apiRequest(`/subdomains/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get user activity/history
     */
    getActivity: async () => {
        return apiRequest('/subdomains/activity');
    },

    /**
     * Set DNS verification code on a subdomain
     * @param {string} id - Subdomain ID
     * @param {string} code - Verification code from DNS platform
     */
    setDnsVerificationCode: async (id, code) => {
        return apiRequest(`/subdomains/${id}/dns-verification`, {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },

    // Nameservers
    updateNameservers: (id, nameservers, recordType) =>
        apiRequest(`/subdomains/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                recordValue: Array.isArray(nameservers) ? nameservers.join(', ') : nameservers,
                recordType: recordType || 'NS'
            })
        }),

    // Generic methods for custom endpoints
    post: async (endpoint, data) => {
        return apiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    patch: async (endpoint, data) => {
        return apiRequest(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    get: async (endpoint) => {
        return apiRequest(endpoint);
    },
};

export const API = {
    auth: authAPI,
    subdomains: subdomainAPI
};
