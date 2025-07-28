// API service layer - Ready for MongoDB backend integration
// Replace BASE_URL with your actual backend URL when ready

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    // TODO: Connect to your MongoDB backend
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  }
};

// Customer endpoints
export const customerAPI = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/customers`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  create: async (customerData: any) => {
    const response = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  update: async (id: string, customerData: any) => {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  }
};

// Service endpoints
export const serviceAPI = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    serviceType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.serviceType) queryParams.append('serviceType', params.serviceType);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const response = await fetch(`${BASE_URL}/services?${queryParams}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  create: async (serviceData: any) => {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  },

  update: async (id: string, serviceData: any) => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  }
};

// Analytics endpoints
export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  getMonthlyAnalytics: async (month?: string, year?: string) => {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    if (year) queryParams.append('year', year);

    const response = await fetch(`${BASE_URL}/analytics/monthly?${queryParams}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  },

  getServiceTypeBreakdown: async (dateFrom?: string, dateTo?: string) => {
    const queryParams = new URLSearchParams();
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    const response = await fetch(`${BASE_URL}/analytics/service-types?${queryParams}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.json();
  }
};

// Utility function for handling API errors
export const handleAPIError = (error: any) => {
  console.error('API Error:', error);
  if (error.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  throw error;
};