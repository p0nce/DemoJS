var gfm = gfm || {};


gfm.Main = function(wx, wy)
{
    // screen renderer
    this._renderer = new gfm.Renderer("c0");

    this._textureManager = new gfm.TextureManager(4);
    this._textureManager.add("fire2.png", 128, 128);
    this._textureManager.add("gfm.png", 203, 149);
    this._textureManager.add("demojs.png", 320, 200);
    this._textureManager.add("mars.gif", 300, 300);

    this._pattern =  [[1,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,0,0,1,0,1,1],
                      [1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,0,1,0],
                      [1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1],
                      [1,1,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,1,1]];


    this._audioManager = new gfm.AudioManager();
    this._audioManager.addMusic("muzak", "muzak.ogg", "muzak.mp3", 1.0);
    
    // levels
    this.N = 8;
    this._backbuf = new Array(this.N);    
    for (var i = 0; i < this.N; ++i)
        this._backbuf[i] = new gfm.Renderer();

    // flames
    this.F = 57;
    this._flames = new Array(this.N);    
    for (var i = 0; i < this.F; ++i)
    {
        this._flames[i] = new gfm.Flame();    
        for (var k = 0; k < this._flames[i].N; ++k)
        {
            this._flames[i]._x[k] = -1;
            this._flames[i]._y[k] = +2;
        }
        
    }

    // first scene
    this._flame1 = new gfm.Flame(1000, 50, 4.5);
    
    this._width = 0;
    this._height = 0;
    this.resize(wx, wy);   
    
    this._localTime = 0.0;
    this._globalTime = 0.0;
    
    this._firstFrame = true;    
    this._wind = 0;
    this._wind2 = 0;

    this._BPM = 132;
};

