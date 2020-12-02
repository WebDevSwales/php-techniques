//key information for/from api requests
var lat;
var lng;
var countryCode;
var countryName;
var town;
var localData;
var weatherData;
var countryData;
var wikiData;

var mapSelection = "outdoors";


//setting up map. this includes bounds and center. center will be used to focus on countries when selected and to show users location initially
var map = L.map('map',{
    center: [57,-1],
    zoom: 4,
    minZoom: 3,
    maxZoom: 6,
    maxBounds: [
        //south west 
        [180,-180],
        //north east
        [-180,180]
    ]}); 

    var geoJson;


//setting up map. currently using neighboorhod from thunderforest.
var Thunderforest = L.tileLayer(`https://tile.thunderforest.com/${mapSelection}/{z}/{x}/{y}.png?apikey=8c17817d10c0456c853764480540314f`, {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', //attribution required
	maxZoom: 22
}).addTo(map);


// this function goes to the countryCode api at geonames.org. It returns the country code and country name from lattitude and longitude from the click.
// this funtion also revels the overlay and displays the country name and lat/lng of click for user.
// funtions retrieving information for other overlay panes will be put in external scripts for tidiness and readability.
map.on('click', debounce(function(e){
    console.log(e);
    var coord = e.latlng;
    lat = coord.lat;
    lng = coord.lng;
    map.setView([lat,lng],5)
    console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
    basicCountryData();  
    
          
},250));
        
        





function basicCountryData(){
    $.ajax({
        url:"libs/php/getCountryCode.php",
        type: "POST",
        dataType: 'json',
        data:{
            lat: `${lat}`,
            lng: `${lng}`
        },

        success: function(result){
            console.log(result);
            //storing data into variables for use by other apis
            
            countryName= result['data']['countryName'];
            countryCode= result['data']['countryCode'];

            if(result['data']['countryName'] == "South Korea"){
                countryName = "republic of korea"
            }

            if(result['data']['countryName'] == "North Korea"){
                countryName = "korea";
            }

            console.log("%cbasicCountryData() ", "color: red");
            console.log(countryName, countryCode)
            //revealing modal overlay
            $('.overlay').removeClass("hidden");
            if(countryName != undefined){
                getCountryInfo();
                getwikiData();
                getweatherInfo();
                
            }
            $('.info').addClass("hidden");
            $('#country').removeClass("hidden");

            //if we done get a country returned we can prompt people to try again. 
            //mostly its because I sometimes click on sea and think the code is broken. 
            //code have saved myself 30 or so minutes if I had caught this early on.
            if(countryName == undefined){
                $('#info').html(
                    `<p>I think you might have clicked a sea or an ocean. try again, but on land this time</p>`
               ) 
            }
            
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    })
}

function getwikiData(){
    $.ajax({
        url:"libs/php/getwikidata.php",
        type: "POST",
        dataType: 'json',
        data:{
            lat: `${lat}`,
            lng: `${lng}`
        },

        success: function(result){
            console.log("%cwikiData()", "color:red")
            wikiData = result;
            //storing data into variables for use by other apis
            //revealing modal overlay
            
            
            wikiDataRefresh();
            //if we done get a country returned we can prompt people to try again. 
            //mostly its because I sometimes click on sea and think the code is broken. 
            //code have saved myself 30 or so minutes if I had caught this early on.
                        
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    
})}


//debounce function because it was calling 2/3 times a click
function debounce(func, wait, immediate) {
    var timeout;
  
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };

$('.bubble').on("click",(event) => {
    mapSelection = event.currentTarget.id;
    console.log(mapSelection);

    map.removeLayer(Thunderforest);
    Thunderforest = L.tileLayer(`https://tile.thunderforest.com/${mapSelection}/{z}/{x}/{y}.png?apikey=8c17817d10c0456c853764480540314f`, {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', //attribution required
	maxZoom: 22
    }).addTo(map);
})





   


