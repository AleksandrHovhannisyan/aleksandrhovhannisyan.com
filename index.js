var nightModeSwitch = $('.nightmode-switch');
/** Called when the user clicks the night mode switch in the top-left of the navbar.
 *  Toggles the document's class to trigger a change in the color themes. 
 */
nightModeSwitch.click(function(){        
    $(document.documentElement).toggleClass('night');
    updateThemeLabel($(this).next());
});


// Auto-transition to night mode, if applicable
(function(){
    var today = new Date();
    var dusk = 20;
    var dawn = 6;
    
    if(today.getHours() >= dusk || today.getHours() <= dawn) {
        nightModeSwitch.click();
    }
})();


/** Updates the text in the given label to match whatever mode the page is in (dark, light).
 *  @param themeLabel {Node} The element that displays the color theme the page is currently using (light or dark).
 */
function updateThemeLabel(themeLabel){
    if($(document.documentElement).hasClass('night')) {
        themeLabel.html('Dark mode');
    }
    else {
        themeLabel.html('Light mode');
    }
}


/** Scrolls to the provided target destination at the given speed.
 * @param topOfTarget - the offset().top of the target, plus/minus any additional offset
 * @param speed - the speed at which the scrolling should be animated 
 */
function smoothScrollTo(topOfTarget, speed=500){
    $('html, body').animate({scrollTop: topOfTarget}, speed);
}


var collapsible = $('.collapsible');
/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
collapsible.click(function(){        
    var content = $(this).next();
    var icon = $(this).find('i');

    if(content.css('max-height') != '0px'){
        content.css('max-height', '0px');
        icon.toggleClass('fa-angle-down fa-angle-right');
    } else {
        // Have to set the max height to some large value; auto isn't eligible for transitions/animation, unfortunately
        // One notable downside to this is that the speed will vary depending on the amount of content in the div
        content.css('max-height', '1000px');
        icon.toggleClass('fa-angle-right fa-angle-down');
    }

    smoothScrollTo($(this).offset().top - 60);
});


var navbarHamburger = $('#topnav .navbar-hamburger');
var navbarLinkContainer = $('#topnav .nav-links');
/** Called when the user clicks on the hamburger icon in the navigation menu. 
 */
navbarHamburger.click(function(){
    navbarLinkContainer.toggleClass('active');
});


var navbarLinks = navbarLinkContainer.find('a');
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
    smoothScrollTo($($.attr(this, 'href')).offset().top);
});