import Appointment from "../models/appointment.model.js";
import {
  sendAppointmentStatusEmail,
  sendBookingConfirmationEmail,
} from "../services/email.service.js";

// @desc    Create a new appointment
// @route   POST /api/v1/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      date,
      notes,
      reference,
      appointmentMode,
      amount,
    } = req.body;

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      service,
      date,
      notes,
      reference,
      appointmentMode,
      amount,
    });

    // Fire-and-forget: send booking confirmation email
    sendBookingConfirmationEmail(appointment).catch((err) => {
      console.error("Failed to send booking confirmation email:", err.message);
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
    // Fetch the existing appointment to compare status
    const existingAppointment = await Appointment.findById(req.params.id);

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    const oldStatus = existingAppointment.status;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    // If status changed, send email notification
    if (req.body.status && req.body.status !== oldStatus) {
      // Fire and forget - don't block the response
      sendAppointmentStatusEmail(appointment, oldStatus).catch((err) => {
        console.error("Failed to send status email:", err.message);
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
