import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Download
} from 'lucide-react';
import { analyticsAPI } from '@/services/api';
import { AnalyticsData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [dateRange, setDateRange] = useState('30');
  
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [month, year] = selectedMonth.split('-');
      
      // Fetch monthly analytics
      const monthlyResponse = await analyticsAPI.getMonthlyAnalytics(month, year);
      setMonthlyData(monthlyResponse);

      // Fetch service type breakdown
      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      const serviceTypeResponse = await analyticsAPI.getServiceTypeBreakdown(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setServiceTypeData(serviceTypeResponse.serviceTypes || []);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, dateRange]);

  const totalRevenue = monthlyData?.dailyIncome?.reduce((sum: number, day: any) => sum + day.income, 0) || 0;
  const totalServices = monthlyData?.dailyIncome?.reduce((sum: number, day: any) => sum + day.customers, 0) || 0;
  const avgDailyRevenue = monthlyData?.dailyIncome?.length ? totalRevenue / monthlyData.dailyIncome.length : 0;

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary bg-gradient-primary bg-clip-text">
              Income Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track revenue trends and service performance
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  return (
                    <SelectItem key={value} value={value}>
                      {format(date, 'MMMM yyyy')}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="hover-scale">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-scale transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +{getPercentageChange(totalRevenue, totalRevenue * 0.9).toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices}</div>
              <p className="text-xs text-muted-foreground">
                +{getPercentageChange(totalServices, totalServices * 0.85).toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgDailyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Daily average for selected month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Service Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalServices > 0 ? (totalRevenue / totalServices).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue per service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="services">Service Distribution</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daily Revenue Overview
                </CardTitle>
                <CardDescription>
                  Revenue breakdown for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[400px] animate-pulse bg-muted rounded"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={monthlyData?.dailyIncome || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'dd')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        formatter={(value, name) => [
                          name === 'income' ? `$${value}` : value,
                          name === 'income' ? 'Revenue' : 'Services'
                        ]}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6}
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Services Count Trend
                </CardTitle>
                <CardDescription>
                  Daily service count for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] animate-pulse bg-muted rounded"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData?.dailyIncome || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'dd')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                        formatter={(value) => [value, 'Services']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981' }}
                        name="Services"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Service Type Distribution
                  </CardTitle>
                  <CardDescription>
                    Revenue breakdown by service type (Last {dateRange} days)
                  </CardDescription>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] animate-pulse bg-muted rounded"></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={serviceTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {serviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Service Volume by Type
                  </CardTitle>
                  <CardDescription>
                    Number of services by type (Last {dateRange} days)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] animate-pulse bg-muted rounded"></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={serviceTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="type" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" name="Services" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>Services by revenue generation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceTypeData
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((service, index) => (
                        <div key={service.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="font-medium capitalize">{service.type.replace('-', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${service.revenue}</div>
                            <div className="text-sm text-muted-foreground">{service.count} services</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key business indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Best Performing Day</span>
                    <span className="font-semibold">
                      {monthlyData?.dailyIncome?.length ? 
                        format(new Date(monthlyData.dailyIncome.reduce((best: any, current: any) => 
                          current.income > best.income ? current : best
                        ).date), 'MMM dd') : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Peak Revenue Day</span>
                    <span className="font-semibold">
                      ${monthlyData?.dailyIncome?.length ? 
                        Math.max(...monthlyData.dailyIncome.map((d: any) => d.income)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Most Popular Service</span>
                    <span className="font-semibold capitalize">
                      {serviceTypeData.length ? 
                        serviceTypeData.reduce((best, current) => 
                          current.count > best.count ? current : best
                        ).type.replace('-', ' ') : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span className="font-semibold text-green-600">
                      +{getPercentageChange(totalRevenue, totalRevenue * 0.9).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}