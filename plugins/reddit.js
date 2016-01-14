'use strict';
var plugin = {
  name: 'Reddit Karma Info',
  desc: 'Displays reddit karma for given user',
  author: 'Slak44',
  version: '1.1.1',
  settings: [
    {
      name: 'Reddit username',
      desc: 'Karma information for this user',
      type: 'text',
      value: '',
      isVisible: true
    },
    {
      name: 'Data update period',
      desc: 'Time between karma updates, in milliseconds',
      type: 'number',
      value: '',
      isVisible: true
    }
  ],
  init: function () {
  },
  main: function (plugin) {
    var url = 'https://www.reddit.com/user/' + plugin.settings[0].value;
    function updateRedditKarma() {
      var req = new XMLHttpRequest();
      req.open('GET', url + '/about.json');
      req.onload = function () {
        if (req.status === 200) {
          var data = JSON.parse(req.response);
          byId('reddit-karma').innerHTML =
            '<a href="'+url+'" class="color accent-4">' + data.data.comment_karma + '</a> comment karma<br><a href="'+url+'" class="color accent-4">' + data.data.link_karma + '</a> link karma';
        } else throw new Error('Failed request.');
      };
      req.onloadend = function () {
        setTimeout(updateRedditKarma, plugin.settings[1].value);
      };
      req.send();
    }
    byId('data-collection').insertAdjacentHTML('beforeend', '<li class="collection-item"><h5 id="reddit-karma"></h5></li>');
    setTimeout(updateRedditKarma, 0);
  }
};
/*jshint -W030 */
plugin;
