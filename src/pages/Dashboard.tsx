
import { 
  LineChart, 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Calendar, 
  Egg as EggIcon 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This is a placeholder dashboard - in a real application this would connect to API data
const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back to DG Poultry Farm Management</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            + Add Pen
          </Button>
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
            + Record Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center">
              $8,459
              <span className="ml-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +12.5%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Compared to last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center">
              $3,826
              <span className="ml-2 text-sm text-red-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" /> +8.2%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Compared to last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center">
              $4,633
              <span className="ml-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> +16.8%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Compared to last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Pens</CardDescription>
            <CardTitle className="text-2xl font-bold">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">4,523 total birds</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Egg Production</CardTitle>
                <CardDescription>Daily collection rates</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Last 7 Days
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
              <LineChart className="h-16 w-16 text-gray-300" />
              <span className="ml-2 text-gray-500">Chart will render here with real data</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Expenses Breakdown</CardTitle>
                <CardDescription>Feed, medicine, and other costs</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                This Month
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] flex items-center justify-center border rounded-md bg-gray-50">
              <BarChart className="h-16 w-16 text-gray-300" />
              <span className="ml-2 text-gray-500">Chart will render here with real data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest entries and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recent activities would be mapped from data in a real app */}
              <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                <div className="bg-green-100 p-2 rounded-full">
                  <EggIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">Egg Collection Recorded</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">365 eggs collected from Pen #3</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                <div className="bg-blue-100 p-2 rounded-full">
                  <PiggyBank className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">Feed Purchase</p>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600">500kg of layer feed purchased for $450</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">New Batch Added</p>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">250 layer chicks added to Pen #7</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <EggIcon className="mr-2 h-5 w-5" />
                Record Egg Collection
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <PiggyBank className="mr-2 h-5 w-5" />
                Log Feed Purchase
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <Calendar className="mr-2 h-5 w-5" />
                Add New Batch
              </Button>
              <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50 justify-start">
                <LineChart className="mr-2 h-5 w-5" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
