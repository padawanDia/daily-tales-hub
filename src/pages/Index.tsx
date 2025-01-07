import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryPanel } from "@/components/CategoryPanel";
import { PostCard, Post } from "@/components/PostCard";

const samplePosts: Post[] = [
  {
    id: "1",
    title: "My Morning Routine",
    excerpt: "How I start my day with mindfulness and productivity...",
    categoryId: "1",
    date: "2024-02-20",
    author: "Alice Johnson"
  },
  {
    id: "2",
    title: "Remote Work Tips",
    excerpt: "Best practices for staying productive while working from home...",
    categoryId: "2",
    date: "2024-02-19",
    author: "Bob Smith"
  },
  {
    id: "3",
    title: "Weekend in Paris",
    excerpt: "Exploring the city of lights and discovering hidden gems...",
    categoryId: "3",
    date: "2024-02-18",
    author: "Charlie Brown"
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredPosts = selectedCategory
    ? samplePosts.filter(post => post.categoryId === selectedCategory)
    : samplePosts;

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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;