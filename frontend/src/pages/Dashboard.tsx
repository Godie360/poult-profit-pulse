
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Info, Plus, ChevronRight } from "lucide-react";

const dailyData = [
  { name: 'May 16', eggs: 250, sales: 125, expenses: 80 },
  { name: 'May 17', eggs: 240, sales: 130, expenses: 75 },
  { name: 'May 18', eggs: 260, sales: 135, expenses: 90 },
  { name: 'May 19', eggs: 255, sales: 140, expenses: 85 },
  { name: 'May 20', eggs: 270, sales: 160, expenses: 95 },
  { name: 'May 21', eggs: 265, sales: 155, expenses: 90 },
  { name: 'May 22', eggs: 280, sales: 180, expenses: 100 },
];

const weeklyData = [
  { name: 'Week 19', eggs: 1650, sales: 850, expenses: 550 },
  { name: 'Week 20', eggs: 1750, sales: 950, expenses: 600 },
  { name: 'Week 21', eggs: 1830, sales: 980, expenses: 580 },
  { name: 'Week 22', eggs: 1900, sales: 1050, expenses: 620 },
];

const monthlyData = [
  { name: 'Jan', eggs: 7200, sales: 3600, expenses: 2400 },
  { name: 'Feb', eggs: 6800, sales: 3400, expenses: 2200 },
  { name: 'Mar', eggs: 7500, sales: 3800, expenses: 2500 },
  { name: 'Apr', eggs: 7900, sales: 4100, expenses: 2600 },
  { name: 'May', eggs: 8200, sales: 4300, expenses: 2700 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back to DG Poultry</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">120,400 Tsh</div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">12%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">70,000 Tsh</div>
              <div className="flex items-center text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">5%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Egg Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">8,240</div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">8%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total eggs this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mortality Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">1.2%</div>
              <div className="flex items-center text-green-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">0.4%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lower is better</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Farm Performance</CardTitle>
            <Tabs defaultValue="daily">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="eggs" stroke="#4ade80" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sales" stroke="#16a34a" />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pens Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pens Summary</CardTitle>
            <Link to="/dashboard/pens">
              <Button variant="outline" size="sm" className="text-xs">
                View All Pens
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((pen) => (
                <div key={pen} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium">Pen #{pen}</div>
                    <div className="text-sm text-gray-500">{200 + (pen * 50)} birds</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{160 + (pen * 30)} eggs/day</div>
                    <div className="text-sm text-gray-500">{10 + pen} weeks old</div>
                  </div>
                  <div>
                    <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
                  </div>
                </div>
              ))}
              <Link to="/dashboard/pens" className="flex items-center text-green-600 text-sm hover:underline">
                <span>View all 5 pens</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link to="/dashboard/records">
              <Button variant="outline" size="sm" className="text-xs">
                View All Records
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2025-05-22", type: "Feed", amount: 450, description: "Layer Feed (500kg)" },
                { date: "2025-05-20", type: "Medicine", amount: 120, description: "Antibiotics (20 bottles)" },
                { date: "2025-05-18", type: "Feed", amount: 275, description: "Chick Starter (250kg)" },
              ].map((expense, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium">{expense.type}</div>
                    <div className="text-sm text-gray-500">{expense.description}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{expense.amount} Tsh</div>
                    <div className="text-xs text-gray-500">{expense.date}</div>
                  </div>
                </div>
              ))}
              <Link to="/dashboard/records" className="flex items-center text-green-600 text-sm hover:underline">
                <span>View all expenses</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
