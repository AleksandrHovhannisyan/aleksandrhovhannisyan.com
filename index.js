/** Updates the text in the given label to match whatever mode the page is in (dark, light).
 *  @param nightModeSwitch {Node} The element the user clicks to toggle light/dark mode.
 *  @param themeLabel {Node} The element that displays the color theme the page is currently using (light or dark).
 */
function updateThemeLabel(nightModeSwitch, themeLabel){
    if(nightModeSwitch.hasClass('night')) {
        themeLabel.html('Dark mode');
    }
    else {
        themeLabel.html('Light mode');
    }
}


$(document).ready(function(){   

    var nightModeSwitch = $('.nightmode-switch');
    var collapsible = $('.collapsible');
    var navbarHamburger = $('#topnav .navbar-hamburger');
    var navbarLinkContainer = $('#topnav .nav-links');
    var navbarLinks = navbarLinkContainer.find('a');

    // Auto-transition to night mode
    (function(){
        var today = new Date();
        var dusk = 20;
        var dawn = 6;
        
        if(today.getHours() >= dusk || today.getHours() <= dawn) {
            $(document.documentElement).toggleClass('night');
            updateThemeLabel(nightModeSwitch, nightModeSwitch.next());
        }
    })();


    /** Called when the user clicks the night mode switch in the top-left of the navbar.
     *  Toggles the document's class to trigger a change in the color themes. 
     */
    nightModeSwitch.click(function(){        
        $(document.documentElement).toggleClass('night');
        $(this).toggleClass('night');
        updateThemeLabel($(this), $(this).next());
    });


    /** Called when the user clicks on a collapsible element (accordion). Expands or
     *  collapses the button accordingly, and also updates the collapsible's icon.
     */
    collapsible.click(function(){        
        var content = $(this).next();
        var icon = $(this).find('i');

        if(content.css('display') === 'grid'){
            content.css('display', 'none');
            icon.toggleClass('fa-angle-down fa-angle-right');
        } else {
            content.css('display', 'grid');
            icon.toggleClass('fa-angle-right fa-angle-down');
        }

        this.scrollIntoView();
    });


    /** Called when the user clicks on the hamburger icon in the navigation menu. 
     */
    navbarHamburger.click(function(){
        navbarLinkContainer.toggleClass('active');
    });


    /** Called when the user clicks on a navbar link. Checks to see if the click occured
     *  while the mobile version of the navigation was showing. If so, it simulates a
     *  click on the hamburger icon to hide the navigation menu.
     */
    navbarLinks.click(function() {
        if(navbarHamburger.css('display') != 'none'){
            navbarHamburger.click();
        }
    });


    /** Smoothly scrolls to the location within the document specified by the clicked anchor's
     *  href attribute. Taken from: https://stackoverflow.com/a/7717572/10480032
     */
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });

});