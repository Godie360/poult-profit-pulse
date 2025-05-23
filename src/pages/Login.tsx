
import { useState } from "react";
import { Link } from "react-router-dom";
import { Egg, Eye, EyeOff } from "lucide-react";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    // In a real application, we would send this data to the server
    console.log("Login data:", data);
    
    // Show success message
    toast({
      title: "Login successful!",
      description: "Welcome back to DG Poultry.",
    });
    
    // Redirect to dashboard (in a real application)
    // navigate("/dashboard");
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
            <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Login to Your Account</h1>
            
            <div className="mb-6 flex justify-center">
              <div className="bg-green-50 p-3 rounded-full">
                <Egg className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Login
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-600 font-medium hover:underline">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
