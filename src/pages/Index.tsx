import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryPanel } from "@/components/CategoryPanel";
import { PostCard, Post } from "@/components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: posts, isLoading, error } = useQuery({
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
        categoryId: post.category_id, // Map category_id to categoryId
        date: new Date(post.created_at).toLocaleDateString(), // Format the date
        author: post.author,
        imageUrl: post.image_url || '' // Map image_url to imageUrl
      }));
      
      console.log('Mapped posts:', mappedPosts);
      return mappedPosts;
    },
  });

  console.log('Current posts:', posts);
  console.log('Selected category:', selectedCategory);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

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