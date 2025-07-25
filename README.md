# @charlie404/marquee-image

A lightweight web component for creating smooth image marquee effects with customizable speed, height, and direction.

## Installation

```bash
npm install @charlie404/marquee-image
```

## Usage

### Import the component

```javascript
import { MarqueeImage } from "@charlie404/marquee-image";

new MarqueeImage();
```

### Add to your HTML

```html
<!-- Example with all props specified -->
<marquee-image
  speed="100"
  desktop-margin="20"
  tablet-margin="15"
  mobile-margin="10"
  desktop-height="72"
  tablet-height="54"
  mobile-height="36"
  repeat="20"
  reverse
>
  <img src="https://picsum.photos/200/100" />
  <img src="https://picsum.photos/150/100" />
  <img src="https://picsum.photos/250/100" />
  <img src="https://picsum.photos/180/100" />
</marquee-image>

<!-- Example using cascade (tablet inherits from desktop, mobile from tablet) -->
<marquee-image
  speed="100"
  desktop-margin="25"
  desktop-height="80"
  mobile-height="40"
  repeat="15"
>
  <img src="https://picsum.photos/200/100" />
  <img src="https://picsum.photos/150/100" />
  <img src="https://picsum.photos/250/100" />
</marquee-image>

<!-- Minimal example (all margins and heights inherit from desktop) -->
<marquee-image desktop-margin="30" desktop-height="60">
  <img src="https://picsum.photos/200/100" />
  <img src="https://picsum.photos/150/100" />
</marquee-image>
```

### Required CSS

Add this CSS to your stylesheet for proper display:

```css
marquee-image {
  display: block;
  width: 100%;
}
```

## Attributes

| Attribute        | Type    | Default         | Description                                              |
| ---------------- | ------- | --------------- | -------------------------------------------------------- |
| `speed`          | number  | 100             | Animation speed in pixels per second                     |
| `desktop-margin` | number  | 20              | Spacing between images on desktop devices (≥ 1024px)     |
| `tablet-margin`  | number  | desktop-margin  | Spacing between images on tablet devices (768px - 1023px) |
| `mobile-margin`  | number  | tablet-margin   | Spacing between images on mobile devices (< 768px)       |
| `desktop-height` | number  | 72              | Height of the marquee on desktop devices (≥ 1024px)      |
| `tablet-height`  | number  | desktop-height  | Height of the marquee on tablet devices (768px - 1023px) |
| `mobile-height`  | number  | tablet-height   | Height of the marquee on mobile devices (< 768px)        |
| `repeat`         | number  | 10              | Number of times to repeat the image sequence             |
| `reverse`        | boolean | false           | Reverse the animation direction                          |

**Cascade Logic:**

- If `tablet-margin` is not specified, it defaults to `desktop-margin`
- If `mobile-margin` is not specified, it defaults to `tablet-margin`
- If `tablet-height` is not specified, it defaults to `desktop-height`
- If `mobile-height` is not specified, it defaults to `tablet-height`

## License

MIT
