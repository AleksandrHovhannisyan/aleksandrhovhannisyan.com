$("document").ready(function(){
    
    $(".collapsible").click(function(){
        
        var content = $(this).next();
        var caret = $(this).find("i");

        if(content.css("display") === "grid"){
            content.css("display", "none");
            caret.toggleClass("fa-caret-up fa-caret-down");
        } else {
            content.css("display", "grid");
            caret.toggleClass("fa-caret-down fa-caret-up");
        }
    })
});