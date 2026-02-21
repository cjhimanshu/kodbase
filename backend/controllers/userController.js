const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const passport = require('passport');
const { sendResetCode } = require('../utils/emailService');  // Fixed import

const secret = process.env.JWT_SECRET || "secret";

function getStartupCode(language) {
  switch(language.toLowerCase()) {
    case "python":
      return 'print("Hello World")';
    case "javascript":
      return 'console.log("Hello World");';
    case "java":
      return 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}';
    case "cpp":
      return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
    case "c":
      return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
    case "go":
      return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
    case "bash":
      return 'echo "Hello World"';
    case "ruby":
      return 'puts "Hello World"';
    case "dart":
      return 'void main() {\n    print("Hello World");\n}';
    case "swift":
      return 'print("Hello World")';
    case "php":
      return '<?php\necho "Hello World";\n?>';
    case "rust":
      return 'fn main() {\n    println!("Hello World");\n}';
    default:
      return '// Hello World program\nconsole.log("Hello World");';
  }
}

const signUp = async (req, res) => {
  try {
    let { email, pwd, fullName } = req.body;

    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.status(400).json({
        success: false,
        msg: "Email already exist"
      })
    }

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(pwd, salt, async function (err, hash) {
        let user = await userModel.create({
          email: email,
          password: hash,
          fullName: fullName
        });

        return res.status(200).json({
          success: true,
          msg: "User created successfully",
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, email, bypassToken } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters long"
      });
    }
    
    let user;
    
    // Handle both token-based and email-based resets
    if (resetToken) {
      try {
        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your_jwt_secret');
        user = await userModel.findOne({ _id: decoded.userId });
      } catch (tokenError) {
        console.error('Token verification error:', tokenError.message);
        return res.status(401).json({
          success: false,
          msg: "Invalid or expired token"
        });
      }
    } else if (email && bypassToken) {
      // Development bypass mode using email directly
      user = await userModel.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "User not found with this email address"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        msg: "Missing required parameters"
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password and clear reset code
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    
    // Save the updated user and handle potential validation errors
    try {
      await user.save();
      
      console.log(`Password reset successful for user: ${user.email}`);
      
      return res.status(200).json({
        success: true,
        msg: "Password successfully reset"
      });
    } catch (saveError) {
      console.error('Error saving updated password:', saveError);
      return res.status(500).json({
        success: false,
        msg: "Failed to update password. Please try again."
      });
    }

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      msg: "Server error during password reset. Please try again."
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required"
      });
    }

    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    try {
      // Log the provided password and the stored hash for debugging
      console.log(`Login attempt for ${email}`);
      
      const isMatch = await bcrypt.compare(pwd, user.password);
      if (isMatch) {
        // Create a better structured token with proper algorithm
        const token = jwt.sign(
          { 
            userId: user._id,
            email: user.email
          }, 
          secret, 
          { 
            expiresIn: '24h',
            algorithm: 'HS256'
          }
        );
        
        console.log(`Login successful for user: ${user.email}`);
        
        return res.status(200).json({
          success: true,
          msg: "Login successful",
          token,
          fullName: user.fullName
        });
      } else {
        console.log(`Invalid password attempt for user: ${email}`);
        return res.status(401).json({
          success: false,
          msg: "Invalid password"
        });
      }
    } catch (err) {
      console.error('Password comparison error:', err);
      return res.status(500).json({
        success: false,
        msg: "Error verifying password"
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      msg: "Server error during login. Please try again."
    });
  }
};

const createProj = async (req, res) => {
  try {
    let { name, projLanguage, version } = req.body;
    
    // Handle guest user
    if (req.user && req.user.isGuest) {
      const guestProjectId = `guest_${Date.now()}`;
      return res.status(200).json({
        success: true,
        msg: "Guest project created successfully",
        projectId: guestProjectId,
        isGuest: true
      });
    }
    
    const userId = req.user.userId; // from verifyToken middleware
    
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    // Generate starter code for the selected language
    const starterCode = getStartupCode(projLanguage);

    let project = await projectModel.create({
      name: name,
      projLanguage: projLanguage,
      createdBy: userId,
      code: starterCode, // Use the starter code here
      version: version || '1.0.0'
    });

    return res.status(200).json({
      success: true,
      msg: "Project created successfully",
      projectId: project._id
    });
  } catch (error) {
    console.error("Create project error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Server error occurred when creating project"
    });
  }
};

