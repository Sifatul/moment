var weather={};
var quote = "";
var author = "";
var quotes_array = [];
var pos={};
var imag = {
	"snow":["https://lh4.ggpht.com/uLSWY0zGdxJrCl25Z_eEtSLU7a71gsTYbkeylAD_7Yb4rvSlaxz_39oigRIj1MUGWbs=h900"],
	"cold":["https://wallpaperclicker.com/storage/wallpaper/Good-Morning-Wallpaper-HD-Download-48407880.jpg"],
	"normal":["http://cdn.wonderfulengineering.com/wp-content/uploads/2015/06/Bangladesh-Wallpaper-26.jpg"],
	"hot":["http://wallpaperden.com/wp-content/uploads/2014/08/Sunny-autumn-day.jpg?156492"],
	
	};

function getRandom(num) {
  return Math.round(Math.random() * num);
}

var img_url = "";



$.ajax({
  url: "https://codepen.io/Siegoboy/pen/zqzKyb.js",
  dataType: "json",
  success: function(data) {
    data.map(function(element, index) {
      quotes_array.push(element);
    });

    quote = quotes_array[getRandom(quotes_array.length - 1)].quote;
    author = quotes_array[getRandom(quotes_array.length - 1)].author;

    $(".post").html(quote + "\n\n -" + author);

    $(   '<a class="fa fa-twitter " href="http://twitter.com/intent/tweet?text=' +
        encodeURI(quote) +
        '"></a>'
    ).appendTo(".post");
  }
}); //end of ajax




function initMap() {
	
	return new Promise(function (resolve, reject) {
  var  geocoder=new google.maps.Geocoder;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      //console.log(pos);
      geocoder.geocode({'location':pos},function(results,status){
        if (status === 'OK') {
          if (results[0]) {				
            var city_name=results[0].address_components[3].short_name;

            $('.location').html(city_name);
				resolve(pos)
            
          } else { window.alert('No results found'); }
        }else { window.alert('Geocoder failed due to: ' + status); }

      });
    }, function() { console.log("error"); }); 
  } else { console.log("Browser unsupported");}		



				
	}) //end of promise

  
} //end of intMap()



function setImge(temp){
	var type=20;
	if(temp<0){
		type= "snow";
	}else if(type>=0 && type <15){
		type="cold"
	}
	else if(type>=15 && type <25){
		type="normal"
	}
	else {
		type="hot"
	}
	img_url= imag[type][getRandom(imag[type].length-1)];
	$("body").css("background-image", "url(" + img_url + ")");
	
	/*return new Promise(function(resolve,reject){
		resolve(img_url);
	});
	*/
}




var getWeather = function(pos) {		
	
	return new Promise(function (resolve, reject) {
		var data_w={};
		$.getJSON('https://api.openweathermap.org/data/2.5/weather', {
			lat: pos.lat,
			lon: pos.lng,
			appid: "46d02d607f2a24449ffb403c3919051f"
		}, function(data) {	resolve(data)}, 'jsonp');
			
	});
	
};

function convertCelcius(data_in_kelvin){	
	var temp=  (data_in_kelvin - 272.15).toFixed(1);
	$('.temp').html(temp+'&deg');
	$( ".temp" ).removeClass('fahrenheit').addClass( "celcius" );
	return new Promise(function (resolve, reject) {
		resolve(temp)
	});
	
}

function getTemp(){
	
	return new Promise(function (resolve, reject) {
	//resolve(temp)

		return initMap()
				.then(getWeather)
				.then( function(data) {
				// data holds an array with the return values of the promises
				resolve(data.main.temp)
		});

	});
		
}

function convertfahrenheit(data_in_kelvin){
	var temp=  (data_in_kelvin - -457.87).toFixed(1);
	$('.temp').html(temp+'&#8457;');
	$( ".temp" ).removeClass( "celcius" ).addClass( "fahrenheit" );
	return new Promise(function (resolve, reject) {
		resolve(temp)
	});
}

function update(pos) {
	return getTemp()
			.then(convertCelcius)
			.then(setImge);     
}

	







$(document).ready(function() {
	
	update(pos);
	
	$('.temperature_box').click(function(){
		$('.temp').hasClass('celcius') ? getTemp().then(convertfahrenheit) : getTemp().then(convertCelcius);
		
		
	});
  
}); //end of ready();






