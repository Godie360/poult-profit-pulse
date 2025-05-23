
import { Link } from "react-router-dom";
import { Egg, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-6 shadow-md">
            <Egg className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="bg-green-600 hover:bg-green-700">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
