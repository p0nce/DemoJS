var gfm = gfm || {};

gfm.Vec3 = function(x, y, z)
{
    this._x = x;
    this._y = y;
    this._z = z;
};


gfm.Vec3.prototype = {
    
    copyTo : function(v)
    {
        v._x = this._x;
        v._y = this._y;
        v._z = this._z;        
    },
  
    cross : function(v, res) // return cross product
    {
       var x = this._x;    
       var y = this._y;
       var z = this._z;
       res._x = y * v._z - z * v._y;
       res._y = z * v._x - x * v._z;
       res._z = x * v._y - y * v._x;       
    },
    
    dot : function(v) // return cross product
    {
       var x = this._x;    
       var y = this._y;
       var z = this._z;
       return x * v._x + y * v._y + z * v._z;
    },
    
    normalize : function()
    {
        var f = 1 / this.getLength();        
        this._x *= f;
        this._y *= f;
        this._z *= f;
    },    
    
    getLength : function()
    {
        var x = this._x;    
        var y = this._y;
        var z = this._z;
        return Math.sqrt(x * x + y * y + z * z);
    },
    
    sub : function(v, res)
    {
       var x = this._x;    
       var y = this._y;
       var z = this._z;
       res._x = y - v._x;
       res._y = z - v._y;
       res._z = x - v._z;
    }
};