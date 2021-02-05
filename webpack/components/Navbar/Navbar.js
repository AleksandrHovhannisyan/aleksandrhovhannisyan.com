export default class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.menu = this.navbar.querySelector('.navbar-menu');
    this.mobileNavbarToggle = this.navbar.querySelector('#navbar-toggle');
    this.registerListeners();
  }

  registerListeners() {
    this.menu.addEventListener('click', () => this.closeMenu());
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
}
