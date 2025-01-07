import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { PostCard, Post } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSearch } from "@/hooks/useSearch";

const Dashboard = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>("posts", []);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { searchQuery, handleSearch, filteredPosts } = useSearch(posts);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const handleSave = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
      setEditingPost(null);
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } else {
      setPosts([...posts, post]);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
    toast({
      title: "Success",
      description: "Post deleted successfully",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Your Posts</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <PostForm onSave={handleSave} initialPost={editingPost} />
          </div>
          <div className="md:col-span-2">
            <div className="grid gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="relative">
                    <PostCard post={post} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchQuery 
                      ? "No posts found matching your search."
                      : "No posts available. Create your first post!"}
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

export default Dashboard;