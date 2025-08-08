import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

const About: React.FC = () => <h2>About the Project</h2>;

const App: React.FC = () => {
return (
<AuthProvider>
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Router>
<NavBar />
<div style={{ padding: '2rem' }}>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />
<Route path="/profile" element={<Profile />} />
</Routes>
</div>
</Router>
</TooltipProvider>
</QueryClientProvider>
</AuthProvider>
);
};

export default App;