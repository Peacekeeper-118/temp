import React, { useState } from 'react';
import { Post, User } from '../types';
import { ChevronLeft, Trash2 } from 'lucide-react';

interface YourPostsScreenProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onDeletePost: (postId: string) => void;
}

interface DeleteConfirmDialog {
  isOpen: boolean;
  postId: string | null;
  postTitle: string | null;
}

export const YourPostsScreen: React.FC<YourPostsScreenProps> = ({ user, posts, onBack, onDeletePost }) => {
  const userPosts = posts.filter(p => p.user.id === user.id);
  const [deleteDialog, setDeleteDialog] = useState<DeleteConfirmDialog>({
    isOpen: false,
    postId: null,
    postTitle: null
  });

  const handleDeleteClick = (postId: string, postTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      postId,
      postTitle
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.postId) {
      onDeletePost(deleteDialog.postId);
      setDeleteDialog({ isOpen: false, postId: null, postTitle: null });
    }
  };

  const handleCancel = () => {
    setDeleteDialog({ isOpen: false, postId: null, postTitle: null });
  };

  return (
    <div className="bg-[#F0F0F0] min-h-full pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="p-6 pt-8 flex items-center gap-3 bg-white shadow-sm">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-earth-50 border border-earth-200 flex items-center justify-center text-earth-600 hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display font-black text-2xl text-earth-900">Your Posts</h2>
      </div>

      <div className="px-6 mt-6">
        {userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-earth-100 border-dashed animate-fade-in-up">
            <div className="w-12 h-12 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-earth-300" />
            </div>
            <p className="text-earth-400 text-sm font-bold">No posts yet.</p>
            <p className="text-earth-300 text-xs mt-1">Create your first post to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-[2rem] border border-earth-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Post Image */}
                  <div className="w-20 h-20 bg-earth-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.description}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-earth-900 text-sm line-clamp-2 mb-1">
                      {post.description}
                    </h3>
                    <p className="text-xs text-earth-500 font-medium capitalize mb-2">
                      {post.brand} • {post.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg text-earth-900">₹{post.price}</span>
                        {post.isSold && (
                          <span className="bg-earth-100 text-earth-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            SOLD
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteClick(post.id, post.description)}
                        className="p-2 rounded-lg bg-pop-orange/10 text-pop-orange hover:bg-pop-orange/20 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-3 pt-3 border-t border-earth-100 grid grid-cols-3 gap-3 text-[10px]">
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Condition</p>
                    <p className="font-black text-earth-900">{post.condition}</p>
                  </div>
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Category</p>
                    <p className="font-black text-earth-900">{post.brand}</p>
                  </div>
                  <div>
                    <p className="font-bold text-earth-500 uppercase mb-1">Status</p>
                    <p className="font-black text-earth-900">{post.isSold ? 'Sold' : 'Active'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-in-up">
          <div className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <h3 className="font-display font-black text-2xl text-earth-900 mb-2">
              Delete Post?
            </h3>
            <p className="text-earth-600 text-sm font-medium mb-6">
              Are you sure you want to delete "{deleteDialog.postTitle}"? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-earth-100 text-earth-900 py-3 rounded-xl font-bold text-sm hover:bg-earth-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-pop-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-pop-orange/90 transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
