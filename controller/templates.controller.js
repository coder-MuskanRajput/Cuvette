import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import TemplateModel from "../models/template.model.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

// Create a new template
export const createTemplate = catchAsyncError(async (req, res, next) => {
    const { templateName, type, subject, body, variables } = req.body;
    const name = templateName;

    // Check for required fields
    if (!name || !type || !body) {
        return next(new ErrorHandler('Name, type, and body are required!', 400));
    }

    const template = new TemplateModel({ name, type, subject, body, variables });
    await template.save();

    res.status(201).json({ success: true, message: 'Template created successfully', template });
});

// Edit an existing template
export const editTemplate = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const template = await TemplateModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!template) {
        return next(new ErrorHandler('Template not found', 404));
    }

    res.status(200).json({ success: true, message: 'Template updated successfully', template });
});

// Delete a template
export const deleteTemplate = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const template = await TemplateModel.findByIdAndDelete(id);
    if (!template) {
        return next(new ErrorHandler('Template not found', 404));
    }

    res.status(200).json({ success: true, message: 'Template deleted successfully' });
});

// Fetch a list of templates
export const fetchTemplates = catchAsyncError(async (req, res) => {
    const templates = await TemplateModel.find();
    res.status(200).json({ success: true, templates });
});

// Fetch a single template by ID
export const fetchTemplate = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const template = await TemplateModel.findById(id);
    if (!template) {
        return next(new ErrorHandler('Template not found', 404));
    }

    res.status(200).json({ success: true, template });
});
