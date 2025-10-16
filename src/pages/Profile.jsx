import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './profile.css';

export default function Profile() {
  const { user, logout, updateProfile } = useUser();
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();
  const fileRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.name ?? '');

  // Combined effect: redirect to login if unauthenticated,
  // and apply the attached static avatar when user exists but has no avatar.
  useEffect(() => {
    if (!user) {
      nav('/login');
      return;
    }
    if (user && !user.avatar) {
      updateProfile({ avatar: '/avatars/attached-avatar.svg' });
    }
  }, [user, nav, updateProfile]);

  if (!user) return null;

  const handleFile = (f) => {
    if (!f) return;
    setUploading(true);
    const r = new FileReader();
    r.onload = () => {
      updateProfile({ avatar: r.result });
      setUploading(false);
    };
    r.readAsDataURL(f);
  };


  

  return (
    <div className="profile-card">
      <img className="profile-avatar" src={user.avatar} alt="avatar" />
      <div className="profile-main">
        <div className="profile-header">
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email ?? ''}</div>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-row">
            <input className="edit-input" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
            <button className="btn" onClick={() => { updateProfile({ name: draftName }); setIsEditing(false); }} disabled={!draftName.trim()}>Save</button>
            <button className="btn secondary" onClick={() => { setDraftName(user.name); setIsEditing(false); }}>Cancel</button>
          </div>
        ) : (
          <div className="profile-actions">
            <button className="btn" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? 'Uploading...' : 'Add / Change Avatar'}</button>
            <button className="btn secondary" onClick={() => setIsEditing(true)}>Edit name</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>
        )}

        <div className="small-help">Tip: upload a PNG/JPG to set a personalized avatar. Avatars are stored locally in your browser.</div>

        <div className="logout-btn">
          <button className="btn secondary" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </div>
    </div>
  );
}
