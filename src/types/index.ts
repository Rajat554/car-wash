// Type definitions for the Car Wash Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'employee';
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleNumber: string;
  vehiclePlate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  customerId: string;
  customer?: Customer; // Populated customer data
  serviceType: ServiceType;
  price: number;
  serviceDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceType = 
  | 'basic-wash'
  | 'deep-clean'
  | 'waxing'
  | 'interior-clean'
  | 'engine-wash'
  | 'full-service';

export interface ServiceOption {
  value: ServiceType;
  label: string;
  basePrice: number;
}

export interface DashboardStats {
  todayCustomers: number;
  todayIncome: number;
  monthlyCustomers: number;
  monthlyIncome: number;
  recentServices: Service[];
}

export interface AnalyticsData {
  dailyIncome: Array<{
    date: string;
    income: number;
    customers: number;
  }>;
  serviceTypeBreakdown: Array<{
    type: ServiceType;
    count: number;
    revenue: number;
  }>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ServiceFormData {
  customerId?: string;
  customerName: string;
  phone: string;
  address: string;
  vehicleNumber: string;
  vehiclePlate: string;
  serviceType: ServiceType;
  price: number;
  serviceDate: Date;
  notes?: string;
}