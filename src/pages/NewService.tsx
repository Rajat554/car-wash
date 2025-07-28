import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, User, Car, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { SERVICE_TYPES, CURRENCY_SYMBOL } from '@/lib/constants';
import { ServiceFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const NewService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ServiceFormData>({
    customerName: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    vehiclePlate: '',
    serviceType: 'basic-wash',
    price: SERVICE_TYPES[0].basePrice,
    serviceDate: new Date(),
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceTypeChange = (value: any) => {
    const selectedService = SERVICE_TYPES.find(service => service.value === value);
    setFormData(prev => ({
      ...prev,
      serviceType: value,
      price: selectedService?.basePrice || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call when backend is ready
      // await serviceAPI.create(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Service Created Successfully!",
        description: `New service for ${formData.customerName} has been added.`,
      });

      // Reset form
      setFormData({
        customerName: '',
        phone: '',
        address: '',
        vehicleNumber: '',
        vehiclePlate: '',
        serviceType: 'basic-wash',
        price: SERVICE_TYPES[0].basePrice,
        serviceDate: new Date(),
        notes: ''
      });

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">New Service Entry</h1>
          <p className="text-muted-foreground mt-2">Add a new customer service record</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter customer name"
                        required
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          className="pl-10 transition-all duration-200 focus:shadow-glow"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Customer address"
                        className="pl-10 transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                      <div className="relative">
                        <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                          placeholder="DL01AB1234"
                          className="pl-10 transition-all duration-200 focus:shadow-glow uppercase"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePlate">Vehicle Plate Name</Label>
                      <Input
                        id="vehiclePlate"
                        value={formData.vehiclePlate}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                        placeholder="Same as vehicle number"
                        className="transition-all duration-200 focus:shadow-glow uppercase"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Details */}
            <div>
              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2 text-primary" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={handleServiceTypeChange}
                      required
                    >
                      <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {SERVICE_TYPES.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.label}</span>
                              <span className="text-muted-foreground ml-2">
                                {CURRENCY_SYMBOL}{service.basePrice}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Service Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        className="pl-8 transition-all duration-200 focus:shadow-glow"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Service Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal transition-all duration-200 focus:shadow-glow",
                            !formData.serviceDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.serviceDate ? (
                            format(formData.serviceDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.serviceDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, serviceDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes..."
                      className="transition-all duration-200 focus:shadow-glow"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Service
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewService;