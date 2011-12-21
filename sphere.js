var gfm = gfm || {};

gfm.Sphere = function(x, y, z, radius, material)
{
    this._N = 10;
   /*
    if (radius > 0.1)
    {
        this._N = Math.min(3, this._N);
    }
    
    if (radius > 0.2)
    {
        this._N = Math.min(1, this._N);
    }
    */
    
    this._x = new Array(this._N);
    this._y = new Array(this._N);
    this._z = new Array(this._N);
    
    for (var i = 0; i < this._N; ++i)
    {
        this._x[i] = x;
        this._y[i] = y;
        this._z[i] = z;
    }
    
    this._radius = radius;
    this._material = material;
    this._vx = 0; // velocity
    this._vy = 0;
    this._vz = 0;
    this._ax = 0; // acceleration accum
    this._ay = 0;
    this._az = 0;
    this._mass = 4 * Math.PI * Math.pow(this._radius, 3) / 3;
    this._invMass = 1 / this._mass;
};


gfm.Sphere.prototype = {
        
    progress: function(dt, frictionFactor)
    {
        var x = this._x;
        var y = this._y;
        var z = this._z;
        
        var vx = this._vx;
        var vy = this._vy;
        var vz = this._vz;
        
        var nx = x[0] + dt * vx;
        var ny = y[0] + dt * vy;
        var nz = z[0] + dt * vz;
        
        var invMass = this._invMass;
        vx += dt * this._ax * invMass;
        vy += dt * this._ay * invMass;
        vz += dt * this._az * invMass;
        
        vx *= frictionFactor;
        vy *= frictionFactor;
        vz *= frictionFactor;
        var radius = this._radius;
        var limsup = 4 * radius;
        var liminf = -4 * radius;
        var M = Math;
        var min = M.min;
        var max = M.max;
        vx = max(liminf, min(limsup, vx ));
        vy = max(liminf, min(limsup, vy ));
        vz = max(liminf, min(limsup, vz ));
        
        
        this._ax = 0;
        this._ay = 0;
        this._az = 0;
        this._vx = vx;
        this._vy = vy;
        this._vz = vz;
        var N = this._N;
        
        for (var i = N - 1; i > 0; --i)
        {
            x[i] = x[i - 1];
            y[i] = y[i - 1];
            z[i] = z[i - 1];            
        }
        x[0] = nx;
        y[0] = ny;
        z[0] = nz;
    }   
};
  