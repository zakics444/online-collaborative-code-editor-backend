const express = require('express');
const bcrypt = require('bcryptjs');
const Project = require('../models/Project');  // Import Project model
const authMiddleware = require('../middleware/authMiddleware');  // Import authMiddleware
const router = express.Router();

// Create Project (Protected Route)
router.post('/create', authMiddleware, async (req, res) => {
    const { projectName, password } = req.body;

    try {
        // Check if the project already exists
        const existingProject = await Project.findOne({ name: projectName });
        if (existingProject) {
            return res.status(400).json({ error: 'Project already exists' });
        }

        // Create a new project
        const newProject = new Project({
            name: projectName,
            password: password,  // Ideally, hash the password
            owner: req.user.userId  // Set the project owner to the authenticated user
        });

        // Save the project to the database
        await newProject.save();

        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
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

        // You can add logic here to associate the user with the project if necessary
        res.status(200).json({ message: 'Joined project successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join project' });
    }
});

module.exports = router;
