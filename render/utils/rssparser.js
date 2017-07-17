const Parser = require('rss-parser');
const HTTP = require('http');
const HTTPS = require('https');
const URL = require('url');
const request = require('request');

function parseString(xml) {
    return new Promise((resolve, reject) => {
        Parser.parseString(xml, (err, parsed) => {
            if (err) {
                reject(err);
            } else {
                resolve(parsed);
            }
        });
    });
}

function getFeed(options) {
    options = Object.assign({}, {
        timeout: 4000
    }, options);
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve({ response, body });
            }
        })
    });
}

module.exports = function (options) {
    return getFeed(options).then(res => {
        return res.body;
    }).then(parseString);
    // return new Promise((resolve, reject) => {
    //     Parser.parseURL(options.url, (error, response, body) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             console.log('success');
    //             resolve(response);
    //         }
    //     })
    // });
}