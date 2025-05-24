
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  // This would be real data from the API in a real application
  const mockData = {
    expenses: 12450,
    income: 18200,
    profit: 5750,
    eggsProduced: 24500,
    eggsSold: 23800,
    mortality: 1.8,
    feedExpense: 8600,
    medicineExpense: 1200,
    laborExpense: 2650,
  };

  const [dateRange, setDateRange] = useState("last30days");

  const handleExportReports = () => {
    toast({
      title: "Export initiated",
      description: "Your report is being prepared for download.",
    });
    // In a real application with DB connection:
    // 1. Make API call to generate report
    // 2. Download the generated file
    console.log("Exporting reports with data:", mockData);
  };

  const handleChangePeriod = () => {
    toast({
      title: "Period selection",
      description: "Date range selection will be implemented with database connection",
    });
    // In a real application with DB connection:
    // 1. Open date range picker
    // 2. Update data based on selected range
    console.log("Changing report period");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">Financial and farm performance insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={handleChangePeriod}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Change Period
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleExportReports}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold">${mockData.expenses}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl font-bold">${mockData.income}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className="text-2xl font-bold">${mockData.profit}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>
      </div>

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
                        <p className="font-medium">${mockData.feedExpense} (69.1%)</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm">Medicine</span>
                        </div>
                        <p className="font-medium">${mockData.medicineExpense} (9.6%)</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm">Labor</span>
                        </div>
                        <p className="font-medium">${mockData.laborExpense} (21.3%)</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">A pie chart will be rendered here with actual data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Profit Trend</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
                  <p className="text-gray-500">A bar chart will be rendered here with monthly data</p>
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
                      <p className="font-bold text-xl">{mockData.eggsProduced}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">Eggs Sold</p>
                      <p className="font-bold text-xl">{mockData.eggsSold}</p>
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
                    <p className="font-bold text-xl">{mockData.mortality}%</p>
                    <p className="text-xs text-gray-500 mt-2">Industry average: 2-3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
