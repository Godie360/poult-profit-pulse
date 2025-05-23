
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="lg" />
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
                Empowering Poultry Farmers With Smart Financial Insights
              </h1>
              <p className="text-lg text-gray-700">
                Track costs, optimize resources, and boost profits with DG Poultry's 
                comprehensive farm management system. Make data-driven decisions for your farm.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                <img 
                  src="/lovable-uploads/3767062a-b994-4e6d-b932-eab2d9b334b3.png" 
                  alt="DG Poultry Logo" 
                  className="absolute inset-0 m-auto w-3/4 h-3/4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Why Choose DG Poultry Management System?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Track All Expenses</h3>
              <p className="text-gray-700">Monitor costs for feed, medicine, equipment, and labor in one central location.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Clear Financial Insights</h3>
              <p className="text-gray-700">Make data-driven decisions with comprehensive reports and visual analytics.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Team Collaboration</h3>
              <p className="text-gray-700">Multiple user roles for farmers, workers, and veterinarians to coordinate effectively.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-12">What Our Users Say</h2>
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic text-lg mb-4">
              "DG Poultry management system has transformed how I run my farm. I can now track all expenses, 
              monitor production, and make informed decisions that have increased my profits by 30%."
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-full"></div>
              <div>
                <p className="font-semibold text-green-800">John Mbeki</p>
                <p className="text-sm text-gray-600">Poultry Farmer, Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo textClassName="text-white" />
            <div className="text-center md:text-right">
              <p>© 2025 DG Poultry. All rights reserved.</p>
              <p className="text-green-200">Empowering farmers with smart technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
