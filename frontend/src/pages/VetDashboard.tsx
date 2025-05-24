
import { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [treatments, setTreatments] = useState([
    { date: "2025-05-22", pen: "Pen 1", treatment: "Vaccination", medication: "Newcastle", cost: 45 },
    { date: "2025-05-20", pen: "Pen 3", treatment: "Deworming", medication: "Ivermectin", cost: 30 },
    { date: "2025-05-18", pen: "Pen 2", treatment: "Medication", medication: "Antibiotics", cost: 55 },
    { date: "2025-05-15", pen: "Pen 1", treatment: "Vitamin", medication: "Multivitamin", cost: 25 },
    { date: "2025-05-12", pen: "Pen 4", treatment: "Vaccination", medication: "Gumboro", cost: 40 },
  ]);

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

  const onSubmit = (data: TreatmentForm) => {
    // In a real application with DB connection:
    // 1. Make API call to create a new treatment record
    // 2. Update treatment records list with response
    
    const newTreatment = {
      date: format(data.date, "yyyy-MM-dd"),
      pen: `Pen ${data.penId}`,
      treatment: data.treatmentType,
      medication: data.medication,
      cost: data.cost
    };
    
    setTreatments([newTreatment, ...treatments]);
    
    toast({
      title: "Treatment record submitted",
      description: `Successfully recorded ${data.treatmentType} for pen ${data.penId}.`,
    });
    
    // Reset the form
    form.reset();
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Pen 1</SelectItem>
                          <SelectItem value="2">Pen 2</SelectItem>
                          <SelectItem value="3">Pen 3</SelectItem>
                          <SelectItem value="4">Pen 4</SelectItem>
                          <SelectItem value="5">Pen 5</SelectItem>
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
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Submit Treatment Record
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Pen</th>
                  <th className="pb-2 font-medium">Treatment</th>
                  <th className="pb-2 font-medium">Medication</th>
                  <th className="pb-2 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.date}</td>
                    <td className="py-3">{item.pen}</td>
                    <td className="py-3">{item.treatment}</td>
                    <td className="py-3">{item.medication}</td>
                    <td className="py-3">{item.cost} Tsh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VetDashboard;
