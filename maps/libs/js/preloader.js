var userLat;
var userLng;

if ("geolocation" in navigator){ //check geolocation available 
	//try to get user current location using getCurrentPosition() method
	navigator.geolocation.getCurrentPosition(function(position){ 
            console.log("Found your location \nLat : "+position.coords.latitude+" \nLang :"+ position.coords.longitude);
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
		});
}else{
	console.log("Browser doesn't support geolocation!");
}

function displayLat()
{
    if(userLat == undefined){
        setTimeout(() => {
            console.log("still finding")
            displayLat()
        }, 100);

    } else{
        console.log("found")
        $('#main').html(
    
            `<h1> your lat = ${userLat} </h1><br>
            <h1> you lng = ${userLng}
            `)
            $('#loader').remove();
    $('#background').remove();
    $('#splash').remove();

    displayMap();
    }
}

displayLat();




    


