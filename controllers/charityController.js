const Charity = require('../models/Charity');
const Project = require('../models/Project');

exports.registerCharity = async (req, res) => {
  try {
    const { name, description, goal } = req.body;

    const charity = await Charity.create({ name, description, goal });

    res.status(201).json({ message: 'Charity registered successfully', charity });
  } catch (err) {
    res.status(500).json({ error: 'Error registering charity', details: err.message });
  }
};

exports.getCharityProfile = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.charityId, {
      include: ['Projects'],
    });

    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' });
    }

    res.status(200).json({ charity });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving charity profile', details: err.message });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const charityId = req.params.charityId;

    const project = await Project.create({ title, description, charity_id: charityId });

    res.status(201).json({ message: 'Project added successfully', project });
  } catch (err) {
    res.status(500).json({ error: 'Error adding project', details: err.message });
  }
};
