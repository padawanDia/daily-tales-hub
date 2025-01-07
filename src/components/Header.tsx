import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthError } from "@supabase/supabase-js";

export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error:", error);
    let errorMessage = "An error occurred during authentication";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("weak_password")) {
      errorMessage = "Password should be at least 6 characters long.";
    } else if (error.message.includes("email_provider_disabled")) {
      errorMessage = "Email authentication is currently disabled. Please contact support.";
    } else if (error.message.includes("invalid_credentials")) {
      errorMessage = "Invalid email or password combination. Please check your credentials.";
    }

    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        handleAuthError(error);
        return;
      }
      console.log("Initial session:", session);
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      console.log("New session state:", session);
      
      setSession(session);
      if (session) {
        setOpen(false);
        toast({
          title: "Login successful!",
          description: "Welcome back to Post your day",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      } else if (event === 'USER_UPDATED' && !session) {
        handleAuthError(new Error("Invalid login credentials") as AuthError);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
        >
          Post your day
        </h1>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Hey!</span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="hover:bg-primary hover:text-white transition-colors"
              >
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Welcome Back</DialogTitle>
              </DialogHeader>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="light"
                providers={[]}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
};