const saveProject = async (req, res) => {
  try {
    let { projectId, code } = req.body;
    
    // Handle guest user
    if (req.user && req.user.isGuest) {
      // For guest users, we just return success as they save locally
      return res.status(200).json({
        success: true,
        msg: "Guest project saved",
        isGuest: true
      });
    }
    
    const userId = req.user.userId; // from middleware
    
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    };

    let project = await projectModel.findOneAndUpdate({ _id: projectId }, {code: code});

    return res.status(200).json({
      success: true,
      msg: "Project saved successfully"
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};

const getProjects = async (req, res) => {
  try {
    // Check if this is a guest user
    if (req.user && req.user.isGuest) {
      // For guest users, return a success response with empty projects
      // The frontend will use localStorage to manage guest projects
      return res.status(200).json({
        success: true,
        msg: "Guest user projects",
        projects: [],
        isGuest: true
      });
    }

    // Regular user flow continues here
    const userId = req.user.userId;
    
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    let projects = await projectModel.find({ createdBy: userId });
    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects: projects
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};

const getProject = async (req, res) => {
  try {
    let { projectId } = req.body;
    
    // Handle guest user
    if (req.user && req.user.isGuest) {
      return res.status(200).json({
        success: true,
        msg: "Guest project info",
        isGuest: true
      });
    }

    // Regular user flow
    let user = await userModel.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    let project = await projectModel.findOne({ _id: projectId });

    if (project) {
      return res.status(200).json({
        success: true,
        msg: "Project fetched successfully",
        project: project
      });
    }
    else {
      return res.status(404).json({
        success: false,
        msg: "Project not found"
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};

const deleteProject = async (req, res) => {
  try {
    let { projectId } = req.body;
    
    // Handle guest user
    if (req.user && req.user.isGuest) {
      return res.status(200).json({
        success: true,
        msg: "Guest project deleted",
        isGuest: true
      });
    }
    
    let user = await userModel.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    let project = await projectModel.findOneAndDelete({ _id: projectId });

    return res.status(200).json({
      success: true,
      msg: "Project deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};

const editProject = async (req, res) => {
  try {
    let { projectId, name } = req.body;
    
    // Handle guest user
    if (req.user && req.user.isGuest) {
      return res.status(200).json({
        success: true,
        msg: "Guest project edited",
        isGuest: true
      });
    }
    
    let user = await userModel.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    };

    let project = await projectModel.findOne({ _id: projectId });
    if(project){
      project.name = name;
      await project.save();
      return res.status(200).json({
        success: true,
        msg: "Project edited successfully"
      })
    }
    else{
      return res.status(404).json({
        success: false,
        msg: "Project not found"
      })
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};

// GitHub authentication handler
const githubAuth = passport.authenticate('github', { scope: [ 'user:email' ] });

// GitHub callback handler
const githubCallback = (req, res, next) => {
  passport.authenticate('github', async (err, profile) => {
    if (err) return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_auth_failed`);
    
    try {
      // Check if user exists by GitHub ID or email
      let user = await userModel.findOne({ 
        $or: [
          { githubId: profile.id },
          { email: profile.emails[0].value }
        ]
      });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await userModel.create({
          email: profile.emails[0].value,
          fullName: profile.displayName || profile.username,
          password: Math.random().toString(36).slice(-8), // Generate random password
          githubId: profile.id
        });
      } else {
        // Update existing user's GitHub ID if not set
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      // Redirect to frontend with token and fullName
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&fullName=${encodeURIComponent(user.fullName)}`);
    } catch (error) {
      console.error('GitHub auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github_auth_failed`);
    }
  })(req, res, next);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found with this email address"
      });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    try {
      await sendResetCode(email, verificationCode);
      
      return res.status(200).json({
        success: true,
        msg: "Verification code sent to your email"
      });
    } catch (emailError) {
      // Rollback the saved verification code if email fails
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(emailError.statusCode || 500).json({
        success: false,
        msg: emailError.message || "Failed to send verification code. Please try again."
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      msg: "Server error. Please try again later."
    });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await userModel.findOne({ 
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired verification code"
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      resetToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};

module.exports = {
  signUp,
  login,
  createProj,
  saveProject,
  getProjects,
  getProject,
  deleteProject,
  editProject,
  githubAuth,
  githubCallback,
  forgotPassword,
  verifyResetCode,
  resetPassword
};