import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
        >
          Post your day
        </h1>
        <Button 
          onClick={() => navigate("/login")}
          variant="outline"
          className="hover:bg-primary hover:text-white transition-colors"
        >
          Login
        </Button>
      </div>
    </header>
  );
};