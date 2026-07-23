import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const STATUS_VALUES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_VALUES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

const leadCreateValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(STATUS_VALUES).withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),
  body('source')
    .optional()
    .isIn(SOURCE_VALUES).withMessage(`Source must be one of: ${SOURCE_VALUES.join(', ')}`),
  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  body('phone')
    .optional()
    .trim(),
  body('value')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Deal Value must be a non-negative number'),
];

const leadUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(STATUS_VALUES).withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),
  body('source')
    .optional()
    .isIn(SOURCE_VALUES).withMessage(`Source must be one of: ${SOURCE_VALUES.join(', ')}`),
  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  body('phone')
    .optional()
    .trim(),
  body('value')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Deal Value must be a non-negative number'),
];

const leadStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(STATUS_VALUES).withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),
];

router.use(protect);

router.get('/search', searchLeads);
router.get('/stats', getLeadStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/', getLeads);
router.post('/', validate(leadCreateValidation), createLead);
router.get('/:id', getLeadById);
router.put('/:id', validate(leadUpdateValidation), updateLead);
router.patch('/:id/status', validate(leadStatusValidation), updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
