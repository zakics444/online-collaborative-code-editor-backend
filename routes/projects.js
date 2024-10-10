const express = require('express');
const Project = require('../models/Project');  // Correct import of Project model
const authMiddleware = require('./auth').authMiddleware;  // Correct import of authMiddleware
const router = express.Router();

// Create Project (Protected Route)
router.post('/create', authMiddleware, async (req, res) => {
    const { projectName, password } = req.body;

    try {
        // Ensure the project name and password are provided
        if (!projectName || !password) {
            return res.status(400).json({ error: 'Project name and password are required' });
        }

        // Create a new project
        const newProject = new Project({
            name: projectName,
            password: password,  // In production, hash the password for security
            owner: req.user.userId  // Set the authenticated user as the project owner
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Join Project (Protected Route)
router.post('/join', authMiddleware, async (req, res) => {
    const { projectName, password } = req.body;

    try {
        const project = await Project.findOne({ name: projectName });
        if (!project || project.password !== password) {
            return res.status(401).json({ error: 'Invalid project credentials' });
        }

        // Logic to associate the user with the project (if necessary)
        res.status(200).json({ message: 'Joined project successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to join project' });
    }
});

module.exports = router;
