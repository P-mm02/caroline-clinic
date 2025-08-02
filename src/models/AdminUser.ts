import { Schema, model, models } from 'mongoose'

const roles = ['superadmin', 'admin', 'operator', 'viewer'] as const

const AdminUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows some users without email
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: roles,
      default: 'viewer',
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
)

const AdminUser =
  models.AdminUser || model('AdminUser', AdminUserSchema, 'adminusers')
export default AdminUser
