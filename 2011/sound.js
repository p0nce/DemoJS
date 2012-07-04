var gfm = gfm || {};

// a Sound contains a music (streamed) or a sample (non streamed)

gfm.Sound = function(title, ssrc, streaming, baseVolume)
{
	this._dom = document.createElement('audio');	
	this._baseVolume = baseVolume;
		
	this._canPlay = false;
	this._canPlayThrough = false;
    this._error = false;
    this._playing = false;
    this._ssrc = ssrc;
    this._streaming = streaming;
   	this._load();
   	this._title = title;
   	this._t = -1337;
   //	this._duration = 0;   	
};

gfm.Sound.prototype = 
{
	play: function(t, volume)
	{
		if (this._error) { return false; }
		if (this.isPlaying()) { return false; }
		this._playing = true; // the mutex of the poor
		var d = this._dom;
	
		d.volume = volume * this._baseVolume;
		//d.currentTime = 0;
		d.play();
		this._t = t;
		
		return true;
	},
	
	forceplay: function(t, volume)
	{
		if (this._error) { return; }
		this._playing = true; // the mutex of the poor
		var d = this._dom;
	
		d.volume = volume * this._baseVolume;
		//d.currentTime = 0;
		this._t = t;
		d.play();	
	},
	
	isLoaded : function()
  	{
	  	if (this._error) 
	  	{
		  	return true;
	  	}
	  	
	  	if (this._streaming)
	  	{
		  	return this._canPlay;
	  	}
	  	else
	  	{
		  	return this._canPlayThrough;
	  	}
  	},
  	
  	isPlaying : function()
  	{
	 	return this._playing;
  	},  	
  	
  	_setCanPlay : function()
    {
	    this._canPlay = true;   
    },
    
    _setCanPlaythrough : function()
    {
	    this._canPlayThrough = true;   
    },
    
    _shitHappens : function()
    {
	    this._playing = false;
	  	this._error = true; 
    },
    
    _goodThingsComeToAnEnd : function()
    {
	    this._playing = false; 
    },
    
    _load : function()
    {
	    this._dom.addEventListener('canplay', this._setCanPlay.bind(this), false);
	  	this._dom.addEventListener('canplaythrough', this._setCanPlaythrough.bind(this), false);
	  	this._dom.addEventListener('error', this._shitHappens.bind(this), false);
	  	this._dom.addEventListener('ended', this._goodThingsComeToAnEnd.bind(this), false);
	  	
	  	
	    this._dom.autobuffer = true;
	    this._dom.preload = 'auto';
	    this._dom.src = this._ssrc;	
	    this._dom.load();	    
    },
    
    checkEnded : function()
    {
	 	if (this._dom.ended)
	 	{
		 	this._playing = false;
	 	}
    },
    
    mute : function()
    {
	    this._dom.volume = 0;
    },
    
    unmute : function() // only for music
    {
	    this._dom.volume = this._baseVolume;
    }

};