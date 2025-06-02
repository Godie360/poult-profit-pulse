
import { useState, useEffect } from "react";
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
import { CalendarIcon, ArrowDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pensService, dashboardService, Pen, DailyLog } from "@/api";

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
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const [pens, setPens] = useState<Pen[]>([]);
  const [isLoadingPens, setIsLoadingPens] = useState(true);
  const [penError, setPenError] = useState<string | null>(null);

  // Fetch pens and logs from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pens
        setIsLoadingPens(true);
        setPenError(null);
        const pensData = await pensService.getAllPens();
        setPens(pensData);
        setIsLoadingPens(false);

        // Fetch daily logs
        setIsLoadingLogs(true);
        const logsData = await dashboardService.getUserDailyLogs();
        setLogs(logsData);
        setIsLoadingLogs(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPenError('Failed to load data. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
        setIsLoadingPens(false);
        setIsLoadingLogs(false);
      }
    };

    fetchData();
  }, []);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: DailyLogForm) => {
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

      // Create daily log data
      const logData = {
        date: data.date,
        penId: data.penId,
        eggsCollected: data.eggsCollected,
        poultryDeaths: data.poultryDeaths,
        poultrySold: data.poultrySold || 0,
        salesAmount: data.salesAmount || 0
      };

      // Make API call to create a new daily log
      const newLog = await dashboardService.createDailyLog(logData);

      // Update logs list with the new log
      // We need to fetch all logs again to get the updated list with proper IDs
      const updatedLogs = await dashboardService.getUserDailyLogs();
      setLogs(updatedLogs);

      toast({
        title: "Daily log submitted",
        description: `Successfully recorded ${data.eggsCollected} eggs from ${selectedPen.name} on ${format(data.date, "PP")}.`,
      });

      // Reset the form
      form.reset({
        date: new Date(),
        penId: "",
        eggsCollected: 0,
        poultryDeaths: 0,
        poultrySold: 0,
        salesAmount: 0,
      });
    } catch (error) {
      console.error('Error creating daily log:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit daily log. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
                      <FormLabel>Sales Amount (Tsh)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    "Submit Daily Log"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Daily Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Pen</th>
                    <th className="pb-2 font-medium">Eggs</th>
                    <th className="pb-2 font-medium">Deaths</th>
                    <th className="pb-2 font-medium">Sold</th>
                    <th className="pb-2 font-medium">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="py-3">{log.penName || `Pen ${log.penId}`}</td>
                      <td className="py-3">{log.eggsCollected}</td>
                      <td className="py-3">{log.poultryDeaths}</td>
                      <td className="py-3">{log.poultrySold || 0}</td>
                      <td className="py-3">{(log.salesAmount || 0).toLocaleString()} Tsh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No daily logs found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoultryWorker;
