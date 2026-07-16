import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * User schema for application authentication and authorization.
 */
const UserSchema = new Schema(
  {
    /**
     * The user's display name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    /**
     * The user's email address used for login.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Email must be a valid email address'],
    },

    /**
     * Hashed password for the user account. Required only for local auth.
     * @type {String}
     */
    password: {
      type: String,
      required: [
        function() {
          return this.authProvider === 'local';
        },
        'Password is required'
      ],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    /**
     * Unique identifier from Google.
     * @type {String}
     */
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    /**
     * URL of the user's profile picture from Google.
     * @type {String}
     */
    profilePicture: {
      type: String,
    },

    /**
     * Authentication method used.
     * @type {String}
     */
    authProvider: {
      type: String,
      enum: {
        values: ['local', 'google'],
        message: 'Auth provider must be either local or google',
      },
      default: 'local',
    },

    /**
     * User role determines access level in the application.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },

    /**
     * Whether the user account is active.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function save() {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare provided password with stored hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  return obj;
};

export const User = model('User', UserSchema);
export default User;
export { UserSchema };
