'use strict';

const Path = require("path");
const expect = require("chai").expect;
const fang = require("../.");

describe("fang", function(){

    it("returns language information about a file with a known extension", function(){
        const lang = fang('assets/main.scss');
        expect(lang).to.be.an('object');
        expect(lang).to.have.property('name');
        expect(lang).to.have.property('type');
        expect(lang).to.have.property('extensions');
        expect(lang).to.have.property('color');
        expect(lang).to.have.property('language_id');
        expect(lang).to.have.property('aliases');
    });

    it("returns undefined if the extension is not recognised", function(){
        const lang = fang('assets/main.XFXFXF');
        expect(lang).to.be.undefined;
    });

    it("returns undefined when a directory path is used", function(){
        const lang = fang('assets/css');
        expect(lang).to.be.undefined;
    });


});
