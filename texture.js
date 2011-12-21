var gfm = gfm || {};

gfm.Texture = function(filename, w, h)
{
	this._path = filename;
	this._width = w;
	this._height = h;
	var quality = false;
	
	var img = new Image();
	img.width = w;
	img.height = h;
	img.src = filename;
	
	var ieValue = quality ? "bicubic" : "nearest-neighbor";
    var ffValue = quality ? "optimizeQuality" : "optimizeSpeed";
	
	if (img.style.msInterpolationMode !== undefined) {
    	img.style.msInterpolationMode = ieValue;
    } 
	else if (img.style.getPropertyValue("image-rendering") != null) 
	{
    	img.style.setProperty ("image-rendering", ffValue, null);
	}
	
	this._img = img;	
};
    
gfm.Texture.prototype = {
	isLoaded: function()
	{
		return this._img.complete; //loaded;
	}	
};

