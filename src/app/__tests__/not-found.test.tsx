import { render } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('should render the main container', () => {
    const { container } = render(<NotFound />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer.tagName.toLowerCase()).toBe('div');
  });

  it('should render the wrapper div', () => {
    const { container } = render(<NotFound />);

    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render the SVG illustration', () => {
    const { container } = render(<NotFound />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 1920 1080');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('should have SVG title element', () => {
    const { container } = render(<NotFound />);

    const title = container.querySelector('title');
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe('404');
  });

  it('should render main SVG groups', () => {
    const { container } = render(<NotFound />);

    const groups = container.querySelectorAll('g');
    expect(groups.length).toBeGreaterThan(0);

    // Check for specific known groups
    const layer12 = container.querySelector(String.raw`#Layer_12\ yellow-back-fig`);
    expect(layer12).toBeInTheDocument();

    const fortyfour = container.querySelector('#fortyfour');
    expect(fortyfour).toBeInTheDocument();
  });

  it('should render geometric shapes', () => {
    const { container } = render(<NotFound />);

    // Check for paths
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);

    // Check for rectangles
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  it('should have proper CSS classes on SVG elements', () => {
    const { container } = render(<NotFound />);

    // Check for elements with cls-1 class
    const cls1Elements = container.querySelectorAll('.cls-1');
    expect(cls1Elements.length).toBeGreaterThan(0);

    // Check for elements with cls-2 class
    const cls2Elements = container.querySelectorAll('.cls-2');
    expect(cls2Elements.length).toBeGreaterThan(0);

    // Check for elements with cls-3 class
    const cls3Elements = container.querySelectorAll('.cls-3');
    expect(cls3Elements.length).toBeGreaterThan(0);
  });

  it('should render the "four" elements', () => {
    const { container } = render(<NotFound />);

    const fourA = container.querySelector('.four.a');
    expect(fourA).toBeInTheDocument();

    const fourB = container.querySelector('.four.b');
    expect(fourB).toBeInTheDocument();
  });

  it('should render decorative elements', () => {
    const { container } = render(<NotFound />);

    // Check for round configuration elements
    const roundConf = container.querySelector('#round-conf');
    expect(roundConf).toBeInTheDocument();

    // Check for circle elements with specific classes
    const circleElements = container.querySelectorAll('.circle');
    expect(circleElements.length).toBeGreaterThan(0);
  });

  it('should have proper DOM structure', () => {
    const { container } = render(<NotFound />);

    const mainDiv = container.firstChild as HTMLElement;
    const wrapper = mainDiv.querySelector('.wrapper');
    const svg = wrapper?.querySelector('svg');

    expect(mainDiv).toContainElement(wrapper as HTMLElement);
    expect(wrapper).toContainElement(svg as SVGElement);
  });

  it('should handle component rendering without errors', () => {
    expect(() => {
      render(<NotFound />);
    }).not.toThrow();
  });

  it('should render consistently across multiple renders', () => {
    const { unmount, rerender } = render(<NotFound />);

    // First render check
    const container = document.body;
    let svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Re-render
    rerender(<NotFound />);

    // Check consistency after re-render
    svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Cleanup
    unmount();
  });

  it('should handle component unmounting gracefully', () => {
    const { unmount } = render(<NotFound />);

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('should have proper SVG accessibility', () => {
    const { container } = render(<NotFound />);

    const svg = container.querySelector('svg');
    const title = svg?.querySelector('title');

    // SVG should have a title for accessibility
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe('404');
  });

  it('should render with proper element hierarchy', () => {
    const { container } = render(<NotFound />);

    // Check main structure
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer.children).toHaveLength(1);

    const wrapper = mainContainer.children[0] as HTMLElement;
    expect(wrapper).toHaveClass('wrapper');
    expect(wrapper.children).toHaveLength(1);

    const svg = wrapper.children[0] as SVGElement;
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('should contain complex illustration elements', () => {
    const { container } = render(<NotFound />);

    // Verify that the illustration has multiple layers
    const layers = container.querySelectorAll('g[data-name]');
    expect(layers.length).toBeGreaterThan(0);
  });
});
