var gfm = gfm || {};

gfm.Material = function(context, r, g, b)
{
    this._N = 1000;
    this._gradients = new Array(this._N);
    this._r = r * 0.5;
    this._g = g * 0.5;
    this._b = b * 0.55;
    this._context = context;
    
    for (var i = 1; i < this._N; ++i)
    {
        //this._gradients[i] = null;
        this._gradients[i] = this.buildGradient(i);
    }
    
};

gfm.Material.prototype = {
    
    getMaterial: function(radius)
    {
        radius = radius | 0;
        if (radius >= this._N)
        {
            return this.buildGradient(radius);
            
        }   
        else
        {
        
            if (this._gradients[radius] === null)
            {
                this._gradients[radius] = this.buildGradient(radius);
            }
            
            return this._gradients[radius];
        }
    },
    
    buildGradient: function(radius)
    {
        var context = this._context;
        var gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
                     
        var r = this._r;
        var g = this._g;
        var b = this._b;
        var rgb = gfm.rgb;
        var rgba = gfm.rgba;
        gradient.addColorStop(0, rgb(r, g, b));
        gradient.addColorStop(0.4, rgb(r * 0.6, g * 0.6, b * 0.6));
        gradient.addColorStop(0.465, rgba(r * 0.4, g * 0.4, b * 0.4, 0.7));
        gradient.addColorStop(0.5, rgba(r * 0.1, g * 0.1, b * 0.1, 0.6));            
        gradient.addColorStop(0.511, rgba(0, 0, 0, 0.225));
        gradient.addColorStop(0.64, rgba(0, 0, 0.1, 0.07));
        gradient.addColorStop(0.67, rgba(0.9, 0.9, 1, 0.1));
        gradient.addColorStop(0.700, rgba(0, 0, 0.1, 0.07));        
        gradient.addColorStop(1.00, rgba(0, 0, 0, 0));
        return gradient;        
    }
    
};