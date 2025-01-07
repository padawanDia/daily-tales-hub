import { Category, categories } from "./CategoryPanel";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  categoryId: string;
  date: string;
  author: string;
}

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const category = categories.find((c) => c.id === post.categoryId);

  return (
    <div className="post-card bg-white rounded-lg border p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        {category && (
          <span className={`category-badge ${category.color}`}>
            {category.name}
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{post.author}</span>
        <span>{post.date}</span>
      </div>
    </div>
  );
};