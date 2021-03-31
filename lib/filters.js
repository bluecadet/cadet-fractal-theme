'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

function getConfigData(viewPath) {
  const compPath = viewPath.substring(0, viewPath.lastIndexOf("/"));
  const files = fs.readdirSync(compPath);
  const configFile = files.find((file) => {
    return file.includes('config');
  });

  if ( !configFile ) {
    return false;
  }

  const filePath = path.join(compPath, configFile);
  let configData;

  if ( path.extname(configFile) === '.yml' ) {
    configData = yaml.load(fs.readFileSync(filePath, 'utf8'));
  } else {
    configData = require(filePath);
  }

  return configData;
}


module.exports = function (theme, env, app) {
  env.engine.addGlobal('getContext', function() {
    return this.ctx;
  });

  env.engine.addGlobal('getKnownViolations', function() {
    const ctx = this.ctx;
    const viewPath = ctx.entity.viewPath;
    const configData = getConfigData(viewPath);

    if ( !configData || !configData.knownViolations ) {
      return false;
    }

    return configData.knownViolations.join(',');
  });
};
