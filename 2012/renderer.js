var gfm = gfm || {};

gfm.Renderer = function(canvasId)
{
	this._width = 0;
	this._height = 0;

	if (canvasId)
	{	
		this._canvas = document.getElementById(canvasId);
	}
	else
	{
		// create an offscreen Canvas
		this._canvas = document.createElement('canvas');
	}

	this._context = this._canvas.getContext('2d');
	
	var canvasDrawOptimization = true;
	
	// the same trick applied on texture can be applied
	// this only works for FF and Opera
	
	if (canvasDrawOptimization)
	{
		if (this._canvas.style.msInterpolationMode !== undefined) {
			this._canvas.style.msInterpolationMode = "nearest-neighbor";
		} 
		else if (this._canvas.style.getPropertyValue("image-rendering") != null) 
		{
			this._canvas.style.setProperty ("image-rendering", "optimizeSpeed", null);
		}	
	}		
	
	this._isValid = (this._canvas !== null);
};

gfm.Renderer.prototype = {
		
	setSize: function(w, h)
	{
		this._width = w;
		this._height = h;
		if (this._canvas) 
		{
			this._canvas.width = w;
			this._canvas.height = h;
		}
		this._imageData = null;
		this._imageData2 = null;
	},
	
	blit: function(renderer)
	{
		this._context.drawImage(renderer._canvas, 0, 0);
	},

	draw: function(renderer, offsetX, offsetY)
	{
		this._context.drawImage(renderer._canvas, 0, 0, renderer._width, renderer._height, offsetX, offsetY, this._width, this._height);
	},

	createImageDataLazily: function()
	{
		if (!this._imageData)
		{
			this._imageData = this._context.getImageData(0, 0, this._width, this._height);
		}
	},

	createImageDataLazily2: function()
	{
		if (!this._imageData2)
		{
			this._imageData2 = this._context.getImageData(0, 0, this._width, this._height);
		}
	},

	// pixelFunction(r, g, b, a, x, y) -> {r: ..., g: ..., b: ..., a: ...}
	mapPixels: function(pixelFunction)
	{
		// get entire image
		this.createImageDataLazily();

		var imageData = this._imageData;
		// apply function


		var w = imageData.width;
		var h = imageData.height;
		var data = imageData.data; 
		var index = 0;
		for (var j = 0; j < h; ++j)
	    {
	      var y = j / h;
	      for (var i = 0; i < w; ++i)
	      {
	      	 var x = i / w;
	         var R = data[index] / 255.0;
	         var G = data[index+1] / 255.0;
	         var B = data[index+2] / 255.0;
	         var A = data[index+3] / 255.0;

	         var RGBA = pixelFunction(R, G, B, A, x, y);

	         data[index] = (0.5 + RGBA.r * 255.0) | 0;
	         data[index + 1] = (0.5 + RGBA.g * 255.0) | 0;
	         data[index + 2] = (0.5 + RGBA.b * 255.0) | 0;
	         data[index + 3] = (0.5 + RGBA.a * 255.0) | 0;

	         index += 4;
	       }
	     }

		this._context.putImageData(imageData, 0, 0);
		return this;
	},

	makeNoise: function()
	{
		this.mapPixels((function(R, G, B, A, x, y) { 
	        return { 
	            r: Math.random(), 
	            g: Math.random(), 
	            b: Math.random(), 
	            a: Math.random() };
	        }
        ));
        return this;
	},

	greyScale: function()
	{
		return this.mapPixels((function(R, G, B, A, x, y) { 
			var grey = (R + G + B) / 3;
	        return { 
	            r: grey,
	            g: grey,
	            b: grey, 
	            a: A };
	        }
        ));
	},

	multiply: function(mulR, mulG, mulB, mulA)
	{
		return this.mapPixels((function(R, G, B, A, x, y) { 
			return { 
	            r: R * mulR,
	            g: G * mulG,
	            b: B * mulB, 
	            a: A * mulA };
	        }
        ));
	},

	addConstant: function(addR, addR, addB, addA)
	{
		return this.mapPixels((function(R, G, B, A, x, y) { 
			return { 
	            r: R * addR,
	            g: G * addG,
	            b: B * addB, 
	            a: A * addA };
	        }
        ));
	},

	// slow convolution
	// filter should be an array of cx * vy coefficients
	convolve: function(coef, cx, cy)
	{
		// get entire image
		this.createImageDataLazily();
		this.createImageDataLazily2();

		var imageData = this._imageData;
		var imageData2 = this._imageData2;
		// apply function

		var w = imageData.width;
		var h = imageData.height;
		var data = imageData.data; 
		var data2 = imageData2.data; 
		var indexDest = 0;
		var xshift = (cx / 2) | 0;
		var yshift = (cy / 2) | 0;

		// compute filter weight
		var weight = 0;
		for (var ci = 0; ci < cx * cy; ++ci) 
		{
			weight += coef[ci];
		}

		for (var j = 0; j < h; ++j)
	    {
	      for (var i = 0; i < w; ++i)
	      {
	         var Raccum = 0;
	         var Gaccum = 0;
	         var Baccum = 0;
	         var Aaccum = 0;

	         for(var l = 0; l < cy; ++l)
	         {
	         	var y = j + l - yshift;
	         	y = (y + h) % h; // wrap
	         	for(var k = 0; k < cx; ++k)
	         	{
	         		var x = i + k - xshift;
	         		x = (x + w) % w; // wrap

	         		var index = 4 * (y * w + x);
	         		var C = coef[cx * l + k];
	         		Raccum += data[index] * C;
	         		Gaccum += data[index+1] * C;
	         		Baccum += data[index+2] * C;
	         		Aaccum += data[index+3] * C;
	         	}
	         }



	         data2[indexDest] = Raccum / weight;
	         data2[indexDest + 1] = Gaccum/ weight;
	         data2[indexDest + 2] = Baccum/ weight;
	         data2[indexDest + 3] = Aaccum/ weight;

	         indexDest += 4;
	       }
	    }
		this._context.putImageData(imageData2, 0, 0);
		return this;
	},

	blur: function()
	{
		return this.convolve([1, 2, 1,
			                  2, 4, 2,
			                  1, 2, 1], 3, 3);
	},

	fillColor: function(cR, cG, cB)
	{
		var c = this._context;
		var gA = c.globalAlpha;
		var gCO = c.globalCompositeOperation;
		c.globalAlpha = 1.0;
		c.globalCompositeOperation = 'copy';
		c.fillStyle = 'rgb(' + (Math.round(cR * 255) | 0) + ',' +  + (Math.round(cG * 255) | 0) + ',' +  + (Math.round(cB * 255) | 0) + ')';
		c.fillRect(0, 0, this._width, this._height);
        c.globalAlpha = gA;
		c.globalCompositeOperation = gCO;
	},
};
