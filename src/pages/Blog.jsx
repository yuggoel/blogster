import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import samplePosts from '../data/samplePosts';
import '../blog.css';
import { useUser } from '../contexts/UserContext';
import RequireAuth from '../components/RequireAuth';
import PostDetail from './PostDetail';

function BlogHome({ posts, onAdd, user, onDelete, currentUserEmail }) {
  return (
    <div>
      {user && (
        <div className="inline-create card">
          <NewPost onAdd={onAdd} />
        </div>
      )}
      <PostList posts={posts} onDelete={onDelete} currentUserName={user?.name} currentUserEmail={currentUserEmail} />
    </div>
  );
}

export default function Blog() {
  const { user, logout } = useUser();

  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem('blog_posts');
      return raw ? JSON.parse(raw) : samplePosts;
    } catch {
      return samplePosts;
    }
  });

  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  const navigate = useNavigate();

  const addPost = (title, content) => {
    const p = { id: Date.now(), title, content, author: user?.name || 'Anonymous', authorEmail: user?.email || null };
    setPosts((s) => [p, ...s]);
    navigate('/');
  };

  const deletePost = (id) => {
    if (!window.confirm('Delete this post?')) return;
    setPosts((s) => s.filter((p) => p.id !== id));
  };

  if (!user)
    return (
      <div className="login-wrap">
        <div className="auth-card">
          <h2>Welcome to the demo blog</h2>
          <p style={{ color: '#4b5563' }}>Sign in to create posts, edit your profile and upload an avatar. This demo stores data locally in your browser.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn secondary" onClick={() => navigate('/register')}>Create account</button>
            <button
              className="btn"
              onClick={() => {
                // quick demo login - uses simple demo account stored in localStorage
                const demo = { name: 'Demo User', email: 'demo@local', avatar: `https://i.pravatar.cc/150?u=demo@local` };
                // use the context login function to set demo user
                // NOTE: useUser not available here, but we can call logout/login via props — instead, navigate to /login for credential flow
                localStorage.setItem('blog_user', JSON.stringify(demo));
                window.location.reload();
              }}
            >Continue as demo</button>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
            Or <button className="btn secondary" style={{ padding: '6px 10px' }} onClick={() => navigate('/login')}>sign in</button> with your own account.
          </div>
        </div>
      </div>
    );

  return (
    <div className="blog-root">
      <div className="blog-header">
        <div className="profile">
          <img src={user.avatar} alt="avatar" />
          <div className="profile-name">{user.name}</div>
        </div>
        <button className="logout" onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </button>
      </div>

      <div className="layout">
        <div>
          <Routes>
            <Route path="/" element={<BlogHome posts={posts} onAdd={addPost} user={user} onDelete={deletePost} currentUserEmail={user?.email} />} />
            <Route path="/new" element={<RequireAuth><NewPost onAdd={addPost} /></RequireAuth>} />
            <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
          </Routes>
        </div>

        <aside className="sidebar">
          <div className="card about">
            <h4>About this blog</h4>
            <div>Simple demo blog built with React. Create posts, register and upload an avatar.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
