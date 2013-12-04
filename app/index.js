'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var WalkerBackboneGenerator = module.exports = function WalkerBackboneGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.testFramework = this.options['test-framework'] || 'mocha';
  this.templateFramework = 'underscore';
  this.hookFor(this.testFramework, {
    as: 'app',
    options: {
      options: {
        'skip-install': this.options['skip-install']
      }
    }
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WalkerBackboneGenerator, yeoman.generators.Base);

WalkerBackboneGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log('Out of the box I include Compass, jQuery, Backbone.js, Underscore.js, RequireJS, & Modernizr.\n');

  var prompts = [{
    type: 'confirm',
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap-sass version (Yes)?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.bootstrap = props.bootstrap;

    cb();
  }.bind(this));
};

WalkerBackboneGenerator.prototype.app = function app() {
  this.mkdir('app');
  // Make Folder structure
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.mkdir('app/bower_components');
  this.mkdir('app/scripts');
  // Backbone
  this.mkdir('app/scripts/collections');
  this.mkdir('app/scripts/models');
  this.mkdir('app/scripts/routes');
  this.mkdir('app/scripts/view');
  // JS Files
  this.copy('_app.js','app/scripts/app.js');
  this.template('_main.js','app/scripts/main.js');
  // Non-Backbone
  this.mkdir('app/scripts/custom');
  this.mkdir('app/scripts/vendor');
  // SCSS
  this.copy ('_main.scss', 'app/styles/main.scss');
};

WalkerBackboneGenerator.prototype.writeIndexWithRequirejs = function writeIndexWithRequirejs() {
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), '_index.html'));
  this.indexFile = this.engine(this.indexFile, this);
  this.indexFile = this.append(this.indexFile, 'body', '\n        <script data-main="scripts/main" src="scripts/bower_components/requirejs/require.js"></script>\n    ');
};

WalkerBackboneGenerator.prototype.writeIndex = function writeIndex() {
  this.write('app/index.html', this.indexFile);
};

WalkerBackboneGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  // NPM
  this.copy('_package.json', 'package.json');
  // Git
  this.copy('.gitignore', '.gitignore');
  // Bower
  this.template('_bower.json', 'bower.json');
  this.copy('.bowerrc','.bowerrc');
  // Compass
  this.copy('config.rb','config.rb');
  // Finally Grunt
  this.copy('Gruntfile.js', 'Gruntfile.js');
};
