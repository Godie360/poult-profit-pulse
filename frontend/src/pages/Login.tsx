
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
import { Logo } from "@/components/ui/logo";
import { authService } from "@/api";

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);

    try {
      // Call the authService login method
      const response = await authService.login(data);

      // Determine redirect path based on user role
      let redirectPath = "/dashboard";
      const role = response.user.role;

      if (role === 'worker') {
        redirectPath = "/worker";
      } else if (role === 'vet') {
        redirectPath = "/vet";
      }

      // Show success message
      toast({
        title: "Login successful!",
        description: `Welcome back to DG Poultry, ${response.user.fullName}.`,
      });

      // Redirect to dashboard based on role
      navigate(redirectPath);
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);

      // Show error message
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Login to Your Account</h1>

            <div className="mb-6 flex justify-center">
              <div className="bg-green-50 p-3 rounded-full">
                <Logo size="lg" withText={false} />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="emailOrUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="john@example.com or johnsmith" {...field} />
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-600 font-medium hover:underline">
                Register Now
              </Link>
            </div>

            {/* Demo accounts for testing */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500 mb-2">Demo Accounts</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs py-1 h-auto"
                  onClick={() => {
                    form.setValue("emailOrUsername", "farmer@example.com");
                    form.setValue("password", "password123");
                  }}
                >
                  Farmer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs py-1 h-auto"
                  onClick={() => {
                    form.setValue("emailOrUsername", "worker@example.com");
                    form.setValue("password", "password123");
                  }}
                >
                  Worker
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs py-1 h-auto"
                  onClick={() => {
                    form.setValue("emailOrUsername", "vet@example.com");
                    form.setValue("password", "password123");
                  }}
                >
                  Veterinarian
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <Link to="/" className="text-green-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
