import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { UserProvider, useUser } from './contexts/UserContext';

function NavLinks() {
  const { user } = useUser();
  return (
    <nav className="App-nav">
  <Link to="/" className="nav-link">Home</Link>{' '}
  <Link to="/new" className="nav-link">New Post</Link>{' '}
  {user ? (
    <Link to="/profile" className="nav-link">Profile</Link>
  ) : (
    <>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  )}
</nav>
);
}


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App-root">
          <NavLinks />
          <main className="App-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/*"
                element={<Blog />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
