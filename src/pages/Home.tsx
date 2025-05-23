
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Egg, TrendingUp, LineChart, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm md:px-10">
        <div className="flex items-center gap-2">
          <Egg className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold text-green-800">DG Poultry</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-green-800 hover:text-green-600">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              Register
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 md:px-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-4">
              Empowering Poultry Farmers With Smart Financial Insights
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Track costs, monitor production, and boost profits with our comprehensive poultry farm management solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-600 text-green-700 hover:bg-green-50 w-full sm:w-auto"
                >
                  Login to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-green-50 py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-12">
            Everything You Need to Manage Your Poultry Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Egg className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Track Production</h3>
              <p className="text-gray-600">
                Monitor egg production and poultry health with easy-to-use daily logs for your team.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Manage Expenses</h3>
              <p className="text-gray-600">
                Record and track feed, medicine, and other costs to keep your farm's finances under control.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Analyze Profits</h3>
              <p className="text-gray-600">
                Generate detailed reports showing income, expenses, and profits to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 md:px-10 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-8">
            Trusted by Poultry Farmers
          </h2>
          <blockquote className="text-xl italic text-gray-700 mb-6">
            "Since using DG Poultry, I've been able to reduce my feed costs by 15% and increase egg production by tracking daily performance. The reports helped me identify issues I never noticed before."
          </blockquote>
          <div className="font-medium text-green-800">
            Peter Kimani - Nairobi Poultry Farm
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <Egg className="h-6 w-6" />
              <span className="text-xl font-bold">DG Poultry</span>
            </div>
            <p className="max-w-xs text-green-100">
              Smart financial insights for better poultry farming decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-green-700 text-center text-green-100">
          <p>© {new Date().getFullYear()} DG Poultry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
