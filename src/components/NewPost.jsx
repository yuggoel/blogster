import React, { useState } from 'react';

export default function NewPost({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const canPublish = title.trim() && content.trim();

  const publish = async () => {
    if (!canPublish) return;
    setLoading(true);
    // emulate network latency for UX
    await new Promise((r) => setTimeout(r, 400));
    onAdd(title.trim(), content.trim());
    setTitle('');
    setContent('');
    setLoading(false);
    setPublished(true);
    setTimeout(() => setPublished(false), 1800);
  };

  return (
    <div className="new-post">
      <h2>Create a new post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content..."
        rows={6}
      />
      <div className="actions">
        <button onClick={publish} disabled={!canPublish || loading}>
          {loading ? 'Publishing...' : published ? 'Published ✓' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
