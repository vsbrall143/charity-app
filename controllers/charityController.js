const { where } = require("sequelize");
const Charity = require("../models/Charity");
const Project = require("../models/Project");
const { Op } = require("sequelize");

require("dotenv").config();

exports.approvecharity = async (req, res) => {
  const charityid = req.params.charityid;

  try {
    // Find the project by ID
    const charity = await Charity.findByPk(charityid);

    if (!charity) {
      return res.status(404).json({ message: "charity not found" });
    }

    // Update the approve field to 1 (approved)
    charity.approve = 1;
    await charity.save();

    res.status(200).json({ message: "Charity approved successfully" });
  } catch (error) {
    console.error("Error approving charity:", error);
    res.status(500).json({ message: "Failed to approve charity" });
  }
};

exports.deleteproject = async (req, res) => {
  const projectId = req.params.projectid;

  try {
    // Find the project by ID
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project
    await project.destroy();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

exports.unapprovedcharities = async (req, res) => {
  try {
    const charities = await Charity.findAll({
      where: { approve: 0 }, // Fetch only approved projects
    });
    res.json(charities);
  } catch (error) {
    console.error("Error fetching unapproved charities:", error);
    res.status(500).json({ error: "Failed to fetch unapproved charities" });
  }
};

exports.allprojects = async (req, res) => {
  try {
    const { charityid } = req.params; // Extract charity ID from request parameters
    console.log(req.params);
    const projects = await Project.findAll({
      where: {
        charity_id: charityid, // Filter by charity ID
      },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.allcharities = async (req, res) => {
  try {
    const { search, location, category, approve } = req.query;
    let whereClause = {};

    // Search by name (case insensitive)
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` }; // Op.like for partial matching
    }

    // Filter by location
    if (location) {
      whereClause.location = location.split(",");
    }

    // Filter by category
    if (category) {
      whereClause.category = category.split(",");
    }

    // Filter by approval status
    if (approve) {
      whereClause.approve = approve.split(",").map(Number); // Convert to numbers
    }

    // Fetch filtered charities
    const charities = await Charity.findAll({ where: whereClause });

    res.json(charities);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching charities");
  }
};

// exports.allcharities = async (req, res) => {
//   try {

//     const charities = await Charity.findAll({
//       where:{
//         approve:1
//       }
//     });
//     res.json(charities);
//   } catch (error) {
//     console.error('Error fetching charities:', error);
//     res.status(500).json({ error: 'Failed to fetch charities' });
//   }
// };

exports.registerCharity = async (req, res) => {
  try {
    const { name, description,mission,category,location,registrationNumber } = req.body;

    const charity = await Charity.create({ name, description, mission ,category,location,registrationNumber});

    res
      .status(201)
      .json({ message: "Charity registered successfully", charity });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error registering charity", details: err.message });
  }
};

exports.getCharityProfile = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.charityId, {
      include: ["Projects"],
    });

    if (!charity) {
      return res.status(404).json({ error: "Charity not found" });
    }

    res.status(200).json({ charity });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error retrieving charity profile",
        details: err.message,
      });
  }
};

const multer = require("multer");
const path = require("path");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename with timestamp
  },
});

const upload = multer({ storage });

// Middleware for file upload
exports.uploadMiddleware = upload.single("image");

exports.addProject = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging
    console.log("Uploaded File:", req.file); // Debugging

    const { title, description, target, current } = req.body;

    // Ensure fields are received correctly
    if (!title || !description || !target) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const charityId = req.user.id; // Extract charity ID from authenticated user
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL if uploaded

    const project = await Project.create({
      title,
      description,
      charity_id: charityId,
      imageUrl,
      target,
      current,
    });

    res.status(201).json({ message: "Project added successfully", project });
  } catch (err) {
    console.error("Error adding project:", err);
    res
      .status(500)
      .json({ error: "Error adding project", details: err.message });
  }
};
