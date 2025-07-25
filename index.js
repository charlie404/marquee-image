class MarqueeImage extends HTMLElement {
  static get observedAttributes() {
    return [
      "speed",
      "desktop-margin",
      "tablet-margin",
      "mobile-margin",
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
    this.scaledWidths = [];
    this.baseCyclePositions = [];
    this.cycleWidth = 0;
    this.scrollOffset = 0;
    this.lastTimestamp = null;
  }

  connectedCallback() {
    this.speed = parseFloat(this.getAttribute("speed")) || 100;
    this.desktopMargin = parseFloat(this.getAttribute("desktop-margin")) || 20;
    this.tabletMargin = parseFloat(this.getAttribute("tablet-margin")) || this.desktopMargin;
    this.mobileMargin = parseFloat(this.getAttribute("mobile-margin")) || this.tabletMargin;
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
    if (name === "desktop-margin") {
      this.desktopMargin = parseFloat(newVal) || this.desktopMargin;
      if (!this.getAttribute("tablet-margin")) this.tabletMargin = this.desktopMargin;
      if (!this.getAttribute("mobile-margin")) this.mobileMargin = this.tabletMargin;
    }
    if (name === "tablet-margin") {
      this.tabletMargin = parseFloat(newVal) || this.tabletMargin;
      if (!this.getAttribute("mobile-margin")) this.mobileMargin = this.tabletMargin;
    }
    if (name === "mobile-margin")
      this.mobileMargin = parseFloat(newVal) || this.mobileMargin;
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
    
    // Get current margin based on screen size
    const currentMargin = this.getCurrentMargin();
    
    // Calculate base positions for one complete cycle
    this.baseCyclePositions = [];
    let x = 0;
    for (let i = 0; i < this.images.length; i++) {
      this.baseCyclePositions.push(x);
      x += this.scaledWidths[i] + currentMargin;
    }
    
    // Store the width of one complete cycle
    this.cycleWidth = x;
    
    // Reset scroll offset
    this.scrollOffset = 0;
  }
  
  getCurrentMargin() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      return this.mobileMargin;
    } else if (isTablet) {
      return this.tabletMargin;
    } else {
      return this.desktopMargin;
    }
  }

  drawFrame(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta =
      ((timestamp - this.lastTimestamp) / 1000) *
      this.speed *
      (this.reverse ? -1 : 1);
    this.lastTimestamp = timestamp;

    // Update global scroll offset
    this.scrollOffset += delta;
    
    // Keep offset within cycle bounds to prevent overflow
    this.scrollOffset = this.scrollOffset % this.cycleWidth;
    if (this.scrollOffset < 0) this.scrollOffset += this.cycleWidth;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate how many cycles we need to cover the screen
    const screenWidth = this.canvas.width;
    const cyclesNeeded = Math.ceil((screenWidth + this.cycleWidth) / this.cycleWidth);
    
    // Draw images from multiple cycles to ensure full coverage
    for (let cycle = -1; cycle < cyclesNeeded + 1; cycle++) {
      for (let i = 0; i < this.images.length; i++) {
        // Calculate absolute position for this image in this cycle
        const baseX = this.baseCyclePositions[i] + (cycle * this.cycleWidth);
        const finalX = baseX - this.scrollOffset;
        
        // Only draw if image is potentially visible
        const imageWidth = this.scaledWidths[i];
        if (finalX + imageWidth >= -50 && finalX <= screenWidth + 50) {
          const img = this.images[i];
          this.ctx.drawImage(img, finalX, 0, imageWidth, this.canvas.height);
        }
      }
    }

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
