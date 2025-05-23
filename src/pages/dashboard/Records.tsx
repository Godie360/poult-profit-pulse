
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Filter, ArrowDownUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const feedRecordSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  feedType: z.string().min(1, "Feed type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  supplier: z.string().min(1, "Supplier is required"),
});

const medicineRecordSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  medicine: z.string().min(1, "Medicine name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  supplier: z.string().min(1, "Supplier is required"),
});

type FeedRecordForm = z.infer<typeof feedRecordSchema>;
type MedicineRecordForm = z.infer<typeof medicineRecordSchema>;

const Records = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  const feedForm = useForm<FeedRecordForm>({
    resolver: zodResolver(feedRecordSchema),
    defaultValues: {
      date: new Date(),
      feedType: "",
      quantity: 0,
      price: 0,
      supplier: "",
    },
  });

  const medicineForm = useForm<MedicineRecordForm>({
    resolver: zodResolver(medicineRecordSchema),
    defaultValues: {
      date: new Date(),
      medicine: "",
      quantity: "",
      price: 0,
      supplier: "",
    },
  });

  // Initial feed records
  const [feedRecords, setFeedRecords] = useState([
    { date: "2025-05-20", type: "Layer Feed", quantity: 500, price: 450, supplier: "FarmSupply Co." },
    { date: "2025-05-13", type: "Chick Starter", quantity: 250, price: 275, supplier: "Agro Feeds Ltd." },
    { date: "2025-05-05", type: "Layer Feed", quantity: 600, price: 540, supplier: "FarmSupply Co." },
    { date: "2025-04-28", type: "Grower Feed", quantity: 400, price: 380, supplier: "Green Farms" },
    { date: "2025-04-20", type: "Layer Feed", quantity: 500, price: 450, supplier: "FarmSupply Co." },
  ]);

  // Initial medicine records
  const [medicineRecords, setMedicineRecords] = useState([
    { date: "2025-05-18", medicine: "Antibiotics", quantity: "20 bottles", price: 160, supplier: "VetMed Supply" },
    { date: "2025-05-10", medicine: "Vitamins", quantity: "15 packets", price: 90, supplier: "FarmCare" },
    { date: "2025-05-02", medicine: "Vaccines", quantity: "50 doses", price: 250, supplier: "VetMed Supply" },
    { date: "2025-04-25", medicine: "Dewormer", quantity: "10 bottles", price: 120, supplier: "Agro Health" },
    { date: "2025-04-15", medicine: "Antibiotics", quantity: "15 bottles", price: 120, supplier: "VetMed Supply" },
  ]);

  const handleAddRecord = () => {
    setIsAddRecordDialogOpen(true);
  };

  const handleFilter = () => {
    setIsFilterPopoverOpen(true);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    
    // Sort feed records
    const sortedFeedRecords = [...feedRecords].sort((a, b) => {
      if (newSortOrder === "asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    setFeedRecords(sortedFeedRecords);
    
    // Sort medicine records
    const sortedMedicineRecords = [...medicineRecords].sort((a, b) => {
      if (newSortOrder === "asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    setMedicineRecords(sortedMedicineRecords);
    
    toast({
      title: "Records sorted",
      description: `Records are now sorted ${newSortOrder === "asc" ? "oldest first" : "newest first"}`,
    });
  };

  const onSubmitFeedRecord = (data: FeedRecordForm) => {
    // In a real application with DB connection:
    // 1. Make API call to create a new feed record
    // 2. Update feed records list with response
    
    const newRecord = {
      date: format(data.date, "yyyy-MM-dd"),
      type: data.feedType,
      quantity: data.quantity,
      price: data.price,
      supplier: data.supplier,
    };
    
    setFeedRecords([newRecord, ...feedRecords]);
    
    toast({
      title: "Feed record added",
      description: `${data.quantity}kg of ${data.feedType} purchased for $${data.price}`,
    });
    
    setIsAddRecordDialogOpen(false);
    feedForm.reset();
  };

  const onSubmitMedicineRecord = (data: MedicineRecordForm) => {
    // In a real application with DB connection:
    // 1. Make API call to create a new medicine record
    // 2. Update medicine records list with response
    
    const newRecord = {
      date: format(data.date, "yyyy-MM-dd"),
      medicine: data.medicine,
      quantity: data.quantity,
      price: data.price,
      supplier: data.supplier,
    };
    
    setMedicineRecords([newRecord, ...medicineRecords]);
    
    toast({
      title: "Medicine record added",
      description: `${data.quantity} of ${data.medicine} purchased for $${data.price}`,
    });
    
    setIsAddRecordDialogOpen(false);
    medicineForm.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feed & Medicine</h1>
          <p className="text-gray-600">Track all your feed and medicine expenses</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={handleFilter}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAddRecord}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feed">Feed Records</TabsTrigger>
          <TabsTrigger value="medicine">Medicine Records</TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Feed Purchase History</CardTitle>
                <Button variant="outline" size="sm" onClick={handleSort}>
                  <ArrowDownUp className="mr-2 h-3 w-3" />
                  {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Feed Type</th>
                      <th className="pb-2 font-medium">Quantity (kg)</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedRecords.map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.type}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.price}</td>
                        <td className="py-3">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medicine">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Medicine Purchase History</CardTitle>
                <Button variant="outline" size="sm" onClick={handleSort}>
                  <ArrowDownUp className="mr-2 h-3 w-3" />
                  {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Medicine</th>
                      <th className="pb-2 font-medium">Quantity</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineRecords.map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.medicine}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.price}</td>
                        <td className="py-3">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Record Dialog */}
      <Dialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{activeTab === "feed" ? "Add Feed Record" : "Add Medicine Record"}</DialogTitle>
            <DialogDescription>
              Enter the details of the {activeTab === "feed" ? "feed purchase" : "medicine purchase"}.
            </DialogDescription>
          </DialogHeader>
          
          {activeTab === "feed" ? (
            <Form {...feedForm}>
              <form onSubmit={feedForm.handleSubmit(onSubmitFeedRecord)} className="space-y-4">
                <FormField
                  control={feedForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Purchase Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={feedForm.control}
                    name="feedType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feed Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select feed type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Layer Feed">Layer Feed</SelectItem>
                            <SelectItem value="Broiler Feed">Broiler Feed</SelectItem>
                            <SelectItem value="Chick Starter">Chick Starter</SelectItem>
                            <SelectItem value="Grower Feed">Grower Feed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={feedForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={feedForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={feedForm.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. FarmSupply Co." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddRecordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Save Record
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <Form {...medicineForm}>
              <form onSubmit={medicineForm.handleSubmit(onSubmitMedicineRecord)} className="space-y-4">
                <FormField
                  control={medicineForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Purchase Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={medicineForm.control}
                    name="medicine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Antibiotics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={medicineForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 20 bottles" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={medicineForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={medicineForm.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. VetMed Supply" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddRecordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Save Record
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Filter Popover - Would connect to DB in real implementation */}
      <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
        <PopoverTrigger asChild>
          <span></span>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Filter Records</h3>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Date Range</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                  setIsFilterPopoverOpen(false);
                  toast({
                    title: "Filter applied",
                    description: "Showing records from the last 30 days",
                  });
                }}>Last 30 days</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                  setIsFilterPopoverOpen(false);
                  toast({
                    title: "Filter applied",
                    description: "Showing records from the last 3 months",
                  });
                }}>Last 3 months</Button>
              </div>
              
              {activeTab === "feed" && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium">Feed Type</h4>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsFilterPopoverOpen(false);
                      toast({
                        title: "Filter applied",
                        description: "Showing Layer Feed records",
                      });
                    }}>Layer Feed</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsFilterPopoverOpen(false);
                      toast({
                        title: "Filter applied",
                        description: "Showing Chick Starter records",
                      });
                    }}>Chick Starter</Button>
                  </div>
                </div>
              )}
              
              <div className="pt-3 flex justify-end">
                <Button size="sm" onClick={() => {
                  setIsFilterPopoverOpen(false);
                  toast({
                    title: "Filters cleared",
                    description: "Showing all records",
                  });
                }}>Clear Filters</Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Records;
