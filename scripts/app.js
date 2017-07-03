(function(window, document) {
  'use strict';

  var _ = require('lodash');
  var $ = require('jquery');

  var dbURL = 'resources/db.json';

  var getDB = $.ajax({
    type: 'GET',
    url: dbURL,
    dataType: 'json'
  });

  getDB.done(function(db, textStatus, jqXHR) {
    _(db.items).forEach(function(item, i) {
      if (i >= 30) {
        return false;
      }

      var pubDate = new Date(item.pubDate);
      var date = ('0' + pubDate.getDate()).slice(-2);
      var month = ('0' + (pubDate.getMonth() + 1)).slice(-2);
      var title = pubDate.getUTCFullYear() + '/' + month + '/' + date + ' - '+ item.title;

      $('<h3>').text(title).appendTo('body');
      $('<audio>').attr({
        src: item.url,
        preload: 'metadata',
        controls: 'controls'
      }).appendTo('body');
    });
  });

  getDB.done(function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
  });

})(window, document);
