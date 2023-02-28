import mongoose from 'mongoose';
const { Schema } = mongoose;


const VulnerabilitiesSchema = new Schema(
  {
    code: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    status: {
      type: Boolean,
      require: true,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const mongose = mongoose.model('vulnerabilities', VulnerabilitiesSchema);

export class vulnerabilities { }