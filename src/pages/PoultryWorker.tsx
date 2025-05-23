
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const dailyLogSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  penId: z.string().min(1, "Pen ID is required"),
  eggsCollected: z.coerce.number().min(0, "Must be a positive number"),
  poultryDeaths: z.coerce.number().min(0, "Must be a positive number"),
  poultrySold: z.coerce.number().min(0, "Must be a positive number"),
  salesAmount: z.coerce.number().min(0, "Must be a positive number"),
});

type DailyLogForm = z.infer<typeof dailyLogSchema>;

const PoultryWorker = () => {
  const form = useForm<DailyLogForm>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: {
      date: new Date(),
      penId: "",
      eggsCollected: 0,
      poultryDeaths: 0,
      poultrySold: 0,
      salesAmount: 0,
    },
  });

  const onSubmit = (data: DailyLogForm) => {
    // In a real application, we would send this data to the server
    console.log("Daily log data:", data);
    
    toast({
      title: "Daily log submitted",
      description: `Successfully recorded ${data.eggsCollected} eggs from pen ${data.penId} on ${format(data.date, "PP")}.`,
    });
    
    // Reset the form
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Poultry Worker Dashboard</h1>
        <p className="text-gray-600">Record daily poultry data and activities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Log Entry</CardTitle>
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
                  name="eggsCollected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eggs Collected</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poultryDeaths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poultry Deaths</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poultrySold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poultry Sold</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Submit Daily Log
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoultryWorker;
