
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pensService, Pen, CreatePenRequest } from "@/api";
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

const Pens = () => {
  const [pens, setPens] = useState<Pen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPenDialogOpen, setIsAddPenDialogOpen] = useState(false);

  // Fetch pens from the API
  useEffect(() => {
    const fetchPens = async () => {
      try {
        setIsLoading(true);
        const pensData = await pensService.getAllPens();
        setPens(pensData);
      } catch (error) {
        console.error('Error fetching pens:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pens. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPens();
  }, []);

  const form = useForm<PenForm>({
    resolver: zodResolver(penSchema),
    defaultValues: {
      penId: "",
      birdCount: 0,
      penType: "",
      age: 0,
    },
  });

  const handlePenClick = (penId: string) => {
    toast({
      title: "Pen selected",
      description: `You've selected Pen with ID ${penId}. Details view will be implemented soon.`,
    });
  };

  const onSubmit = async (data: PenForm) => {
    try {
      // Create pen request object
      const penRequest: CreatePenRequest = {
        name: `Pen #${data.penId}`,
        birdCount: data.birdCount,
        type: data.penType,
        age: data.age,
        dailyEggAvg: Math.floor(data.birdCount * 0.8),
        mortality: 0.5, // Default mortality rate
        status: "active"
      };

      // Make API call to create a new pen
      const newPen = await pensService.createPen(penRequest);

      // Update pens list with the new pen
      setPens([...pens, newPen]);

      toast({
        title: "Pen added successfully",
        description: `New pen ${data.penId} has been added with ${data.birdCount} birds.`,
      });

      setIsAddPenDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating pen:', error);
      toast({
        title: 'Error',
        description: 'Failed to create pen. Please try again.',
        variant: 'destructive',
      });
    }
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
        {isLoading ? (
          // Loading skeleton
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : pens.length > 0 ? (
          pens.map((pen) => (
            <Card 
              key={pen._id} 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => handlePenClick(pen._id)}
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
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-gray-500">
            No pens found. Click "Add New Pen" to create one.
          </div>
        )}
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
