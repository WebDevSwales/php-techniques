$('#wikiButton').on('click', function(){
    console.log("country info please");
    $('.info').addClass("hidden");
    $('#wiki').removeClass("hidden");
});

$('#localButton').on('click', function(){
    console.log(lat);
    $('.info').addClass("hidden");
    $('#local').removeClass("hidden");
});

$('#weatherButton').on('click', function(){
    console.log(lat);
    $('.info').addClass("hidden");
    $('#weather').removeClass("hidden");
});

$('#countryButton').on('click', function(){
    console.log(lat);
    $('.info').addClass("hidden");
    $('#country').removeClass("hidden");
});

$('#close').on('click', function(){
    console.log("close please")
    $('#overlay').addClass('hidden');
});