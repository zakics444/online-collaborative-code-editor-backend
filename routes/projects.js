const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        unique: true  // Each project must have a unique name
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']  // Enforce a minimum password length
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model (Project owner)
        required: true  // Each project must have an owner
    },
    createdAt: {
        type: Date,
        default: Date.now  // Automatically track the creation date of the project
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
