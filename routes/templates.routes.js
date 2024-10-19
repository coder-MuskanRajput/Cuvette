import express from 'express';
import {
    createTemplate,
    editTemplate,
    deleteTemplate,
    fetchTemplates,
    fetchTemplate
} from '../controller/templates.controller.js';

const router = express.Router();

router.post('/create-template', createTemplate); // Create a new template
router.put('/templates/:id', editTemplate); // Edit an existing template
router.delete('/templates/:id', deleteTemplate); // Delete a template
router.get('/templates', fetchTemplates); // Fetch all templates
router.get('/templates/:id', fetchTemplate); // Fetch a single template

export default router;
