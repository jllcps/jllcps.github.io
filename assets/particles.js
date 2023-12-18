(function (factory) {
  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = (typeof self === 'object' && self.self === self && self) || (typeof global === 'object' && global.global === global && global);
  root.ParticleBackground = factory(root, {});
}(function (root, ParticleBackground) {
  const RandomWithRanges = (range) => Math.floor(range * Math.random());

  var Particle = function(parent) {
    this.size = (RandomWithRanges(parent.particleMaxSize - parent.particleMinSize) + parent.particleMinSize) * parent.particleScale;
    this.colorIndex = RandomWithRanges(parent.particleColors.length);
    this.color = parent.particleColors[this.colorIndex];
    this.angle = 2 * Math.PI * Math.random();

    this.textElem = document.createElement("span");
    this.textElem.style.fontSize = `${this.size}px`;
    this.textElem.style.transform = `rotate(${this.angle}rad)`;
    this.textElem.style.color = `rgba(${this.color}, ${this.color}, ${this.color}, 1)`;
    parent.bgdiv.appendChild(this.textElem);

    // this.textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    // this.textElem.setAttribute("font-size", `${this.size}px`);
    // this.textElem.setAttribute("transform", `rotate(${this.angle}rad)`);
    // this.textElem.setAttribute("fill", `rgba(${this.color}, ${this.color}, ${this.color}, 1)`);
    // parent.svg.appendChild(this.textElem);

    this.textElem.innerHTML = parent.particleText;
    this.textElem.id = `particle-${parent.count}`;
    this.textElem.classList.add("particles");
    this.textElem.classList.add(`glow${this.colorIndex+1}`);
    // this.textElem.innerHTML = `${parent.particleTexts[RandomWithRanges(parent.particleTexts.length)]}&#xFE0E;`;
    this.update(parent);
  };

  Particle.prototype.update = function(parent) {
    // if ((this.posY < parent.backgroundTop) ||
    //     (this.posY > parent.backgroundBottom - this.size) ||
    //     (this.posX < parent.backgroundLeft) ||
    //     (this.posX > parent.backgroundRight - this.size) ||
    //     )
    //   console.log("not within viewport");
    // }

    this.posX = RandomWithRanges(parent.backgroundRight - parent.backgroundLeft - 2 * this.size) + parent.backgroundLeft;
    this.posY = RandomWithRanges(parent.backgroundBottom - parent.backgroundTop - 2 * this.size) + parent.backgroundTop;
    this.textElem.style.top = this.posY + "px";
    this.textElem.style.left = this.posX + "px";
    // this.textElem.setAttribute("y", this.posY + "px");
    // this.textElem.setAttribute("x", this.posX + "px");
  }

  Particle.prototype.destroy = function(parent) {
    this.size = null;
    this.posX = null;
    this.posY = null;
    this.colorIndex = null;
    this.color = null;
    this.angle = null;

    if (this.textElem)  this.textElem.remove()
    this.textElem = null;
  }

  ParticleBackground = function() {
    this.refreshInterval = 3000;

    this.particleMinSize = 15;
    this.particleMaxSize = 30;
    this.particleScale = Math.max(1, window.devicePixelRatio * 0.6);

    this.particleText = "&#10053;&#xFE0E;";   // \uFE0E (U+FE0E)
    // this.particleTexts = ["&#10053;"];
    this.particleColors = [200, 210, 220];

    this.particleDensity = 1 / 30000;
    this.bgdiv = document.getElementById("particle");

    this.init();
    this.update();
  }

  ParticleBackground.prototype.init = function() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = null;

    this.count = 0;
    this.particles = {};
    this.particleAmount = 0;
    this.bgdiv.innerHTML = "";
    // this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // this.bgdiv.appendChild(this.svg);

    window.addEventListener("animationiteration", (event) => {
      if (event.target.classList.contains("particles")) {
        let particleId = event.target.id;
        let particle = this.particles[particleId];
        if (this.particleAmount > this.newParticleAmount) {
          particle.destroy();
          delete this.particles[particleId];
          this.particleAmount -= 1;          
        } else {
          particle.update(this);
        }
      }
    });
  }

  ParticleBackground.prototype.update = function() {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0,
        viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    this.backgroundTop = document.body.scrollTop || window.pageYOffset || 0;
    this.backgroundBottom = this.backgroundTop + viewportHeight;
    this.backgroundLeft = document.body.scrollLeft || window.pageXOffset || 0;
    this.backgroundRight = this.backgroundLeft + viewportWidth;

    this.newParticleAmount = viewportWidth * viewportHeight * this.particleDensity;
    for (; this.particleAmount < this.newParticleAmount; this.particleAmount++) {
      let particle = new Particle(this);
      this.particles[`particle-${this.count}`] = particle;
      this.count += 1;
    }

    this.refreshTimer = setTimeout(() => {
      this.update();
    }, this.refreshInterval);
  }

  ParticleBackground.prototype.resume = function() {
    const keys = Object.keys(this.particles);
    for (let i = 0; i < keys.length; i++) {
      let particle = this.particles[keys[i]];
      particle.textElem.classList.add('running');
      particle.textElem.classList.remove('paused');
      // particle.textElem.classList.add(`glow${particle.colorIndex+1}`);
    }
    this.update();
  }

  ParticleBackground.prototype.stop = function() {
    const keys = Object.keys(this.particles);
    for (let i = 0; i < keys.length; i++) {
      let particle = this.particles[keys[i]];
      particle.textElem.classList.add('paused');
      particle.textElem.classList.remove('running');
      // particle.textElem.classList.remove(`glow${particle.colorIndex+1}`);
    }
    clearTimeout(this.refreshTimer);
    this.refreshTimer = null;
  }

  ParticleBackground.prototype.destroy = function() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = null;

    this.refreshInterval = null;
    this.particleMinSize = null;
    this.particleMaxSize = null;
    this.particleScale = null;
    this.particleText = null;
    this.particleColors = null;
    this.particleDensity = null;

    const keys = Object.keys(this.particles);
    for (let i = 0; i < keys.length; i++) {
        this.particles[keys[i]].destroy();
        delete this.particles[keys[i]];
    }
    this.particles = null;
    this.backgroundTop = null;
    this.backgroundBottom = null;
    this.backgroundLeft = null;
    this.backgroundRight = null;
    this.count = null;
    this.particleAmount = null;
    this.newParticleAmount = null;

    if (this.bgdiv)  this.bgdiv.remove();
    this.bgdiv = null;
    // if (this.svg)  this.svg.remove();
    // this.svg = null;
  }

  return ParticleBackground;
}));

window.particleBackgroundInstance = new ParticleBackground();

window.destroyParticleBackground = function() {
  if (window.particleBackgroundInstance !== null)  window.particleBackgroundInstance.destroy();
  window.particleBackgroundInstance = null;
}

document.addEventListener('visibilitychange', () => { window.particleBackgroundInstance === null? undefined : (document.hidden? window.particleBackgroundInstance.stop() : window.particleBackgroundInstance.resume()); });
