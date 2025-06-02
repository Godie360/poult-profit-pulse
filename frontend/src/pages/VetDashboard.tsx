
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { pensService, recordsService, Pen, RecordType, MedicineRecord, CreateMedicineRecordRequest } from "@/api";

const treatmentSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  penId: z.string().min(1, "Pen ID is required"),
  treatmentType: z.string().min(1, "Treatment type is required"),
  medication: z.string().min(1, "Medication is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  notes: z.string().optional(),
});

type TreatmentForm = z.infer<typeof treatmentSchema>;

const VetDashboard = () => {
  const [treatments, setTreatments] = useState<MedicineRecord[]>([]);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(true);
  const [treatmentError, setTreatmentError] = useState<string | null>(null);

  const [pens, setPens] = useState<Pen[]>([]);
  const [isLoadingPens, setIsLoadingPens] = useState(true);
  const [penError, setPenError] = useState<string | null>(null);

  // Fetch pens from the API
  useEffect(() => {
    const fetchPens = async () => {
      try {
        setIsLoadingPens(true);
        setPenError(null);
        const pensData = await pensService.getAllPens();
        setPens(pensData);
      } catch (error) {
        console.error('Error fetching pens:', error);
        setPenError('Failed to load pens. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load pens. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPens(false);
      }
    };

    fetchPens();
  }, []);

  // Fetch treatment records from the API
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setIsLoadingTreatments(true);
        setTreatmentError(null);
        const recordsData = await recordsService.getAllRecords(RecordType.MEDICINE);
        setTreatments(recordsData as MedicineRecord[]);
      } catch (error) {
        console.error('Error fetching treatment records:', error);
        setTreatmentError('Failed to load treatment records. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load treatment records. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingTreatments(false);
      }
    };

    fetchTreatments();
  }, []);

  const form = useForm<TreatmentForm>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      date: new Date(),
      penId: "",
      treatmentType: "",
      medication: "",
      cost: 0,
      notes: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TreatmentForm) => {
    // Find the selected pen to get its name
    const selectedPen = pens.find(pen => pen._id === data.penId);

    if (!selectedPen) {
      toast({
        title: "Error",
        description: "Selected pen not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create medicine record request
      const medicineRecordRequest: CreateMedicineRecordRequest = {
        date: data.date,
        medicine: data.medication,
        quantity: data.treatmentType, // Using treatmentType as quantity
        price: data.cost,
        supplier: "Veterinary Service", // Default supplier for vet treatments
      };

      // Make API call to create a new medicine record
      const newRecord = await recordsService.createMedicineRecord(medicineRecordRequest);

      // Update treatments list with the new record
      setTreatments([newRecord, ...treatments]);

      toast({
        title: "Treatment record submitted",
        description: `Successfully recorded ${data.treatmentType} for ${selectedPen.name}.`,
      });

      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error creating treatment record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save treatment record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Veterinary Dashboard</h1>
        <p className="text-gray-600">Record treatments and monitor poultry health</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Treatment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Treatment Date</FormLabel>
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

                <FormField
                  control={form.control}
                  name="penId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pen ID</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPens}>
                        <FormControl>
                          <SelectTrigger>
                            {isLoadingPens ? (
                              <div className="flex items-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span>Loading pens...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select a pen" />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {penError ? (
                            <div className="p-2 text-red-500 text-sm">{penError}</div>
                          ) : pens.length === 0 ? (
                            <div className="p-2 text-gray-500 text-sm">No pens found</div>
                          ) : (
                            pens.map((pen) => (
                              <SelectItem key={pen._id} value={pen._id}>
                                {pen.name} ({pen.birdCount} birds)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select treatment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="deworming">Deworming</SelectItem>
                          <SelectItem value="vitamin">Vitamin Supplement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication/Product Used</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Newcastle vaccine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost (Tsh)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any observations or additional information about the treatment" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Treatment Record"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Treatments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTreatments ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : treatmentError ? (
            <div className="text-center py-4 text-red-500">{treatmentError}</div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No treatment records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Medicine</th>
                    <th className="pb-2 font-medium">Treatment Type</th>
                    <th className="pb-2 font-medium">Cost</th>
                    <th className="pb-2 font-medium">Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="py-3">{item.medicine}</td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">{item.price.toLocaleString()} TSH</td>
                      <td className="py-3">{item.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VetDashboard;
