var gfm = gfm || {};
 


gfm.PrimVec = function(maxCount)
{
    this._maxCount = maxCount;
    this._prims = new Array(maxCount);
     
    for (var i = 0; i < maxCount; ++i)
    {
        this._prims[i] = new gfm.Prim(0, 0, 0, 0, 0, 0, 0);        
    }
    
    this._count = 0;
    
    this._linesStyle = gfm.rgba(0.9, 0.9, 1, 0.4);
};

gfm.PrimVec.prototype = {
  
    clear: function()
    {
        this._count = 0;
    },
    
    push: function(x, y, z, radius, material)
    {
        var oldCount = this._count;
                
        var prim = this._prims[oldCount];
        prim._x = x;
        prim._y = y;
        prim._z = z;
        prim._material = material;
        prim._radius = radius;
        this._count ++;
        return oldCount;
    }
};

