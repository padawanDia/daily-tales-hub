import { Category, categories } from "./CategoryPanel";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  categoryId: string;
  date: string;
  author: string;
  imageUrl: string;
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
      {post.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{post.author}</span>
        <span>{post.date}</span>
      </div>
    </div>
  );
};