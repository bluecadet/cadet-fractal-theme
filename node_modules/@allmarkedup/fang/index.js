'use strict';

const path      = require('path');
const languages = require('./languages');

module.exports = function fang(filePath) {

    const ext = path.extname(filePath).toLowerCase();
    for (let lang of languages) {
        if (lang.extensions.indexOf(ext) !== -1) {
            return lang;
        }
    }
    return;
};
