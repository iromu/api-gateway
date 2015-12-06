'use strict';

describe('Main View', function () {
  var page;

  //http://balancer.local/prd-prsn.com/api/version/

  beforeEach(function () {
    browser.get('/');
    page = require('./main.po.js');
  });

  it('should include jumbotron with correct data', function () {
    expect(page.headingEl.getText()).toBe('Versionable REST Registry');
  });
});
