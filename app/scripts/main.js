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
        return e;
    }

    var htmlEditor = editor('html', 'html');
    var jsEditor = editor('js', 'javascript');
    var cssEditor = editor('css', 'css');

    OAuth.initialize('mj0kqdjERrNWCYZ8XCr8lNa3LYE');

    $('#login').click(function() {
        OAuth.popup('github')
            .done(function(result) {
              console.log(result);
              result.get('/gists')
                .done(function(response) {
                    console.log(response);
                }).fail(function (err) {
                  console.log(err);
                });
            })
            .fail(function (err) {
              console.log(err);
            });
    });

    $('#update').click(function() {
        var output = window.parent.output.document;
        $(output.head).empty()
            .append($('<style>', {type: 'text/css'}).text(cssEditor.getValue()))
            .append($('<script>', {type: 'text/javascript'}).text(jsEditor.getValue()));
        $(output.body).empty()
            .html(htmlEditor.getValue());
    });
});
