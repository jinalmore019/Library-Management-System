const API_BASE_URL = 'http://localhost:8081';

const getAuthHeaders = () => {
    const auth = localStorage.getItem('auth');
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        headers['Authorization'] = `Basic ${auth}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        // Unauthorized - clear credentials and trigger redirect
        localStorage.removeItem('auth');
        window.dispatchEvent(new Event('auth_error'));
        throw new Error('Unauthorized. Please login again.');
    }
    
    if (!response.ok) {
        let msg = 'API error';
        try {
            const err = await response.json();
            msg = err.message || err.error || msg;
        } catch (e) {
            msg = response.statusText || msg;
        }
        throw new Error(msg);
    }
    // Handle empty responses (like void deletion from Sprint Boot)
    if(response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const api = {
    // Auth Endpoints (Unprotected)
    register: (data) => fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    }).then(handleResponse),
    
    forgotPassword: (email) => fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    }).then(handleResponse),

    // Auth Test (We just hit /books to test basic auth validity)
    verifyLogin: (authString) => fetch(`${API_BASE_URL}/books`, {
        headers: { 'Authorization': `Basic ${authString}` }
    }).then(handleResponse),

    // Books
    getBooks: () => fetch(`${API_BASE_URL}/books`, { headers: getAuthHeaders() }).then(handleResponse),
    addBook: (data) => fetch(`${API_BASE_URL}/books`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    updateBook: (id, data) => fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    deleteBook: (id) => fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
    }).then(handleResponse),

    // Students
    getStudents: () => fetch(`${API_BASE_URL}/students`, { headers: getAuthHeaders() }).then(handleResponse),
    addStudent: (data) => fetch(`${API_BASE_URL}/students`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    updateStudent: (id, data) => fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    deleteStudent: (id) => fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
    }).then(handleResponse),

    // Categories
    getCategories: () => fetch(`${API_BASE_URL}/categories`, { headers: getAuthHeaders() }).then(handleResponse),
    addCategory: (data) => fetch(`${API_BASE_URL}/categories`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    updateCategory: (id, data) => fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    deleteCategory: (id) => fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
    }).then(handleResponse),

    // Issues
    getIssues: () => fetch(`${API_BASE_URL}/issues`, { headers: getAuthHeaders() }).then(handleResponse),
    addIssue: (data) => fetch(`${API_BASE_URL}/issues`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    updateIssue: (id, data) => fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data)
    }).then(handleResponse),
    deleteIssue: (id) => fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
    }).then(handleResponse),
};
