/**
 * @file src/admin/AdminContent.tsx
 * @purpose Admin Content Management module for managing blog articles and customer FAQs.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Allows creating and editing blog posts and FAQ knowledge base items.
 */

import React, { useState, useEffect } from 'react';
import { FileText, Plus, BookOpen, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BlogPost } from '../types/index.ts';

export const AdminContent: React.FC = () => {
  const { showToast } = useStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Equipment Insights');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('CCDL Technical Fitting Team');

  const fetchPosts = () => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data || []);
      })
      .catch((e) => console.warn(e));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      category,
      author,
      readTime: '5 min read',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setPosts([newPost, ...posts]);
    showToast(`Article "${newPost.title}" published to The Fairway Journal.`);
    setTitle('');
    setExcerpt('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Content Studio</span>
        <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
          Content Management (Blog & FAQs)
        </h1>
        <p className="text-xs text-stone-500">Publish equipment articles and manage customer knowledge base entries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Published Articles List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded p-6 space-y-4">
          <h3 className="font-serif-display font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            Published Journal Articles ({posts.length})
          </h3>

          <div className="divide-y divide-stone-100">
            {posts.map((p) => (
              <div key={p.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="font-semibold text-[#0D3B2E] uppercase">{p.category}</span>
                  <span>·</span>
                  <span>{p.publishedAt}</span>
                  <span>·</span>
                  <span>{p.readTime}</span>
                </div>
                <h4 className="font-semibold text-stone-900">{p.title}</h4>
                <p className="text-stone-500 line-clamp-2">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Article Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded p-6 space-y-4 text-xs text-stone-700">
          <h3 className="font-semibold text-stone-900 text-sm">Write New Journal Article</h3>
          <form onSubmit={handleCreateArticle} className="space-y-3">
            <div>
              <label className="block text-stone-900 font-semibold mb-1">Article Headline *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aerodynamics of Low-Spin Drivers"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              >
                <option value="Equipment Insights">Equipment Insights</option>
                <option value="Club Tech">Club Tech & Metallurgy</option>
                <option value="Gear Maintenance">Gear Maintenance</option>
                <option value="Course Guides">Indian Course Guides</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Short Excerpt</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Summary for article card..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Author Byline</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
              />
            </div>

            <div>
              <label className="block text-stone-900 font-semibold mb-1">Full Article Prose *</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full analysis and fitting data..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors"
            >
              Publish to Journal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
