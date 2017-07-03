(function() {
  'use strict';

  var _ = require('lodash');
  var fs = require('fs');
  var request = require('request');
  var parseString = require('xml2js').parseString;

  var podcast_URL = 'http://urotrosfiles.media.streamtheworld.com/otrosfiles/podcasts/517.xml';
  var db_file = 'resources/db.json';
  var parserConfig = {
    ignoreAttrs: true,
    trim: true,
    normalize: true
  };

  var download = function(download_url, filename, callback) {
    request.get(download_url, function (err, response, body) {
      if (err && response.statusCode != 200) {
        return callback(err);
      }

      parseString(body, parserConfig, function (err, result) {
        if (err) {
          return callback(err);
        }

        var db = null;
        var dbLoaded = true;
        var written = false;
        var firstItemURL = '';
        var i = 0;

        try {
          db = JSON.parse(fs.readFileSync(db_file, 'utf8'));

        } catch (e) {
          db = {
            lastDate: '',
            lastMP3URL: '',
            items: []
          };
          dbLoaded = false;
        }

        _(result['rss']['channel'][0]['item']).forEach(function(item, j) {
          var itemURL = item['guid'][0];
          if (j === 0) {
            firstItemURL = itemURL;
          }

          if (db.lastMP3URL === itemURL) {
            return false;
          }

          var itemToAdd = {
            url: itemURL,
            title: item['itunes:summary'][0],
            duration: item['itunes:duration'][0],
            pubDate: (new Date(item['pubDate'][0])).toJSON()
          };

          i = j;
          if (!dbLoaded) {
            db.items.push(itemToAdd);
            written = true;

          } else {
            db.items.splice(j, 0, itemToAdd);
            written = true;
          }
        });

        if (written) {
          console.log('Adding ' + (i + 1) + ' new entry/ies...');
          db.lastDate = (new Date()).toJSON();
          db.lastMP3URL = firstItemURL;
          return fs.writeFile(filename, JSON.stringify(db, null, 2), 'utf-8', callback);
        }
      });
    });
  };

  download(podcast_URL, db_file, function(err) {
    if (err) {
      console.log(err);
      return null;
    }
  });

})();
