
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pensService, Pen, CreatePenRequest, UpdatePenRequest } from "@/api";
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
  const [isEditPenDialogOpen, setIsEditPenDialogOpen] = useState(false);
  const [selectedPen, setSelectedPen] = useState<Pen | null>(null);

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

  const handlePenClick = (pen: Pen) => {
    setSelectedPen(pen);
    setIsEditPenDialogOpen(true);
  };

  const handleEditPen = (e: React.MouseEvent, pen: Pen) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setSelectedPen(pen);
    setIsEditPenDialogOpen(true);
  };

  const handleDeletePen = async (e: React.MouseEvent, penId: string) => {
    e.stopPropagation(); // Prevent the card click event from firing

    if (window.confirm("Are you sure you want to delete this pen?")) {
      try {
        await pensService.deletePen(penId);
        setPens(pens.filter(pen => pen._id !== penId));
        toast({
          title: "Pen deleted",
          description: "The pen has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting pen:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete pen. Please try again.',
          variant: 'destructive',
        });
      }
    }
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
              onClick={() => handlePenClick(pen)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{pen.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm py-1 px-2 rounded ${
                      pen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pen.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-green-600"
                      onClick={(e) => handleEditPen(e, pen)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={(e) => handleDeletePen(e, pen._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      {/* Add Pen Dialog */}
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

      {/* Edit Pen Dialog */}
      <Dialog open={isEditPenDialogOpen} onOpenChange={setIsEditPenDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pen</DialogTitle>
            <DialogDescription>
              Update the details of this poultry pen.
            </DialogDescription>
          </DialogHeader>

          {selectedPen && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={selectedPen.name} 
                    onChange={(e) => setSelectedPen({...selectedPen, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={selectedPen.type} 
                    onValueChange={(value) => setSelectedPen({...selectedPen, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pen type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Layers">Layers</SelectItem>
                      <SelectItem value="Broilers">Broilers</SelectItem>
                      <SelectItem value="Chicks">Chicks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Bird Count</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={selectedPen.birdCount} 
                    onChange={(e) => setSelectedPen({...selectedPen, birdCount: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Age (weeks)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={selectedPen.age} 
                    onChange={(e) => setSelectedPen({...selectedPen, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Daily Egg Average</label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={selectedPen.dailyEggAvg} 
                    onChange={(e) => setSelectedPen({...selectedPen, dailyEggAvg: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mortality Rate (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={selectedPen.mortality} 
                    onChange={(e) => setSelectedPen({...selectedPen, mortality: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={selectedPen.status} 
                    onValueChange={(value) => setSelectedPen({...selectedPen, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditPenDialogOpen(false);
                    setSelectedPen(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={async () => {
                    try {
                      // Create update request object
                      const updateRequest: UpdatePenRequest = {
                        name: selectedPen.name,
                        birdCount: selectedPen.birdCount,
                        type: selectedPen.type,
                        age: selectedPen.age,
                        dailyEggAvg: selectedPen.dailyEggAvg,
                        mortality: selectedPen.mortality,
                        status: selectedPen.status
                      };

                      // Make API call to update the pen
                      const updatedPen = await pensService.updatePen(selectedPen._id, updateRequest);

                      // Update pens list with the updated pen
                      setPens(pens.map(pen => pen._id === updatedPen._id ? updatedPen : pen));

                      toast({
                        title: "Pen updated successfully",
                        description: `Pen ${selectedPen.name} has been updated.`,
                      });

                      setIsEditPenDialogOpen(false);
                      setSelectedPen(null);
                    } catch (error) {
                      console.error('Error updating pen:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to update pen. Please try again.',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Update Pen
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pens;
