// jshint devel:true
'use strict';
$(function() {
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
            .append($('<style>', {type: 'text/css'}).text($('#css').val()))
            .append($('<script>', {type: 'text/javascript'}).text($('#js').val()));
        $(output.body).empty()
            .html($('#html').val());
    });
});
