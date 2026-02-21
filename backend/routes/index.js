var express = require('express');
const { signUp, login, createProj, saveProject, getProjects, getProject, deleteProject, editProject, githubAuth, githubCallback, forgotPassword, verifyResetCode, resetPassword } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendContactEmail } = require('../utils/emailService');
const { handleContact } = require('../controllers/contactController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// Public routes
router.post("/signUp", signUp);
router.post("/login", login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/contact', handleContact);

// Protected routes - add the verifyToken middleware
// The actual project route handlers can focus on their core functionality
router.post("/createProj", verifyToken, createProj);
router.post("/saveProject", verifyToken, saveProject);
router.post("/getProjects", verifyToken, getProjects);
router.post("/getProject", verifyToken, getProject);
router.post("/deleteProject", verifyToken, deleteProject);
router.post("/editProject", verifyToken, editProject);

// OAuth routes
router.get('/auth/github', githubAuth);
router.get('/auth/github/callback', githubCallback);

module.exports = router;
