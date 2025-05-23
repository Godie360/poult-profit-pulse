
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
  treatment: z.string().min(3, "Treatment description is required"),
  medication: z.string().min(1, "Medication is required"),
  cost: z.coerce.number().min(0, "Must be a positive number"),
  notes: z.string().optional(),
  treatmentType: z.enum(["preventive", "emergency", "followup"], {
    required_error: "Treatment type is required",
  }),
});

type TreatmentForm = z.infer<typeof treatmentSchema>;

const VetDashboard = () => {
  const form = useForm<TreatmentForm>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      date: new Date(),
      penId: "",
      treatment: "",
      medication: "",
      cost: 0,
      notes: "",
      treatmentType: "preventive",
    },
  });

  const onSubmit = (data: TreatmentForm) => {
    // In a real application, we would send this data to the server
    console.log("Treatment data:", data);
    
    toast({
      title: "Treatment record submitted",
      description: `Successfully recorded ${data.treatmentType} treatment for pen ${data.penId}.`,
    });
    
    // Reset the form
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vet Dashboard</h1>
        <p className="text-gray-600">Record treatments and medications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Record</CardTitle>
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
                      <FormLabel>Date</FormLabel>
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
                      <FormControl>
                        <Input placeholder="e.g. Pen 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Given</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Vaccination" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Used</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Antibiotics" {...field} />
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
                      <FormLabel>Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <select 
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="preventive">Preventive</option>
                          <option value="emergency">Emergency</option>
                          <option value="followup">Follow-up</option>
                        </select>
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
                        placeholder="Enter any additional health observations or notes"
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
    </div>
  );
};

export default VetDashboard;
