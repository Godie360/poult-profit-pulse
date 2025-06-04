import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clipboard, Copy, Users, UserPlus, Stethoscope, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { usersService, User, AccessCode } from "@/api";

// Schema for generating access code form
const generateCodeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["worker", "vet"], {
    required_error: "Please select a team member type",
  }),
});

type GenerateCodeFormValues = z.infer<typeof generateCodeSchema>;

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form for generating access codes
  const form = useForm<GenerateCodeFormValues>({
    resolver: zodResolver(generateCodeSchema),
    defaultValues: {
      name: "",
      type: "worker",
    },
  });

  // Fetch team members and access codes on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [users, codes] = await Promise.all([
          usersService.getAllUsers(),
          usersService.getAccessCodes(),
        ]);

        // Filter out non-worker and non-vet users (i.e., only show team members)
        const teamMembers = users.filter(user => user.isWorker || user.isVet);
        setTeamMembers(teamMembers);
        setAccessCodes(codes);
      } catch (error) {
        console.error("Error fetching team data:", error);
        toast({
          title: "Error",
          description: "Failed to load team data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission for generating access code
  const onSubmit = async (data: GenerateCodeFormValues) => {
    setIsGeneratingCode(true);
    try {
      const request = {
        name: data.name,
        isWorker: data.type === "worker",
        isVet: data.type === "vet",
      };

      const newCode = await usersService.generateCode(request);

      // Add the new code to the list
      setAccessCodes(prev => [newCode, ...prev]);

      // Reset the form
      form.reset();

      toast({
        title: "Access Code Generated",
        description: `Successfully generated a ${data.type} access code for ${data.name}.`,
      });
    } catch (error) {
      console.error("Error generating access code:", error);
      toast({
        title: "Error",
        description: "Failed to generate access code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Copy access code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Copied to Clipboard",
      description: "Access code has been copied to clipboard.",
    });

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your farm's team members and generate access codes for new workers and veterinarians.
        </p>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team Members</span>
          </TabsTrigger>
          <TabsTrigger value="codes" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            <span>Access Codes</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Generate Code</span>
          </TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
              <CardDescription>
                View all workers and veterinarians registered under your farm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading team members...</div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No team members found. Generate access codes and invite workers or veterinarians to join your farm.
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {member.isWorker ? (
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="bg-green-100 p-2 rounded-full">
                            <Stethoscope className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{member.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.email} • {member.isWorker ? "Worker" : "Veterinarian"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Codes Tab */}
        <TabsContent value="codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Codes</CardTitle>
              <CardDescription>
                View and manage access codes for your team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading access codes...</div>
              ) : accessCodes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No access codes found. Generate new codes to invite team members.
                </div>
              ) : (
                <div className="space-y-4">
                  {accessCodes.map((code) => (
                    <div
                      key={code.code}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {code.type === "worker" ? (
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="bg-green-100 p-2 rounded-full">
                            <Stethoscope className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{code.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {code.type === "worker" ? "Worker" : "Veterinarian"} • 
                            {code.used ? " Used" : " Available until"} {new Date(code.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono bg-gray-100 px-3 py-1 rounded">
                          {code.code}
                        </div>
                        {!code.used && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            {copiedCode === code.code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Code Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Access Code</CardTitle>
              <CardDescription>
                Create a new access code for a worker or veterinarian to join your farm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Member Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the name of the person who will use this access code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Team Member Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="worker" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Poultry Worker
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="vet" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Veterinarian
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Select the type of team member you want to add to your farm.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isGeneratingCode}>
                    {isGeneratingCode ? "Generating..." : "Generate Access Code"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
