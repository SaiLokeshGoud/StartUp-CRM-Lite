import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lead schema for capturing prospect information in the CRM.
 */
const LeadSchema = new Schema(
  {
    /**
     * The lead's full name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters'],
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },

    /**
     * Company or organization associated with the lead.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },

    /**
     * Lead email address for outreach and notifications.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Email must be a valid email address'],
    },

    /**
     * Optional phone number for the lead.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
    },

    /**
     * Current stage of the lead in the sales pipeline.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of the predefined lead stages',
      },
      default: 'New',
    },

    /**
     * Source where the lead originated.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of the predefined lead sources',
      },
      default: 'Website',
    },

    /**
     * Additional notes and context for the lead.
     * @type {String}
     */
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    /**
     * Reference to the user who created or owns this lead.
     * @type {mongoose.Types.ObjectId}
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Number of days since the lead was created.
 * @returns {number|null}
 */
LeadSchema.virtual('age').get(function getAge() {
  if (!this.createdAt) {
    return null;
  }

  const diffMs = Date.now() - this.createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

LeadSchema.index({ owner: 1, status: 1 });
LeadSchema.index({ owner: 1, source: 1 });
LeadSchema.index({ owner: 1, createdAt: -1 });
LeadSchema.index({ email: 1 });

export const Lead = model('Lead', LeadSchema);
export { LeadSchema };
