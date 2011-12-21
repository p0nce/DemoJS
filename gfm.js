var gfm = gfm || {};

Function.prototype.bind = function()
{ 
	var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
	return function()
	{ 
		return fn.apply(object, 
		args.concat(Array.prototype.slice.call(arguments))); 
	}; 
}; 

gfm.randInt = function(a, b)
{
    // assumes b >= a
    return a + Math.floor(Math.random() * (b - a));
};

gfm.fillArray = function(a, e)
{
	var l = a.length;
	for (var i = 0; i < l; ++i)
	{
		a[i] = e;
	}	
};

gfm.floatColor = function(x)
{
    return (x * 255.0) | 0;
};

gfm.rgb = function(r, g, b)
{
    var f = gfm.floatColor;
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';	
};
	
gfm.rgba = function(r, g, b, a)
{
    var f = gfm.floatColor;
    return 'rgba(' + f(r) + ',' + f(g) + ',' + f(b) + ',' + a + ')';	
};
