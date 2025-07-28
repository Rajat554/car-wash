import { ServiceOption } from '@/types';

export const SERVICE_TYPES: ServiceOption[] = [
  {
    value: 'basic-wash',
    label: 'Basic Wash',
    basePrice: 150
  },
  {
    value: 'deep-clean',
    label: 'Deep Clean',
    basePrice: 300
  },
  {
    value: 'waxing',
    label: 'Waxing',
    basePrice: 500
  },
  {
    value: 'interior-clean',
    label: 'Interior Clean',
    basePrice: 250
  },
  {
    value: 'engine-wash',
    label: 'Engine Wash',
    basePrice: 200
  },
  {
    value: 'full-service',
    label: 'Full Service',
    basePrice: 800
  }
];

export const SERVICE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
];

export const CURRENCY_SYMBOL = '₹';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

export const PAGINATION_SIZES = [10, 25, 50, 100];

export const MOCK_USER = {
  id: '1',
  name: 'Car Wash Owner',
  email: 'owner@carwash.com',
  role: 'owner' as const
};