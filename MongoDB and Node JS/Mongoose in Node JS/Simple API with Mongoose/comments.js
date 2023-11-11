const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    name: String,
    lang: String,
    exp: Number
});

module.exports = mongoose.model('comments', blogSchema);

