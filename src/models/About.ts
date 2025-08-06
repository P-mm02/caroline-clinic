import { Schema, model, models } from 'mongoose'

const AboutSchema = new Schema(
  {
    aboutDescription1: {
      en: { type: String, default: '' },
      th: { type: String, default: '' },
      jp: { type: String, default: '' },
      zh: { type: String, default: '' },
    },
    aboutDescription2: {
      en: { type: String, default: '' },
      th: { type: String, default: '' },
      jp: { type: String, default: '' },
      zh: { type: String, default: '' },
    },
    aboutImage: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

const About = models.About || model('About', AboutSchema, 'abouts')
export default About
