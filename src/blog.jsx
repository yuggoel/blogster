import React, { useState } from "react";

export default function BlogWebsite() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: "", avatar: "", title: "", content: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setUser({
      name: form.name,
      avatar: form.avatar || `https://i.pravatar.cc/150?u=${form.name}`,
    });
  };

  const addPost = () => {
    if (form.title && form.content)
      setPosts([{ id: Date.now(), title: form.title, content: form.content }, ...posts]);
    setForm({ ...form, title: "", content: "" });
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-80 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            placeholder="Your Name"
            className="border p-2 w-full mb-3 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Profile URL (optional)"
            className="border p-2 w-full mb-3 rounded"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <button className="bg-blue-500 text-white w-full py-2 rounded">
            Login
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
          <h2 className="text-lg font-semibold">{user.name}</h2>
        </div>
        <button
          onClick={() => setUser(null)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mb-10">
        <input
          placeholder="Post Title"
          className="border p-3 w-full mb-3 rounded text-lg"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Write your content..."
          rows="3"
          className="border p-2 w-full mb-3 rounded"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button
          onClick={addPost}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Publish
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts yet.</p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
            <p className="text-gray-700">{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
