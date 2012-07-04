var gfm = gfm || {};

gfm.TextureManager = function(n)
{
    this._textures = new Array(n);
    this._count = 0;
};

gfm.TextureManager.prototype = {

    add: function(path, w, h)
    {
        this._textures[this._count] = new gfm.Texture(path, w, h);
        this._count++;
    },
    
    get: function(i)
    {
        return this._textures[i];
    },
    
    count: function()
    {
        return this._count;
    },
    
    loadedCount: function()
    {
        var res = 0;
        var textures = this._textures;
        var count = this._count;
        for (var i = 0; i < count; ++i)
        {
            var tex = textures[i];
            if (tex.isLoaded()) 
            {
            	res++;
			}
        }
        return res;
    },
    
    allLoaded: function()
    {
        return this.loadedCount() === this.count();
    },
    
    progression: function()
    {
        return this.loadedCount() / this.count();
    }
};
