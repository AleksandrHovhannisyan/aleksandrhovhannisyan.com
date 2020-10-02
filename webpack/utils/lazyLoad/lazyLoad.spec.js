import lazyLoad from './lazyLoad';

let entries;
let observeFn;
let unobserveFn;

class MockObserver {
  constructor(fn) {
    fn(entries, this);
  }

  observe() {
    observeFn();
  }
  unobserve() {
    unobserveFn();
  }
}

beforeEach(() => {
  document.body.innerHTML = '';
  entries = [];
  observeFn = jest.fn();
  unobserveFn = jest.fn();
});

describe('lazyLoad utility', () => {
  it('observes each target', () => {
    for (let i = 0; i < 3; i++) {
      const target = document.createElement('img');
      target.className = 'lazy-img';
      document.body.appendChild(target);
    }

    lazyLoad('.lazy-img', jest.fn(), MockObserver);
    expect(observeFn).toHaveBeenCalledTimes(3);
  });

  it('detects intersections', () => {
    const img1 = document.createElement('img');
    img1.id = 'img1';
    img1.className = '.lazy-img';

    const img2 = document.createElement('img');
    img2.id = 'img2';
    img2.className = '.lazy-img';

    const img3 = document.createElement('img');
    img3.id = 'img3';
    img3.className = '.lazy-img';

    document.body.appendChild(img1);
    document.body.appendChild(img2);
    document.body.appendChild(img3);

    entries = [
      {
        target: img1,
        isIntersecting: false,
      },
      {
        target: img2,
        isIntersecting: true,
      },
      {
        target: img3,
        isIntersecting: true,
      },
    ];

    const onIntersection = jest.fn();
    lazyLoad('.lazy-img', onIntersection, MockObserver);
    expect(onIntersection).toHaveBeenCalledTimes(2);
    expect(onIntersection).toHaveBeenCalledWith(img2);
    expect(onIntersection).toHaveBeenCalledWith(img3);
    expect(onIntersection).not.toHaveBeenCalledWith(img1);
    expect(unobserveFn).toHaveBeenCalledTimes(2);
  });
});
