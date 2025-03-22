import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    // Fetch posts from your API
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    try {
      // Call your backend to delete the post
      await axios.delete(`/api/posts/${selectedPostId}`);
      setPosts(posts.filter(post => post._id !== selectedPostId)); // Remove post from the UI
      setShowModal(false);
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => { setShowModal(true); setSelectedPostId(post._id); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <ConfirmDeleteModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PostsPage;
