import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  IndianRupee, 
  Calendar, 
  TrendingUp,
  Clock,
  Car,
  Eye
} from 'lucide-react';
import { CURRENCY_SYMBOL, SERVICE_TYPES } from '@/lib/constants';
import { Service, DashboardStats } from '@/types';
import { Link } from 'react-router-dom';

// Mock data - replace with real API calls later
const mockStats: DashboardStats = {
  todayCustomers: 12,
  todayIncome: 4500,
  monthlyCustomers: 285,
  monthlyIncome: 127500,
  recentServices: [
    {
      id: '1',
      customerId: '1',
      customer: {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        address: 'Delhi',
        vehicleNumber: 'DL01AB1234',
        vehiclePlate: 'DL01AB1234',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      serviceType: 'basic-wash',
      price: 150,
      serviceDate: new Date(),
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      customerId: '2',
      customer: {
        id: '2',
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        address: 'Mumbai',
        vehicleNumber: 'MH01CD5678',
        vehiclePlate: 'MH01CD5678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      serviceType: 'full-service',
      price: 800,
      serviceDate: new Date(),
      status: 'in-progress',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    // loadDashboardData();
  }, []);

  const getServiceTypeLabel = (type: string) => {
    return SERVICE_TYPES.find(service => service.value === type)?.label || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today's Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Today's Income</p>
                  <p className="text-2xl font-bold text-foreground">
                    {CURRENCY_SYMBOL}{stats.todayIncome.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Monthly Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.monthlyCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-glow/10 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-primary-glow" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                  <p className="text-2xl font-bold text-foreground">
                    {CURRENCY_SYMBOL}{stats.monthlyIncome.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Services</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/services">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Car className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{service.customer?.name}</p>
                          <p className="text-sm text-muted-foreground">{service.customer?.vehicleNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{CURRENCY_SYMBOL}{service.price}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(service.status)} variant="secondary">
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" asChild>
                  <Link to="/new-service">
                    <Clock className="w-4 h-4 mr-2" />
                    New Service Entry
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/customers">
                    <Users className="w-4 h-4 mr-2" />
                    View Customers
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/analytics">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;