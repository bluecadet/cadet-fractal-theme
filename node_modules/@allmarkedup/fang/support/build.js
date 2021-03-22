#! /usr/bin/env node

'use strict';

const _       = require('lodash');
const fs      = require('fs');
const yaml    = require('js-yaml');

fs.readFile(`${__dirname}/languages.yml`, 'utf-8', function(err, contents){
    if (err) {
        return console.log(err);
    }
    const data = yaml.load(contents);
    const langs = _.map(data, (value, key) => {
        value.name = key;
        value.color = value.color || '#000';
        value.aliases = value.aliases || [];
        value.extensions = [].concat(value.extensions);
        return value;
    });
    fs.writeFile(`${__dirname}/../languages.json`, JSON.stringify(langs, null, 2), 'utf-8', function(err){
        if (err) {
            return console.log(err);
        }
        console.log('✔︎ languages.json file generated successfully.');
    });
});
