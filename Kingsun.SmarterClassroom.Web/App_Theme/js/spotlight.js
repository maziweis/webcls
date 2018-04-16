/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://webcodingeasy.com
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * Spotlight class creates a spotlight like visual cue to 
 * concentrate visitors attention to specific elements
 *
 * For more information, examples and online documentation visit: 
 * http://webcodingeasy.com/JS-classes/Javascript-Spotlight-visual-cue
**************************************************************/
var spotlight = function(f) {
	var g = {
		bgColor: "rgba(0,0,0,1)",
		lightStart: 0,
		lightEnd: 0.2,
		size: 100,
		blurRadius: 20,
		interval: 10,
		steps: 50,
		zIndex: 100,
		onMouseOver: null,
		onMouseOut: null,
		onSpotClick: null,
		onCanvasClick: null,
		onAnimationStart: null,
		onAnimationEnd: null
	};
	var d, ctx, current = {},
		target = {},
		step = {};
	current.x = 0, current.y = 0, current.r = 0, current.blur = 0, target.x = 0, target.y = 0, target.r = 0, target.blur = 0, step.x = 0, step.y = 0, step.r = 0, step.blur = 0;
	var h = function() {
			d = m();
			for (var a in f) {
				g[a] = f[a]
			}
			current.r = g.size;
			target.r = g.size;
			current.blur = g.blurRadius;
			target.blur = g.blurRadius;
			var b;
			if (document.getElementById("canvas")) {
				b = document.getElementById("canvas");
				ctx = b.getContext("2d")
			} else {
				b = document.createElement("canvas");
				b.setAttribute("width", d.width + "px");
				b.setAttribute("height", d.height + "px");
				b.style.position = "absolute";
				b.style.top = "0px";
				b.style.left = "0px";
				b.style.zIndex = g.zIndex;
				b.id = "canvas";
				ctx = b.getContext("2d");
				document.body.appendChild(b)
			}
			if (g.onCanvasClick || g.onSpotClick) {
				n(b, "click", function(e) {
					e = o(e);
					if (((e.pageX - current.x) * (e.pageX - current.x)) + ((e.pageY - current.y) * (e.pageY - current.y)) <= current.r * current.r) {
						if (g.onSpotClick) {
							g.onSpotClick(e)
						}
					} else {
						if (g.onCanvasClick) {
							g.onCanvasClick(e)
						}
					}
				})
			}
			if (g.onMouseOver || g.onMouseOut) {
				n(b, "mousemove", function(e) {
					e = o(e);
					if (((e.pageX - current.x) * (e.pageX - current.x)) + ((e.pageY - current.y) * (e.pageY - current.y)) <= current.r * current.r) {
						if (g.onMouseOver) {
							g.onMouseOver(e)
						}
					} else {
						if (g.onMouseOut) {
							g.onMouseOut(e)
						}
					}
				})
			}
		};
	this.show = function(x, y, r) {
		l(x, y, r)
	};
	this.hide = function() {
		k()
	};
	this.animate = function(x, y, r, a, b) {
		target.x = x;
		target.y = y;
		target.r = r;
		target.blur = a;
		b = (b) ? b : g.steps;
		step.x = Math.abs(target.x - current.x) / b;
		step.y = Math.abs(target.y - current.y) / b;
		step.r = Math.abs(target.r - current.r) / b;
		step.blur = Math.abs(target.blur - current.blur) / b;
		if (g.onAnimationStart) {
			g.onAnimationStart()
		}
		i()
	};
	this.move = function(x, y) {
		this.animate(x, y, current.r, current.blur)
	};
	this.resize = function(r) {
		this.animate(current.x, current.y, r, current.blur)
	};
	this.blur = function(a) {
		this.animate(current.x, current.y, current.r, a)
	};
	this.changeBgColor = function(a) {
		g.bgColor = a;
		l(current.x, current.y)
	};
	this.changeSpot = function(a, b) {
		g.lightStart = a;
		g.lightEnd = b;
		l(current.x, current.y)
	};
	this.setSteps = function(a) {
		g.steps = a
	};
	var i = function() {
			var a = false;
			a = j("x", a);
			a = j("y", a);
			a = j("r", a);
			a = j("blur", a);
			l(current.x, current.y, current.r, current.blur);
			if (a) {
				setTimeout(i, g.interval)
			} else {
				if (g.onAnimationEnd) {
					g.onAnimationEnd()
				}
			}
		};
	var j = function(a, b) {
			if (current[a] > target[a]) {
				current[a] -= step[a];
				b = true
			} else if (current[a] < target[a]) {
				current[a] += step[a];
				b = true
			}
			if (current[a] > target[a] - step[a] && current[a] < target[a] + step[a]) {
				current[a] = target[a]
			}
			return b
		};
	var k = function() {
			ctx.globalCompositeOperation = "source-over";
			ctx.clearRect(0, 0, d.width, d.height);
			ctx.fillStyle = g.bgColor;
			ctx.fillRect(0, 0, d.width, d.height)
		};
	var l = function(x, y, r, a) {
			k();
			current.x = x;
			current.y = y;
			r = (r) ? r : current.r;
			current.r = r;
			a = (a) ? a : current.blur;
			current.blur = a;
			var b = r + a;
			var c = ctx.createRadialGradient(x, y, 0, x, y, b);
			c.addColorStop(0, "rgba(0,0,0," + (1 - g.lightStart) + ")");
			c.addColorStop(r / b, "rgba(0,0,0," + (1 - g.lightEnd) + ")");
			c.addColorStop(1, "rgba(0,0,0,0)");
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = c;
			ctx.beginPath();
			ctx.arc(x, y, b, 0, Math.PI * 2);
			ctx.fill()
		};
	var m = function() {
			var a = new Object();
			a.width = 0;
			a.height = 0;
			a.width = Math.max(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), Math.max(document.body.offsetWidth, document.documentElement.offsetWidth), Math.max(document.body.clientWidth, document.documentElement.clientWidth));
			a.height = Math.max(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), Math.max(document.body.offsetHeight, document.documentElement.offsetHeight), Math.max(document.body.clientHeight, document.documentElement.clientHeight));
			return a
		};
	var n = function(a, b, c) {
			if (a.addEventListener) {
				a.addEventListener(b, c, false)
			} else {
				a.attachEvent('on' + b, c)
			}
		};
	var o = function(e) {
			if (typeof e.pageY == 'undefined' && typeof e.clientX == 'number' && document.documentElement) {
				e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			};
			return e
		};
	h()
}