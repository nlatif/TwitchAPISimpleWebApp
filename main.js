/*jslint sloppy:true, browser:true, devel:true, white:true, vars:true, eqeq:true, nomen:true, unparam:true */
/** Please note - Twitch API login authentication not implemented, 
* No Javascript framework used as implementation was requested in Vanilla Javascript.
* Retrieved Images NoImage from - https://www.google.com/search?q=noimage+png&espv=2&biw=1440&bih=708&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiU1ZPutKrOAhVY2mMKHVsKBKIQ_AUIBigB#tbm=isch&q=noimage&imgdii=ASbBglzjMAGtRM%3A%3BASbBglzjMAGtRM%3A%3BPt3RmyJiTzSDEM%3A&imgrc=ASbBglzjMAGtRM%3A
* leftarrow from - https://www.google.com/search?q=left+arrow&espv=2&biw=1440&bih=708&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiRh7fFtarOAhUD-mMKHWIbAUIQ_AUIBigB#imgrc=zhDS9aJIqG4XwM%3A
* rightarrow from - https://www.google.com/search?q=right+arrow&espv=2&biw=1440&bih=708&source=lnms&tbm=isch&sa=X&sqi=2&ved=0ahUKEwjOnrzStarOAhVHKWMKHQ1jD-YQ_AUIBigB#imgrc=Z9LPEu-pJUhjIM%3A
*/

var streamsObj;
var beginCount;
var endCount;

//Client ID for Twitch init
window.CLIENT_ID = '3w0unz6o9h76epnjhaq10hachxtmqbl';
    
$(function() {
  Twitch.init({clientId: CLIENT_ID}, function(error, status) {
    });
});

/**
 * This function search the twitch api "search stream" as mentioned in the instractions and uses JSONP
 */
function search() {
	var queryString = document.getElementById("searchString").value;
	if(queryString === null || queryString === '') {
		alert("Please enter a search string");
	}
	else{
		var url = updateQueryStringParameter('https://api.twitch.tv/kraken/search/streams', 'q', queryString)
			url = updateQueryStringParameter(url,'callback','jsonPParser');

		var script = document.createElement('script');
		script.src = url;

		document.body.appendChild(script);
	}
}

/**
 * This function is the JSONP callback function that is added to the query string.
 *
 * @param - data - the twitch api response.
 */
function jsonPParser(data)
{
	streamsObj = data;
	var streams = streamsObj.streams.length;
  document.getElementById("totalResults").innerHTML = streams-1;
  document.getElementById("streamsDiv").innerHTML = "";
   	
  beginCount = 0;
  endCount = Math.floor(streams/2);
  if(endCount <=4 ){
    endCount = 5;
  }
  displayStream(beginCount,endCount);
}

/**
 * This function renders the search stream response.
 *
 * @param - beginCount - the lower range of streams currently displayed
 * @param - endCount - the higher range of streams currently displayed
 */
function displayStream(beginCount,endCount) {
  document.getElementById("streamsDiv").innerHTML = "";
  for(var i=beginCount; i<endCount; i++){
    var line = document.createElement("div");
    var src = streamsObj.streams[i].channel.logo == null ?  "./images/No_Image.png": streamsObj.streams[i].channel.logo 
    line.innerHTML =  '<div class="streamInfoDiv">'+
      '<div><img class="logoImg" src="'+src+'"></img></div>'+
      '<div class="streamDispName">'+streamsObj.streams[i].channel.display_name+'</div>'+
      '<div class="streamName">'+streamsObj.streams[i].game+'</div>'+
      '<div class="streamDesc">'+streamsObj.streams[i].channel.status+'</div>'+
      '</div>'
    document.getElementById("streamsDiv").appendChild(line);
  }
  var beginC = (beginCount == 0) ? 1 : beginCount
  var endCo = (endCount == streamsObj.streams.length) ? streamsObj.streams.length-1 : endCount;
  document.getElementById("pagesStream").innerHTML = beginC+"-"+endCount;
}

/**
 * This function renders streams on the previous page.
 */
function beforePage() {
  if(beginCount!=0) {
    endCount = beginCount - 1 ;
    beginCount = (beginCount == 0) ? 0 : beginCount-6; 
    if(beginCount < 0) {
      beginCount = 0;
    }
    displayStream(beginCount,endCount)
    document.getElementById("pagesStream").innerHTML = beginCount+1+"-"+endCount;
  }
}

/**
 * This function renders streams on the next page.
 */
function afterPage() {
  if(endCount!=streamsObj.streams.length) {
    beginCount = endCount + 1;
    endCount = (endCount == streamsObj.streams.length) ? streamsObj.streams.length : endCount+5;
    if(endCount > streamsObj.streams.length) {
      endCount = streamsObj.streams.length;
    }
    var enC = endCount-1;
    displayStream(beginCount,endCount)
    document.getElementById("pagesStream").innerHTML = beginCount+"-"+enC;
  }
}

/**
 * This function adds the search input box's input text as the query selector to the twitch api
 *
 * @param - uri, the Twitch API seach uri
 * @param - specialCharacter query
 * @param - Query string
 */
function updateQueryStringParameter(uri, key, value) {
  	var regE = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  	var specChar = uri.indexOf('?') !== -1 ? "&" : "?";
  	if (uri.match(regE)) {
    	return uri.replace(regE, '$1' + key + "=" + value + '$2');
  	}
  	else {
    	return uri + specChar + key + "=" + value;
  	}
}

