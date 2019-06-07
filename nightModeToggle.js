$(document).ready(function(){

    var today = new Date();

    // If it's dark out, then toggle dark mode automatically
    if(today.getHours() >= 20 || today.getHours() <= 6)
    {
        $('.switch').toggleClass('night')
        $('body').toggleClass('night')
    }

    // But also give the user the option of toggling it manually
    $(".switch").click(function(){
        $(".switch").toggleClass("night")
        $("body").toggleClass("night")
    })
})