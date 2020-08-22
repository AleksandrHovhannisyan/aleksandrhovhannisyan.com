const navbar = document.querySelector('.navbar');
const mobileNavbarToggle = navbar.querySelector('#navbar-toggle');

function toggleMobileNavbarVisibility() {
  if (navbar.classList.contains('opened')) {
    navbar.classList.remove('opened');
    mobileNavbarToggle.setAttribute('aria-label', 'Open navigation menu');
  } else {
    navbar.classList.add('opened');
    mobileNavbarToggle.setAttribute('aria-label', 'Close navigation menu');
  }
}

let cachedActiveNavlink;

// Ensures that only one navbar link has the active state at a time. Otherwise, if there's
// an active link and we hover another link, both will have an underline.
function onNavLinkHovered(mouseEvent) {
  const activeNavLink = document.getElementById('active-navbar-link');

  // Happens if we're on the home page
  if (!activeNavLink) return;

  const hoveredAnchor = mouseEvent.target;

  if (hoveredAnchor === activeNavLink) return;

  cachedActiveNavlink = activeNavLink;
  activeNavLink.id = '';
}

// Once we stop hovering a link, simply re-apply the active-navbar-link
// ID to the cached anchor, if there is one.
function rehighlightActiveNavLink() {
  if (cachedActiveNavlink) {
    cachedActiveNavlink.id = 'active-navbar-link';
  }
}

export { toggleMobileNavbarVisibility, rehighlightActiveNavLink, onNavLinkHovered };
