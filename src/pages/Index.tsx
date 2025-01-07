import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryPanel } from "@/components/CategoryPanel";
import { PostCard, Post } from "@/components/PostCard";

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      // Initialize with example posts if localStorage is empty
      if (key === "posts") {
        const examplePosts: Post[] = [
          {
            id: "1",
            title: "Journey Through the Amazon",
            excerpt: "Exploring the diverse wildlife and indigenous cultures of the Amazon rainforest.",
            categoryId: "3", // Travel category
            date: "2024-02-20",
            author: "Adventure Explorer",
            imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801"
          },
          {
            id: "2",
            title: "Modern Office Productivity",
            excerpt: "Tips and tricks for maintaining productivity in the modern workplace.",
            categoryId: "2", // Work category
            date: "2024-02-19",
            author: "Productivity Pro",
            imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"
          },
          {
            id: "3",
            title: "Healthy Living Guide",
            excerpt: "Essential tips for maintaining a healthy lifestyle in the modern world.",
            categoryId: "5", // Health category
            date: "2024-02-18",
            author: "Wellness Coach",
            imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352"
          },
          {
            id: "4",
            title: "My Pet Stories",
            excerpt: "Heartwarming stories about the special bond between humans and their pets.",
            categoryId: "1", // Personal category
            date: "2024-02-17",
            author: "Pet Lover",
            imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e"
          },
          {
            id: "5",
            title: "Culinary Adventures",
            excerpt: "Discovering unique flavors and cooking techniques from around the world.",
            categoryId: "4", // Food category
            date: "2024-02-16",
            author: "Food Explorer",
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          }
        ];
        window.localStorage.setItem(key, JSON.stringify(examplePosts));
        return examplePosts;
      }
      return initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [posts] = useLocalStorage<Post[]>("posts", []);

  console.log("Current posts:", posts);
  console.log("Selected category:", selectedCategory);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categoryId === selectedCategory)
    : posts;

  console.log("Filtered posts:", filteredPosts);

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
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {filteredPosts.length === 0 && (
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