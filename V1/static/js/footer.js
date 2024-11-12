function checkAndPositionFooter() {
    var footer = $('footer');
    footer.removeClass('fixed-bottom');
    var contentHeight = document.body.scrollHeight;
    var windowHeight = window.innerHeight;

    if (contentHeight <= windowHeight) {
        footer.addClass('fixed-bottom');
    }
}

// reset the footer when initializing and resizing
$(function () {
    checkAndPositionFooter();
    $(window).resize(checkAndPositionFooter);
});



$(function(){
$.get('ip.php', function(data) {
    $("#visits").html("<b>Visit Number: <span style='letter-spacing: 3px;'>"+data.visits+"</span></b>");
});
});