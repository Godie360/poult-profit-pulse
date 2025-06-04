
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchemaStep1 = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const registerSchemaStep2 = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.string().min(1, "Access type is required"),
  vetCode: z.string().optional(),
  workerCode: z.string().optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
    // Temporarily removed regex validation for testing
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
    //   "Password must contain at least one uppercase letter, one lowercase letter, and one number, and can only contain letters and numbers"),
  confirmPassword: z.string(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
.refine(
  data => !(data.role === "worker" && (!data.workerCode || data.workerCode.trim() === "")), {
    message: "Worker access code is required for worker access",
    path: ["workerCode"],
  }
)
.refine(
  data => !(data.role === "vet" && (!data.vetCode || data.vetCode.trim() === "")), {
    message: "Veterinarian access code is required for veterinarian access",
    path: ["vetCode"],
  }
);

type RegisterFormStep1 = z.infer<typeof registerSchemaStep1>;
type RegisterFormStep2 = z.infer<typeof registerSchemaStep2>;

const Register = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<RegisterFormStep1 | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      role: "",
      vetCode: "",
      workerCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitStep1 = (data: RegisterFormStep1) => {
    setStep1Data(data);
    setStep(2);

    // Pre-fill username with email prefix
    const emailPrefix = data.email.split('@')[0];
    step2Form.setValue("username", emailPrefix);
  };

  const onSubmitStep2 = async (data: RegisterFormStep2) => {
    if (!step1Data) return;

    console.log("Form data:", { ...step1Data, ...data });

    setIsSubmitting(true);

    try {
      // Combine data from both steps and remove confirmPassword field
      const { confirmPassword, ...dataWithoutConfirmPassword } = data;

      // Set isWorker and isVet flags based on role
      const isWorker = data.role === "worker";
      const isVet = data.role === "vet";

      const fullData = {
        ...step1Data,
        ...dataWithoutConfirmPassword,
        // Always set role to "farmer" as per new backend design
        role: "farmer",
        // Add worker/vet flags if applicable
        isWorker,
        isVet
      };

      console.log("Submitting registration data:", fullData);

      // Make API call to register user
      const response = await authService.register(fullData);

      console.log("Registration response:", response);

      // Reset both forms
      step1Form.reset({
        fullName: "",
        email: "",
        phone: "",
      });

      step2Form.reset({
        username: "",
        role: "",
        vetCode: "",
        workerCode: "",
        password: "",
        confirmPassword: "",
      });

      // Reset step1Data
      setStep1Data(null);

      // Show success message
      toast({
        title: "Registration successful!",
        description: `Welcome to DG Poultry! You've been registered as a ${isWorker ? 'worker' : isVet ? 'veterinarian' : 'farm owner'}.`,
      });

      // Redirect based on role
      if (response.user.isWorker) {
        navigate("/worker");
      } else if (response.user.isVet) {
        navigate("/vet");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Show error message
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration. Please try again.",
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
            <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">Create an Account</h1>

            <div className="mb-6 text-sm text-gray-600 text-center">
              <p>Register as a farm owner, poultry worker, or veterinarian.</p>
              <p className="text-xs mt-1">Workers and veterinarians need an access code from a farm owner.</p>
            </div>

            {/* Progress bar */}
            <div className="relative mb-8">
              <div className="h-1 w-full bg-green-100 rounded-full">
                <div 
                  className="h-1 bg-green-600 rounded-full transition-all" 
                  style={{ width: step === 1 ? "50%" : "100%" }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-green-800">
                <span className={step === 1 ? "font-medium" : ""}>Personal Details</span>
                <span className={step === 2 ? "font-medium" : ""}>Account Setup</span>
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
                          <Input placeholder="Gabby Dee" {...field} />
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
                          <Input type="email" placeholder="gabby@example.com" {...field} />
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
                          <Input type="tel" placeholder="+255 689 737 689" {...field} />
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
                <form 
                  key={`step2-form-${Date.now()}`} 
                  onSubmit={(e) => {
                    console.log("Form submitted");
                    // Validate all fields before submission
                    step2Form.trigger().then(isValid => {
                      if (isValid) {
                        step2Form.handleSubmit(onSubmitStep2)(e);
                      } else {
                        console.log("Form validation failed");
                        // Show toast for validation errors
                        toast({
                          title: "Validation Error",
                          description: "Please check the form for errors",
                          variant: "destructive",
                        });
                      }
                    });
                  }} 
                  className="space-y-4" 
                  autoComplete="off">
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Type</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Trigger validation after value change
                            step2Form.trigger("role");
                          }} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your access type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="farmer">Farm Owner (Full Access)</SelectItem>
                            <SelectItem value="worker">Poultry Worker (Limited Access)</SelectItem>
                            <SelectItem value="vet">Veterinarian (Limited Access)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Select "Farm Owner" if you own the farm. Select "Poultry Worker" or "Veterinarian" if you were invited by a farm owner.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Conditional fields based on access type */}
                  {step2Form.watch("role") === "worker" && (
                    <FormField
                      control={step2Form.control}
                      name="workerCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Worker Access Code <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter the code provided by your farm owner" 
                              {...field} 
                              required 
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            This code is required and must be provided by a farm owner who has registered you as a worker.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {step2Form.watch("role") === "vet" && (
                    <FormField
                      control={step2Form.control}
                      name="vetCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veterinarian Access Code <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter the code provided by your farm owner" 
                              {...field} 
                              required 
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            This code is required and must be provided by a farm owner who has registered you as a veterinarian.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              onBlur={() => {
                                // Trigger validation for both password fields when focus leaves the field
                                step2Form.trigger("password");
                                if (step2Form.getValues("confirmPassword")) {
                                  step2Form.trigger("confirmPassword");
                                }
                              }}
                              autoComplete="new-password"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
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
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              onBlur={() => {
                                // Trigger validation for confirm password field when focus leaves the field
                                step2Form.trigger("confirmPassword");
                              }}
                              autoComplete="new-password"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
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
                      onClick={() => {
                        // Reset form fields before going back to step 1 
                        step2Form.reset({
                          username: step2Form.getValues("username"),
                          role: "",
                          vetCode: "",
                          workerCode: "",
                          password: "",
                          confirmPassword: ""
                        });
                        setStep(1);
                      }}
                      className="border-green-600 text-green-700 hover:bg-green-50"
                      disabled={isSubmitting}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
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
