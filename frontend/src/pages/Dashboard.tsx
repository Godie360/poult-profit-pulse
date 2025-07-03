
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Info, Plus, ChevronRight, Loader2, Activity, Egg } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { reportsService, pensService, recordsService, authService, dashboardService, DashboardSummary, Pen, Record, VetWorkerData, DailyLog } from "@/api";

// We'll replace these with real data from the API
const defaultDailyData = [
  { name: 'Day 1', eggs: 0, sales: 0, expenses: 0 },
  { name: 'Day 2', eggs: 0, sales: 0, expenses: 0 },
];

const defaultWeeklyData = [
  { name: 'Week 1', eggs: 0, sales: 0, expenses: 0 },
  { name: 'Week 2', eggs: 0, sales: 0, expenses: 0 },
];

const defaultMonthlyData = [
  { name: 'Month 1', eggs: 0, sales: 0, expenses: 0 },
  { name: 'Month 2', eggs: 0, sales: 0, expenses: 0 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [pens, setPens] = useState<Pen[]>([]);
  const [recentRecords, setRecentRecords] = useState<Record[]>([]);
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [userData, setUserData] = useState<any>(null);
  const [chartData, setChartData] = useState({
    daily: defaultDailyData,
    weekly: defaultWeeklyData,
    monthly: defaultMonthlyData,
  });

  // State for vet and worker data
  const [vetWorkerData, setVetWorkerData] = useState<VetWorkerData | null>(null);
  const [isLoadingVetWorkerData, setIsLoadingVetWorkerData] = useState(true);

  // Get user data
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserData(currentUser);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch dashboard summary
        const summary = await reportsService.getDashboardSummary();
        setDashboardData(summary);

        // Fetch pens
        const pensData = await pensService.getAllPens();
        setPens(pensData.slice(0, 3)); // Get first 3 pens for the dashboard

        // Fetch recent records
        const recordsData = await recordsService.getAllRecords();
        setRecentRecords(recordsData.slice(0, 3)); // Get first 3 records for the dashboard

        // In a real application, we would also fetch chart data for different periods
        // For now, we'll use the mock data

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch vet and worker data
  useEffect(() => {
    const fetchVetWorkerData = async () => {
      try {
        setIsLoadingVetWorkerData(true);

        // Fetch vet and worker data
        const data = await dashboardService.getVetWorkerData();
        setVetWorkerData(data);

        setIsLoadingVetWorkerData(false);
      } catch (error) {
        console.error('Error fetching vet and worker data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vet and worker data. Please try again.',
          variant: 'destructive',
        });
        setIsLoadingVetWorkerData(false);
      }
    };

    fetchVetWorkerData();
  }, []);

  // Handle Add Record button click
  const handleAddRecord = () => {
    navigate('/dashboard/records/add');
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.dashboard')}</h1>
          <p className="text-gray-600">
            {t('dashboard.welcome')}, {userData?.fullName || userData?.name || 'Farmer'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAddRecord}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.addRecord')}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeleton for stats
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          // Actual stats when data is loaded
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.totalRevenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {dashboardData?.financialSummary?.totalIncome?.toLocaleString() || 0} Tsh
                  </div>
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {Math.round(((dashboardData?.financialSummary?.totalIncome || 0) / 
                        (dashboardData?.financialSummary?.totalExpense || 1) - 1) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('dashboard.currentPeriod')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.totalExpenses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {dashboardData?.financialSummary?.totalExpense?.toLocaleString() || 0} Tsh
                  </div>
                  <div className="flex items-center text-red-600">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {Math.round(((dashboardData?.financialSummary?.feedExpense || 0) / 
                        (dashboardData?.financialSummary?.totalExpense || 1)) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('dashboard.feedMainExpense')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.eggProduction')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {dashboardData?.productionSummary?.eggsProduced?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {Math.round(((dashboardData?.productionSummary?.eggsProduced || 0) / 
                        (dashboardData?.productionSummary?.totalBirds || 1)) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('dashboard.totalEggs')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.mortalityRate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {dashboardData?.productionSummary?.mortality?.toFixed(1) || 0}%
                  </div>
                  <div className="flex items-center text-green-600">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {((dashboardData?.productionSummary?.mortality || 0) < 2) ? 'Good' : 'High'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('dashboard.lowerIsBetter')}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('dashboard.farmPerformance')}</CardTitle>
            <Tabs defaultValue="daily" onValueChange={setChartPeriod}>
              <TabsList>
                <TabsTrigger value="daily">{t('dashboard.daily')}</TabsTrigger>
                <TabsTrigger value="weekly">{t('dashboard.weekly')}</TabsTrigger>
                <TabsTrigger value="monthly">{t('dashboard.monthly')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading skeleton for chart
            <div className="h-[300px] bg-gray-100 animate-pulse rounded flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData[chartPeriod as keyof typeof chartData]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 25,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    label={{ 
                      value: 'Time Period', 
                      position: 'insideBottomRight', 
                      offset: -15 
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Amount (Tsh)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      const formattedName = name === 'eggs' ? 'Eggs (count)' : 
                                           name === 'sales' ? 'Sales (Tsh)' : 
                                           'Expenses (Tsh)';
                      return [`${value} ${name === 'eggs' ? '' : 'Tsh'}`, formattedName];
                    }}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend 
                    formatter={(value) => {
                      return value === 'eggs' ? 'Egg Production' : 
                             value === 'sales' ? 'Total Sales' : 
                             'Total Expenses';
                    }}
                    wrapperStyle={{ paddingTop: 10 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="eggs" 
                    name="eggs"
                    stroke="#4ade80" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    name="sales"
                    stroke="#16a34a" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="expenses"
                    stroke="#dc2626" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-gray-500 mt-2">
                {t('dashboard.chartDescription')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pens Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.pensSummary')}</CardTitle>
            <Link to="/dashboard/pens">
              <Button variant="outline" size="sm" className="text-xs">
                {t('dashboard.viewAllPens')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton for pens
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Actual pens when data is loaded
                <>
                  {pens.length > 0 ? (
                    pens.map((pen) => (
                      <div key={pen._id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">{pen.name}</div>
                          <div className="text-sm text-gray-500">{pen.birdCount} birds</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{pen.dailyEggAvg} eggs/day</div>
                          <div className="text-sm text-gray-500">{pen.age} weeks old</div>
                        </div>
                        <div>
                          <span className={`text-xs py-1 px-2 rounded ${
                            pen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pen.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No pens found</div>
                  )}
                  <Link to="/dashboard/pens" className="flex items-center text-green-600 text-sm hover:underline">
                    <span>{t('dashboard.viewAllPens')}</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.recentExpenses')}</CardTitle>
            <Link to="/dashboard/records">
              <Button variant="outline" size="sm" className="text-xs">
                {t('dashboard.viewAllRecords')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton for expenses
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Actual expenses when data is loaded
                <>
                  {recentRecords.length > 0 ? (
                    recentRecords.map((record) => (
                      <div key={record._id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">
                            {record.recordType === 'feed' ? 'Feed' : 'Medicine'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.recordType === 'feed' 
                              ? `${(record as any).feedType} (${(record as any).quantity}kg)` 
                              : `${(record as any).medicine} (${(record as any).quantity})`}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{record.price} Tsh</div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No records found</div>
                  )}
                  <Link to="/dashboard/records" className="flex items-center text-green-600 text-sm hover:underline">
                    <span>{t('dashboard.viewAllExpenses')}</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vet and Worker Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Vet Treatments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>{t('dashboard.recentTreatments')}</CardTitle>
            </div>
            <Link to="/vet">
              <Button variant="outline" size="sm" className="text-xs">
                {t('dashboard.viewVetDashboard')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingVetWorkerData ? (
                // Loading skeleton for treatments
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Actual treatments when data is loaded
                <>
                  {vetWorkerData?.treatments && vetWorkerData.treatments.length > 0 ? (
                    vetWorkerData.treatments.slice(0, 3).map((treatment) => (
                      <div key={treatment._id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">
                            {(treatment as any).medicine}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(treatment as any).quantity}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{treatment.price} Tsh</div>
                          <div className="text-xs text-gray-500">
                            {new Date(treatment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No treatments found</div>
                  )}
                  <Link to="/vet" className="flex items-center text-green-600 text-sm hover:underline">
                    <span>View all treatments</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Worker Daily Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Egg className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>Recent Daily Logs</CardTitle>
            </div>
            <Link to="/worker">
              <Button variant="outline" size="sm" className="text-xs">
                View Worker Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingVetWorkerData ? (
                // Loading skeleton for daily logs
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Actual daily logs when data is loaded
                <>
                  {vetWorkerData?.dailyLogs && vetWorkerData.dailyLogs.length > 0 ? (
                    vetWorkerData.dailyLogs.map((log) => (
                      <div key={log._id || log.date} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">
                            {log.penName || `Pen ${log.penId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.eggsCollected} eggs collected
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {log.poultryDeaths > 0 ? `${log.poultryDeaths} deaths` : 'No deaths'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No daily logs found</div>
                  )}
                  <Link to="/worker" className="flex items-center text-green-600 text-sm hover:underline">
                    <span>View all daily logs</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
