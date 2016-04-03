window.onload = function() {
	// Get client id and secret and other necessary urls.
	var client_id = '0R1X4PD1OAA55OIV0HEX0YZZZZO3SMWBY1VXZFTNQFUPBKRG';
	var client_secret = 'W2EKI2P5O3DU22KYR31NDAULZUOMJLELHK0DZRMSFUDUTU1B';

	var request_date = new Date().toISOString().slice(0,10).replace(/-/g, "");		// returns current date in format YYYYMMDD

	var base_url = 'https://api.foursquare.com/v2/';
	var endpoint = 'venues/4efd99619a520dfd642c41fd/photos?';
	
	var auth = "&client_id=" +  client_id + "&client_secret=" + client_secret + "&v=" + request_date;
	var url = base_url + endpoint + auth;
	
	var results = document.getElementById("view");
	
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var data = JSON.parse(request.responseText);
			var photos = data["response"]["photos"]["items"];
			results.innerHTML = "";
			
			for (var i = 0; i < photos.length; i++) {
				results.innerHTML += "<a href=\"" + photos[i].prefix + photos[i].width + "x" + photos[i].height + photos[i].suffix + "\"/>" + photos[i].suffix + "</a><hr />";
			}
		}
	}
	request.send(null);
	results.innerHTML = "requesting...";
}
