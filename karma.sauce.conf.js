
// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-sauce-launcher')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['SL_Chrome_Windows', 'SL_Chrome_Linux', 'SL_Chrome_macOS', 'SL_Chrome_Windows_7'],
    singleRun: true,
    sauceLabs: {
        build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
        startConnect: false,
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    },

    customLaunchers: {
      'SL_Chrome_Windows': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest',
        platform: 'Windows 10'
      },
      'SL_Chrome_Linux': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest',
        platform: 'Linux'
      },
      'SL_Chrome_macOS': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest',
        platform: 'macOS 10.12'
      },
      'SL_Chrome_Windows_7': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest',
        platform: 'Windows 7'
      }
    }
  });
};
