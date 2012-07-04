var gfm = gfm || {};

gfm.Mat4 = function()
{
    this._c = new Array(16);
    
    for (var i = 0; i < 16; ++i)
    {
        this._c[i] = 0;
    }
};
    
    
gfm.Mat4.prototype = {
    
    copyTo : function(m)
    {
        for (var i = 0; i < 16; ++i)
        {
            m._c[i] = this._c[i];
        }
    },
    
    get: function(i, j)
    {
        return this._c[4 * i + j];
    },
    
    set: function(i, j, x)
    {
        this._c[4 * i + j] = x;
    },
    
    // return product this * m
    mul: function(m, result)
    {   
        for (var i = 0; i < 4; ++i)
        {
            for (var j = 0; j < 4; ++j)
            {
                var sum = 0;
                for (var k = 0; k < 4; ++k)
                {
                    sum += this.get(i, k) * m.get(k, j);
                }
                result._c[i * 4 + j] = sum;
            }
        }
    },
         
    // matrix * vector
    // return a Vec4      
    transform: function(x, y, z, w, res)
    {
        var c = this._c;
        res._x = c[0] * x + c[1] * y + c[2] * z + c[3] * w;
        res._y = c[4] * x + c[5] * y + c[6] * z + c[7] * w;
        res._z = c[8] * x + c[9] * y + c[10] * z + c[11] * w;
        res._w = c[12] * x + c[13] * y + c[14] * z + c[15] * w;        
    },
    
    transformPersp: function(x, y, z, radius, res)
    {
        var c = this._c;
        var tx = c[0] * x + c[1] * y + c[2] * z + c[3];
        var ty = c[4] * x + c[5] * y + c[6] * z + c[7];
        var tz = c[8] * x + c[9] * y + c[10] * z + c[11];
        var tw = c[12] * x + c[13] * y + c[14] * z + c[15];
        var f = 1 / tw;
        res._x = tx * f;
        res._y = ty * f;
        res._z = tz;
        res._w = radius * f;        
    }
    
};

 // return a perspective matrix   
     
gfm.perspective = function (fovy, aspect, zNear, zFar, result)
{
    var f = 1 / Math.tan(fovy * Math.PI / 360);
    var d = 1 / (zNear - zFar);
    
    result._c[0] = f / aspect;
    result._c[1] = 0;
    result._c[2] = 0;
    result._c[3] = 0;
    
    result._c[4] = 0;
    result._c[5] = f;
    result._c[6] = 0;
    result._c[7] = 0;
    
    result._c[8] = 0;
    result._c[9] = 0;
    result._c[10] = (zFar + zNear) * d;
    result._c[11] = 2 * d * zFar * zNear;
    
    result._c[12] = 0;
    result._c[13] = 0;
    result._c[14] = -1;
    result._c[15] = 0;
};

   
// return new camera function from 3 Vec3
gfm.lookat = function(eye, center, up, f, s, u, rot, tr, result)
{   
    center.sub(eye, f);
    f.normalize();
    f.cross(up, s);
    s.normalize();
    s.cross(f, u);
    u.normalize();
    
    rot._c[0] = -s._x;
    rot._c[1] = -s._y;
    rot._c[2] = -s._z;
    rot._c[3] = 0;
    rot._c[4] =  u._x;
    rot._c[5] =  u._y;
    rot._c[6] =  u._z;
    rot._c[7] = 0;
    rot._c[8] = -f._x;
    rot._c[9] = -f._y;
    rot._c[10] = -f._z;
    rot._c[11] = 0;
    rot._c[12] = 0;
    rot._c[13] = 0;
    rot._c[14] = 0;
    rot._c[15] = 1;
    
    tr._c[0] = 1;
    tr._c[1] = 0;
    tr._c[2] = 0;
    tr._c[3] = -eye._x;
    tr._c[4] = 0;
    tr._c[5] = 1;
    tr._c[6] = 0;
    tr._c[7] = -eye._y;
    tr._c[8] = 0;
    tr._c[9] = 0;
    tr._c[10] = 1;
    tr._c[11] = -eye._z;
    tr._c[12] = 0;
    tr._c[13] = 0;
    tr._c[14] = 0;
    tr._c[15] = 1;
    
    
    rot.mul(tr, result);                          
};