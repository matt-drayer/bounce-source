const slugify = require('slugify');

const toSlug = (str) => slugify(str, { lower: true, trim: true, strict: true, nullObject: true });

module.exports = toSlug;
