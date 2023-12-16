/* global moment, BarChart, _ */

class BarChart {
  constructor({xAxisLabels, height}) {
    this.max = 2;
    this.data = _.range(xAxisLabels.length).map(_ => 0);
    this.bars = _.range(this.data.length).map(_ => null);

    this.$element = document.createElement('div');
    this.$element.classList.add('bar-chart');
    this.$element.style.height = `${height}px`;
    
    const barAreas = _.range(this.data.length).map(i => `bar-${i}`);
    const xLabelAreas = _.range(this.data.length).map(i => `x-axis-label-${i}`);
    const columns =  _.range(this.data.length).map(_ => '1fr');
    this.$element.style.gridTemplateColumns =
      `min-content ${columns.join(' ')}`;
    this.$element.style.gridTemplateAreas =
      `"y-axis-label-max ${barAreas.join(' ')}"` +
      `"y-axis-label-half ${barAreas.join(' ')}"` +
      `". ${xLabelAreas.join(' ')}"`;
    
    this.$maxLabel = document.createElement('div');
    this.$maxLabel.classList.add('label-max-y');
    this.$maxLabel.textContent = this.max;
    this.$element.append(this.$maxLabel);

    this.$halfLabel = document.createElement('div');
    this.$halfLabel.classList.add('label-half-y');
    this.$halfLabel.textContent = this.max / 2;
    this.$element.append(this.$halfLabel);

    for (let i = 0; i < this.data.length; i++) {
      const label = document.createElement('div');
      label.classList.add('label-x');
      label.style.gridArea = `x-axis-label-${i}`;
      label.textContent = xAxisLabels[i];
      this.$element.append(label);
    }
  }
  
  appendTo($container) {
    $container.append(this.$element);
  }
  
  plot(x) {
    this.data[x]++;
    
    if (this.data[x] > this.max) {
      this.max *= 2;
      this.$maxLabel.textContent = this.max;
      this.$halfLabel.textContent = this.max / 2;
      for (let i = 0; i < this.data.length; i++) this.draw(i);
    } else {
      this.draw(x);
    }
  }

  draw(i) {
    if (this.data[i] < 1) return;
    if (!this.bars[i]) this.bars[i] = this.buildBar(i);
    
    this.bars[i].$plot.style.height = `${this.data[i] * 100 / this.max}%`;
    this.bars[i].$plot.textContent = this.data[i];
  }
  
  buildBar(i) {
    const $bar = document.createElement('div');
    $bar.classList.add('bar');
    $bar.style.gridArea = `bar-${i}`;
    this.$element.append($bar);

    $bar.$plot = document.createElement('div');
    $bar.$plot.classList.add('plot');
    if (i % 2 === 0) $bar.$plot.classList.add('even');
    $bar.append($bar.$plot);
    
    return $bar;
  }
}