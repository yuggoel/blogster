import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts, onDelete, currentUserName, currentUserEmail }) {
  if (!posts || posts.length === 0)
    return <p className="empty">No posts yet.</p>;

  return (
    <div className="posts">
      {posts.map((p) => (
        <article key={p.id} className="post">
          {onDelete && (
            ((p.authorEmail && currentUserEmail && p.authorEmail === currentUserEmail) || (!p.authorEmail && p.author === currentUserName)) && (
              <button className="post-delete" onClick={() => onDelete(p.id)} aria-label={`Delete post ${p.title}`}>
                ×
              </button>
            )
          )}
          <h3 className="post-title"><Link to={`/post/${p.id}`}>{p.title}</Link></h3>
          <div className="post-meta">by {p.author || 'Anonymous'}</div>
          <p className="post-body">{p.content}</p>
        </article>
      ))}
    </div>
  );
}
