import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryPanel } from "@/components/CategoryPanel";
import { PostCard, Post } from "@/components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "@/components/PostForm";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("Current session:", session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: async () => {
      console.log('Fetching posts with category:', selectedCategory);
      let query = supabase.from('posts').select('*');
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      // Map the Supabase data to match our Post interface
      const mappedPosts: Post[] = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        categoryId: post.category_id,
        date: new Date(post.created_at).toLocaleDateString(),
        author: post.author,
        imageUrl: post.image_url || ''
      }));
      
      console.log('Mapped posts:', mappedPosts);
      return mappedPosts;
    },
  });

  const handleSavePost = async (post: Post) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please login to create posts",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      console.log("Creating post with author:", session.user.id);
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: post.title,
            excerpt: post.excerpt,
            category_id: post.categoryId,
            image_url: post.imageUrl,
            author: session.user.id, // Explicitly set the author ID from the session
          }
        ]);

      if (error) {
        console.error('Error saving post:', error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your post has been created",
      });

      // Refetch posts to update the list
      refetch();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <CategoryPanel
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            {session && (
              <div className="mt-6">
                <PostForm onSave={handleSavePost} initialPost={null} />
              </div>
            )}
          </div>
          <div className="md:col-span-3">
            <div className="grid gap-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading posts. Please try again later.</p>
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {selectedCategory 
                      ? "No posts found in this category."
                      : "No posts available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;