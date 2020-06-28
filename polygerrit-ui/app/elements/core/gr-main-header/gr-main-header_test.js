/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../../test/common-test-setup-karma.js';
import './gr-main-header.js';

const basicFixture = fixtureFromElement('gr-main-header');

suite('gr-main-header tests', () => {
  let element;

  setup(() => {
    stub('gr-rest-api-interface', {
      getConfig() { return Promise.resolve({}); },
      probePath(path) { return Promise.resolve(false); },
    });
    stub('gr-main-header', {
      _loadAccount() {},
    });
    element = basicFixture.instantiate();
  });

  test('link visibility', () => {
    element.loading = true;
    assert.equal(getComputedStyle(element.shadowRoot
        .querySelector('.accountContainer')).display,
    'none');
    element.loading = false;
    element.loggedIn = false;
    assert.notEqual(getComputedStyle(element.shadowRoot
        .querySelector('.accountContainer')).display,
    'none');
    assert.notEqual(getComputedStyle(element.shadowRoot
        .querySelector('.loginButton')).display,
    'none');
    assert.notEqual(getComputedStyle(element.shadowRoot
        .querySelector('.registerButton')).display,
    'none');
    assert.equal(getComputedStyle(element.shadowRoot
        .querySelector('gr-account-dropdown')).display,
    'none');
    assert.equal(getComputedStyle(element.shadowRoot
        .querySelector('.settingsButton')).display,
    'none');
    element.loggedIn = true;
    assert.equal(getComputedStyle(element.shadowRoot
        .querySelector('.loginButton')).display,
    'none');
    assert.equal(getComputedStyle(element.shadowRoot
        .querySelector('.registerButton')).display,
    'none');
    assert.notEqual(getComputedStyle(element.shadowRoot
        .querySelector('gr-account-dropdown'))
        .display,
    'none');
    assert.notEqual(getComputedStyle(element.shadowRoot
        .querySelector('.settingsButton')).display,
    'none');
  });

  test('fix my menu item', () => {
    assert.deepEqual([
      {url: 'https://awesometown.com/#hashyhash'},
      {url: 'url', target: '_blank'},
    ].map(element._fixCustomMenuItem), [
      {url: 'https://awesometown.com/#hashyhash'},
      {url: 'url'},
    ]);
  });

  test('user links', () => {
    const defaultLinks = [{
      title: 'Faves',
      links: [{
        name: 'Pinterest',
        url: 'https://pinterest.com',
      }],
    }];
    const userLinks = [{
      name: 'Facebook',
      url: 'https://facebook.com',
    }];
    const adminLinks = [{
      name: 'Repos',
      url: '/repos',
    }];

    // When no admin links are passed, it should use the default.
    assert.deepEqual(element._computeLinks(
        defaultLinks,
        /* userLinks= */[],
        adminLinks,
        /* topMenus= */[],
        /* docBaseUrl= */ ''
    ),
    defaultLinks.concat({
      title: 'Browse',
      links: adminLinks,
    }));
    assert.deepEqual(element._computeLinks(
        defaultLinks,
        userLinks,
        adminLinks,
        /* topMenus= */[],
        /* docBaseUrl= */ ''
    ),
    defaultLinks.concat([
      {
        title: 'Your',
        links: userLinks,
      },
      {
        title: 'Browse',
        links: adminLinks,
      }])
    );
  });

  test('documentation links', () => {
    const docLinks = [
      {
        name: 'Table of Contents',
        url: '/index.html',
      },
    ];

    assert.deepEqual(element._getDocLinks(null, docLinks), []);
    assert.deepEqual(element._getDocLinks('', docLinks), []);
    assert.deepEqual(element._getDocLinks('base', null), []);
    assert.deepEqual(element._getDocLinks('base', []), []);

    assert.deepEqual(element._getDocLinks('base', docLinks), [{
      name: 'Table of Contents',
      target: '_blank',
      url: 'base/index.html',
    }]);

    assert.deepEqual(element._getDocLinks('base/', docLinks), [{
      name: 'Table of Contents',
      target: '_blank',
      url: 'base/index.html',
    }]);
  });

  test('top menus', () => {
    const adminLinks = [{
      name: 'Repos',
      url: '/repos',
    }];
    const topMenus = [{
      name: 'Plugins',
      items: [{
        name: 'Manage',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        /* defaultLinks= */ [],
        /* userLinks= */ [],
        adminLinks,
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Browse',
      links: adminLinks,
    },
    {
      title: 'Plugins',
      links: [{
        name: 'Manage',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }]);
  });

  test('ignore top project menus', () => {
    const adminLinks = [{
      name: 'Repos',
      url: '/repos',
    }];
    const topMenus = [{
      name: 'Projects',
      items: [{
        name: 'Project Settings',
        target: '_blank',
        url: '/plugins/myplugin/${projectName}',
      }, {
        name: 'Project List',
        target: '_blank',
        url: '/plugins/myplugin/index.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        /* defaultLinks= */ [],
        /* userLinks= */ [],
        adminLinks,
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Browse',
      links: adminLinks,
    },
    {
      title: 'Projects',
      links: [{
        name: 'Project List',
        url: '/plugins/myplugin/index.html',
      }],
    }]);
  });

  test('merge top menus', () => {
    const adminLinks = [{
      name: 'Repos',
      url: '/repos',
    }];
    const topMenus = [{
      name: 'Plugins',
      items: [{
        name: 'Manage',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }, {
      name: 'Plugins',
      items: [{
        name: 'Create',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/create.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        /* defaultLinks= */ [],
        /* userLinks= */ [],
        adminLinks,
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Browse',
      links: adminLinks,
    }, {
      title: 'Plugins',
      links: [{
        name: 'Manage',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }, {
        name: 'Create',
        url: 'https://gerrit/plugins/plugin-manager/static/create.html',
      }],
    }]);
  });

  test('merge top menus in default links', () => {
    const defaultLinks = [{
      title: 'Faves',
      links: [{
        name: 'Pinterest',
        url: 'https://pinterest.com',
      }],
    }];
    const topMenus = [{
      name: 'Faves',
      items: [{
        name: 'Manage',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        defaultLinks,
        /* userLinks= */ [],
        /* adminLinks= */ [],
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Faves',
      links: defaultLinks[0].links.concat([{
        name: 'Manage',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }]),
    }, {
      title: 'Browse',
      links: [],
    }]);
  });

  test('merge top menus in user links', () => {
    const userLinks = [{
      name: 'Facebook',
      url: 'https://facebook.com',
    }];
    const topMenus = [{
      name: 'Your',
      items: [{
        name: 'Manage',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        /* defaultLinks= */ [],
        userLinks,
        /* adminLinks= */ [],
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Your',
      links: userLinks.concat([{
        name: 'Manage',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }]),
    }, {
      title: 'Browse',
      links: [],
    }]);
  });

  test('merge top menus in admin links', () => {
    const adminLinks = [{
      name: 'Repos',
      url: '/repos',
    }];
    const topMenus = [{
      name: 'Browse',
      items: [{
        name: 'Manage',
        target: '_blank',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }],
    }];
    assert.deepEqual(element._computeLinks(
        /* defaultLinks= */ [],
        /* userLinks= */ [],
        adminLinks,
        topMenus,
        /* baseDocUrl= */ ''
    ), [{
      title: 'Browse',
      links: adminLinks.concat([{
        name: 'Manage',
        url: 'https://gerrit/plugins/plugin-manager/static/index.html',
      }]),
    }]);
  });

  test('register URL', () => {
    const config = {
      auth: {
        auth_type: 'LDAP',
        register_url: 'https//gerrit.example.com/register',
      },
    };
    element._retrieveRegisterURL(config);
    assert.equal(element._registerURL, config.auth.register_url);
    assert.equal(element._registerText, 'Sign up');

    config.auth.register_text = 'Create account';
    element._retrieveRegisterURL(config);
    assert.equal(element._registerURL, config.auth.register_url);
    assert.equal(element._registerText, config.auth.register_text);
  });

  test('register URL ignored for wrong auth type', () => {
    const config = {
      auth: {
        auth_type: 'OPENID',
        register_url: 'https//gerrit.example.com/register',
      },
    };
    element._retrieveRegisterURL(config);
    assert.equal(element._registerURL, null);
    assert.equal(element._registerText, 'Sign up');
  });
});

