class MarqueeImage extends HTMLElement {
  static get observedAttributes() {
    return [
      "speed",
      "margin",
      "desktop-height",
      "tablet-height",
      "mobile-height",
      "repeat",
      "reverse",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Canvas
    this.canvas = document.createElement("canvas");
    this.shadowRoot.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.images = [];
    this.widths = [];
    this.positions = [];
    this.totalWidth = 0;
    this.lastTimestamp = null;
  }

  connectedCallback() {
    this.speed = parseFloat(this.getAttribute("speed")) || 100;
    this.margin = parseFloat(this.getAttribute("margin")) || 20;
    this.desktopHeight = parseFloat(this.getAttribute("desktop-height")) || 72;
    this.tabletHeight = parseFloat(this.getAttribute("tablet-height")) || this.desktopHeight;
    this.mobileHeight = parseFloat(this.getAttribute("mobile-height")) || this.tabletHeight;
    this.repeat = parseInt(this.getAttribute("repeat")) || 10;
    this.reverse =
      this.getAttribute("reverse") === "true" ||
      this.getAttribute("reverse") === "";
    this.loadChildren();
    window.addEventListener("resize", this.resize.bind(this));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "speed") this.speed = parseFloat(newVal) || this.speed;
    if (name === "margin") this.margin = parseFloat(newVal) || this.margin;
    if (name === "desktop-height") {
      this.desktopHeight = parseFloat(newVal) || this.desktopHeight;
      if (!this.getAttribute("tablet-height")) this.tabletHeight = this.desktopHeight;
      if (!this.getAttribute("mobile-height")) this.mobileHeight = this.tabletHeight;
    }
    if (name === "tablet-height") {
      this.tabletHeight = parseFloat(newVal) || this.tabletHeight;
      if (!this.getAttribute("mobile-height")) this.mobileHeight = this.tabletHeight;
    }
    if (name === "mobile-height")
      this.mobileHeight = parseFloat(newVal) || this.mobileHeight;
    if (name === "repeat") this.repeat = parseInt(newVal) || this.repeat;
    if (name === "reverse") this.reverse = newVal === "true" || newVal === "";
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  loadChildren() {
    const urls = Array.from(this.children)
      .filter((el) => el.tagName.toLowerCase() === "img")
      .map((img) => img.src);
    let loaded = 0;
    urls.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        this.images[i] = img;
        loaded++;
        if (loaded === urls.length) this.initMarquee();
      };
      img.src = src;
    });
  }

  resize() {
    this.canvas.width = this.clientWidth;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    let targetHeight;
    
    if (isMobile) {
      targetHeight = this.mobileHeight;
    } else if (isTablet) {
      targetHeight = this.tabletHeight;
    } else {
      targetHeight = this.desktopHeight;
    }
    
    this.canvas.height = targetHeight;
    this.style.height = targetHeight + "px";
    this.calculatePositions();
  }

  calculatePositions() {
    const canvasHeight = this.canvas.height;
    this.scaledWidths = this.images.map((img) => {
      const scale = canvasHeight / img.height;
      return img.width * scale;
    });
    this.totalWidth =
      this.scaledWidths.reduce((sum, w) => sum + w, 0) +
      this.margin * this.images.length;
    this.positions = [];
    let x = 0;
    for (let i = 0; i < this.images.length * this.repeat; i++) {
      this.positions.push(x);
      x += this.scaledWidths[i % this.images.length] + this.margin;
    }
  }

  drawFrame(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta =
      ((timestamp - this.lastTimestamp) / 1000) *
      this.speed *
      (this.reverse ? -1 : 1);
    this.lastTimestamp = timestamp;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.positions = this.positions.map((x, i) => {
      let newX = x - delta;
      if (this.reverse) {
        if (newX > this.canvas.width) newX -= this.totalWidth;
      } else {
        if (newX < -this.scaledWidths[i % this.images.length])
          newX += this.totalWidth;
      }
      return newX;
    });

    this.positions.forEach((x, i) => {
      const img = this.images[i % this.images.length];
      const scaledWidth = this.scaledWidths[i % this.images.length];
      this.ctx.drawImage(img, x, 0, scaledWidth, this.canvas.height);
    });

    requestAnimationFrame(this.drawFrame.bind(this));
  }

  initMarquee() {
    this.shadowRoot.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", () => this.resize());
    requestAnimationFrame(this.drawFrame.bind(this));
  }
}

customElements.define("marquee-image", MarqueeImage);

export { MarqueeImage };
