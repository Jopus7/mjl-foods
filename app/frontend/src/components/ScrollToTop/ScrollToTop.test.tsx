import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

const scrollToMock = jest.fn();

beforeEach(() => {
  window.scrollTo = scrollToMock;
  scrollToMock.mockClear();
});

describe('ScrollToTop', () => {
  it('wywołuje window.scrollTo(0, 0) przy montowaniu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('wywołuje window.scrollTo(0, 0) przy innej ścieżce', () => {
    render(
      <MemoryRouter initialEntries={['/menu']}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('wywołuje window.scrollTo dokładnie raz na montowanie', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });

  it('nie wywołuje window.scrollTo bez renderowania', () => {
    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
