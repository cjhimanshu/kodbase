import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Editor2 from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import { api_base_url, isGuestMode, getGuestStartupCode, isTokenValid, handleAuthError } from '../helper';
import { toast } from 'react-toastify';
import { FaPlay, FaRegClipboard, FaSave, FaCog, FaExpandAlt, FaCompressAlt, FaSpinner, FaTerminal, FaBars, FaCheck, FaTimes, FaCode, FaMobileAlt, FaDownload, FaKeyboard, FaAngleDown, FaAngleUp, FaEraser } from 'react-icons/fa';

const Editor = () => {
  const [code, setCode] = useState(""); // State to hold the code
  const { id } = useParams(); // Extract project ID from URL params
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const editorRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [fontSize, setFontSize] = useState(16);
  const [outputConfig, setOutputConfig] = useState({
    wrap: true,
    fontSize: 14,
    showLineNumbers: true
  });
  const [loadingState, setLoadingState] = useState({
    status: '',
    progress: 0
  });
  const [executionSteps, setExecutionSteps] = useState({
    compiling: false,
    running: false,
    completed: false,
    failed: false
  });
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'output'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userInput, setUserInput] = useState('');
  const [showInputField, setShowInputField] = useState(false);
  const userInputRef = useRef(null);
  const [isGuest, setIsGuest] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch project data on mount
  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = isGuestMode();
    setIsGuest(guestMode);
    
    if (guestMode) {
      // Get project from localStorage for guest users
      const savedGuestProjects = localStorage.getItem('guestProjects');
      if (savedGuestProjects) {
        try {
          const projects = JSON.parse(savedGuestProjects);
          const project = projects.find(p => p._id === id);
          
          if (project) {
            setCode(project.code || "");
            setData(project);
          } else {
            toast.error("Project not found");
            navigate("/");
          }
        } catch (e) {
          console.error("Error loading guest project:", e);
          toast.error("Failed to load project");
          navigate("/");
        }
      } else {
        toast.error("No projects found");
        navigate("/");
      }
    } else {
      // Regular user flow
      if (!isTokenValid()) {
        toast.error("Your session has expired. Please log in again.");
        handleAuthError();
        return;
      }
      
      // Fetch project from API for registered users
      fetch(`${api_base_url}/getProject`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          projectId: id,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Handle guest project received from API
          if (data.isGuest) {
            setIsGuest(true);
            localStorage.setItem("isGuest", "true");
            // Look for project in localStorage
            const savedGuestProjects = localStorage.getItem('guestProjects');
            if (savedGuestProjects) {
              try {
                const projects = JSON.parse(savedGuestProjects);
                const project = projects.find(p => p._id === id);
                if (project) {
                  setCode(project.code || "");
                  setData(project);
                }
              } catch (e) {
                console.error("Error parsing guest projects:", e);
              }
            }
          } else {
            // Regular project
            setCode(data.project.code);
            setData(data.project);
          }
        } else {
          if (data.msg && (
            data.msg.includes("Authentication failed") || 
            data.msg.includes("invalid signature") || 
            data.msg.includes("jwt") ||
            data.msg.includes("Invalid token")
          )) {
            toast.error("Session expired. Please login again.");
            handleAuthError();
          } else {
            toast.error(data.msg || "Failed to load project");
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        toast.error('Failed to load project');
      });
    }
  }, [id, navigate]);

  // Enhanced save function for guest projects
  const saveProject = () => {
    const trimmedCode = code?.toString().trim() || "";
    
    // For guest users, save to localStorage
    if (isGuest) {
      const savedGuestProjects = localStorage.getItem('guestProjects');
      if (savedGuestProjects) {
        try {
          const projects = JSON.parse(savedGuestProjects);
          const projectIndex = projects.findIndex(p => p._id === id);
          
          if (projectIndex !== -1) {
            projects[projectIndex].code = trimmedCode;
            projects[projectIndex].lastModified = new Date().toISOString(); // Add last modified date
            localStorage.setItem('guestProjects', JSON.stringify(projects));
            return Promise.resolve({ success: true, isGuest: true });
          }
        } catch (e) {
          console.error("Error saving guest project:", e);
        }
      }
      return Promise.reject({ success: false, msg: "Failed to save guest project" });
    }
    
    // Regular save for logged-in users
    return fetch(`${api_base_url}/saveProject`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        projectId: id,
        code: trimmedCode,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success && !data.isGuest) {
        throw new Error(data.msg);
      }
      return data;
    });
  };

  // Enhanced save handler with better feedback
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveProject();
      
      // Special message for guest users
      if (result.isGuest) {
        toast.success('Project saved locally!');
      } else {
        toast.success('Project saved successfully!');
      }
    } catch (error) {
      toast.error(error.msg || 'Failed to save code');
    } finally {
      setIsSaving(false);
    }
  };

  // Shortcut handler for saving with Ctrl+S
  const handleSaveShortcut = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault(); // Prevent browser's default save behavior
      saveProject(); // Call the save function
    }
  };

  // Add and clean up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleSaveShortcut);
    return () => {
      window.removeEventListener('keydown', handleSaveShortcut);
    };
  }, [code]); // Reattach when `code` changes

  const runProject = async () => {
    setIsRunning(true);
    setExecutionSteps({
      compiling: true,
      running: false,
      completed: false,
      failed: false
    });
    setError(false);
    setOutput("");
    
    try {
      // Simulate compilation step
      setLoadingState({ status: 'Compiling code...', progress: 25 });
      await new Promise(r => setTimeout(r, 500));
      
      setExecutionSteps(prev => ({ ...prev, compiling: false, running: true }));
      setLoadingState({ status: 'Executing program...', progress: 50 });

      // Language-specific execution adjustments
      let languageToUse = data?.projLanguage?.toLowerCase() || 'python';
      let versionToUse = data?.version || 'latest';
      let codeContent = code;
      
      // Use project name for the filename when possible
      let projectName = data?.name ? data.name.replace(/[^a-zA-Z0-9]/g, '_') : 'main';
      let filename = `${projectName}.${getFileExtension(languageToUse)}`;
      
      // Special handling for certain languages
      if (languageToUse === 'java') {
        // Check if code contains a class definition with main method
        if (!code.includes('public static void main')) {
          // Use project name as the class name (ensure it starts with uppercase)
          const className = projectName.charAt(0).toUpperCase() + projectName.slice(1);
          
          // Wrap the code in a class with a main method
          codeContent = `
public class ${className} {
    public static void main(String[] args) {
        ${code}
    }
}`;
          filename = `${className}.java`;
        }
      } else if (languageToUse === 'cpp' || languageToUse === 'c') {
        // Check if code contains main function and necessary includes
        const hasMainFunc = code.includes('main(') || code.includes('main (');
        if (!hasMainFunc) {
          // Add basic structure for C/C++ program
          const includes = languageToUse === 'cpp' 
            ? '#include <iostream>\nusing namespace std;\n\n'
            : '#include <stdio.h>\n\n';
          codeContent = `${includes}int main() {
    ${code}
    return 0;
}`;
        }
      }

      console.log("Sending execution request for language:", languageToUse);
      
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languageToUse,
          version: versionToUse,
          files: [{
            filename: filename,
            content: codeContent
          }],
          stdin: userInput || "", // Use userInput if available
          args: [] // Add command line args support
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      setLoadingState({ status: 'Processing output...', progress: 75 });
      const result = await response.json();
      console.log("Execution result:", result);
      
      if (!result || !result.run) {
        throw new Error('Invalid response format from execution service');
      }
      
      // Separate stdout and stderr
      let formattedOutput = [];
      let errorOutput = [];
      let hasError = false;
      
      // Check run status
      if (result.run.code !== 0) {
        hasError = true;
      }
      
      // Process stdout if exists
      if (result.run.stdout) {
        formattedOutput = result.run.stdout.split('\n').map((line, i) => ({
          line: i + 1,
          content: line,
          type: 'output'
        }));
      }
      
      // Process stderr if exists
      if (result.run.stderr) {
        errorOutput = result.run.stderr.split('\n').map((line, i) => ({
          line: formattedOutput.length + i + 1,
          content: line,
          type: 'error'
        }));
        hasError = true;
      }
      
      // Handle case where neither stdout nor stderr, but there's output
      if (formattedOutput.length === 0 && errorOutput.length === 0 && result.run.output) {
        formattedOutput = [{
          line: 1,
          content: result.run.output,
          type: 'output'
        }];
      }
      
      // Combine outputs, showing stderr after stdout
      const combinedOutput = [...formattedOutput, ...errorOutput];
      
      if (combinedOutput.length === 0) {
        // If no output at all, provide a default message
        combinedOutput.push({
          line: 1,
          content: 'Program executed successfully with no output',
          type: 'output'
        });
      }
      
      if (hasError) {
        setExecutionSteps(prev => ({ ...prev, running: false, failed: true }));
        setError(true);
        
        // Format the error message better
        const errorSummary = result.run.stderr ? 
          result.run.stderr.split('\n')[0] : 
          'Execution failed with code ' + result.run.code;
          
        toast.error(`Error: ${errorSummary}`, {
          position: 'bottom-right',
          autoClose: 4000
        });
      } else {
        setExecutionSteps(prev => ({ ...prev, running: false, completed: true }));
        setLoadingState({ status: 'Completed successfully', progress: 100 });
        toast.success('Code executed successfully!', {
          position: 'bottom-right',
          autoClose: 2000
        });
      }

      // Always set output
      setOutput(combinedOutput);

    } catch (err) {
      console.error("Execution error:", err);
      setExecutionSteps(prev => ({ ...prev, running: false, failed: true }));
      setError(true);
      toast.error('Execution failed: ' + (err.message || 'Unknown error'), {
        position: 'bottom-right'
      });
      
      // Show error in output window too
      setOutput([{
        line: 1,
        content: `Error: ${err.message || 'Unknown execution error'}`,
        type: 'error'
      }]);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        setExecutionSteps({
          compiling: false,
          running: false,
          completed: false,
          failed: false
        });
        setLoadingState({ status: '', progress: 0 });
      }, 2000);
    }
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Add selection change listener
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getModel().getValueInRange(e.selection);
      if (selection) {
        setSelectedCode(selection);
      }
    });
  }

  const runSelectedCode = () => {
    const codeToRun = selectedCode || "print('Hello World')"; // Default to Hello World if no selection
    setIsRunning(true);
    setOutput("");
    setError(false);
    
    // Use project name for the filename when possible
    const languageToUse = data?.projLanguage || 'python';
    const projectName = data?.name ? data.name.replace(/[^a-zA-Z0-9]/g, '_') : 'main';
    
    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: languageToUse,
        version: data?.version || 'latest',
        files: [{
          filename: `${projectName}.${getFileExtension(languageToUse)}`,
          content: codeToRun
        }]
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Selected code execution result:", data);
      
      if (!data || !data.run) {
        throw new Error('Invalid response format');
      }
      
      const hasError = data.run.code !== 0;
      let outputContent = data.run.stdout || data.run.output || 'No output';
      
      if (data.run.stderr) {
        outputContent = data.run.stderr;
        setError(true);
        toast.error('Execution failed: ' + data.run.stderr.split('\n')[0]);
      } else if (hasError) {
        setError(true);
        toast.error('Execution failed with code ' + data.run.code);
      } else {
        toast.success('Code executed successfully!');
      }
      
      setOutput([{
        line: 1,
        content: outputContent,
        type: hasError ? 'error' : 'output'
      }]);
    })
    .catch(err => {
      console.error("Selected code execution error:", err);
      toast.error('Failed to run code: ' + (err.message || 'Unknown error'));
      setError(true);
      setOutput([{
        line: 1,
        content: `Error: ${err.message || 'Failed to execute code'}`,
        type: 'error'
      }]);
    })
    .finally(() => {
      setIsRunning(false);
    });
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        runProject();
      } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setIsFullScreen(!isFullScreen);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullScreen]);

  // Get file extension for selected language
  const getFileExtension = (language) => {
    const extensions = {
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      cpp: 'cpp',
      c: 'c',
      java: 'java',
      bash: 'sh',
      dart: 'dart',
      swift: 'swift',
      php: 'php',
      go: 'go',
      ruby: 'rb',
      csharp: 'cs',
      kotlin: 'kt',
      rust: 'rs',
      haskell: 'hs',
      perl: 'pl',
      plaintext: 'txt',
      scala: 'scala',
      r: 'r'
    };
    
    if (!language) return 'txt';
    return extensions[language.toLowerCase()] || 'txt';
  };

  // Enhanced download function that works for guest users too
  const handleDownload = () => {
    if (!code) {
      toast.error('No code to download');
      return;
    }
    
    // Get the filename based on language
    const getFileExtension = (language) => {
      if (!language) return 'txt';
      
      switch(language.toLowerCase()) {
        case 'python': return 'py';
        case 'javascript': return 'js';
        case 'typescript': return 'ts';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        case 'c': return 'c';
        case 'csharp':
        case 'c#': return 'cs';
        case 'php': return 'php';
        case 'ruby': return 'rb';
        case 'go': return 'go';
        case 'rust': return 'rs';
        case 'swift': return 'swift';
        case 'kotlin': return 'kt';
        case 'dart': return 'dart';
        case 'bash': return 'sh';
        default: return 'txt';
      }
    };
    
    // Use project name for the filename when available
    const projectName = data?.name || 'code';
    const fileName = `${projectName}.${getFileExtension(data?.projLanguage)}`;
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success(`Downloaded as ${fileName}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen pt-16">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FaCode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h2 className="font-medium text-gray-800 dark:text-white">
              {data?.name || 'Untitled'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <FaSave className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
            </button>
            {/* Add download button to mobile header */}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <FaDownload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileView(prev => prev === 'editor' ? 'output' : 'editor')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              {mobileView === 'editor' ? <FaTerminal className="w-5 h-5" /> : <FaCode className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Header - hide on mobile */}
        <div className="hidden md:block border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white group">
                {data?.name || 'Untitled'}
                <span className="ml-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                  ({data?.projLanguage})
                </span>
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-2">
                <button
                  onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                  className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  A-
                </button>
                <span className="px-2 text-sm text-gray-600 dark:text-gray-300">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                  className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  A+
                </button>
              </div>

              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2 transition-all hover:scale-105"
                title="Save (Ctrl + S)"
              >
                <FaSave className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>

              {/* Add download button */}
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center space-x-2 transition-all hover:scale-105"
                title="Download Code"
              >
                <FaDownload className="w-4 h-4" />
                <span>Download</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {executionSteps.compiling && (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Compiling...</span>
                    </div>
                  )}
                  {executionSteps.running && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Running...</span>
                    </div>
                  )}
                  {executionSteps.completed && (
                    <div className="flex items-center gap-2 text-green-500">
                      <FaCheck className="w-4 h-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}
                  {executionSteps.failed && (
                    <div className="flex items-center gap-2 text-red-500">
                      <FaTimes className="w-4 h-4" />
                      <span className="text-sm">Failed</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={runProject}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    isRunning 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-green-500/25'
                  } text-white font-medium`}
                >
                  {isRunning ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>{loadingState.status}</span>
                    </>
                  ) : (
                    <>
                      <FaPlay className="w-4 h-4" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor and Output */}
        <div className={`flex flex-1 overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 pt-16' : ''}`}>
          {/* Editor Panel */}
          <div className={`
            ${isMobile ? (mobileView === 'editor' ? 'flex' : 'hidden') : 'flex'} 
            ${isFullScreen ? 'w-3/5' : 'w-full md:w-1/2'} 
            flex-col transition-all duration-300
          `}>
            <Editor2
              onMount={handleEditorDidMount}
              onChange={(newCode) => setCode(newCode || '')}
              theme={localStorage.getItem('theme') === 'dark' ? "vs-dark" : "light"}
              height={isFullScreen ? "calc(100vh - 64px)" : "calc(100vh - 180px)"}
              language={data?.projLanguage || 'plaintext'}
              value={code}
              options={{
                ...outputConfig,
                fontSize: isMobile ? Math.max(16, fontSize) : fontSize,
                minimap: { enabled: !isMobile },
                lineNumbers: isMobile ? 'off' : 'on'
              }}
            />
          </div>
          
          {/* Output Panel */}
          <div className={`
            ${isMobile ? (mobileView === 'output' ? 'flex' : 'hidden') : 'flex'}
            ${isFullScreen ? 'w-2/5' : 'w-full md:w-1/2'} 
            border-l border-gray-200 dark:border-gray-700 
            flex-col transition-all duration-300
          `}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaTerminal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-800 dark:text-white">Console Output</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOutputConfig(prev => ({ ...prev, wrap: !prev.wrap }))}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Toggle Word Wrap"
                    >
                      <FaBars className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(
                        Array.isArray(output) 
                          ? output.map(item => item.content).join('\n') 
                          : output
                      )}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Copy Output"
                    >
                      <FaRegClipboard className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={runProject}
                      disabled={isRunning}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-md flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {isRunning ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{loadingState.status}</span>
                        </>
                      ) : (
                        <>
                          <FaPlay className="w-4 h-4" />
                          <span className="text-sm">Run</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Loading Progress */}
                {isRunning && (
                  <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${loadingState.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output Content with improved rendering */}
            <div className="flex-1 overflow-auto">
              {output && output.length > 0 ? (
                <div className={`p-4 font-mono text-sm ${error ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                  <pre className={`${outputConfig.wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
                    <table className="w-full border-collapse">
                      <tbody>
                        {Array.isArray(output) ? output.map(({line, content, type}) => (
                          <tr key={line} className={`hover:bg-opacity-10 ${
                            type === 'error' ? 'hover:bg-red-100 dark:hover:bg-red-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }`}>
                            {outputConfig.showLineNumbers && (
                              <td className="select-none pr-4 text-gray-400 text-right align-top font-mono">{line}</td>
                            )}
                            <td className={`break-all ${
                              type === 'error' 
                                ? 'text-red-600 dark:text-red-400 font-semibold' 
                                : 'text-gray-800 dark:text-gray-200'
                            }`}>{content}</td>
                          </tr>
                        )) : (
                          <tr>
                            {outputConfig.showLineNumbers && <td className="select-none pr-4 text-gray-400 text-right">1</td>}
                            <td className="break-all text-gray-800 dark:text-gray-200">{output}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
                  <FaTerminal className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-sm">Ready to execute your code</p>
                  <p className="text-xs mt-1 opacity-75">Press Ctrl + B or click Run</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex items-center justify-around">
            <button
              onClick={() => setMobileView('editor')}
              className={`p-3 rounded-lg flex flex-col items-center ${
                mobileView === 'editor' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FaCode className="w-5 h-5" />
              <span className="text-xs mt-1">Editor</span>
            </button>
            
            <button
              onClick={runProject}
              disabled={isRunning}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex flex-col items-center"
            >
              <FaPlay className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
              <span className="text-xs mt-1">{isRunning ? 'Running' : 'Run'}</span>
            </button>
            
            {/* Add download button to mobile navigation */}
            <button
              onClick={handleDownload}
              className="p-3 rounded-lg flex flex-col items-center text-gray-500"
            >
              <FaDownload className="w-5 h-5" />
              <span className="text-xs mt-1">Download</span>
            </button>
            
            <button
              onClick={() => setMobileView('output')}
              className={`p-3 rounded-lg flex flex-col items-center ${
                mobileView === 'output' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FaTerminal className="w-5 h-5" />
              <span className="text-xs mt-1">Output</span>
            </button>
          </div>
        )}

        {/* Keyboard Shortcuts - Hide on mobile */}
        {!isMobile && (
          <div className="fixed bottom-4 right-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 space-y-1">
              <p>Ctrl + S: Save</p>
              <p>Ctrl + B: Run</p>
              <p>Ctrl + F: Toggle Fullscreen</p>
              <p>Ctrl + D: Download</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Editor;
