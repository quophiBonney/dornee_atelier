import Contact from "../models/contact.model.js";

// @desc    Submit a contact/enquiry form
// @route   POST /api/v1/contacts
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, message, subject, channel } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message,
      subject,
      channel,
    });

    res.status(201).json({
      success: true,
      message: "Contact enquiry submitted successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to submit contact enquiry",
    });
  }
};

// @desc    Get all contact enquiries
// @route   GET /api/v1/contacts
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const { status, channel, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch contacts",
    });
  }
};

// @desc    Get single contact enquiry by ID
// @route   GET /api/v1/contacts/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch contact enquiry",
    });
  }
};

// @desc    Update contact enquiry (status, notes, etc.)
// @route   PUT /api/v1/contacts/:id
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact enquiry updated successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to update contact enquiry",
    });
  }
};

// @desc    Delete contact enquiry
// @route   DELETE /api/v1/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact enquiry deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to delete contact enquiry",
    });
  }
};
