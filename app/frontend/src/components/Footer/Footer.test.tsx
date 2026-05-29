import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderuje element footer', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('wyświetla aktualny rok w stopce', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('wyświetla tekst praw autorskich', () => {
    render(<Footer />);
    expect(screen.getByText(/MJL Foods/)).toBeInTheDocument();
  });

  it('wyświetla email kontaktowy z poprawnym href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /hello@mjlfoods\.pl/i });
    expect(link).toHaveAttribute('href', 'mailto:hello@mjlfoods.pl');
  });

  it('wyświetla numer telefonu z poprawnym href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /\+48 000 000 000/ });
    expect(link).toHaveAttribute('href', 'tel:+48000000000');
  });

  it('wyświetla godziny otwarcia', () => {
    render(<Footer />);
    expect(screen.getByText(/Pon–Nie/)).toBeInTheDocument();
  });

  it('wyświetla imiona autorów', () => {
    render(<Footer />);
    expect(screen.getByText('Maja Maj')).toBeInTheDocument();
    expect(screen.getByText('Michał Jopa')).toBeInTheDocument();
    expect(screen.getByText('Marcin Ligocki')).toBeInTheDocument();
  });

  it('wyświetla tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Smak, który czujesz/)).toBeInTheDocument();
  });
});
