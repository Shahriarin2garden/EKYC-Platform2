import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Sample Frontend Test', () => {
  test('should verify React Testing Library works', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    document.body.appendChild(div);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
