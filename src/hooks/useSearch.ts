import { useState } from 'react';
import { Post } from '@/components/PostCard';

export const useSearch = (posts: Post[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredPosts = posts?.filter(post => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchQuery,
    handleSearch,
    filteredPosts
  };
};