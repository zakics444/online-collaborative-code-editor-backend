import React, { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';

const Project = () => {
    const [projectData, setProjectData] = useState({ projectName: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleCreateProject = async () => {
        try {
            await axios.post('/projects/create', projectData);
            navigate('/editor');  // Redirect to editor after project creation
        } catch (error) {
            console.error('Error creating project', error);
        }
    };

    const handleJoinProject = async () => {
        try {
            await axios.post('/projects/join', projectData);
            navigate('/editor');  // Redirect to editor after joining project
        } catch (error) {
            console.error('Error joining project', error);
        }
    };

    return (
        <div>
            <h2>Create or Join a Project</h2>
            <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={projectData.projectName}
                onChange={handleInputChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={projectData.password}
                onChange={handleInputChange}
                required
            />
            <button onClick={handleCreateProject}>Create Project</button>
            <button onClick={handleJoinProject}>Join Project</button>
        </div>
    );
};

export default Project;
