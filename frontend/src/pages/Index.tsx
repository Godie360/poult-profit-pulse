
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page
    navigate("/");
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Index;
