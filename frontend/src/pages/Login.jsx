import React, { useEffect, useState } from 'react';
import logo from "../images/logos/logo.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api_base_url } from '../helper';
import { FaEye, FaEyeSlash, FaCode, FaRocket } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Make sure this is added

  // Update the GitHub login handler if needed
  const handleGitHubLogin = () => {
    try {
      console.log("Redirecting to GitHub auth from Login...");
      window.location.href = `${api_base_url}/auth/github`;
    } catch (error) {
      console.error("GitHub auth error:", error);
      toast.error('GitHub authentication failed. Please try again.');
    }
  };

  // Add Google login handler
  const handleGoogleLogin = () => {
    try {
      console.log("Redirecting to Google auth from Login...");
      window.location.href = `${api_base_url}/auth/google`;
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error('Google authentication failed. Please try again.');
    }
  };

  // Add Facebook login handler
  const handleFacebookLogin = () => {
    try {
      console.log("Redirecting to Facebook auth from Login...");
      window.location.href = `${api_base_url}/auth/facebook`;
    } catch (error) {
      console.error("Facebook auth error:", error);
      toast.error('Facebook authentication failed. Please try again.');
    }
  };

  // Check for token in URL params (for OAuth callbacks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const fullName = params.get('fullName');
    const error = params.get('error');
    
    if (error) {
      if (error === 'google_auth_failed') {
        toast.error('Google authentication failed. Please try again.');
      } else if (error === 'facebook_auth_failed') {
        toast.error('Facebook authentication failed. Please try again.');
      } else if (error === 'github_auth_failed') {
        toast.error('GitHub authentication failed. Please try again.');
      } else if (error === 'google_auth_not_configured') {
        toast.error('Google authentication is not properly configured. Please try another method.');
      } else if (error === 'facebook_auth_not_configured') {
        toast.error('Facebook authentication is not properly configured. Please try another method.');
      }
      return;
    }
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      if (fullName) {
        localStorage.setItem('fullName', decodeURIComponent(fullName));
      }
      
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true
      });
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    }
  }, [navigate, location.search]);

  const submitForm = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true when form is submitted
    
    if (!email || !pwd) {
      toast.error("Please enter both email and password");
      setIsLoading(false);
      return;
    }
    
    try {
      fetch(api_base_url + "/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          pwd: pwd
        })
      })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Invalid credentials");
          } else if (res.status === 404) {
            throw new Error("User not found");
          } else {
            throw new Error("Server error");
          }
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          // Clear any existing tokens first to prevent issues
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('fullName');
          
          // Set new valid tokens
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("fullName", data.fullName);
          
          toast.success("Login successful!");
          
          // Immediate navigation without setTimeout
          navigate("/");
          // Force a page reload to ensure the app recognizes the login state
          window.location.href = "/";
        } else {
          toast.error(data.msg || "Login failed. Please check your credentials.");
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        toast.error(err.message || "Server error. Please try again.");
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Client error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    // Set guest mode in localStorage
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("fullName", "Guest User");
    
    // Create a temporary guest token with more entropy
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const guestToken = `guest_${timestamp}_${randomString}`;
    localStorage.setItem("token", guestToken);
    
    // Initialize empty projects array for guest
    localStorage.setItem("guestProjects", JSON.stringify([]));
    
    // Show success message
    toast.success("Guest mode activated! Code in any language without registration", {
      autoClose: 2000,
      position: "top-center"
    });
    
    // Force navigation to home page
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-4 bg-black rounded-lg shadow-md border border-gray-800">
        <div className="text-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-48 mx-auto transform hover:scale-110 transition-all duration-300 hover:brightness-110 hover:drop-shadow-[0_0_30px_rgba(59,_130,_246,_0.5)]" 
          />
          <h2 className="mt-4 text-2xl font-bold text-white">Login</h2>
          <p className="text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/signUp" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
        
        {/* Prominent Guest Mode Button */}
        <div className="pt-2 pb-4 animate-pulse">
          <button
            onClick={handleGuestMode}
            className="w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg font-medium text-lg"
          >
            <FaRocket className="text-lg" />
            <span>Start Coding Instantly</span>
          </button>
          <p className="text-center text-gray-400 text-sm mt-2">
            Code in Python, JavaScript, Java, C++, and many more languages without login!
          </p>
        </div>
        
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute border-t border-gray-700 w-full"></div>
          <div className="relative px-4 bg-black text-gray-400">OR</div>
        </div>

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6 characters or more"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[35px] transform text-gray-400 hover:text-gray-300 z-10"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-400">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 border-gray-700 rounded focus:ring-blue-400 bg-gray-800"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-400">or login with</p>
          <div className="flex justify-center mt-2 space-x-4">
            <button 
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              onClick={handleGoogleLogin}
              type="button"
            >
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png"
                alt="Google"
                className="w-5 h-5"
              />
            </button>
            <button 
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              onClick={handleFacebookLogin}
              type="button"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="w-5 h-5"
              />
            </button>
            <button 
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              onClick={handleGitHubLogin}
              type="button"
            >
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;