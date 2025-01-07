import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryPanel } from "@/components/CategoryPanel";
import { PostCard, Post } from "@/components/PostCard";

// Move this to a separate file later if needed
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
            title: "Delicious Mediterranean Cuisine",
            excerpt: "Explore the flavors of the Mediterranean with these authentic recipes.",
            categoryId: "food",
            date: "2024-02-20",
            author: "Chef Maria",
            imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
          },
          {
            id: "2",
            title: "Meet Luna: The Playful Kitten",
            excerpt: "A heartwarming story about a rescued kitten finding her forever home.",
            categoryId: "pets",
            date: "2024-02-19",
            author: "Pet Lover Sarah",
            imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
          },
          {
            id: "3",
            title: "Dragons of Komodo Island",
            excerpt: "A fascinating look at these ancient reptiles in their natural habitat.",
            categoryId: "wildlife",
            date: "2024-02-18",
            author: "Wildlife Explorer John",
            imageUrl: "https://images.unsplash.com/photo-1487252665478-49b61b47f302"
          },
          {
            id: "4",
            title: "Desert Wanderers: Life of Camels",
            excerpt: "Discover how these magnificent creatures survive in harsh desert conditions.",
            categoryId: "wildlife",
            date: "2024-02-17",
            author: "Desert Guide Ahmed",
            imageUrl: "https://images.unsplash.com/photo-1469041797191-50ace28483c3"
          },
          {
            id: "5",
            title: "Monkey Business",
            excerpt: "A day in the life of playful primates in their natural habitat.",
            categoryId: "wildlife",
            date: "2024-02-16",
            author: "Nature Photographer Lisa",
            imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838"
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