(function (factory) {
  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = (typeof self === 'object' && self.self === self && self) || (typeof global === 'object' && global.global === global && global);
  root.ParticleBackground = factory(root, {});
}(function (root, ParticleBackground) {
  const RandomWithRanges = (range) => Math.floor(range * Math.random());

  var Particle = function(parent, initY=null) {
    this.size = (RandomWithRanges(parent.particleMaxSize - parent.particleMinSize) + parent.particleMinSize) * parent.particleScale;
    this.sink = parent.particleSpeed * this.size / 5;
    this.posX = RandomWithRanges(parent.particleMarginRight - this.size);
    this.posY = initY === null? RandomWithRanges(2 * parent.particleMarginBottom - parent.particleMarginBottom - 2 * this.size) : 0;
    this.color = parent.particleColors[RandomWithRanges(parent.particleColors.length)];

    this.accumRad = 0;
    this.increRad = 0.03 + Math.random() / 10;
    this.swings = Math.random() * parent.particleSwingScale;

    this.textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.textElem.innerHTML = parent.particleText;
    this.textElem.setAttribute("font-size", `${this.size}px`);
    this.textElem.setAttribute("fill", this.color);
    this.textElem.setAttribute("x", this.posX + "px");
    this.textElem.setAttribute("y", this.posY + "px");
    // this.textElem.style.fontFamily = "Helvetica, Arial, sans-serif";
    parent.svg.appendChild(this.textElem);
  };

  Particle.prototype.update = function(parent) {
    this.accumRad += this.increRad;
    this.posY += this.sink;
    let posXMoved = this.posX + parent.particleSpeed * this.swings * Math.sin(this.accumRad);

    this.textElem.setAttribute("x", posXMoved + "px");
    this.textElem.setAttribute("y", this.posY + "px");

    if ((this.posY >= parent.particleMarginBottom) ||
        (posXMoved > parent.particleMarginRight) || (posXMoved < 0)) {
      if (parent.particleAmount > parent.newParticleAmount) {
        return true;
      } else {
        this.posX = RandomWithRanges(parent.particleMarginRight - this.size);
        this.posY = 0;
        return false;
      }
    }
  }

  Particle.prototype.destroy = function(parent) {
    this.sink = null;
    this.posX = null;
    this.posY = null;
    this.color = null;
    this.accumRad = null;
    this.increRad = null;
    this.swings = null;

    if (this.textElem)  this.textElem.remove()
    this.textElem = null;
  }

  ParticleBackground = function(wrapperID) {
    this.refreshTimer = null;
    this.intervalTimer = null;
    this.particleRefresh = 25;

    this.particleSpeed = 0.13;
    this.particleSwingScale = 50;
    this.particleMinSize = 15;
    this.particleMaxSize = 30;
    this.particleScale = Math.max(1, window.devicePixelRatio * 0.6);
    this.particleText = "&#10053;";
    this.particleColors = ["#DDD", "#D5D5D5", "#EEE"];
    this.particleDensity = 1 / 28000;
    this.bgdiv = document.getElementById(wrapperID);

    this.init();
    this.update();
    this.monitor();
  }

  ParticleBackground.prototype.init = function() {
    // clearTimeout(this.refreshTimer);
    clearTimeout(this.intervalTimer);
    cancelAnimationFrame(this.refreshTimer);

    this.bgdiv.innerHTML = "";
    this.particleMarginBottom = document.documentElement.scrollHeight;
    this.particleMarginRight = document.documentElement.clientWidth;
    this.particleAmount = 0;
    this.newParticleAmount = this.particleMarginRight * document.documentElement.clientHeight * this.particleDensity;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // this.svg.style.width = "100%";
    // this.svg.style.height = "100%";
    // this.svg.setAttribute("viewBox", `0 0 ${this.particleMarginRight} ${this.particleMarginBottom}`);

    this.particles = [];
    for (; this.particleAmount < this.newParticleAmount; this.particleAmount++) {
      let particle = new Particle(this);
      this.particles.push(particle);
    }
    this.bgdiv.appendChild(this.svg);
  }

  ParticleBackground.prototype.monitor = function() {
    this.particleMarginRight = document.documentElement.clientWidth;
    this.particleMarginBottom = document.documentElement.scrollHeight;

    // this.svg.setAttribute("viewBox", `0 0 ${this.particleMarginRight} ${this.particleMarginBottom}`);
    this.newParticleAmount = this.particleMarginRight * document.documentElement.clientHeight * this.particleDensity;
    if (this.newParticleAmount > this.particleAmount) {
      for (; this.particleAmount < this.newParticleAmount; this.particleAmount++) {
        let particle = new Particle(this, true);
        this.particles.push(particle);
      }
    }

    this.intervalTimer = setTimeout(() => {
      this.monitor();
    }, 3000);;
  }

  ParticleBackground.prototype.update = function() {
    let count = 0;
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      if (!particle) {
        this.particles[i] = null;
        continue;
      }
      const obsolete = particle.update(this);
      if (obsolete) {
        count += 1;
        particle.destroy();
        this.particles[i] = null;
      }
    }

    this.particleAmount -= count;
    this.particles = this.particles.filter(item => item !== null);

    this.refreshTimer = requestAnimationFrame(this.update)
    // this.refreshTimer = setTimeout(() => {
    //   this.update();
    // }, this.particleRefresh);
  }

  ParticleBackground.prototype.resume = function() {
    this.update();
    this.monitor();
  }

  ParticleBackground.prototype.stop = function() {
    cancelAnimationFrame(this.refreshTimer);
    // clearTimeout(this.refreshTimer);
    clearTimeout(this.intervalTimer);
    this.refreshTimer = null;
    this.intervalTimer = null;
  }

  ParticleBackground.prototype.destroy = function() {
    cancelAnimationFrame(this.refreshTimer);
    // clearTimeout(this.refreshTimer);
    clearTimeout(this.intervalTimer);
    this.refreshTimer = null;
    this.intervalTimer = null;

    this.particleSpeed = null;
    this.particleSwingScale = null;
    this.particleRefresh = null;
    this.particleMinSize = null;
    this.particleMaxSize = null;
    this.particleScale = null;
    this.particleText = null;
    this.particleColors = null;
    this.particleDensity = null;

    for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].destroy();
        this.particles[i] = null;
    }
    this.particles = null;
    this.particleMarginBottom = null;
    this.particleMarginRight = null;
    this.particleAmount = null;
    this.newParticleAmount = null;

    if (this.svg)  this.svg.remove();
    if (this.bgdiv)  this.bgdiv.remove();
    this.svg = null;
    this.bgdiv = null;
  }

  return ParticleBackground;
}));

let particleBackground = new ParticleBackground("particle");

function destroyParticleBackground() {
  if (particleBackground)  particleBackground.destroy();
  particleBackground = null;
}
