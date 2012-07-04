var gfm = gfm || {};

// grid element (position + list of primitives indices

gfm.Slot = function(x, y, width, height, capacity) // in pixels
{
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._capacity = capacity;
        
    this._pindices = new Array(capacity);
     
    for (var i = 0; i < capacity; ++i)
    {
        this._pindices[i] = -1;
    }
    this._count = 0;
    this._backgroundNeedRedraw = true;
};

gfm.Slot.prototype = {
  
    clear: function()
    {
        this._count = 0;
    },
    
    empty: function()
    {
        return (this._count === 0);        
    },
    
    // sort indices by object depth
    sort: function(primvec)
    {   
        var count = this._count;
        var pindices = this._pindices;
        // bubble sort (!) of the active part of the array
        var prims = primvec._prims;
        for (var i = 0; i < count; ++i)
            for (var j = count - 1; j > i; --j)
            {
                var idxa = pindices[j-1];
                var idxb = pindices[j];
                var prima = prims[idxa];
                var primb = prims[idxb];
                
                if (prima._z < primb._z)
                {
                    pindices[j] = idxa; // invert indices
                    pindices[j-1] = idxb; 
                }
            }
    },
    
    processOcclusions: function(primvec)
    {
        var count = this._count;
        var pindices = this._pindices;
        var prims = primvec._prims;
        for (var i = 0; i < count; )
        {
            var idxi = pindices[i];
            var primi = prims[idxi];
            var occluded = false;
            var j = i + 1;
            var idxj = 0;
            var pradius = primi._radius * 0.7;
            for ( ; j < count; ++j)
            {
                idxj = pindices[j];
                var primj = prims[idxj];
                                
                var radius = primj._radius * 0.4; // opaque part
                
                if (pradius < radius)
                {
                    if (primi._z < primj._z)
                    {
                        var rdiff = radius - pradius;
                        var dx = primj._x - primi._x;
                        var dy = primj._y - primi._y;
                        
                        if (dx * dx + dy * dy < rdiff * rdiff)
                        {
                            occluded = true;
                            break;                    
                        }                        
                    }                    
                }
            }
                 
            if (occluded)
            {
                pindices[i] = idxj;
                this._count--;
                count = this._count;
            }
            else
            {
                ++i;
            }
        } 
               
    },
    
    draw: function(materials, textureManager, bggradient, primvec, context, zfocus, cost)
    {
        
        // set clipping region
        var basex = this._x;
        var basey = this._y;
        var width = this._width;
        var height = this._height;
        var xmax = basex + width;
        var ymax = basey + height;
        context.save();
        
        context.beginPath();
        context.rect(basex, basey, width, height);        
        context.clip();
        
        var count = this._count;
        var prims = primvec._prims;
        var startShadow = primvec._startShadow;
        var midShadow = primvec._midShadow;
        var endShadow = primvec._endShadow;
        var linesStyle = primvec._linesStyle;
        var pindices = this._pindices;        
        
        context.lineWidth = 0.5;
        
        var M = Math;
        var pow = M.pow;
        var max = M.max;
        var abs = M.abs;
        var rgb = gfm.rgb;
        var rgba = gfm.rgba;
        var textures = textureManager._textures;
       
        
        if (this._backgroundNeedRedraw)
        {
            context.fillStyle = bggradient;	    
	        context.fillRect(basex, basey, width, height);            
        }
        
        var translatex = 0;
        var translatey = 0;
        
        for (var i = 0; i < count; ++i)
        {
            var prim = prims[pindices[i]];
            var z = prim._z;            
            var x = prim._x;
            var y = prim._y;
            
            context.translate(- translatex + x, -translatey + y);
            translatex = x;
            translatey = y;
            
            var radius = prim._radius;
            var effRadius = radius * (0.4 + 0.4 / (z * 0.5 + 1));
            if (effRadius > 2)
            {
                var material = prim._material;
                if (material <= 3)
                {
                    var img = textures[prim._material]._img;
                    context.drawImage(img, 0 - radius, 0 - radius, 2 * radius, 2 * radius);
                }
                else
                {
                    context.fillStyle = materials[prim._material - 4].getMaterial(radius);
                    
                    context.beginPath();
                    context.arc(0, 0, effRadius, 0.0, Math.PI*2, true);
                    context.closePath();
                    context.fill();
                }
            }
            else
            {
                //context.fillStyle = '#000';
                context.fillRect(0, 0, 1, 1);                
            }
        }
        context.restore();  
        this._backgroundNeedRedraw = (count > 0);
    }   
};