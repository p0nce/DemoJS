var gfm = gfm || {};


gfm.Grid = function(width, height, div, capacity) // in pixels
{
    this._xdiv = Math.ceil(width / div) | 0;
    this._ydiv = Math.ceil(height / div) | 0;
    
    
    this._count = this._xdiv * this._ydiv;
    
    this._slots = new Array(this._count); // grid elements
    
    for (var j = 0; j < this._ydiv; ++j)
    {
        for (var i = 0; i < this._xdiv; ++i)
        {
            var basex = i * div;
            var basey = j * div;
            var wid = Math.min(div, width - basex);
            var hei = Math.min(div, height - basey);
            
            this._slots[i + (j * this._xdiv)] = new gfm.Slot(basex, basey, wid, hei, capacity);
        }
    }
  
  
  this._primvec = new gfm.PrimVec(capacity);
 
}

gfm.Grid.prototype = {  
    
    push: function(x, y, z, radius, material)
    {
        var primvec = this._primvec;      
        if (radius < 1)
        {
            return;
        }     
        
        if (z < 0)
        {
            return;
        }
                  
        var idx = this._primvec.push(x, y, z, radius, material);
    },  
    
    pushInSlots: function()
    {
        // push in each slot that do not clip it        
        var count = this._count;
        var slots = this._slots;
        var primvec = this._primvec;
        var pcount = primvec._count;
        var prims = primvec._prims;
        
        for (var i = 0; i < count; ++i)
        {
            var slot = slots[i];
            var xmin = slot._x;
            var xmax = slot._x + slot._width - 1;
            var ymin = slot._y;
            var ymax = slot._y + slot._height - 1;
            var pindices = slot._pindices;
            
            for (var p = 0; p < pcount; ++p)
            {
                var prim = prims[p];
            
                var cx = prim._x;
                var cy = prim._y;
                var radius = prim._radius * 0.7;
                var x = cx;
                var y = cy;               
                
                if (x < xmin) { x = xmin; }
                if (x > xmax) { x = xmax; }
                if (y < ymin) { y = ymin; }
                if (y > ymax) { y = ymax; }
                var dx = x - cx;
                var dy = y - cy;
                var dist2 = dx * dx + dy * dy;
                if (dist2 <= (radius * radius))
                {                 
                    pindices[slot._count] = p;
                    slot._count ++;
                }
            }            
        }
    },
     
    clear: function()
    {
        // clear slots and primvec
        var count = this._count;
        var slots = this._slots;
        for (var i = 0; i < count; ++i)
        {
            slots[i].clear();
        }
        this._primvec.clear();
    },    
    
    sort: function()
    {
        // sort indices in slots
        var count = this._count;
        var slots = this._slots;
        var primvec = this._primvec;
        for (var i = 0; i < count; ++i)
        {
            slots[i].sort(primvec);
        }
    },
    
    processOcclusions: function()
    {
        var count = this._count;
        var slots = this._slots;
        var primvec = this._primvec;
        for (var i = 0; i < count; ++i)
        {
            slots[i].processOcclusions(primvec);
        }
    },
    
    draw: function(materials, textureManager, bggradient, context, zfocus, cost)
    {
        var count = this._count;
        var slots = this._slots;
        var primvec = this._primvec;
        for (var i = 0; i < count; ++i)
        {            
            slots[i].draw(materials, textureManager, bggradient, primvec, context, zfocus, cost);
        }
    }
};