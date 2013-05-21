var Playtomic = {};

(function() 
{
	var APIURL,
		PUBLICKEY,
		PRIVATEKEY;
  
	/**
	 * Initializes the API without sending a View.  This is for page-based sites and applications without a single persistant page
	 * @param	publickey	Your game's public key
	 * @param	privatekey	Your game's private key
	 * @param	apiurl		The url to your server, eg https://my-server.herokuapp.com
	 */
	Playtomic.initialize = function(publickey, privatekey, apiurl) {
		
		if(apiurl.lastIndexOf("/") != apiurl.length - 1) {
			apiurl += "/";
		}
		
		APIURL = apiurl + "v1?publickey=" + publickey;
		PRIVATEKEY = privatekey;
		PUBLICKEY = publickey;
	};
	
	// newsletter
	(function() {
	
		var SECTION = "newsletter";
		var SUBSCRIBE = "subscribe";
	
		Playtomic.Newsletter = {
		
			/**
			 * Subscribes a user to your newsletter
			 * @param options	The options:  { email: , fields: { } }
			 * @param callback	Your callback function(response)
			 */
			subscribe: function(options, callback) {
				sendAPIRequest(SECTION, SUBSCRIBE, subscribeComplete, callback, options);
			}
		}
		
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The object returned from the server
		 * @param	response	The response from the server
		 */
		function subscribeComplete(callback, postdata, data, response) {
			if(callback == null)
				return;
		
			callback(response);
		}
	})();
	
	// achievements
	(function() {
	
		var SECTION = "achievements";
		var LIST = "list";
		var STREAM = "stream";
		var SAVE = "save";
		
		Playtomic.Achievements = {
		
			/**
			 * Lists all achievements
			 * @param	options		The list options
			 * @param	callback	Your function to receive the response: function(achievements, response)
			 */
			list: function(options, callback) {
				sendAPIRequest(SECTION, LIST, listComplete, callback, options);
			},

			/**
			 * Shows a chronological stream of achievements 
			 * @param	options		The stream options
			 * @param	callback	Your function to receive the response: function(achievements, response)
			 */ 
			 stream: function(options, callback) {
				 sendAPIRequest(SECTION, STREAM, streamComplete, callback, options);
			},

			/**
			 * Award an achievement to a player
			 * @param	achievement	The achievement
			 * @param	callback	Your function to receive the response: function(response)
			 */
			save: function(achievement, callback) {
				sendAPIRequest(SECTION, SAVE, saveComplete, callback, achievement);
			}
		}
			
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The object returned from the server
		 * @param	response	The response from the server
		 */
		function saveComplete(callback, postdata, data, response) {
			if(callback == null)
				return;
		
			callback(response);
		}

		function listComplete(callback, postdata, data, response) {
			if(callback == null) {
				return;
			}
		
			if(!response.success) {
				callback([], response);
				return;
			}

			callback(data.achievements, response);
		}
	
		function streamComplete(callback, postdata, data, response) {
			if(callback == null)
				return;

			if(!response.success) {
				callback([], response);
				return;
			}

			callback(data.achievements, data.numachievements, response);
		}
	
	}());
				
		
	// level sharing
	(function() {	
		var SECTION = "playerlevels";
		var SAVE = "save";
		var LOAD = "load";
		var RATE = "rate";
		var LIST = "list";
			
		Playtomic.PlayerLevels = {		
			POPULAR: "popular",
			NEWEST: "newest",
	
			/**
			 * Saves a player level
			 * @param	level			The level object to save
			 * @param	callback		Your function to receive the response:  function(level, response)
			 */		
			save: function(level, callback) {		
				sendAPIRequest(SECTION, SAVE, saveLoadComplete, callback, level);
			},				
			
			/**
			 * Loads a player level
			 * @param	levelid			An existing level's levelid 
			 * @param	callback		Your function to receive the response:  function(level, response)
			 */
			load: function(levelid, callback) {	
				sendAPIRequest(SECTION, LOAD, saveLoadComplete, callback, { levelid: levelid });
			},
	
			/**
			 * Lists player levels
			 * @param	options			The list options
			 * @param	callback		Your function to receive the response:  function(levels, numlevels, response)
			 */
			list: function(options, callback) {
				sendAPIRequest(SECTION, LIST, listComplete, callback, options);
			},
			
			/**
			 * Rates a player level
			 * @param	levelid			The levelid
			 * @param	rating			Integer from 1 to 10
			 * @param	callback		Your function to receive the response:  function(response)
			 */
			rate: function(levelid, rating, callback) {
				sendAPIRequest(SECTION, RATE, rateComplete, callback, { levelid: levelid, rating: rating });
			}
		};
		
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The object returned from the server
		 * @param	response	The response from the server
		 */
		function saveLoadComplete(callback, postdata, data, response) {
			if(callback == null)
				return;
			
			callback(data.level, response);
		}

		function listComplete(callback, postdata, data, response) {
			if(callback == null) {
				return;
			}
			
			if(!response.success) {
				callback([], 0, response);
				return;
			}

			callback(data.levels, data.numlevels, response);
		};
		
		function rateComplete(callback, postdata, data, response) {
			if(callback == null)
				return;

			callback(response);
		};
	}());
	
	// leaderboards
	(function() {
		var SECTION = "leaderboards";
		var SAVE = "save";
		var LIST = "list";
		var SAVEANDLIST = "saveandlist";
		
		Playtomic.Leaderboards = {
			
			TODAY: "today",
			LAST7DAYS: "last7days",
			LAST30DAYS: "last30days",
			ALLTIME: "alltime",
			NEWEST: "newest",
	
			/**
			 * Lists scores from a table
			 * @param	options		The leaderboard options
			 * @param	callback	Callback function to receive the data:  function(scores, numscores, response)

			 */		
			list: function(options, callback) {		
				sendAPIRequest(SECTION, LIST, listComplete, callback, options);		
			},
			
			/**
			 * Saves a user's score
			 * @param	score		The player's score
			 * @param	callback	Callback function to receive the data:  function(response)
			 */		
			save: function(score, callback) {
				sendAPIRequest(SECTION, SAVE, saveComplete, callback, score);
			},
			
			/**
			 * Performs a save and a list in a single request that returns the player's score and page of scores it occured on
			 * @param	score		The player's score
			 * @param	callback	Callback function to receive the data:  function(scores, numscores, response)
			 */
			saveAndList: function(score, callback) {
				sendAPIRequest(SECTION, SAVEANDLIST, listComplete, callback, score);
			}
		};	
		
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The XML returned from the server
		 * @param	response	The response from the server
		 */
		function listComplete(callback, postdata, data, response) {
			if(callback == null) {
				return;
			}
			
			if(response.success == false) {
				callback([], 0, response);
				return;
			}

			callback(data.scores, data.numscores, response);
		}	
		
		function saveComplete(callback, postdata, data, response) {
			if(callback == null) {
				return; 
			}

			callback(response);
		}
	}());
	
	// geoip
	(function()
	{
		var SECTION = "geoip";
		var LOOKUP = "lookup";
		
		Playtomic.GeoIP = {
			/**
			 * Performs a country lookup on the player IP address
			 * @param	callback	Your function to receive the data:  callback(data, response);
			 */			
			lookup: function(callback) {		
				sendAPIRequest(SECTION, LOOKUP, lookupComplete, callback, null);
			}
		};
		
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The XML returned from the server
		 * @param	status		The request status returned from the esrver (1 for success)
		 * @param	errorcode	The errorcode returned from the server (0 for none)
		 */	
		function lookupComplete(callback, postdata, data, response)
		{
			if(callback == null) {
				return;
			}
			
			if(response.success == false) {
				callback(null, response);
				return;
			}
				
			callback(data, response);
		}
	}());
	
	// gamevars
	(function() {	
		
		var SECTION = "gamevars";
		var LOAD = "load";
		var LOADSINGLE = "single";
		
		Playtomic.GameVars = {
			/**
			 * Loads your GameVars 
			 * @param	callback	Your function to receive the data:  callback(gamevars, response);
			 */		
			load: function(callback) {		
				sendAPIRequest(SECTION, LOAD, loadComplete, callback);
			},
			
			/**
			 * Loads a single GameVar
			 * @param	name	The GameVar to load
			 * @param callback	Your function receive the data:  callback(gamevars, response);
			 */
			loadSingle: function(name, callback) {
				sendAPIRequest(SECTION, LOADSINGLE, loadComplete, callback, { name: name });
			}
		};
		
		/**
		 * Processes the response received from the server, returns the data and response to the user's callback
		 * @param	callback	The user's callback function
		 * @param	postdata	The data that was posted
		 * @param	data		The XML returned from the server
		 * @param	status		The request status returned from the esrver (1 for success)
		 * @param	errorcode	The errorcode returned from the server (0 for none)
		 */		
		function loadComplete(callback, postdata, data, response) {
			
			if(callback == null) {
				return;
			}
			
			if(response.success == false) {
				callback(null, response);
				return;
			}
				
			callback(data, response);
		}
	}());
	
	function sendAPIRequest(section, action, complete, callback, postdata) {
		
		postdata = postdata || {};
		postdata.section = section;
		postdata.action = action;
		postdata.publickey = PUBLICKEY;
		
		var json = JSON.stringify(postdata);
		var pda = "data=" + Encode.base64(json) + "&hash=" + Encode.md5(json + PRIVATEKEY);
		var request = window.XDomainRequest ? new XDomainRequest() : new XMLHttpRequest(); 
		
		request.onerror = function() {
			complete(callback, postdata, {}, Response(false, 1));
		};

		request.onload = function() {
			var result = JSON.parse(request.responseText);
			complete(callback, postdata, result, Response(result.success, result.errorcode));
		};
		
		if(window.XDomainRequest) {
			request.open("POST", APIURL);
		}
		else {
			request.open("POST", APIURL, true);
		}
		
		request.send(pda);
	}
	
	// Responses
	var ERRORS = {
		// General Errors
		"1": "General error, this typically means the player is unable to connect to the server",
		"2": "Invalid game credentials, make sure you use the rihgt public and private keys",
		"3": "Request timed out",
		"4": "Invalid request",
		
		// GeoIP Errors
		"100": "GeoIP API has been disabled for this game",
		
		// Leaderboard Errors
		"200": "Leaderboard API has been disabled for this game",
		"201": "The player's name wasn't provided",
		"203": "Player is banned from submitting scores in this game",
		"204": "Score was not saved because it was not the player's best.  You can allow players to have	more than one score by specifying allowduplicates=true in your save options",

		// GameVars Errors
		"300": "GameVars API has been disabled for this game",
		
		// LevelSharing Errors
		"400": "Level sharing API has been disabled for this game",
		"401": "Invalid rating value (must be 1 - 10)",
		"402": "Player has already rated that level",
		"403": "Missing level name",
		"404": "Missing level id",
		"405": "Level already exists",
		
		// Achievement errors
		"500": "Achievements API has been disabled for this game",
		"501": "Missing playerid",
		"502": "Missing player name",
		"503": "Missing achievementid",
		"504": "Invalid achievementid or achievement key",
		"505": "Player already had the achievement, you can overwrite old achievements with overwrite=true or save each time the player is awarded with allowduplicates=true",
		"506": "Player already had the achievement and it was overwritten or a duplicate was saved successfully",
		
		// Newsletter errors
		// Newsletter errors
		"600": "Newsletter API has been disabled for this game",
		"601": "MailChimp API key is not configured",
		"602": "The MailChimp API returned an error"		
	};

	function Response(success, errorcode) {
		return {
			success: success, 
			errorcode: errorcode, 
			errormessage: ERRORS[errorcode] 
		};
	}
	
	// encoding is derived from these two sources:
	// Base64 encoding: http://www.webtoolkit.info/javascript-base64.html
	// MD5 enconding: Version 2.2 Copyright (C) Paul Johnston 1999 - 2009 See http://pajhome.org.uk/crypt/md5 for more info.
	var Encode = (new function() {
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var hex_chr = "0123456789abcdef";
		
		return {
			
			base64: function(str) {
			    var output = "";
			    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			    var i = 0;
	
			    str = _utf8_encode(str);
			
			    while (i < str.length) {
			        chr1 = str.charCodeAt(i++);
			        chr2 = str.charCodeAt(i++);
			        chr3 = str.charCodeAt(i++);
			        enc1 = chr1 >> 2;
			        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			        enc4 = chr3 & 63;
			
			        if (isNaN(chr2)) { 
			            enc3 = enc4 = 64;
			        } else if (isNaN(chr3)) {
			            enc4 = 64;
					}
	
			        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			    }
			
			    return output;
			},

			md5: function(str) {
				var x = str2blks_MD5(str);
				var a =  1732584193;
				var b = -271733879;
				var c = -1732584194;
				var d =  271733878;
	
				for(var i=0; i<x.length; i += 16) {
					var olda = a;
					var oldb = b;
					var oldc = c;
					var oldd = d;
		
					a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
					d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
					c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
					b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
					a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
					d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
					c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
					b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
					a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
					d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
					c = ff(c, d, a, b, x[i+10], 17, -42063);
					b = ff(b, c, d, a, x[i+11], 22, -1990404162);
					a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
					d = ff(d, a, b, c, x[i+13], 12, -40341101);
					c = ff(c, d, a, b, x[i+14], 17, -1502002290);
					b = ff(b, c, d, a, x[i+15], 22,  1236535329);    
					a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
					d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
					c = gg(c, d, a, b, x[i+11], 14,  643717713);
					b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
					a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
					d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
					c = gg(c, d, a, b, x[i+15], 14, -660478335);
					b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
					a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
					d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
					c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
					b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
					a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
					d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
					c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
					b = gg(b, c, d, a, x[i+12], 20, -1926607734);
					a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
					d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
					c = hh(c, d, a, b, x[i+11], 16,  1839030562);
					b = hh(b, c, d, a, x[i+14], 23, -35309556);
					a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
					d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
					c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
					b = hh(b, c, d, a, x[i+10], 23, -1094730640);
					a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
					d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
					c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
					b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
					a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
					d = hh(d, a, b, c, x[i+12], 11, -421815835);
					c = hh(c, d, a, b, x[i+15], 16,  530742520);
					b = hh(b, c, d, a, x[i+ 2], 23, -995338651);
					a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
					d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
					c = ii(c, d, a, b, x[i+14], 15, -1416354905);
					b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
					a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
					d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
					c = ii(c, d, a, b, x[i+10], 15, -1051523);
					b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
					a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
					d = ii(d, a, b, c, x[i+15], 10, -30611744);
					c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
					b = ii(b, c, d, a, x[i+13], 21,  1309151649);
					a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
					d = ii(d, a, b, c, x[i+11], 10, -1120210379);
					c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
					b = ii(b, c, d, a, x[i+ 9], 21, -343485551);
		
					a = addme(a, olda);
					b = addme(b, oldb);
					c = addme(c, oldc);
					d = addme(d, oldd);
				}
		
				return rhex(a) + rhex(b) + rhex(c) + rhex(d);
			}
		};
		
		function _utf8_encode(string) {
			
			if(!string) {
				return "";
			}
			
		    string = string.replace(/\r\n/g,"\n");
		    var utftext = "";
		
		    for (var n = 0; n < string.length; n++) {
		        var c = string.charCodeAt(n);
		
		        if (c < 128) {
		            utftext += String.fromCharCode(c);
		        }
		        else if((c > 127) && (c < 2048)) {
		            utftext += String.fromCharCode((c >> 6) | 192);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }
		        else {
		            utftext += String.fromCharCode((c >> 12) | 224);
		            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }
		    }
		
		    return utftext;
		}
				
		function bitOR(a, b) {
			var lsb = (a & 0x1) | (b & 0x1);
			var msb31 = (a >>> 1) | (b >>> 1);

			return (msb31 << 1) | lsb;
		}

		function bitXOR(a, b) {			
			var lsb = (a & 0x1) ^ (b & 0x1);
			var msb31 = (a >>> 1) ^ (b >>> 1);

			return (msb31 << 1) | lsb;
		}
		
		function bitAND(a, b) { 
			var lsb = (a & 0x1) & (b & 0x1);
			var msb31 = (a >>> 1) & (b >>> 1);

			return (msb31 << 1) | lsb;
		}

		function addme(x, y) {
			var lsw = (x & 0xFFFF)+(y & 0xFFFF);
			var msw = (x >> 16)+(y >> 16)+(lsw >> 16);

			return (msw << 16) | (lsw & 0xFFFF);
		}

		function rhex(num) {
			var str = "";
			var j;

			for(j=0; j<=3; j++)
				str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);

			return str;
		}

		function str2blks_MD5(str) {
			var nblk = ((str.length + 8) >> 6) + 1;
			var blks = new Array(nblk * 16);
			var i;

			for(i=0; i<nblk * 16; i++) {
				blks[i] = 0;
			}
																
			for(i=0; i<str.length; i++) {
				blks[i >> 2] |= str.charCodeAt(i) << (((str.length * 8 + i) % 4) * 8);
			}

			blks[i >> 2] |= 0x80 << (((str.length * 8 + i) % 4) * 8);

			var l = str.length * 8;
			blks[nblk * 16 - 2] = (l & 0xFF);
			blks[nblk * 16 - 2] |= ((l >>> 8) & 0xFF) << 8;
			blks[nblk * 16 - 2] |= ((l >>> 16) & 0xFF) << 16;
			blks[nblk * 16 - 2] |= ((l >>> 24) & 0xFF) << 24;

			return blks;
		}
		
		function rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		function cmn(q, a, b, x, s, t) {
			return addme(rol((addme(addme(a, q), addme(x, t))), s), b);
		}

		function ff(a, b, c, d, x, s, t) {
			return cmn(bitOR(bitAND(b, c), bitAND((~b), d)), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
			return cmn(bitOR(bitAND(b, d), bitAND(c, (~d))), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
			return cmn(bitXOR(bitXOR(b, c), d), a, b, x, s, t);
		}

		function ii(a, b, c, d, x, s, t) {
			return cmn(bitXOR(c, bitOR(b, (~d))), a, b, x, s, t);
		}
		
	}());

}());

// JSON via json.org
if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i, 
            k,  
            v,    
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }


            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }


            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }



    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {


            var j;

            function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }


            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());