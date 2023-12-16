const SQRT3 = Math.sqrt(3);

class Triangle {
  constructor(options) {
    this.options = options;
    const {id, yIndex, xIndex, config} = this.options;
    const {size} = config;
    this.yIndex = yIndex;
    this.xIndex = xIndex;
    this.orientation = this.xIndex % 2;
  }

  render($container) {
    const {config, id} = this.options;
    const {color, scale, size} = config;

    const $el = document.createElement('div');
    const boxScale = scale / SQRT3;
    $el.style.height = `${boxScale}px`;
    $el.style.width = `${boxScale}px`;
    $el.style.position = 'absolute';
    const x = ((scale * size) / 2) + // midpoint
          ((scale - boxScale) / 2) + // + ofset within triangle
          (scale * this.xIndex) - // + offset within row
          ((scale / 2) * (this.yIndex + 1)); // - offset for entire row
    $el.style.left = `${x}px`;
    const y = (scale / 2) * SQRT3 * this.yIndex + // top of row
          (this.orientation === 0 ? (scale - boxScale) : 0); // + offset for orientation
    $el.style.top = `${y}px`;
    $el.textContent = `[${id}]`;
    $el.style.color = '#fff';
    $el.style.backgroundColor = color;
    
    $container.append($el);
  }
}

class TriangulatedSpace {
  constructor(config) {
    this.config = config;
    const {size} = this.config;

    this.space = [];
    let triangle = null,
        id = 0;
    for (var i = 0; i < (size); i++) { // each row
      for (var j = 0; j < (2 * i) + 1; j++) { // each triangle
        triangle = new Triangle({id, config, xIndex: j, yIndex: i});
        this.space.push(triangle);
        if (triangle.orientation === 0) { // /\
          if (triangle.xIndex > 0) {// ignoring the left edge
            triangle.nw = this.space[id - 1];
            this.space[id - 1].se = triangle;
          }
        } else { // \/
          triangle.n = this.space[id - (i + 1)];
          this.space[id - (2 * i)].s = triangle;
          triangle.sw = this.space[id - 1];
          this.space[id - 1].nw = triangle;
        }
        id++;
      }
    }
  }

  render() {
    const {$el, size, scale} = this.config;
    $el.style.height = `${(scale / 2) * SQRT3 * size}px`;
    $el.style.width = `${scale * size}px`;
    $el.style.position = 'relative';
    
    for (var i = 0; i < this.space.length; i++) { // each triangle
      this.space[i].render($el);
    }
  }
}