gfm.Main.prototype = {
  

	resize : function(wx, wy)
	{
        this._renderer.setSize(wx, wy);  
        this._width = wx;
        this._height = wy;
        this._firstFrame = true;  
        //wx = 512;      
        //wy = 512;
        for (var i = 0; i < this.N; ++i)
        {
            this._backbuf[i].setSize(wx, wy);

            wx = (wx / 2) | 0;
            wy = (wy / 2) | 0;
            if (wx < 1) wx = 1;
            if (wy < 1) wy = 1;
        }
	},
	
	move: function(bar)
	{
        this._wind = (this._wind + (Math.random()-0.5) * 0.1) * 0.9;
        this._wind2 = (this._wind2 + (Math.random()-0.5) * 0.1) * 0.9;

        if (bar >= 16 && bar < 32)
        {
            this._flame1.move(this._wind, this._wind2, 0, Math.sin(Math.PI*2*(bar-16)/16), 0.04);
        }
        else if (bar >= 32 && bar < 48)
        {
            this._flame1.move(this._wind, this._wind2, -(bar-32)/16/4, 0, 0.05);
        }
        else if (bar >= 48 && bar < 64)
        {
            this._flame1.move(this._wind, this._wind2, -0.25, -(bar-48)/16/5, 0.045);
        }
        else if (bar >= 64 && bar < 96)
        {
            var f = Math.cos(Math.PI*(bar-64)/8);
            this._flame1.move(this._wind, this._wind2, -0.25*f, -0.2*f, 0.045);
        }
        else if (bar >= 100 && bar < 164)
        {     
  var index = 0;     
  
            for (var l = 0; l < 4; ++l)
                for (var c = 0; c < 25; ++c)
                {
                    if (this._pattern[l][c])
                    {
                        this._flames[index].move(this._wind, this._wind2, c/20 - 0.6, l/20-0.15, bar >= 132 ? 0.05 : 0.03);                
                        this._flames[index].move(this._wind, this._wind2, c/20 - 0.6, l/20-0.15, bar >= 132 ? 0.05 : 0.03);
                        index++;
                    }
                }
        
        }
	},
    
	loop: function(time, dt)
	{
        var renderer = this._renderer;
            
        var W = renderer._width;
        var H = renderer._height;

        var preload = (!this._textureManager.allLoaded()) || (!this._audioManager.allLoaded());

        if (this._firstFrame)    	
        {
            this._firstFrame = false;
            for (var i = 0; i < this.N; ++i)
            {
                this._backbuf[i].fillColor(0, 0, 0, 1.0);
            }
        }

        if (preload)
        {
            return;
        }

        this._audioManager.nextMusic();    	

    	this._localTime = this._audioManager.currentTime();
		var lt = this._localTime;
        var bar = this._BPM * (lt / 60); 
        var N= this.N;

        this.move(bar);

        if (bar >= 16 && bar < 32)
        {
            var fffff = Math.max(0, (bar-31.5)*2);
            this._backbuf[this.N-1].fillColor(0.0+fffff, 0.1, 0.3);
        }
        else if (bar >= 32 && bar < 48)
        {
            var ffffff = Math.max(0, bar-47);
            this._backbuf[this.N-1].fillColor(0.3+ffffff, 0.1+ffffff, 0);            
        }
        else if (bar >= 64 && bar < 96)
        {
            var fffffff = Math.max(0, bar-95);
            this._backbuf[this.N-1].fillColor(0.0+fffffff, 0.0+fffffff, 0.1+fffffff);            
        }
        else if (bar >= 96 && bar < 100)
        {
            this._backbuf[this.N-1].fillColor(1,1,1);
        }       
        else if (bar >= 100 && bar < 196)
        {
            this._backbuf[this.N-1].fillColor(0.3,0.1,0);
        }
        else
        {
            this._backbuf[this.N-1].fillColor(0.0,0.0,0.1);
        }

        var fireimg = this._textureManager.get(0);

        
        var context = this._backbuf[0]._context;
        context.globalAlpha = 1.0;
        context.globalCompositeOperation = 'source-over';
        
        if (bar >= 0 && bar < 8)
        {
            context.globalAlpha = 0.5;
            context.fillStyle = '#444';
            context.fillRect(0, 0, W, H);
            var gfmlogo = this._textureManager.get(1)._img;
            var marslogo = this._textureManager.get(3)._img;
            
            context.globalAlpha = Math.min(2 - bar / 4);
            context.drawImage(marslogo, W/2-marslogo.width/2, H/2-marslogo.height/2);

            context.shadowColor = "#888";
            context.shadowBlur = 100;
            context.globalAlpha = Math.min(2 - bar / 4);
            context.drawImage(gfmlogo, W/2-gfmlogo.width/2+15, H/2-gfmlogo.height/2+5);

            for (var i = 0; i < 6; ++i)
                for (var j = 0; j < 6; ++j)
            {
                var d = 180 + j * 20;
                var cx = d * Math.cos(bar/2 + i - j/6);
                var cz = d * Math.sin(bar/2 + i - j/6);
                var s = 30/(1+j);
                context.drawImage(marslogo, W/2-s/2+cx, H/2-s/2-cz, s, s);
            }

        }
        else if (bar >= 8 && bar < 16)
        {
            context.globalAlpha = 0.5;
            context.fillStyle = '#444';
            context.fillRect(0, 0, W, H);
            var demojslogo = this._textureManager.get(2)._img;
            context.shadowColor = "#888";
            context.shadowBlur = 100;
            context.globalAlpha = Math.min(2.0 - (bar-8)/4, 1.0);
            var f = Math.min(1, 0.8+0.2*(bar-4)/4);
            context.drawImage(demojslogo, W/2-demojslogo.width*f/2, H/2-demojslogo.height*f/2, demojslogo.width*f, demojslogo.height*f);
        }
        else if (bar >= 16 && bar < 32)
        {
            context.globalAlpha = 0.5;
            context.globalCompositeOperation = 'lighter';     
            this._flame1.draw(context, this._backbuf[0]._width, this._backbuf[0]._height, fireimg, 300);
            
        }
        else if (bar >= 32 && bar < 48)
        {           
            context.globalCompositeOperation = 'lighter';     
            var limit = (bar >= 40) ? 300 + (700 * (bar-40)/8) | 0 : 300;
            this._flame1.draw(context, this._backbuf[0]._width, this._backbuf[0]._height, fireimg, limit);            
        }
        else if (bar >= 48 && bar < 64)
        {
            context.globalCompositeOperation = 'lighter';
            this._flame1.drawSym(context, this._backbuf[0]._width, this._backbuf[0]._height, fireimg, 1000, bar >= 56 ? (2 + bar - 56) | 0 : 2);
        }
        else if (bar >= 64 && bar < 96)
        {
            context.globalCompositeOperation = 'lighter';
            this._flame1.drawSym(context, this._backbuf[0]._width, this._backbuf[0]._height, fireimg, 1000, bar >= 56 ? (2 + bar - 56) | 0 : 2, (bar - 64)*(bar - 64)/32);
        }
        else if (bar >= 100 && bar < 164)
        {
            context.globalCompositeOperation = 'lighter';
            context.globalAlpha = 1.0;
            var sizeF = 0.5;
            if (bar >= 116){sizeF += 0.25;}
            if (bar >= 148){sizeF += 0.25;}
            for (var i = 0; i < this.F; ++i)
            {
               var smax = (this._flames[i].N * 0.5 + (bar - 100) / 64) | 0;
               this._flames[i].draw(context, this._backbuf[0]._width, this._backbuf[0]._height, fireimg, smax, sizeF);
            }
        }
        else if (bar >= 164 && bar < 168)
        {
            context.globalAlpha = 0.5;
            context.fillStyle = '#444';
            context.fillRect(0, 0, W, H);
            var marslogo = this._textureManager.get(3)._img;
            
            context.globalAlpha = Math.min(2 - bar / 4);
            context.drawImage(marslogo, W/2-marslogo.width/2, H/2-marslogo.height/2);

            context.shadowColor = "#888";
            context.shadowBlur = 100;
            context.globalAlpha = 1.0;
            
            for (var i = 0; i < 6; ++i)
                for (var j = 0; j < 6; ++j)
            {
                var d = 180 + j * 20;
                var cx = d * Math.cos(bar/2 + i - j/6);
                var cz = d * Math.sin(bar/2 + i - j/6);
                var s = 30/(1+j);
                context.drawImage(marslogo, W/2-s/2+cx, H/2-s/2-cz, s, s);
            }

        }
        
        context.globalAlpha = 1.0;
        context.globalCompositeOperation = 'source-over';
        context.shadowColor = "black";
        context.shadowBlur = 0;     
		
		for (var i = 0; i < N-1; ++i)
        {
            this._backbuf[i + 1]._context.globalAlpha = 0.8;
            if (bar >= 64 && bar < 96)
            {
                this._backbuf[i + 1]._context.globalAlpha = 0.9;
            }
            if (bar >= 100 && bar < 164)
            {
                this._backbuf[i + 1]._context.globalAlpha = 0.8 + 0.05 * (bar - 100) / 64;
            }
            this._backbuf[i + 1].draw(this._backbuf[i], 0, 0);
        }

        for (var i = N - 2; i >= 0; --i)
        {
            this._backbuf[i]._context.globalAlpha = 0.8;
            var offsetY = 10;
            this._backbuf[i].draw(this._backbuf[i+1], 0, 0);
        }

        context.globalCompositeOperation = 'source-over';
       
        this._renderer.blit(this._backbuf[0]);

    }
};
