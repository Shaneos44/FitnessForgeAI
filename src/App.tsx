import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ChakraProvider, Box, Spinner, Center, CSSReset, extendTheme } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { mode } from '@chakra-ui/theme-tools';
import theme from './theme';

// Add Inter font from Google Fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TrainingPlans from './pages/TrainingPlans';
import Workouts from './pages/Workouts';
import WorkoutTracking from './pages/WorkoutTracking';
import Profile from './pages/Profile';
import ProfileSetup from './pages/ProfileSetup';
import WorkoutHistory from './pages/WorkoutHistory';
import TrainingGoals from './pages/TrainingGoals';
import Social from './pages/Social';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Subscription from './pages/Subscription';
import WorkoutPlanGenerator from './pages/WorkoutPlanGenerator';
import WorkoutTracker from './pages/WorkoutTracker';
import SmartwatchConnection from './pages/SmartwatchConnection';
import Onboarding from './pages/Onboarding';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Component to handle auth state before rendering children
const AuthCheck: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Global styles
const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #0ea5e9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #0284c7;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selection styling */
        ::selection {
          background: #0ea5e9;
          color: white;
        }
        
        /* Focus styles */
        *:focus {
          box-shadow: none !important;
        }
        
        *:focus-visible {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.4) !important;
        }
      `}
    />
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Profile setup route - doesn't require profile setup to be complete */}
            <Route element={<PrivateRoute requireProfileSetup={false} />}>
              <Route path="/profile-setup" element={<ProfileSetup />} />
            </Route>
            
            {/* Protected routes that require profile setup */}
            <Route element={<PrivateRoute requireProfileSetup={true} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/training-plans" element={<TrainingPlans />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/workout-tracking" element={<WorkoutTracking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/training-goals" element={<TrainingGoals />} />
                <Route path="/social" element={<Social />} />
                <Route path="/workout-plan-generator" element={<WorkoutPlanGenerator />} />
                <Route path="/workout-tracker" element={<WorkoutTracker />} />
                <Route path="/smartwatch-connection" element={<SmartwatchConnection />} />
              </Route>
            </Route>
            
            {/* Public Home page */}
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/subscription" element={<Subscription />} />

            {/* Authenticated dashboard shortcut */}
            <Route 
              path="/go" 
              element={
                <AuthCheck>
                  <Navigate to="/dashboard" replace />
                </AuthCheck>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
