import { Button } from "@/components/ui/button";

export type Category = {
  id: string;
  name: string;
  color: string;
};

const categories: Category[] = [
  { id: "1", name: "Personal", color: "bg-blue-100 text-blue-800" },
  { id: "2", name: "Work", color: "bg-green-100 text-green-800" },
  { id: "3", name: "Travel", color: "bg-yellow-100 text-yellow-800" },
  { id: "4", name: "Food", color: "bg-red-100 text-red-800" },
  { id: "5", name: "Health", color: "bg-purple-100 text-purple-800" },
];

interface CategoryPanelProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryPanel = ({ selectedCategory, onSelectCategory }: CategoryPanelProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start ${!selectedCategory ? 'bg-primary text-white' : ''}`}
          onClick={() => onSelectCategory("")}
        >
          All Posts
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={`w-full justify-start ${
              selectedCategory === category.id ? 'bg-primary text-white' : ''
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export { categories };