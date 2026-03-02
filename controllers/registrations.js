const Registration = require('../models/Registration');
const Company = require('../models/Company');

// @desc    Get registrations
// @route   GET /api/v1/registrations
// @access  Private (admin gets all, user gets own)
exports.getRegistrations = async (req, res) => {
  try {
    let registrations;

    if (req.user && req.user.role === 'admin') {
      registrations = await Registration.find().populate('company').populate('user');
    } else {
      registrations = await Registration.find({ user: req.user.id }).populate('company');
    }

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single registration
// @route   GET /api/v1/registrations/:id
// @access  Private
exports.getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('company').populate('user');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (req.user.role !== 'admin' && registration.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this registration' });
    }

    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create registration
// @route   POST /api/v1/registrations
// @access  Private
exports.createRegistration = async (req, res) => {
  try {
    const { company: companyId, apptDate } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const registrationCount = await Registration.countDocuments({ user: req.user.id });
    if (registrationCount >= 3) {
      return res.status(400).json({ success: false, message: 'User can not register more than 3 companies' });
    }

    const existing = await Registration.findOne({ user: req.user.id, company: companyId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already registered with this company' });
    }

    const registration = await Registration.create({ apptDate, company: companyId, user: req.user.id });

    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// @desc    Update registration
// @route   PUT /api/v1/registrations/:id
// @access  Private
exports.updateRegistration = async (req, res) => {
  try {
    let registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (req.user.role !== 'admin' && registration.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this registration' });
    }

    registration = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete registration
// @route   DELETE /api/v1/registrations/:id
// @access  Private
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (req.user.role !== 'admin' && registration.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this registration' });
    }

    await registration.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
