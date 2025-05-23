
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const Pens = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pens & Chicks</h1>
          <p className="text-gray-600">Manage your poultry pens and birds</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Pen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((pen) => (
          <Card key={pen} className="hover:bg-green-50 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Pen #{pen}</CardTitle>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Birds:</span>
                  <span className="font-medium">{200 + (pen * 50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="font-medium">Layers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age:</span>
                  <span className="font-medium">{10 + pen} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Daily Egg Avg:</span>
                  <span className="font-medium">{160 + (pen * 30)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Mortality Rate:</span>
                  <span className="font-medium">{(0.5 + (pen * 0.2)).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pens;
