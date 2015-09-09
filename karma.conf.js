// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-swagger-ui/dist/scripts/swagger-ui.min.js',
      'src/client/app/app.js',
      'src/client/app/**/*.js',
      'src/client/components/**/*.js',
      'src/client/app/**/*.html',
      'src/client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'html2js',
      'src/client/app/**/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      instrumenterOptions: {
        istanbul: {noCompact: true}
      },
      reporters: [
        {type: 'html', subdir: 'client-report'},
        {
          type: 'lcovonly',
          subdir: '.',
          file: 'client-lcov.info'
        },
        {type: 'teamcity', subdir: '.', file: 'client-teamcity.txt'},
        {type: 'text', subdir: '.', file: 'client-text.txt'},
        {type: 'text-summary', subdir: '.', file: 'client-text-summary.txt'},]
    },

    plugins: [
      'karma-html2js-preprocessor',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ]
  });
};
