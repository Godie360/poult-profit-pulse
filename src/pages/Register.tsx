
import { useState } from "react";
import { Link } from "react-router-dom";
import { Egg, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const registerSchemaStep1 = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const registerSchemaStep2 = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormStep1 = z.infer<typeof registerSchemaStep1>;
type RegisterFormStep2 = z.infer<typeof registerSchemaStep2>;

const Register = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<RegisterFormStep1 | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const step1Form = useForm<RegisterFormStep1>({
    resolver: zodResolver(registerSchemaStep1),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const step2Form = useForm<RegisterFormStep2>({
    resolver: zodResolver(registerSchemaStep2),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitStep1 = (data: RegisterFormStep1) => {
    setStep1Data(data);
    setStep(2);
  };

  const onSubmitStep2 = (data: RegisterFormStep2) => {
    if (!step1Data) return;

    // Combine data from both steps
    const fullData = {
      ...step1Data,
      ...data
    };

    // In a real application, we would send this data to the server
    console.log("Registration data:", fullData);
    
    // Show success message
    toast({
      title: "Registration successful!",
      description: "You can now log in with your new account.",
    });
    
    // Redirect to login (in a real application)
    // navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <Egg className="h-6 w-6 text-green-600" />
            <span className="font-bold text-green-800">DG Poultry</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Create an Account</h1>

            {/* Progress bar */}
            <div className="relative mb-8">
              <div className="h-1 w-full bg-green-100 rounded-full">
                <div 
                  className="h-1 bg-green-600 rounded-full transition-all" 
                  style={{ width: step === 1 ? "50%" : "100%" }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-green-800">
                <span className="font-medium">Personal Details</span>
                <span className={step === 2 ? "font-medium" : "text-green-500"}>Account Setup</span>
              </div>
            </div>

            {step === 1 ? (
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-4">
                  <FormField
                    control={step1Form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-4">
                  <FormField
                    control={step2Form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johnsmith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step2Form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="********" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step2Form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="********" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="border-green-600 text-green-700 hover:bg-green-50"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Register
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
