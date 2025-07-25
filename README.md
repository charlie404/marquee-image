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
<marquee-image
  speed="100"
  margin="20"
  desktop-height="72"
  mobile-height="36"
  repeat="20"
  reverse
>
  <img src="https://picsum.photos/200/100" />
  <img src="https://picsum.photos/150/100" />
  <img src="https://picsum.photos/250/100" />
  <img src="https://picsum.photos/180/100" />
  <img src="https://picsum.photos/200/100" />
  <img src="https://picsum.photos/150/100" />
  <img src="https://picsum.photos/250/100" />
  <img src="https://picsum.photos/180/100" />
  <img src="https://picsum.photos/280/100" />
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

| Attribute        | Type    | Default | Description                                        |
| ---------------- | ------- | ------- | -------------------------------------------------- |
| `speed`          | number  | 100     | Animation speed in pixels per second               |
| `margin`         | number  | 20      | Spacing between images in pixels                   |
| `desktop-height` | number  | 72      | Height of the marquee on desktop devices           |
| `mobile-height`  | number  | 36      | Height of the marquee on mobile devices (< 1024px) |
| `repeat`         | number  | 10      | Number of times to repeat the image sequence       |
| `reverse`        | boolean | false   | Reverse the animation direction                    |

## License

MIT
# marquee-image
