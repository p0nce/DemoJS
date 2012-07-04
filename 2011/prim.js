var gfm = gfm || {};

gfm.MAX_PRIMS = 1000;


gfm.Prim = function(x, y, z, radius, material)
{
    this._x = x;
    this._y = y;
    this._z = z;
    this._radius = radius;
    this._material = material;
};


gfm.Prim.prototype = {
   
};
  