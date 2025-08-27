export const api_base_url = "http://localhost:3001";

// Better handling of token validation
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  
  // No token at all is invalid
  if (!token) {
    return false;
  }
  
  // Guest tokens are automatically valid
  if (token.startsWith('guest_')) {
    return true;
  }
  
  // Basic check for JWT format (xxx.yyy.zzz)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  try {
    // Decode and check payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

// More comprehensive auth error handler
export const handleAuthError = () => {
  // Clear all auth-related data
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("fullName");
  localStorage.removeItem("isGuest");
  
  // User projects should be preserved for recovery purposes
  // but you can also clear them if needed
  // localStorage.removeItem("guestProjects");
  
  // Redirect to login page
  window.location.href = '/login';
};

// Check if user is in guest mode
export const isGuestMode = () => {
  // Check both guest flag and token format
  const isGuestFlag = localStorage.getItem('isGuest') === 'true';
  const token = localStorage.getItem('token');
  const hasGuestToken = token && token.startsWith('guest_');
  
  return isGuestFlag || hasGuestToken;
};

// Enhanced helper to generate better startup code for all languages for guest projects
export const getGuestStartupCode = (language) => {
  switch(language.toLowerCase()) {
    case 'python':
      return '# Welcome to Python Guest Mode\n\nprint("Hello, Guest User!")\n\n# You can edit this code and run it without creating an account\n# Start coding below:\n\n';
      
    case 'javascript':
      return '// Welcome to JavaScript Guest Mode\n\nconsole.log("Hello, Guest User!");\n\n// You can edit this code and run it without creating an account\n// Start coding below:\n\n';
      
    case 'cpp':
      return '#include <iostream>\nusing namespace std;\n\nint main() {\n  // Welcome to C++ Guest Mode\n  cout << "Hello, Guest User!" << endl;\n  \n  // You can edit this code and run it without creating an account\n  // Start coding below:\n  \n  return 0;\n}\n';
      
    case 'java':
      return '// Welcome to Java Guest Mode\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Guest User!");\n    \n    // You can edit this code and run it without creating an account\n    // Start coding below:\n    \n  }\n}\n';
      
    case 'c':
      return '// Welcome to C Guest Mode\n\n#include <stdio.h>\n\nint main() {\n  printf("Hello, Guest User!\\n");\n  \n  // You can edit this code and run it without creating an account\n  // Start coding below:\n  \n  return 0;\n}\n';
      
    case 'ruby':
      return '# Welcome to Ruby Guest Mode\n\nputs "Hello, Guest User!"\n\n# You can edit this code and run it without creating an account\n# Start coding below:\n\n';
      
    case 'go':
      return '// Welcome to Go Guest Mode\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Guest User!")\n  \n  // You can edit this code and run it without creating an account\n  // Start coding below:\n  \n}\n';
      
    case 'php':
      return '<?php\n// Welcome to PHP Guest Mode\n\necho "Hello, Guest User!";\n\n// You can edit this code and run it without creating an account\n// Start coding below:\n\n?>';
      
    case 'swift':
      return '// Welcome to Swift Guest Mode\n\nprint("Hello, Guest User!")\n\n// You can edit this code and run it without creating an account\n// Start coding below:\n\n';
      
    case 'rust':
      return '// Welcome to Rust Guest Mode\n\nfn main() {\n    println!("Hello, Guest User!");\n    \n    // You can edit this code and run it without creating an account\n    // Start coding below:\n    \n}\n';
      
    case 'typescript':
      return '// Welcome to TypeScript Guest Mode\n\nconsole.log("Hello, Guest User!");\n\n// You can edit this code and run it without creating an account\n// Start coding below:\n\n';
      
    case 'csharp':
    case 'c#':
      return '// Welcome to C# Guest Mode\n\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, Guest User!");\n        \n        // You can edit this code and run it without creating an account\n        // Start coding below:\n        \n    }\n}\n';
      
    case 'bash':
      return '#!/bin/bash\n# Welcome to Bash Guest Mode\n\necho "Hello, Guest User!"\n\n# You can edit this code and run it without creating an account\n# Start coding below:\n\n';
      
    case 'kotlin':
      return '// Welcome to Kotlin Guest Mode\n\nfun main() {\n    println("Hello, Guest User!")\n    \n    // You can edit this code and run it without creating an account\n    // Start coding below:\n    \n}\n';

    case 'dart':
      return '// Welcome to Dart Guest Mode\n\nvoid main() {\n  print("Hello, Guest User!");\n  \n  // You can edit this code and run it without creating an account\n  // Start coding below:\n  \n}\n';

    default:
      return '// Welcome to Guest Mode\n\n// You can edit this code and run it without creating an account\n// Start coding below:\n\n';
  }
};