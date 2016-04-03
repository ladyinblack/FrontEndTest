window.onload = function() {
	var map = document.getElementById('content');
	
	/* HTML5 Geolocation */
	navigator.geolocation.getCurrentPosition(function (data) {
		var lat = data['coords']['latitude'];
		var lng = data['coords']['longitude'];
		
		/* Create a Foursquare developer account */
		/* https://developer.foursquare.com/ */
		var CLIENT_ID = '0R1X4PD1OAA55OIV0HEX0YZZZZO3SMWBY1VXZFTNQFUPBKRG';
		var CLIENT_SECRET = 'W2EKI2P5O3DU22KYR31NDAULZUOMJLELHK0DZRMSFUDUTU1B';
		var REQUEST_DATE = new Date().toISOString().slice(0,10).replace(/-/g, "");		// returns current date in format YYYYMMDD
		var API_URL = 'https://api.foursquare.com/v2/venues/search';
		
		/* https://developer.foursquare.com/start/search/ */
		var API_ENDPOINT = API_URL + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=' + REQUEST_DATE + '&ll=' + lat + ',' + lng;
		
		// Make an AJAX request to Foursquare 
		// to load markers data.
		var request = new XMLHttpRequest();
		request.open("GET", API_ENDPOINT, true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				data = JSON.parse(request.responseText);
				venues = data["response"]["venues"];
				map.innerHTML = "";
				
				// Transform each venue result into a marker on the map.
				for (var i = 0; i < venues.length; i++) {
					map.innerHTML += "<a href=\"view/" + venues[i].id + "\">" + venues[i].name + "</a><hr />";
				}
			}
		}
		request.send(null);
		map.innerHTML = "requesting...";
	});
	
}
