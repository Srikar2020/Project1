var searches = [];
var userFormEl = document.querySelector("#search-form");
var nameInputEl = document.querySelector("#search");
var apartmentsEl = document.querySelector("#apartments-container");
var cityHolderEl = document.querySelector("#city-holder");
var loadingEl;
var spinnerEl;
var headerEl;
var cardHolderEl;

var loadCities = function (){
    searches = localStorage.getItem("searches");
    if(searches === null){
        searches = [];
        return;
    } 
    searches = searches.split(",");
    for(var i = 0; i < searches.length; i ++){
        addCity(searches[i]);
    }
};

var saveCities = function(city) {
    searches.push(city);
    localStorage.setItem("searches", searches);
}

var resetCityHandler = function(event) {
    var cityName = event.target.innerHTML;
    
    getApartments(cityName);
}

var addCity = function(city) {
    var cityEl = document.createElement("button");
    cityEl.textContent = city;
    cityEl.type = "button";
    cityEl.classList = "btn btn-light border p-3 m-0";

    cityHolderEl.addEventListener("click", resetCityHandler);
    cityHolderEl.appendChild(cityEl);
};

var getApartments = function(city) {
    addLoading();
    
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
}

var addLoading = function(){
    if(headerEl){
        apartmentsEl.removeChild(headerEl);
        apartmentsEl.removeChild(cardHolderEl);
    }
    apartmentsEl.classList = "col-12 col-md-8 col";

    loadingEl = document.createElement("h2");
    loadingEl.textContent = "Loading...";
    loadingEl.classList = "loadtext py-3";

    spinnerEl = document.createElement("div");
    spinnerEl.classList = "spinner";

    apartmentsEl.appendChild(loadingEl);
    apartmentsEl.appendChild(spinnerEl);
}

var displayApartments = function(data) {

    apartmentsEl.removeChild(spinnerEl);
    apartmentsEl.removeChild(loadingEl);
    apartmentsEl.textContent = "";
    apartmentsEl.classList = "d-flex flex-column border p-2 col-12 col-md-8";

    headerEl = document.createElement("h3");
    headerEl.textContent = "Apartments:";

    cardHolderEl = document.createElement("div");
    cardHolderEl.classList = "col justify-content-around";

    for(var i = 0; i < 5; i ++){
        var cardEl = document.createElement("div");
        cardEl.classList = "card text-center p-2 mx-3";
        cardEl.setAttribute("id", "apartment-" + i);

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

    setTimeout(function(){getStore(data[0].address.lat,data[0].address.lon,0);}, (0));
    setTimeout(function(){getStore(data[1].address.lat,data[1].address.lon,1);}, (2500));
    setTimeout(function(){getStore(data[2].address.lat,data[2].address.lon,2);}, (5000));
    setTimeout(function(){getStore(data[3].address.lat,data[3].address.lon,3);}, (7500));
    setTimeout(function(){getStore(data[4].address.lat,data[4].address.lon,4);}, (10000));
}

var getStore = function(lat, lon, i) {
    var apiURL = "https://trueway-places.p.rapidapi.com/FindPlacesNearby?type=grocery_store&radius=9999&language=en&location=" + lat + "%252C" + lon;
    fetch(apiURL, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "trueway-places.p.rapidapi.com",
		"x-rapidapi-key": "b85567ce04msh32da023304a149dp1f9df4jsna52f743735c5"
	}
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayStore(data, i);
                console.log(data);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    }).catch(function(error){
        alert("Unable to connect to Trueway Places API");
    });
}

var displayStore = function(data, i) {
    console.log("#apartment-" + i);
    var cardEl = document.querySelector("#apartment-" + i);
    console.log(cardEl);

    var storenameEl = document.createElement("p");
    storenameEl.classList = "card-text";
    storenameEl.textContent = "Nearest grocery store: " + data.results[0].name;

    var storeaddressEl = document.createElement("p");
    storeaddressEl.classList = "card-text";
    storeaddressEl.textContent = "Store Address: " + data.results[0].address;

    var storedistanceEl = document.createElement("p");
    storedistanceEl.classList = "card-text";
    var dist = (parseInt(data.results[0].distance)/1609).toFixed(3);
    storedistanceEl.textContent = "Store Distance: " + dist + " miles";

    cardEl.appendChild(storenameEl);
    cardEl.appendChild(storeaddressEl);
    cardEl.appendChild(storedistanceEl);
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = nameInputEl.value.trim();

    if (city) {
        saveCities(city);
        addCity(city);
        getApartments(city);
        nameInputEl.value = "";
    }
    else{
        alert("Please enter a Bay Area City");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

loadCities();