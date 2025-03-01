const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  señales: {
    type: Boolean,
    default: null
  },
  mentoria: {
    type: Boolean,
    default: null
  },
  comunidad: {
    type: Boolean,
    default: null
  }
});

module.exports = mongoose.model('Role', roleSchema); 