import Navbar from './index.mjs';

beforeEach(() => {
  document.body.innerHTML = '';
  const navbar = document.createElement('nav');
  navbar.className = 'navbar';

  const navbarMenu = document.createElement('div');
  navbarMenu.className = 'navbar-menu';

  const navbarLinks = document.createElement('ul');
  navbarLinks.className = 'navbar-links';

  const links = [
    {
      text: 'About',
      href: '/about/',
    },
    {
      text: 'Notes',
      href: '/notes/',
    },
    {
      text: 'Blog',
      href: '/blog/',
    },
    {
      text: 'Contact',
      href: '/contact/',
    },
  ];

  links.forEach((link) => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.text = link.text;
    anchor.href = link.href;
    anchor.className = 'navbar-link';
    listItem.appendChild(anchor);
    navbarLinks.appendChild(listItem);
  });

  const navbarToggle = document.createElement('button');
  navbarToggle.id = 'navbar-toggle';
  navbar.appendChild(navbarToggle);

  navbarMenu.appendChild(navbarLinks);
  navbar.appendChild(navbarMenu);
  navbar.appendChild(navbarToggle);

  document.body.appendChild(navbar);
});

describe('Navbar component', () => {
  it('is closed by default', () => {
    const navbar = new Navbar();
    expect(navbar.menuIsOpen()).toEqual(false);
  });

  it('toggles from closed to open', () => {
    const navbar = new Navbar();
    navbar.toggleMobileMenu();
    expect(navbar.menuIsOpen()).toEqual(true);
  });

  it('toggles from open back to closed', () => {
    const navbar = new Navbar();
    navbar.toggleMobileMenu();
    navbar.toggleMobileMenu();
    expect(navbar.menuIsOpen()).toEqual(false);
  });
});
