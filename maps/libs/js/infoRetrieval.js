var localData;
var weatherData;
var countryData;

//function is called update local as the local info must be updated before other apis
//this function is called when the map is clicked on. this happens at map.js in the map
// .on("click.... function
function update(){
    $.ajax({
            url:'libs/php/getlocaldata.php',
            type:'POST',
            dataType:'json',
            data:{
                lat: `${lat}`,
                lng: `${lng}`
            },
    
            success: function(result){
                localDataFunc(result);
                
            },
    
            error: function(jqXHR, textStatus,errorThrown){
                            console.log(jqXHR, textStatus, errorThrown);
                            console.log("localdata problem");
                            $('#info').html("it seems there has been an error, click again please...")
                    }
            
    })
};

//only DataFunc which needs result as it returns town variable for the other api searches
function localDataFunc(result){
    console.log(result)
    //storing variables for easy access later.
    localData = result['data'][0];
    console.log(`heres where the problem is ${result['data'][0]}`)
    town = result['data'][0]['name'];

    CountryDataFunc();
    if(localData == undefined){
        $('#info').append(`<p>You clicked to far away form a town. click closer next time</p>`)
        console.log("hiya")
    } else {
    wikiDataFunc();
    WeatherDataFunc();
    refreshLocalData();
    }

    
    
}

//functions for getting data from apis on click. All are nested in local Data as 
//local data must go first. see above.
function wikiDataFunc(){
    $.ajax({
        url:'libs/php/getwikidata.php',
            type:'POST',
            dataType:'json',
            data:{
                lat: `${lat}`,
                lng: `${lng}`                            
            },
    
            success: function(result){
                console.log(`wikipedia: ${result}`)
                //storing variables for easy access later.
                wikiData = result;    
                refreshWikiData();                        
            },
    
            error: function(jqXHR, textStatus,errorThrown){
                    console.log(jqXHR, textStatus, errorThrown)
            }

    })
}

function WeatherDataFunc(){
    $.ajax({
        url:'libs/php/getweatherinfo.php',
            type:'POST',
            dataType:'json',
            data:{
                town: `${town}`                           
            },
    
            success: function(result){
                console.log(`weather: ${result}`)
                //storing variables for easy access later.
                weatherData = result;  
                //refreshWeatherData();                          
            },
    
            error: function(jqXHR, textStatus,errorThrown){
                    console.log(jqXHR, textStatus, errorThrown)
                    console.log("problem with weather")
            }

    })
}

function CountryDataFunc(){
    $.ajax({
        url:'libs/php/getcountryinfo.php',
            type:'POST',
            dataType:'json',
            data:{
                countryName: `${countryName}`                           
            },
    
            success: function(result){
                console.log(`country: ${result}`)
                //storing variables for easy access later.
                countryData = result;
                refreshCountryData(); 
                                           
            },
    
            error: function(jqXHR, textStatus,errorThrown){
                    console.log(jqXHR, textStatus, errorThrown);
                    console.log("problem with country")
                    

            }
        
                
    })
       

}



function refreshLocalData(){
        if(localData['population'] > 0 && weatherData['data'] != null){
            $('#local').html(
                `
                <p><b>Nearest city to click:</b> ${town} in ${localData['adminName1']}</p>
                <p><b>Population<b>: ${localData['population']}</p>
                <p><b>Current Weather:</b> ${weatherData['data']['condition']['text']}<img src="${weatherData['data']['condition']['icon']}"></p>
                <p><b>Wind speed:</b>${weatherData['data']['wind_mph']} mph </p>
                <p></p>
                `
            )
        } else {
            $('#local').html(
                `
                <p>Name of nearest place: ${town} in ${localData['adminName1']}</p>
                <p>population: population data unavailable</p>
                
        
                `
        
            )
        }

    if(weatherData['data'] == null){
        $('#local').html(
            `
                <p><b>Nearest city to click:</b> ${town} in ${localData['adminName1']}</p>
                <p><b>Population<b>: ${localData['population']}</p>
                <p><b>Weather Data unavaliable</b></p>
                `
        )
    }
}   

/*function refreshWeatherData(){
    if(weatherData.data == null){
        $('#weather').html(
            `weather data not availiable due to api limitations. wait a minute and try again`
        )
    } else{
    $('#weather').html(
        
        
    )
    }
}*/

function refreshWikiData(){
        $('#wiki').html(`<p>Here are some Wiki links for nearby places<p>`);

        for(var i = 0; i < wikiData['data'].length; i++){
            $('#wiki').append(
            `<p>${i+1}.<a href="https://${wikiData['data'][i]['wikipediaUrl']}" target="_blank">${wikiData['data'][i]['title']}</a></p>`  
            )
        }
        
    
}

function refreshCountryData(){
    $('#country').html(
        `
        <p><b>Country:</b> ${countryData[0]['name']} (${countryData[0]['alpha2Code']})</p>
        <p><b>Region:</b>${countryData[0]['subregion']}</p>
        <p><b>Capital:</b> ${countryData[0]['capital']}</p>
        <p><b>Population:</b> ${countryData[0]['population']}</p>
        <p><b>Area:</b>${countryData[0]['area']} km<sup>2</sup></p>
        <p><b>Main currency:</b> ${countryData[0]['currencies'][0]['name']}
        <p><b>Bordering Country Codes:</b> ${countryData[0]['borders'].toString(', ')}</p>
        <p><b>Languages:</b><span id="languages"></span><p>
        <p><b>Alternate Spellings:</b><span id="altSpelling"></span></p>
        `
    )
        for(var i= 0; i<countryData[0]['languages'].length; i++){
            $('#languages').append(
               `<span> ${countryData[0]['languages'][i]['name']},</span>`
            )
        }

        countryData[0]['altSpellings'].forEach(alt => {
            $('#altSpelling').append(
                `${alt}, `)
        });

        
        
    
}

