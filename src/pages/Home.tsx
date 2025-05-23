
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('dgpoultry_user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "Poultry Worker") {
        navigate("/worker");
      } else if (userRole === "Veterinarian") {
        navigate("/vet");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    if (isLoggedIn) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "Poultry Worker") {
        navigate("/worker");
      } else if (userRole === "Veterinarian") {
        navigate("/vet");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dgpoultry_user');
    setIsLoggedIn(false);
    setUserRole("");
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="lg" />
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleGetStarted()}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Link to="/register">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Empowering Poultry Farmers With Smart Financial Insights
            </h1>
            <p className="text-lg text-gray-600">
              Track your costs, monitor production, and boost profits with our comprehensive poultry management system.
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 px-6 py-2 text-lg"
                onClick={handleGetStarted}
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
              </Button>
              {!isLoggedIn && (
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50 px-6 py-2 text-lg"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
              <div className="flex justify-center mb-6">
                <Logo size="lg" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-800">Streamlined Record Keeping</h3>
                  <p className="text-gray-600">Easily record and track all your poultry farm activities</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-800">Financial Insights</h3>
                  <p className="text-gray-600">Get clear reports on expenses, income, and profitability</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-800">Multi-User System</h3>
                  <p className="text-gray-600">Different roles for farmers, workers, and veterinarians</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Trusted by Poultry Farmers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "DG Poultry has transformed how I manage my farm, increasing profits by 25%.",
                name: "Grace M.",
                role: "Layer Farm Owner"
              },
              {
                quote: "The reports help me make informed decisions about feed purchases and health management.",
                name: "David K.",
                role: "Broiler Farmer"
              },
              {
                quote: "As a veterinarian, I can easily track treatments and monitor flock health trends.",
                name: "Dr. Sarah J.",
                role: "Poultry Veterinarian"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-green-700">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600">
                © 2025 DG Poultry. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
