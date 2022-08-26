$(document).ready(function() {
    $("search-btn").on("click", function() {
        var searchValue = $("#search-value").val();
        $("#search-value").val("");
        searchWeather(searchValue);
    })
});

$(".history").on("click", "li", function(){
    searchWeather($(this).text());
});

function createRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
}

function searchWeather(searchValue) {
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=84b79da5e5d7c92085660485702f4ce8&units=imperial",
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

				
				getForecast(searchValue);
				getUVIndex(data.coord.lat, data.coord.lon);
			}
		});
	}