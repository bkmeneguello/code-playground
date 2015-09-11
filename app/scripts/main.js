// jshint devel:true
$(function() {
    $('#update').click(function() {
        var output = window.parent.output.document;
        $(output.head).empty()
            .append($('<style>', {type:'text/css'}).text($('#css').val()))
            .append($('<script>', {type:'text/javascript'}).text($('#js').val()));
        $(output.body).empty()
            .html($('#html').val());
    });
})
