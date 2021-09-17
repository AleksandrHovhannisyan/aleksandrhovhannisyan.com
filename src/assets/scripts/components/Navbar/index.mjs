const defaultMenuProps = {
  menu: document.querySelector('#navbar-menu'),
  links: document.querySelector('.navbar-links'),
  toggle: document.querySelector('#navbar-toggle'),
};

export default class Navbar {
  constructor(props = defaultMenuProps) {
    this.menu = props.menu;
    this.links = props.links;
    this.mobileNavbarToggle = props.toggle;
    this.isExpanded = this.mobileNavbarToggle.getAttribute('aria-expanded') === 'true';
    this.registerListeners();
  }

  registerListeners() {
    this.menu.addEventListener('click', () => this.toggleMobileMenu());
    this.links.addEventListener('click', (e) => e.stopPropagation());
    this.mobileNavbarToggle.addEventListener('click', () => this.toggleMobileMenu());
  }

  toggleMobileMenu() {
    this.isExpanded = !this.isExpanded;
    this.mobileNavbarToggle.setAttribute('aria-expanded', this.isExpanded);
  }
}
