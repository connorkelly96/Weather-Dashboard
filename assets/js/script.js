$(document).ready(function() {
    $("search-btn").on("click", function() {
        var searchValue = $("#search-value").val();
        $("#search-value").val("");
        todayWeather(searchValue);
    })
});

$(".history").on("click", "li", function(){
    todayWeather($(this).text());
});

function createRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
}

function todayWeather(searchValue) {
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=f20ddcfc31a9d7fcb9a3ce5ef4c9596f&units=imperial",
        dataType: "json",
        success: function (data) {
            
            if (history.indexOf(searchValue) === -1) {
                history.push(searchValue);
                window.localStorage.setItem("history", JSON.stringify(history));
                createRow(searchValue);
            }
	
				$("#current-weather").empty();

				var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
				var card = $("<div>").addClass("card");
				var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
				var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
				var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
				var cardBody = $("<div>").addClass("card-body");
				var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

				title.append(img);
				cardBody.append(title, temp, humid, wind);
				card.append(cardBody);
				$("#current-weather").append(card);

				fiveDayForecast(searchValue);
				UVIndex(data.coord.lat, data.coord.lon);
			}
		});
}

function UVIndex(lat, lon) {
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/uvi?&appid=f20ddcfc31a9d7fcb9a3ce5ef4c9596f&units=imperial" + lat + "&lon=" + lon,
        dataType: "json",
        success: function (data) {
            var uv = $("<p>").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(data.value);

            if (data.value < 3) {
                btn.addClass("btn-success");
            }
            else if (data.value < 7) {
                btn.addClass("btn-warning");
            }
            else {
                btn.addClass("btn-danger");
            }

            $("#current-weather .card-body").append(uv.append(btn));
        }
    });
}

function fiveDayForecast(searchValue) {
		$.ajax({
			type: "GET",
			url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=f20ddcfc31a9d7fcb9a3ce5ef4c9596f&units=imperial",
			dataType: "json",
			success: function (data) {
			
				$("#forecast").html("<h4 class=\"mt-3 ml-3 mr-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

			
				for (var i = 0; i < data.list.length; i++) {
				
					if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
					
						var col = $("<div>").addClass("col-md-2");
						var card = $("<div>").addClass("card bg-primary text-white");
						var body = $("<div>").addClass("card-body p-2");

						var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

						var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

						var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");

						var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

						
						col.append(card.append(body.append(title, img, p1, p2)));
						$("#forecast .row").append(col);
					}
				}
			}
		});
}
	
var history = JSON.parse(window.localStorage.getItem("history")) || [];

	if (history.length > 0) {
		todayWeather(history[history.length - 1]);
	}

	for (var i = 0; i < history.length; i++) {
		createRow(history[i]);
	}
