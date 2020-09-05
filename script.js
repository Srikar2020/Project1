var userFormEl = document.querySelector("#search-form");
var nameInputEl = document.querySelector("#search");
var apartmentsEl = document.querySelector("#apartments-container");

var test = function() { 
    /*
    var apiURL = "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=San%20Francisco&state_code=CA&limit=200&offset=0";
    fetch(apiURL, {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "realtor.p.rapidapi.com",
		    "x-rapidapi-key": "b85567ce04msh32da023304a149dp1f9df4jsna52f743735c5"
	    }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Unable to connect to OpenWeatherMap");
    })
    */
    
    /*
   fetch("https://trueway-places.p.rapidapi.com/FindPlacesNearby?type=cafe&radius=1500&language=en&location=37.294270%252C-122.039210", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "trueway-places.p.rapidapi.com",
		"x-rapidapi-key": "b85567ce04msh32da023304a149dp1f9df4jsna52f743735c5"
	}
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Unable to connect to OpenWeatherMap");
    });
    */
}

var getApartments = function(city) {
    
    var apiURL = "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=" + city + "&state_code=CA&limit=200&offset=0";
    fetch(apiURL, {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "realtor.p.rapidapi.com",
		    "x-rapidapi-key": "b85567ce04msh32da023304a149dp1f9df4jsna52f743735c5"
	    }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayApartments(data.properties);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Unable to connect to Realtor API");
    })
    
    console.log(city);
}

var displayApartments = function(data) {
    apartmentsEl.textContent = "";
    apartmentsEl.classList = "d-flex flex-column border p-2";

    var headerEl = document.createElement("h3");
    headerEl.textContent = "Apartments:";

    var cardHolderEl = document.createElement("div");
    cardHolderEl.classList = "col justify-content-around";

    for(var i = 0; i < 5; i ++){
        var cardEl = document.createElement("div");
        cardEl.classList = "card text-center p-2 mx-3";

        var addressEl = document.createElement("h5");
        addressEl.classList = "card-title";
        addressEl.textContent = data[i].address.line + " " +data[i].address.city+" CA, " + data[i].address.postal_code;

        var imageEl = document.createElement("img");
        imageEl.classList = "card-img";
        imageEl.src = data[i].photos[1].href;
        imageEl.alt = "Apartment Photo";

        var bedbathEl = document.createElement("p");
        bedbathEl.classList = "card-text";
        bedbathEl.textContent = data[i].community.beds_min + "-" + data[i].community.beds_max + " bed(s) " + data[i].community.baths_min + "-" + data[i].community.baths_max + " bath(s)";

        var priceEl = document.createElement("p");
        priceEl.classList = "card-text";
        priceEl.textContent = "Price Range: $" + data[i].community.price_min + "-$" + data[i].community.price_max;

        var contactEl = document.createElement("p");
        contactEl.classList = "card-text";
        contactEl.textContent = "Call: " + data[i].community.contact_number;

        cardEl.appendChild(addressEl);
        cardEl.appendChild(imageEl);
        cardEl.appendChild(bedbathEl);
        cardEl.appendChild(priceEl);
        cardEl.appendChild(contactEl);

        cardHolderEl.appendChild(cardEl);
    }

    apartmentsEl.appendChild(headerEl);
    apartmentsEl.appendChild(cardHolderEl);
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = nameInputEl.value.trim();

    if (city) {
        getApartments(city);
        nameInputEl.value = "";
    }
    else{
        alert("Please enter a Bay Area City");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

test();