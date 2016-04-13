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
	content = document.getElementById('content');
	headerpage = document.getElementById("headerpage");
	btn = document.getElementById('back');
	btn.style.display = "none";
	headerpage.innerHTML = "Locations in your surrounding area";
	
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
				content.innerHTML += "<a href=\"#\"" + " class=\"locationLinks\"" + " data-locationId=\"" + venues[i].id + "\"" + ">" + venues[i].name + "</a><hr />";
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

var getPhotos = function(e) {
	var venueId = this.getAttribute("data-locationId");
	var venueName = this.text;
	
//	view.innerHTML = venueId;
	var endpoint = 'venues/' + venueId + '/photos?';
	
	var apiUrl = config.API_URL + endpoint + 'client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=' + config.REQUEST_DATE;
	
	view = document.getElementById('view');
	//view.innerHTML = apiUrl;
	
	content.style.display = "none";
	view.style.display = "block";
	btn.style.display = "block";
	btn.addEventListener("click", goBack, false);
	headerpage.innerHTML = "Photos for " + venueName;
	
	var request = new XMLHttpRequest();
	request.open("GET", apiUrl, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var data = JSON.parse(request.responseText);
			var photos = data["response"]["photos"]["items"];
			view.innerHTML = "";
			
			for (var i = 0; i < photos.length; i++) {
				view.innerHTML += "Photo " + [i+1] + ": <a href=\"#\"" + " class=\"photoLinks\"" + " data-photoId=\"" + photos[i].id + "\"" + ">" + photos[i].suffix + "</a><hr />";
				//+ photos[i].prefix + photos[i].width + "x" + photos[i].height + photos[i].suffix + "\"/>"
			}
			if (data["response"]["photos"]["count"] == 0) {
				view.innerHTML = "<p>No pictures for this venue</p>";
			}
			
			pid = document.getElementsByClassName("photoLinks");
			for (var i = 0; i < pid.length; i++) {
				pid[i].addEventListener('click', getPhotoDetails, false);
			}
		}
	}
	request.send(null);
	view.innerHTML = "requesting...";

	e.preventDefault();
}

var getPhotoDetails = function(e) {
	var photoId = this.getAttribute("data-photoId");
	
	details = document.getElementById("details");
	
	var API_URL = "https://foursquare.com/oauth2/authenticate?";
	var access_token = "3Q5YGOR21YY13L03LJZLA0BQUUDHFFESVBNTUGQMEHJSAIDR";
	var endpoint = 'photos/' + photoId + '?';
	
	var apiUrl = config.API_URL + endpoint + 'oauth_token=' + access_token + '&client_id=' + config.CLIENT_ID + '&v=' + config.REQUEST_DATE;
	
	content.style.display = "none";
	view.style.display = "none";
	details.style.display = "block";
	btn.style.display = "block";
	btn.addEventListener("click", goBack, false);
	
	var request = new XMLHttpRequest();
	request.open("GET", apiUrl, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var data = JSON.parse(request.responseText);
			var photodetails = data["response"]["photo"];
			var photoName = photodetails["venue"]["name"];
			headerpage.innerHTML = "Details for " + photoName;
			var imgEl = "<img id=\"photo\" class=\"img-responsive\" alt=\"Image by " + photodetails["user"]["firstName"] + " " + photodetails["user"]["lastName"] + "\" src=\"" + photodetails["prefix"] + photodetails["width"] + "x" + photodetails["height"] + photodetails["suffix"] + "\" />";
			photoImg = document.getElementById("photo");
			var address = photodetails["venue"]["location"]["address"];
			var crossStreet = photodetails["venue"]["location"]["crossStreet"];
			var postalCode = photodetails["venue"]["location"]["postalCode"];
			var city = photodetails["venue"]["location"]["city"];
			var country = photodetails["venue"]["location"]["country"];
			var whereStart = "<p><strong>Address</strong>: ";
			var whereEnd = "</p>";
			var category = photodetails["venue"]["categories"]["name"];
			var categoryStart = "<p><strong>Category</strong>: ";
			var categoryEnd = "</p>";
			if (address == undefined) {
				address = "";
				whereStart += address;
			}
			else {
				whereStart += address + ", ";
			}
			if (crossStreet == undefined) {
				crossStreet = "";
				whereStart += crossStreet;
			}
			else {
				whereStart += crossStreet + ", ";
			}
			if (postalCode == undefined) {
				postalCode = "";
				whereStart += postalCode;
			}
			else {
				whereStart += postalCode + ", ";
			}
			if (city == undefined) {
				city = "";
				whereStart += city;
			}
			else {
				whereStart += city + ", ";
			}
			if (country == undefined) {
				country = "";
				whereStart += country;
			}
			else {
				whereStart += country + ", ";
			}
			if (category == undefined) {
				category = "";
				categoryStart = "";
			}
			else {
				categoryStart += category;
			}
			categoryText = categoryStart + categoryEnd;
			where = whereStart + whereEnd;
			
			details.innerHTML = "";
			details.innerHTML = imgEl + where + categoryText;
		}
	}
	request.send(null);
	details.innerHTML = "requesting...";
	
	e.preventDefault();
}

function goBack() {
	location.reload();
}
