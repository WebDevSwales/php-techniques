//key information for api requests
var lat;
var lng;
var countryCode;
var countryName;
var town;

//store arrays from api calls for easy access later if needed.




//setting up map. this includes bounds and center. center will be used to focus on countries when selected and to show users location initially
var map = L.map('map',{
    center: [57,-1],
    zoom: 4,
    minZoom: 3,
    maxZoom: 10,
    maxBounds: [
        //south west 
        [180,-180],
        //north east
        [-180,180]
    ]}); 


//setting up map. currently using neighboorhod from thunderforest.
var Thunderforest_Neighbourhood = L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=8c17817d10c0456c853764480540314f', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', //attribution required
	maxZoom: 22
}).addTo(map);


// this function goes to the countryCode api at geonames.org. It returns the country code and country name from lattitude and longitude from the click.
// this funtion also revels the overlay and displays the country name and lat/lng of click for user.
// funtions retrieving information for other overlay panes will be put in external scripts for tidiness and readability.
map.on('click', debounce(function(e){
    var coord = e.latlng;
    lat = coord.lat;
    lng = coord.lng;
    console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
            
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
                    console.log(countryName);
                    //revealing modal overlay
                    $('.overlay').removeClass("hidden");
                    if(countryName != undefined){
                        $('#info').html(`
                            <p> you clicked: <br>
                            lattitude: ${lat.toFixed(5)}<br>
                            longitude:${lng.toFixed(5)}</p>
                            <p> You have selected: ${countryName} </p>
                        `)
                    }
                    $('.info').addClass("hidden");
                    $('#info').removeClass("hidden");

                    //if we done get a country returned we can prompt people to try again. 
                    //mostly its because I sometimes click on sea and think the code is broken. 
                    //code have saved myself 30 or so minutes if I had caught this early on.
                    if(countryName == undefined){
                        $('#info').html(
                            `<p>I think you might have clicked a sea or an ocean. try again, but on land this time</p>`
                       ) 
                    }
                    update();
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
        
            })

            
        
},250));
        
        








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







   


