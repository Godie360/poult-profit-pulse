
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { reportsService, FinancialReport, ProductionReport, ReportPeriod, ReportFilter } from "@/api";
import { format, subDays, subMonths } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const Reports = () => {
  // State for reports data
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [productionReport, setProductionReport] = useState<ProductionReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // State for date range
  const [dateFilter, setDateFilter] = useState<ReportFilter>({
    period: ReportPeriod.MONTHLY
  });

  // State for date range picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const [financial, production] = await Promise.all([
          reportsService.getFinancialReport(dateFilter),
          reportsService.getProductionReport(dateFilter),
        ]);
        setFinancialReport(financial);
        setProductionReport(production);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error fetching reports",
          description: "There was an error fetching the reports data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [dateFilter]);

  // Handle export reports
  const handleExportReports = async () => {
    setIsExporting(true);
    toast({
      title: "Export initiated",
      description: "Your report is being prepared for download.",
    });

    try {
      await reportsService.downloadReports(dateFilter);
      toast({
        title: "Export successful",
        description: "Your report has been downloaded.",
      });
    } catch (error) {
      console.error('Error exporting reports:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);

      // Update filter with custom date range
      setDateFilter({
        period: ReportPeriod.CUSTOM,
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: format(range.to, 'yyyy-MM-dd'),
      });

      setIsCalendarOpen(false);
    }
  };

  // Handle predefined period selection
  const handlePeriodSelect = (period: ReportPeriod) => {
    let filter: ReportFilter = { period };
    let newDateRange: DateRange | undefined;

    const today = new Date();

    switch (period) {
      case ReportPeriod.DAILY:
        newDateRange = {
          from: subDays(today, 1),
          to: today,
        };
        break;
      case ReportPeriod.WEEKLY:
        newDateRange = {
          from: subDays(today, 7),
          to: today,
        };
        break;
      case ReportPeriod.MONTHLY:
      default:
        newDateRange = {
          from: subMonths(today, 1),
          to: today,
        };
        break;
    }

    setDateRange(newDateRange);
    setDateFilter(filter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">Financial and farm performance insights</p>
        </div>
        <div className="flex gap-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Select Date Range</h3>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePeriodSelect(ReportPeriod.DAILY)}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePeriodSelect(ReportPeriod.WEEKLY)}
                  >
                    Last 7 Days
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePeriodSelect(ReportPeriod.MONTHLY)}
                  >
                    Last 30 Days
                  </Button>
                </div>
              </div>
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleExportReports}
            disabled={isExporting || isLoading}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg text-gray-600">Loading reports data...</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {financialReport?.financialSummary.totalExpense.toLocaleString() || "0"} TSH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    "Last 30 days"
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Income</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {financialReport?.financialSummary.totalIncome.toLocaleString() || "0"} TSH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    "Last 30 days"
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Net Profit</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {financialReport?.financialSummary.profit.toLocaleString() || "0"} TSH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    "Last 30 days"
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!isLoading && (
        <Tabs defaultValue="financial">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
            <TabsTrigger value="production">Production Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="financial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Where your money is going</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
                    <div className="text-center space-y-4">
                      <div className="flex justify-between px-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Feed</span>
                          </div>
                          <p className="font-medium">
                            {financialReport?.financialSummary.expenseBreakdown.feed.toLocaleString() || "0"} TSH 
                            ({financialReport ? 
                              Math.round((financialReport.financialSummary.expenseBreakdown.feed / financialReport.financialSummary.totalExpense) * 100) 
                              : 0}%)
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Medicine</span>
                          </div>
                          <p className="font-medium">
                            {financialReport?.financialSummary.expenseBreakdown.medicine.toLocaleString() || "0"} TSH 
                            ({financialReport ? 
                              Math.round((financialReport.financialSummary.expenseBreakdown.medicine / financialReport.financialSummary.totalExpense) * 100) 
                              : 0}%)
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">A pie chart will be rendered here with actual data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>
                    {dateRange?.from && dateRange?.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      "Last 30 days"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Total Records</p>
                        <p className="font-bold text-xl">{financialReport?.recordCounts.total || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Feed Records</p>
                        <p className="font-bold text-xl">{financialReport?.recordCounts.feed || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Medicine Records</p>
                        <p className="font-bold text-xl">{financialReport?.recordCounts.medicine || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Profit Margin</p>
                        <p className="font-bold text-xl">
                          {financialReport ? 
                            Math.round((financialReport.financialSummary.profit / financialReport.financialSummary.totalIncome) * 100) 
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="production">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Egg Production</CardTitle>
                  <CardDescription>Daily collection over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
                      <p className="text-gray-500">A line chart will be rendered here with daily egg production data</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Total Eggs Produced</p>
                        <p className="font-bold text-xl">{productionReport?.productionSummary.eggsProduced || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">Eggs Sold</p>
                        <p className="font-bold text-xl">{productionReport?.productionSummary.eggsSold || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Poultry Health</CardTitle>
                  <CardDescription>Mortality and health trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
                      <p className="text-gray-500">A chart will be rendered here with mortality rate data</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-md text-center">
                      <p className="text-sm text-gray-600">Current Mortality Rate</p>
                      <p className="font-bold text-xl">{productionReport?.productionSummary.mortality || 0}%</p>
                      <p className="text-xs text-gray-500 mt-2">Industry average: 2-3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Reports;
