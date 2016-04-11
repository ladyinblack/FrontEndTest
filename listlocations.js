// Create a Foursquare developer account
// https://developer.foursquare.com/
var config = {
	CLIENT_ID: '0R1X4PD1OAA55OIV0HEX0YZZZZO3SMWBY1VXZFTNQFUPBKRG',
	CLIENT_SECRET: 'W2EKI2P5O3DU22KYR31NDAULZUOMJLELHK0DZRMSFUDUTU1B',
	REQUEST_DATE: new Date().toISOString().slice(0,10).replace(/-/g, ""), 	// returns current date in format YYYYMMDD
	API_URL: 'https://api.foursquare.com/v2/'
}

// HTML5 Geolocation
navigator.geolocation.getCurrentPosition(function (data) {
	var content = document.getElementById('content');
	var lat = data['coords']['latitude'];
	var lng = data['coords']['longitude'];
	
	// https://developer.foursquare.com/start/search/
	var endpoint = 'venues/search';
	var apiUrl = config.API_URL + endpoint + '?client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=' + config.REQUEST_DATE + '&ll=' + lat + ',' + lng;
	
	// Make an AJAX request to Foursquare
	var request = new XMLHttpRequest();
	request.open("GET", apiUrl, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			var venues = data["response"]["venues"];
			
			content.innerHTML = "";
			for (var i = 0; i < venues.length; i++) {
				content.innerHTML += "<a href=\"#\"" + " id=\"locationLinks\"" + " data-locationId=\"" + venues[i].id + "\"" + ">" + venues[i].name + "</a><hr />";
			}
			vid = document.getElementsByClassName("locationLinks");
			for (var i = 0; i < vid.length; i++) {
				vid[i].addEventListener('click', getPhotos, false);
			}
		}
	}
	request.send(null);
	content.innerHTML = "requesting...";
	//content.innerHTML = "Latitude: " + lat + "<br />Longitude: " + lng;
});

var getPhotos = function (e) {
	var venueId = this.getAttribute("data-locationId");
//	view.innerHTML = venueId;
	var endpoint = 'venues/' + venueId + '/photos?';
	var apiUrl = config.API_URL + endpoint + 'client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=' + config.REQUEST_DATE;
	
	var view = document.getElementById('view');
	
	var request = new XMLHttpRequest();
	request.open("GET", apiUrl, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var data = JSON.parse(request.responseText);
			var photos = data["response"]["photos"]["items"];
			view.innerHTML = "";
			
			for (var i = 0; i < photos.length; i++) {
				view.innerHTML += "<a href=\"" + photos[i].prefix + photos[i].width + "x" + photos[i].height + photos[i].suffix + "\"/>" + photos[i].suffix + "</a><hr />";
			}
		}
	}
	request.send(null);
	view.innerHTML = "requesting...";
	
	e.preventDefault();
}
