const ACTIVE_LINK_ID = 'active-navbar-link';

export default class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.menu = this.navbar.querySelector('.navbar-menu');
    this.links = this.menu.querySelector('.navbar-links');
    this.mobileNavbarToggle = this.navbar.querySelector('#navbar-toggle');
    this.cachedActiveNavlink = document.getElementById(ACTIVE_LINK_ID);
    this.registerListeners();
  }

  registerListeners() {
    this.menu.addEventListener('click', () => this.closeMenu());
    this.menu.querySelector('.navbar-links').addEventListener('click', (e) => e.stopPropagation());
    this.links.querySelectorAll('.navbar-link').forEach((anchor) => {
      anchor.addEventListener('focusin', (e) => this.changeActiveLinkOnHover(e));
      anchor.addEventListener('mouseenter', (e) => this.changeActiveLinkOnHover(e));
      anchor.addEventListener('focusout', () => this.restorePreviouslyActiveLink());
      anchor.addEventListener('mouseleave', () => this.restorePreviouslyActiveLink());
    });
    this.mobileNavbarToggle.addEventListener('click', () => this.toggleMobileMenu());
  }

  toggleMobileMenu() {
    if (this.menuIsOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  menuIsOpen() {
    return this.navbar.classList.contains('opened');
  }

  openMenu() {
    this.navbar.classList.add('opened');
    this.mobileNavbarToggle.setAttribute('aria-label', 'Close main navigation menu');
  }

  closeMenu() {
    this.navbar.classList.remove('opened');
    this.mobileNavbarToggle.setAttribute('aria-label', 'Open main navigation menu');
  }

  changeActiveLinkOnHover(mouseEvent) {
    // Happens if we're on the home page
    if (!this.cachedActiveNavlink) return;

    const activeNavLink = document.getElementById(ACTIVE_LINK_ID);
    if (!activeNavLink) return;

    const hoveredAnchor = mouseEvent.target;
    if (hoveredAnchor === activeNavLink) return;

    this.cachedActiveNavlink = activeNavLink;
    activeNavLink.id = '';
  }

  restorePreviouslyActiveLink() {
    if (this.cachedActiveNavlink) {
      this.cachedActiveNavlink.id = ACTIVE_LINK_ID;
    }
  }
}
