import { useState, useEffect } from "react";
import { Stethoscope, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { usersService, User } from "@/api";

const VetList = () => {
  const [vets, setVets] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vets on component mount
  useEffect(() => {
    const fetchVets = async () => {
      setIsLoading(true);
      try {
        const users = await usersService.getAllUsers();
        
        // Filter out only vet users
        const vetUsers = users.filter(user => user.isVet);
        setVets(vetUsers);
      } catch (error) {
        console.error("Error fetching vet data:", error);
        toast({
          title: "Error",
          description: "Failed to load veterinarian data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVets();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Veterinarians</h1>
        <p className="text-muted-foreground">
          View all veterinarians registered with your farm.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Veterinarians</CardTitle>
          <CardDescription>
            Contact information for veterinarians who can help with poultry health issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : vets.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No veterinarians found. The farm owner needs to invite veterinarians to join.
            </div>
          ) : (
            <div className="space-y-4">
              {vets.map((vet) => (
                <div
                  key={vet._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{vet.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {vet.email} • {vet.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Date(vet.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VetList;