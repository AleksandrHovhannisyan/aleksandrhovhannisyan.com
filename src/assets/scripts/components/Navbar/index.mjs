const defaultMenuProps = {
  root: document.querySelector('.navbar'),
  menu: document.querySelector('#navbar-menu'),
  links: document.querySelector('.navbar-links'),
  toggle: document.querySelector('#navbar-toggle'),
};

export default class Navbar {
  constructor(props = defaultMenuProps) {
    this.navbar = props.root;
    this.menu = props.menu;
    this.links = props.links;
    this.mobileNavbarToggle = props.toggle;
    this.registerListeners();
  }

  registerListeners() {
    this.menu.addEventListener('click', () => this.closeMenu());
    this.links.addEventListener('click', (e) => e.stopPropagation());
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
    return this.navbar.classList.contains('open');
  }

  openMenu() {
    this.navbar.classList.add('open');
    this.mobileNavbarToggle.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.navbar.classList.remove('open');
    this.mobileNavbarToggle.setAttribute('aria-expanded', 'false');
  }
}
