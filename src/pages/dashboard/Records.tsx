
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Filter, ArrowDownUp } from "lucide-react";

const Records = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feed & Medicine</h1>
          <p className="text-gray-600">Track all your feed and medicine expenses</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feed">Feed Records</TabsTrigger>
          <TabsTrigger value="medicine">Medicine Records</TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Feed Purchase History</CardTitle>
                <Button variant="outline" size="sm">
                  <ArrowDownUp className="mr-2 h-3 w-3" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Feed Type</th>
                      <th className="pb-2 font-medium">Quantity (kg)</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "2025-05-20", type: "Layer Feed", quantity: 500, price: 450, supplier: "FarmSupply Co." },
                      { date: "2025-05-13", type: "Chick Starter", quantity: 250, price: 275, supplier: "Agro Feeds Ltd." },
                      { date: "2025-05-05", type: "Layer Feed", quantity: 600, price: 540, supplier: "FarmSupply Co." },
                      { date: "2025-04-28", type: "Grower Feed", quantity: 400, price: 380, supplier: "Green Farms" },
                      { date: "2025-04-20", type: "Layer Feed", quantity: 500, price: 450, supplier: "FarmSupply Co." },
                    ].map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.type}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.price}</td>
                        <td className="py-3">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medicine">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Medicine Purchase History</CardTitle>
                <Button variant="outline" size="sm">
                  <ArrowDownUp className="mr-2 h-3 w-3" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Medicine</th>
                      <th className="pb-2 font-medium">Quantity</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "2025-05-18", medicine: "Antibiotics", quantity: "20 bottles", price: 160, supplier: "VetMed Supply" },
                      { date: "2025-05-10", medicine: "Vitamins", quantity: "15 packets", price: 90, supplier: "FarmCare" },
                      { date: "2025-05-02", medicine: "Vaccines", quantity: "50 doses", price: 250, supplier: "VetMed Supply" },
                      { date: "2025-04-25", medicine: "Dewormer", quantity: "10 bottles", price: 120, supplier: "Agro Health" },
                      { date: "2025-04-15", medicine: "Antibiotics", quantity: "15 bottles", price: 120, supplier: "VetMed Supply" },
                    ].map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.medicine}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.price}</td>
                        <td className="py-3">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Records;
