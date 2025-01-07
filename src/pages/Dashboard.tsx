import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import { useState } from "react";
import { PostCard, Post } from "@/components/PostCard";
import { PostForm } from "@/components/PostForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../pages/Index";

const Dashboard = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>("posts", []);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSavePost = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } else {
      setPosts([...posts, { ...post, id: Date.now().toString() }]);
      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      });
    }
    setEditingPost(null);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Your Posts</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                New Post
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingPost ? "Edit Post" : "Create New Post"}</SheetTitle>
              </SheetHeader>
              <PostForm onSave={handleSavePost} initialPost={editingPost} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <div className="absolute top-4 right-4 space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Create your first post!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;