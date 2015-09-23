// jshint devel:true
'use strict';
$(function() {
    ace.require('ace/ext/language_tools');

    function editor(id, mode) {
        var e = ace.edit(id);
        e.setTheme('ace/theme/chrome');
        e.getSession().setMode('ace/mode/' + mode);
        e.setFontSize(14);
        e.setFadeFoldWidgets(true);
        e.setOption('vScrollBarAlwaysVisible', false);
        e.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
        e.$blockScrolling = Infinity;
        return e;
    }

    github.init()
    .then(function() {
        $('body').addClass('auth');
    })
    .catch($.noop);

    var markupEditor = editor('markup', 'html');
    var scriptEditor = editor('script', 'javascript');
    var styleEditor = editor('style', 'css');

    if (window.location.hash) {
        github.loadGist(window.location.hash.substr(1)).then(function(gist) {
            markupEditor.setValue(gist.files['markup.html'] ? (gist.files['markup.html'].content || '') : '', -1);
            scriptEditor.setValue(gist.files['script.js'] ? (gist.files['script.js'].content || '') : '', -1);
            styleEditor.setValue(gist.files['style.css'] ? (gist.files['style.css'].content || '') : '', -1);
        });
    } else {
        markupEditor.setValue(localStorage.getItem('markup') || '', -1);
        scriptEditor.setValue(localStorage.getItem('script') || '', -1);
        styleEditor.setValue(localStorage.getItem('style') || '', -1);
    }

    $('#login').click(function() {
        github.login()
        .then(function() {
            $('body').addClass('auth');
        })
        .catch(function(err) {
            $('body').removeClass('auth');
            console.log(err);
        });
    });

    var settings = {};

    $('#save').click(function() {
        var markup = markupEditor.getValue();
        var script = scriptEditor.getValue();
        var style = styleEditor.getValue();

        var gist = {
            public: true,
            files: {
                '_play.json': {
                    content: JSON.stringify(settings)
                }
            }
        };

        gist.files['markup.html'] = markup ? {content: markup} : null;
        gist.files['script.js'] = script ? {content: script} : null;
        gist.files['style.css'] = style ? {content: style} : null;

        alertify.prompt('Descrição (opcional)', function (e, response) {
            if (response) {
                gist.description = response;
            }

            var hash = window.location.hash ? window.location.hash.substr(1) : undefined;
            github.saveGist(gist, hash)
            .then(function(gist) {
                console.log(gist);
                var url = 'gist.github.com/' + gist.id;
                alertify.success('<a href="https://' + url + '">' + url + '</a>');
                window.location.hash = gist.id;
            })
            .catch(function(err) {
                console.log(err);
                alertify.error('Falhou!');
            });
        });
    });

    $('#update').click(function() {
        var output = window.parent.output.document;

        var markup = markupEditor.getValue();
        var script = scriptEditor.getValue();
        var style = styleEditor.getValue();

        localStorage.setItem('markup', markup);
        localStorage.setItem('script', script);
        localStorage.setItem('style', style);

        $(output.head).empty()
            .append($('<style>', {type: 'text/css'}).text(style))
            .append($('<script>', {type: 'text/javascript'}).text(script));
        $(output.body).empty()
            .html(markup);
    });

    $('#layout').click(function() {
        if ($('#editors').hasClass('fill-width')) {
            $('#editors').removeClass('row-xs-3 fill-width').addClass('fill-height col-xs-9');
            $('#output-pane').removeClass('row-xs-9 fill-width').addClass('fill-height col-xs-3');
        } else {
            $('#editors').removeClass('fill-height col-xs-9').addClass('row-xs-3 fill-width');
            $('#output-pane').removeClass('fill-height col-xs-3').addClass('row-xs-9 fill-width');
        }
        markupEditor.resize();
        scriptEditor.resize();
        styleEditor.resize();
    });

    $('#output-phone-size').click(function() {
        $('#output-wrapper').removeClass('sd-size').addClass('mobile-size');
    });

    $('#output-sd-size').click(function() {
        $('#output-wrapper').removeClass('mobile-size').addClass('sd-size');
    });

    $('#output-hd-size').click(function() {
        $('#output-wrapper').removeClass('mobile-size sd-size');
    });

});
