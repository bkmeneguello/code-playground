// jshint devel:true
'use strict';
(function (global) {

    var Github = function () {

        var github = {};

        var _ = {
            init: function() {
                var self = this;
                return new Promise(function(resolve, reject) {
                    OAuth.initialize('mj0kqdjERrNWCYZ8XCr8lNa3LYE');
                    self.oauth = OAuth.create('github');
                    if (self.oauth) {
                        resolve(github);
                    } else {
                        reject();
                    }
                });
            },
            login: function() {
                var self = this;
                return new Promise(function(resolve, reject) {
                    OAuth.popup('github', {cache: true})
                    .done(function(result) {
                        self.oauth = result;
                        resolve(github);
                    })
                    .fail(function (err) {
                        reject(err);
                    });
                });
            },
            loadGist: function(hash) {
                return new Promise(function(resolve, reject) {
                    $.getJSON('https://api.github.com/gists/' + hash)
                    .done(resolve)
                    .fail(reject);
                });
            },
            saveGist: function(gist, hash) {
                var self = this;
                return new Promise(function(resolve, reject) {
                    var gistUrl = '/gists' + (hash ? '/' + hash : '');
                    self.oauth.post(gistUrl, {
                        dataType: 'json',
                        data: JSON.stringify(gist)
                    })
                    .done(resolve)
                    .fail(reject);
                });
            }
        };

        github.init = _.init;
        github.login = _.login;
        github.loadGist = _.loadGist;
        github.saveGist = _.saveGist;

        return github;
    };

	// AMD and window support
	if (typeof define === 'function') {
		define([], function () { return new Github(); });
	} else if (typeof global.github === 'undefined') {
		global.github = new Github();
	}
}(this));
