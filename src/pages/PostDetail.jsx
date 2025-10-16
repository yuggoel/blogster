import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import samplePosts from '../data/samplePosts';

export default function PostDetail({ posts, setPosts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const all = posts || (() => {
      try { return JSON.parse(localStorage.getItem('blog_posts')) || samplePosts; } catch { return samplePosts; }
    })();
    const p = all.find((x) => x.id === postId);
    if (!p) {
      // not found, go back
      navigate('/');
      return;
    }
    setPost(p);
    // keep title as post title, but open a BLANK details editor for elaboration
    setTitle(p.title || '');
    // use existing details if present, otherwise start blank so user can elaborate
    setContent(p.details || '');
  }, [postId, posts, navigate]);

  const save = () => {
    // Save elaboration into post.details without overwriting original post.content
    const updated = { ...post, title: title.trim() || 'Untitled', details: content };
    const next = (posts || []).map((p) => (p.id === postId ? updated : p));
    setPosts(next);
    localStorage.setItem('blog_posts', JSON.stringify(next));
    navigate('/');
  };

  if (!post) return null;

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Edit post</h2>
        <div>
          <button onClick={() => navigate('/')}>Back</button>
          <button style={{ marginLeft: 8 }} onClick={save}>Save</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 10, fontSize: 18, borderRadius: 8, border: '1px solid #e6e9ee' }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e6e9ee', minHeight: 320 }} />
      </div>
    </div>
  );
}
