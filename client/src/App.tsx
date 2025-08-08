import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';

const Home = () => <h2>Welcome to the Naturverse</h2>;
const About = () => <h2>About the Project</h2>;
const SignUp = () => <h2>Sign Up Page</h2>;
const Login = () => <h2>Login Page</h2>;

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
