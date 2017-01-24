var twitchClientId = "109i96vw9aymsu4bmi4thoj4o7y23aa";
var twitchStreamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

var getAllChannels = function(){
  var req = new XMLHttpRequest();

  // Get live streams (broadcasts) from a comma separated list of channels (twitchStreamers). Offline channels will be stored in an array.
  var url = "https://api.twitch.tv/kraken/streams?channel=" + twitchStreamers;
  req.open("GET", url, true);
  req.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
  req.setRequestHeader("Client-ID", twitchClientId);

  req.addEventListener("load", function(response) {
    if(req.status >= 200 && req.status < 400) { // Success
      response = JSON.parse(req.responseText);

      var offlineChannels = [];

      twitchStreamers.forEach(function(stream, index) {
        if(response.streams[index] === undefined) {
          offlineChannels.push(stream);
        } else {
          // Display online channels along with information about the live streams.
          var channels = document.getElementById("channels");
          var div = document.createElement("div");
          div.className = "channel row clearfix online-color";
          var p1 = document.createElement("p");
          var p2 = document.createElement("p");
          var p3 = document.createElement("p");
          p1.className = "col-md-4";
          p2.className = "col-md-4";
          p3.className = "col-md-4";
          p1.innerHTML = "<img src=" + response.streams[index].channel.logo + ">";
          p2.innerHTML = "<a href=" + response.streams[index].channel.url + ">" + response.streams[index].channel.display_name + "</a> ";
          p3.innerHTML = "Streaming Now: <br>" + response.streams[index].channel.status;
          channels.appendChild(div);
          div.appendChild(p1);
          div.appendChild(p2);
          div.appendChild(p3);
        }
      });
      getOfflineChannels(offlineChannels);

    } else { // Error
      console.log("Oh no! An error occurred!");
    }
  });
  req.send();
};
getAllChannels();


var getOfflineChannels = function(offlineChannels){

  // Get offline channel information by looping over the offlineChannels array.
  offlineChannels.forEach(function(channel) {
    var req = new XMLHttpRequest();
    var url = "https://api.twitch.tv/kraken/channels/" + channel;
    req.open("GET", url, true);
    req.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
    req.setRequestHeader("Client-ID", twitchClientId);

    req.addEventListener("load", function(response) {
      if(req.status >= 200 && req.status < 400) {
        response = JSON.parse(req.responseText);
        // Display offline channels
        var channels = document.getElementById("channels");
        var div = document.createElement("div");
        div.className = "channel row clearfix offline-color";
        var p1 = document.createElement("p");
        var p2 = document.createElement("p");
        var p3 = document.createElement("p");
        p1.className = "col-md-4";
        p2.className = "col-md-4";
        p3.className = "col-md-4";
        p1.innerHTML = "<img src=" + response.logo + ">";
        p2.innerHTML = "<a href=" + response.url + ">" + response.display_name + "</a>";
        p3.innerHTML = "Offline";
        channels.appendChild(div);
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);

      // If a channel in the offlineChannels array returns a status code greater than or equal to 400, we know an error has occurred and the information for that channel was not returned. The following text will be displayed.
      } else if(req.status >= 400) {
        var channels = document.getElementById("channels");
        var div = document.createElement("div");
        div.className = "channel row clearfix";
        var p = document.createElement("p");
        p.className = "col-md-12";
        p.innerHTML = channel + " - This channel could not be found.";
        channels.appendChild(div);
        div.appendChild(p);
      } else {
        console.log("Oh no! An error occurred!");
      }
    });
    req.send();
  });
};
