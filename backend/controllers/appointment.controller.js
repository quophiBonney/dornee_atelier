import Appointment from "../models/appointment.model.js";

// @desc    Create a new appointment
// @route   POST /api/v1/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, service, date, notes, reference, amount } =
      req.body;

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      service,
      date,
      notes,
      reference,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create appointment",
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private/Admin
export const getAppointments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
      ];
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch appointments",
    });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/v1/appointments/:id
// @access  Private/Admin
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch appointment",
    });
  }
};

// @desc    Update appointment (status, date, notes, etc.)
// @route   PUT /api/v1/appointments/:id
// @access  Private/Admin
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to update appointment",
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to delete appointment",
    });
  }
};
