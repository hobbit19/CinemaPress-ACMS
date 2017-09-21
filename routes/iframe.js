'use strict';

/**
 * Module dependencies.
 */

var CP_get = require('../lib/CP_get.min');

/**
 * Configuration dependencies.
 */

var modules = require('../config/production/modules');

/**
 * Node dependencies.
 */

var express = require('express');
var router  = express.Router();

/**
 * RSS.
 */

router.get('/:id?/:title?', function(req, res) {

    var kinopoisk = (req.params.id) ? ('' + req.params.id).replace(/\D/g, '') : '';
    var title = (req.params.title) ? req.params.title.replace(/"/g, '\'') : '';

    if (kinopoisk && title) {
    }
    else if (kinopoisk) {
        CP_get.movies(
            {"query_id": req.params.id}, 1, '', 1, false,
            function (err, movies) {
                if (err) return res.status(404).send(err);

                if (movies && movies.length) {
                    title = (movies[0].title_ru || movies[0].title_en) + ' (' + movies[0].year + ')';
                    title = title.replace(/"/g, '\'');
                }
                else {
                    return res.status(404).send('Данного фильма на сайте нет.');
                }
            });
    }
    else {
        return res.status(404).send('Неверный ID.')
    }

    res.send(
        '<!DOCTYPE html><html><body>' +
        '<style>body,html{border:0;padding:0;margin:0;width:100%;height:100%;overflow:hidden}</style>' +
        '<div id="yohoho" ' +
        'data-kinopoisk="' + kinopoisk + '" ' +
        'data-title="' + title + '" ' +
        'data-bg="' + modules.player.data.yohoho.bg + '" ' +
        '></div>' +
        '<script data-cfasync="false" src="//yohoho.cc/yo.js"></script>' +
        '</body></html>'
    );

});

module.exports = router;