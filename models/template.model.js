import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid template name!`
    }
  },
  type:{
    type:String,
    required:true,
    enum:[ 'sms','email']
  },
  subject: {
    type: String,
    // required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v.length <= 78;
      },
      message: 'Subject cannot exceed 78 characters!'
    }
  },
  body: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v.length <= 1000;
      },
      message: 'Email body cannot exceed 1000 characters!'
    }
  },
  variables: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.every(variable => /^[{]{2}[a-zA-Z0-9_]+[}]{2}$/.test(variable));
      },
      message: 'Variables must be in the format {{variable}}'
    },
  },
}, {timestamps:true});

// Middleware to sanitize 'subject' and 'body' before saving
templateSchema.pre('save', function (next) {
  this.subject = sanitizeHtml(this.subject);
  this.body = sanitizeHtml(this.body);
  this.updatedAt = Date.now();
  next();
});

const TemplateModel = mongoose.model('template', templateSchema);

export default TemplateModel;
