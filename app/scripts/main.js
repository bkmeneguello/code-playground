// jshint devel:true
'use strict';
$(function() {
    ace.require('ace/ext/language_tools');

    function editor(id, mode, value) {
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
        e.setValue(value || '', -1);
        return e;
    }

    var markupEditor = editor('markup', 'html', localStorage.getItem('markup'));
    var scriptEditor = editor('script', 'javascript', localStorage.getItem('script'));
    var styleEditor = editor('style', 'css', localStorage.getItem('style'));

    OAuth.initialize('mj0kqdjERrNWCYZ8XCr8lNa3LYE');
    var github = OAuth.create('github');
    $('body').toggleClass('auth', !!github);

    $('#login').click(function() {
        OAuth.popup('github', {cache: true})
            .done(function(result) {
                $('body').toggleClass('auth', true);
                console.log(result);
                github = result;
            })
            .fail(function (err) {
                $('body').toggleClass('auth', false);
                console.log(err);
            });
    });

    $('#save').click(function() {
        var markup = markupEditor.getValue();
        var script = scriptEditor.getValue();
        var style = styleEditor.getValue();

        var gist = {
            public: true,
            files: {
                '_play.conf': {
                    content: '{}'
                },
                markup: {
                    content: markup
                },
                script: {
                    content: script
                },
                style: {
                    content: style
                }
            }
        };

        alertify.prompt('Descrição (opcional)', function (e, response) {
            if (response) {
                gist.description = response;
            }
            github.post('/gists', {
                dataType: 'json',
                data: JSON.stringify(gist)
            })
            .done(function(result) {
                console.log(result);
                var url = 'gist.github.com/' + result.id;
                alertify.success('<a href="https://' + url + '">' + url + '</a>');
                window.location.hash = result.id;
            })
            .fail(function(err) {
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
});
