var gfm = gfm || {};

gfm.Renderer = function(canvasId, aux)
{
	this._width = 0;
	this._height = 0;
	
	this._canvas = document.getElementById(canvasId);

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
	
	if (aux && (this._canvas !== null)) 
	{
		this._auxCanvas = document.createElement('canvas');	

		this._auxContext = this._auxCanvas.getContext('2d');			
		this._auxCanvas.width = this._width;
		this._auxCanvas.height = this._height;	
		
		if (canvasDrawOptimization)
		{			
			if (this._auxCanvas.style)
			{
				if (this._auxCanvas.style.msInterpolationMode !== undefined) {
					this._auxCanvas.style.msInterpolationMode = "nearest-neighbor";
				} 
				else if (this._auxCanvas.style.getPropertyValue("image-rendering") != null) 
				{
					this._auxCanvas.style.setProperty ("image-rendering", "optimizeSpeed", null);
				}
			}
		}
	}
	else
	{	
		this._auxCanvas = null;
		this._auxContext = null;
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
			
			if (this._auxCanvas)
			{
				this._auxCanvas.width = w;
				this._auxCanvas.height = h;
			}
		}
	},
	
	getWidth: function()
	{
		return this._width;
	},
	
	getHeight: function()
	{
		return this._height;
	},
	
	getContext: function()
	{
		return this._context;
	},
	
	getCanvas: function()
	{
		return this._canvas;
	},
	
	getAuxContext: function()
	{
		return this._auxContext;
	},
	
	getAuxCanvas: function()
	{		
		return this._auxCanvas;
	},
	
	flip: function()
	{
		this._context.drawImage(this._auxCanvas, 0, 0);
	}
};
