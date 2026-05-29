import { render } from '@testing-library/react';
import AboutIllustration from './AboutIllustration';

describe('AboutIllustration', () => {
  it('renderuje element figure', () => {
    const { container } = render(<AboutIllustration />);
    const figure = container.querySelector('figure');
    expect(figure).toBeInTheDocument();
  });

  it('figure ma klasę about-story-figure', () => {
    const { container } = render(<AboutIllustration />);
    expect(container.querySelector('.about-story-figure')).toBeInTheDocument();
  });

  it('SVG jest ukryty przed czytnikami ekranu (aria-hidden)', () => {
    const { container } = render(<AboutIllustration />);
    const figure = container.querySelector('figure');
    expect(figure).toHaveAttribute('aria-hidden', 'true');
  });

  it('renderuje element SVG', () => {
    const { container } = render(<AboutIllustration />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('SVG zawiera gradient radialny', () => {
    const { container } = render(<AboutIllustration />);
    expect(container.querySelector('#aboutWarmGlow')).toBeInTheDocument();
  });
});
