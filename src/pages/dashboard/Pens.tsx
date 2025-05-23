
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
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

const penSchema = z.object({
  penId: z.string().min(1, "Pen ID is required"),
  birdCount: z.coerce.number().min(1, "Bird count must be at least 1"),
  penType: z.string().min(1, "Pen type is required"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
});

type PenForm = z.infer<typeof penSchema>;

// Updated the mock pens to ensure mortality is consistently a number
const mockPens = [
  { id: 1, name: "Pen #1", birdCount: 250, type: "Layers", age: 11, dailyEggAvg: 190, mortality: 0.7, status: "active" },
  { id: 2, name: "Pen #2", birdCount: 300, type: "Layers", age: 12, dailyEggAvg: 230, mortality: 1.1, status: "active" },
  { id: 3, name: "Pen #3", birdCount: 350, type: "Layers", age: 13, dailyEggAvg: 270, mortality: 1.5, status: "active" },
  { id: 4, name: "Pen #4", birdCount: 400, type: "Layers", age: 14, dailyEggAvg: 310, mortality: 1.3, status: "active" },
  { id: 5, name: "Pen #5", birdCount: 450, type: "Layers", age: 15, dailyEggAvg: 350, mortality: 1.5, status: "active" },
];

const Pens = () => {
  const [pens, setPens] = useState(mockPens);
  const [isAddPenDialogOpen, setIsAddPenDialogOpen] = useState(false);

  const form = useForm<PenForm>({
    resolver: zodResolver(penSchema),
    defaultValues: {
      penId: "",
      birdCount: 0,
      penType: "",
      age: 0,
    },
  });

  const handlePenClick = (penId: number) => {
    toast({
      title: "Pen selected",
      description: `You've selected Pen #${penId}. Details view will be implemented with database connection.`,
    });
  };

  const onSubmit = (data: PenForm) => {
    // In a real application with DB connection:
    // 1. Make API call to create a new pen
    // 2. Update pens list with response
    const newPen = {
      id: pens.length + 1,
      name: `Pen #${data.penId}`,
      birdCount: data.birdCount,
      type: data.penType,
      age: data.age,
      dailyEggAvg: Math.floor(data.birdCount * 0.8),
      mortality: parseFloat((Math.random() * 0.5 + 0.5).toFixed(1)), // Convert to number
      status: "active"
    };

    setPens([...pens, newPen]);
    toast({
      title: "Pen added successfully",
      description: `New pen ${data.penId} has been added with ${data.birdCount} birds.`,
    });
    setIsAddPenDialogOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pens & Chicks</h1>
          <p className="text-gray-600">Manage your poultry pens and birds</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsAddPenDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Pen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pens.map((pen) => (
          <Card 
            key={pen.id} 
            className="hover:bg-green-50 transition-colors cursor-pointer"
            onClick={() => handlePenClick(pen.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{pen.name}</CardTitle>
                <span className={`text-sm py-1 px-2 rounded ${
                  pen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {pen.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Birds:</span>
                  <span className="font-medium">{pen.birdCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="font-medium">{pen.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age:</span>
                  <span className="font-medium">{pen.age} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Daily Egg Avg:</span>
                  <span className="font-medium">{pen.dailyEggAvg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Mortality Rate:</span>
                  <span className="font-medium">{pen.mortality}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddPenDialogOpen} onOpenChange={setIsAddPenDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Pen</DialogTitle>
            <DialogDescription>
              Enter the details of the new poultry pen.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="penId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pen ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="penType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pen type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Layers">Layers</SelectItem>
                        <SelectItem value="Broilers">Broilers</SelectItem>
                        <SelectItem value="Chicks">Chicks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birdCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Birds</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (weeks)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPenDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Save Pen
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pens;
