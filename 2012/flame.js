var gfm = gfm || {};

gfm.Flame = function(number, mbase, expo)
{

    var N = number ? number : ((30 + Math.random()*Math.random() * 90) | 0);
    this.N = N;
    this._x = new Array(N);
    this._y = new Array(N);
    this._dx = new Array(N);
    this._dy = new Array(N);
    this._wid = new Array(N);
    this._dwid = new Array(N);
    var base = mbase ? mbase : 32 + Math.random() * 48;

    this.init(base, expo ? expo : 1.9);
};

gfm.Flame.prototype = 
{
    init: function(base, expo)
    {
        for (var i = 0; i < this.N; ++i)
        {
            this._y[i] = 0;
            this._x[i] = 0;
            var fr = (1 - i / this.N);
            fr = Math.pow(fr, expo);
            this._wid[i] = base * fr;
            this._dx[i] = 0;            
            this._dy[i] = 0;
            this._dwid[i] = 0;
        }
    },

    move: function(wind, wind2, posx, posy, friction)
    {
        this._y[0] = posy;
        this._x[0] = posx;

        for (var i = 1; i < this.N; ++i)
        {
            this._dx[i] += (this._x[i-1] - this._x[i]) * 20.0;
            this._dx[i] *= friction;
            this._dy[i] += (this._y[i-1] - this._y[i]-0.004 ) * 20.0;
            this._dy[i] *= friction;
        }

        for (var i = 1; i < this.N; ++i)
        {
           var f = i / (this.N - 1);
           var win = wind * f + wind2 * (1 - f);
           this._dx[i] += (Math.random() - 0.5) * 0.006 + win * 0.01;            
           this._dy[i] += (Math.random() - 0.5) * 0.006 + win * 0.01;
        }

        for (var i = 1; i < this.N; ++i)
        {
            this._x[i] += this._dx[i];
            this._y[i] += this._dy[i];
        }

    },

    draw: function(context, W, H, img, max, sizeFactor)
    {
        var x = this._x;
        var y = this._y;
        var wid = this._wid;
        var D = Math.min(W, H);
    //    context.fillStyle = "rgba(255, 0, 0, 0.5)";
        var limit = this.N;
        if (max){limit = Math.min(max, limit);}
        for (var i = 0; i < limit; ++i)
        {            
            var s = wid[i] * (sizeFactor ? sizeFactor : 1);
            var cx = W/2 + D * x[i] - s/2;
            var cy = H/2 + D * y[i] - s/2;

            context.drawImage(img._img, cx, cy, s, s);
        }
    },

    drawSym: function(context, W, H, img, max, symX, baseAngle)
    {
        var x = this._x;
        var y = this._y;
        var wid = this._wid;
        var D = Math.min(W, H);
        var limit = this.N;
        if (max){limit = Math.min(max, limit);}
        for (var i = 0; i < limit; ++i)
        {            
            var s = wid[i];

            for (var k = 0; k < symX; ++k)
            { 
                var angle = k * Math.PI*2 / 9 + (baseAngle ? baseAngle : 0);
                var cx = W/2 + D * (x[i] * Math.cos(angle) + Math.sin(angle) * y[i]) - s/2;
                var cy = H/2 + D * (y[i] * Math.cos(angle) - Math.sin(angle) * x[i]) - s/2;
                context.drawImage(img._img, cx, cy, s, s);
            }
        }
    }
};
