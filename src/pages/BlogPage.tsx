/**
 * @file src/pages/BlogPage.tsx
 * @purpose The Fairway Journal providing golf equipment science, Indian course breakdowns, and fitting guides.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Features editorial list, article reader view, unboxed metadata, and domain insights.
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, User, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BlogPost } from '../types/index.ts';

export const BlogPage: React.FC = () => {
  const { activeBlogSlug, navigate, showToast } = useStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data || []);
          if (activeBlogSlug) {
            const found = data.data.find((p: BlogPost) => p.slug === activeBlogSlug || p.id === activeBlogSlug);
            setActivePost(found || null);
          }
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsLoading(false));
  }, [activeBlogSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!');
    }
  };

  // Single Article Reader View
  if (activePost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => {
            setActivePost(null);
            navigate('blog');
          }}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </button>

        <article className="space-y-6">
          <div className="space-y-3 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-[#0D3B2E] uppercase">{activePost.category}</span>
              <span>·</span>
              <span>{activePost.publishedAt}</span>
              <span>·</span>
              <span>{activePost.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900 leading-tight">
              {activePost.title}
            </h1>

            <div className="flex items-center justify-between pt-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0D3B2E] text-white flex items-center justify-center font-bold">
                  {activePost.author.charAt(0)}
                </div>
                <span>By <strong>{activePost.author}</strong></span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-stone-500 hover:text-stone-900"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="prose prose-stone text-sm leading-relaxed whitespace-pre-line text-stone-700">
            {activePost.content}
          </div>

          <div className="border-t border-stone-200 pt-8 mt-12 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setActivePost(null);
                navigate('blog');
              }}
              className="text-[#0D3B2E] font-semibold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>More Articles</span>
            </button>
            <button
              onClick={() => navigate('shop')}
              className="px-4 py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21]"
            >
              Explore Equipment Catalog
            </button>
          </div>
        </article>
      </div>
    );
  }

  // Articles Index Grid
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
          The Fairway Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900 mt-1">
          Golf Engineering, Ballistics & Course Strategy
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2">
          Equipment science, metallurgical breakdowns, and local playing conditions analyzed by Climate Change Digital Labs.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-stone-400">Loading journal articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group bg-white border border-stone-200 rounded p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="font-semibold text-[#0D3B2E] uppercase">{post.category}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-base font-serif-display font-bold text-stone-900 group-hover:text-[#0D3B2E] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="border-t border-stone-100 pt-4 mt-6 flex items-center justify-between text-xs text-stone-500">
                <span>{post.author.split(',')[0]}</span>
                <span className="text-[#0D3B2E] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article →
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
