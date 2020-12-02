

//function is called update local as the local info must be updated before other apis
//this function is called when the map is clicked on. this happens at map.js in the map
// .on("click.... function
function getCountryInfo(){
    $.ajax({
        url:"libs/php/getcountryinfo.php",
        type: "POST",
        dataType: 'json',
        data:{
            countryName: countryName
        },

        success: function(result){
            console.log("%cCountryData() ", "color: red");
            console.log(result);
            
                countryData = result;
                countryDataRefresh();

            $('.info').addClass("hidden");
            $('#country').removeClass("hidden");

            //if we done get a country returned we can prompt people to try again. 
            //mostly its because I sometimes click on sea and think the code is broken. 
            //code have saved myself 30 or so minutes if I had caught this early on.
            
            $('.overlay').removeClass("hidden");
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    })
}

function getweatherInfo(){
    $.ajax({
        url:"libs/php/getweatherinfo.php",
        type: "GET",
        dataType: 'json',
        data:{
            lat: lat,
            lng: lng
        },

        success: function(result){
            console.log("%cweatherData() ", "color: red");
            console.log(result);
            weatherData = result['data'];
            weatherDataRefresh();
            getlocalInfo();   
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    })
}

function getlocalInfo(){
    $.ajax({
        url:"libs/php/getlocaldata.php",
        type: "GET",
        dataType: 'json',
        data:{
            town: `${weatherData.location.name}`
        },

        success: function(result){
            console.log("%clocalData() ", "color: red");
            console.log(result);
            localData = result;
             
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }

    })
}

function countryDataRefresh(){

if(countryData[1] == undefined || countryData[1] != "United States of America"){
    $('#country').html(`
                    <p><b>lattitude:</b> ${lat.toFixed(5)}<br>
                    <b>longitude:</b>${lng.toFixed(5)}</p>
                    <p><b> You have selected</b>: ${countryName} </p>
                    <p><b> Nearest town to click:</b> ${weatherData.location.name}</p>
                    <p> ${countryName} has a population of ${countryData[0]['population']} and the total area of ${countryName} is ${countryData[0]['area']}km<sup>2</sup>which means icelands population density is about ${(countryData[0]['population']/countryData[0]['area']).toFixed(0)} People per km<sup>2</sup>.<br>
                    The ${countryData[0]['languages'].length < 2 ? `language of ${countryName} is ` : `languages of ${countryName} are `}<span id="languages"></span> and they use the ${countryData[0]['currencies'][0]['name']}(${countryData[0]['currencies'][0]['symbol']}) as their main currency.


                `)

                for(var i = 0; i < countryData[0]['languages'].length; i++){
                    $('#languages').append(`${countryData[0]['languages'][i]['name']}, `)
                }
}    
else if(countryData[1]['name'] == "United States of America"){
    $('#country').html(`
                    <p><b>lattitude:</b> ${lat.toFixed(5)}<br>
                    <b>longitude:</b>${lng.toFixed(5)}</p>
                    <p><b> You have selected</b>: ${countryName} </p><br>
                    <p> ${countryName} has a population of ${countryData[1]['population']}. The total area of ${countryName} is ${countryData[1]['area']}km<sup>2</sup>which means icelands population density is about ${(countryData[1]['population']/countryData[1]['area']).toFixed(0)} People per km<sup>2</sup>.<br>
                    the Language of ${countryName} is <span id="languages"></span> and they use the ${countryData[1]['currencies'][0]['name']}(${countryData[1]['currencies'][0]['symbol']}) as their main currency.


                `)

    
        for(var i = 0; i < countryData[1]['languages'].length; i++){
            $('#languages').append(`${countryData[1]['languages'][i]['name']}`)
        }
    

}}

function wikiDataRefresh(){
    $('#wiki').html(`<h2>Wiki links closest to where you clicked</h2><br>`);

    var i = 1;
    wikiData['data'].forEach(element => {
        console.log(element)
        $('#wiki').append(`
        ${i}. <a href='https://${element.wikipediaUrl}' target='_blank'> ${element.title}</a><br>
        `)
        i++
    });
}
    
function weatherDataRefresh(){
    var icon = weatherData['current']['condition']['icon'].replace('//','');
    
    $('#weather').html(`
    <h3> Current Weather:<br> ${weatherData['location']['name']}</h3>
    <p>weather condition:<br> ${weatherData.current.condition.text}<br><img src="http:${icon}"></p>
    <p>Wind:<br>
    Speed: ${weatherData.current.gust_kph}kph Direction:${weatherData.current.wind_dir}</p>
    <p>Temp:<br>
     ${weatherData.current.temp_c} &deg;C but feels like: ${weatherData.current.feelslike_c}&deg;C</p>
     <p> Humidity: <br>
     ${weatherData.current.humidity}%</p>
     <br>
     <br>
     <p>Last Updated: ${weatherData.current.last_updated}</p>
    `);
}