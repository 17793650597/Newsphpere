var WeatherForecast = {
	getData : function(weatherForecast) {
//		var url =  weatherForecast.options.queryUrl + encodeURIComponent( '&city=' +  weatherForecast.options.city );
//		var param = {
//				location: weatherForecast.options.location,
//				key : weatherForecast.options.key
//		};
		//https://www.nowapi.com/api/weather.future注册账号后获得appkey sign
		var weaid = weatherForecast.options.weaid;
		var appkey = weatherForecast.options.appkey;
		var sign = weatherForecast.options.sign;
		$.ajax({
	        type          : 'get',
	        async         : false,
	        url           : 'http://api.k780.com/?app=weather.future&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
	        dataType      : 'jsonp',
	        jsonp         : 'callback',
	        jsonpCallback : 'data',
	        success       : function(resp){
	            if(resp.success!='1'){
	                console.log(resp.msgid+' '+resp.msg);
	                return;
	            }
				weatherForecast.data = resp.result;
	            $.ajax({
	    	        type          : 'get',
	    	        async         : false,
	    	        url           : 'http://api.k780.com/?app=weather.today&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
	    	        dataType      : 'jsonp',
	    	        jsonp         : 'callback',
	    	        jsonpCallback : 'data',
	    	        success       : function(respNow){
	    	            if(respNow.success!='1'){
	    	                console.log(respNow.msgid+' '+respNow.msg);
	    	                return;
	    	            }
	    				weatherForecast.dataNow = respNow.result;
	    	            $.ajax({
	    	    	        type          : 'get',
	    	    	        async         : false,
	    	    	        url           : 'http://api.k780.com/?app=weather.today&weaid=' + weaid + '&appkey=' + appkey + '&sign=' + sign + '&format=json&jsoncallback=data',
	    	    	        dataType      : 'jsonp',
	    	    	        jsonp         : 'callback',
	    	    	        jsonpCallback : 'data',
	    	    	        success       : function(respAqi){
	    	    	            if(respAqi.success!='1'){
	    	    	                console.log(respAqi.msgid+' '+respAqi.msg);
	    	    	                return;
	    	    	            }
	    	    	            if (respAqi.result && weatherForecast) {
	    	    					weatherForecast.dataAqi = respAqi.result;
	    	    					WeatherForecast.updatePage(weatherForecast);
	    	    				}
	    	    	        }
	    	            });
	    	        }
	    	    });
	        }
	    });
		//和风天气api 可用
//		$.ajax({
//			url : weatherForecast.options.queryUrl,
//			type	: 'GET',
//			data    : param,
//			success : function(resp) {
//				console.log(resp);
//				$.ajax({
//					url : 'https://free-api.heweather.com/s6/weather/now',
//					type	: 'GET',
//					data    :  param,
//					success : function(respNow) {
//						console.log(respNow);
//						$.ajax({
//							url : 'https://free-api.heweather.com/s6/air/now',
//							type	: 'GET',
//							data    : param,
//							success : function(respAir) {
//								console.log(respAir);
//								if (resp['HeWeather6'] && weatherForecast) {
//									weatherForecast.data = resp;
//									weatherForecast.dataNow = respNow;
//									weatherForecast.dataAir = respAir;
//									WeatherForecast.updatePage(weatherForecast);
//								}
//							},
//						});
//					},
//				});
//			},
//		});
	},
	
	updatePage : function(weatherForecast) {
		WeatherForecast.clearPage(weatherForecast);
		setTimeout(function() {
			WeatherForecast.fullfillLeftPane(weatherForecast);
		}, 300);
		setTimeout(function() {
			window.onresize = function() {
				if (weatherForecast.weatherChart) {
					weatherForecast.weatherChart.resize();
				}
			};
		}, 5000);
	},
	
	fullfillLeftPane : function(weatherForecast) {
		var weatherContainer = weatherForecast.options.weatherContainer;
		var leftPane = weatherContainer.find('.left-pane');
		
		var cnDayArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五",
				"星期六");
		var enDayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday",
				"Thursday", "Friday", "Saturday");
		var simpEnDayArray = new Array("Sun", "Mon", "Tue", "Wed", "Thu",
				"Fri", "Sat");
		
		var nowaDay = new Date();
		var cnDay = cnDayArray[nowaDay.getDay()];
		var enDay = enDayArray[nowaDay.getDay()];
		var simpEnDay = simpEnDayArray[nowaDay.getDay()];

		var weatherData = weatherForecast.data;
		var weatherDataNow = weatherForecast.dataNow;
		var todayMaxTemr = weatherData[0].temp_high;
		var todayMinTemr = weatherData[0].temp_low;
		var nowWeatherLogoCode = WeatherForecast.transformIcon(weatherData[0].weatid);
		var nowWeatherDesc = weatherDataNow.weather;
		var nowWeatherTempr = weatherDataNow.temperature_curr;
		var $nextDayTmpContainer = leftPane.find('.next-day-tmp-container');
		var dailyForcastData = weatherData;
		//和风天气对应数据
//		var weatherData = weatherForecast.data['HeWeather6'][0];
//		var weatherDataNow = weatherForecast.dataNow['HeWeather6'][0];
//		var todayMaxTemr = weatherData.daily_forecast[0].tmp_max;
//		var todayMinTemr = weatherData.daily_forecast[0].tmp_min;
//		var nowWeatherLogoCode = weatherDataNow.now.cond_code;
//		var nowWeatherDesc = weatherDataNow.now.cond_txt;
//		var nowWeatherTempr = weatherDataNow.now.tmp;
//		var $nextDayTmpContainer = leftPane.find('.next-day-tmp-container');
//		var dailyForcastData = weatherData.daily_forecast;

		// leftPane部分开始更新
		leftPane.removeClass('active',1000,function(){
//			leftPane.find('div.city').text(weatherForecast.options.city);
			leftPane.find('.min-tmp').text(todayMinTemr);
			leftPane.find('.max-tmp').text(todayMaxTemr);
			leftPane.find('.tianqi').text(nowWeatherDesc);
			leftPane.find('.tianqi-logo>img').attr('src',
					'../../images/weather/' + nowWeatherLogoCode + '.png');
			leftPane.find('.now-tmp').text(nowWeatherTempr);

			$nextDayTmpContainer.empty();
			for (var i = 1; i < 7 && i < dailyForcastData.length; i++) {
				var dailyHtml = '<div class="next-day-tmp">\
						        		<div class="weekday">Monday</div>\
						        		<div class="weekday-tmp">\
						        			<span class="min-tmp">10</span>°\
						        			<span class="max-tmp">19</span>°\
						        		</div>\
					        		</div>';
				var $dailyHtml = $(dailyHtml);
				var date = new Date(dailyForcastData[i].days);
				$dailyHtml.find('.weekday').text(cnDayArray[date.getDay()]);
				$dailyHtml.find('.min-tmp').text(dailyForcastData[i].temp_low);
				$dailyHtml.find('.max-tmp').text(dailyForcastData[i].temp_high);
				$nextDayTmpContainer.append($dailyHtml);
			}
			leftPane.addClass('active', 1000, function(){
				//开始右侧滑出
				WeatherForecast.fullfillRightPane(weatherForecast);
			});
		});
		// leftPane执行完毕
	},
	
	fullfilTopRightWeather: function(weatherForecast){
		var topRight = weatherForecast.options.weatherContainer.find('.top-right');
		topRight.find('div').removeClass('active');
		var airCondition = weatherForecast.options.weatherContainer.find('.air-condition');
		var value = weatherForecast.options.weatherContainer.find('.air-condition .value');
		var desc = weatherForecast.options.weatherContainer.find('.air-condition .desc');
		var clockArea = weatherForecast.options.weatherContainer.find('.top-right .date');
//		var weatherData = weatherForecast.data['HeWeather data service 3.0'][0];
		var weatherDataAqi = weatherForecast.dataAqi;	
		value.text(weatherDataAqi.aqi);
		desc.text(weatherDataAqi.aqi_levnm);
		airCondition.addClass('active');
		setTimeout(function(){
			clockArea.addClass('active');
		},500);
	},
	
	updateClock: function(weatherForecast){
		var clockArea = weatherForecast.options.weatherContainer.find('.top-right .date');
		var nowaDay, cnDay;
		var cnDayArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五","星期六");
		function dateFormat(date, formatStr) {
			var str = formatStr;
			var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
			str = str.replace(/yyyy|YYYY/, date.getFullYear());
			str = str
					.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date
							.getYear() % 100).toString() : '0'
							+ (date.getYear() % 100));

			str = str.replace(/MM/, (date.getMonth()+1) > 9 ? (date.getMonth()+1)
					.toString() : '0' + (date.getMonth()+1));
			str = str.replace(/M/g, date.getMonth());

			str = str.replace(/w|W/g, Week[date.getDay()]);

			str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate()
					.toString() : '0' + date.getDate());
			str = str.replace(/d|D/g, date.getDate());

			str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes()
					.toString() : '0' + date.getMinutes());
			str = str.replace(/m/g, date.getMinutes());

			str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date
					.getSeconds().toString() : '0' + date.getSeconds());
			str = str.replace(/s|S/g, date.getSeconds());

			if (date.getHours() > 12 && str.indexOf('ap' >= 0)) {
				str = str.replace(/hh|HH/, date.getHours() - 12);
				str = str.replace(/h|H/g, date.getHours() - 12);
				str = str.replace('ap', 'pm');
			} else if(str.indexOf('ap') >= 0){
				str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
				str = str.replace(/h|H/g, date.getHours());
				str = str.replace('ap', 'am');
			} else{
				str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
				str = str.replace(/h|H/g, date.getHours());
			}
			
			return str;
		}
		
		function update(){
			nowaDay = new Date();
			cnDay = cnDayArray[nowaDay.getDay()];
			clockArea.find('.weekday').text(cnDay);
			clockArea.find('.day').text(dateFormat(nowaDay, 'yyyy-MM-dd'));
			clockArea.find('.time').text(dateFormat(nowaDay, 'hh:mmap'));
		}
		if(weatherForecast.intervalClock){
			clearInterval(weatherForecast.intervalClock);
		}
		update();
		weatherForecast.intervalClock = setInterval(update, 1000);
	},
	
	updateWeatherChat: function(weatherForecast){
		var weatherChart;
		if (!weatherForecast.weatherChart) {
			var dom = weatherForecast.options.weatherContainer.find('.bg-anim-container')[0];
			weatherChart = echarts.init(dom);
			weatherForecast.weatherChart = weatherChart;
		} else {
			weatherChart = weatherForecast.weatherChart;
		}

		weatherChart.option = {
			animationDurationUpdate : 1500,
			animationDuration : 1500,
			animationEasing : 'BounceInOut',
			title : {
				show : false
			},
			tooltip : {
				show : false
			},
			legend : {
				show : false
			},
			toolbox : {
				show : false,
			},
			grid : {
				left : 0,
				right : 0,
				bottom : '2%',
				containLabel : false
			},
			xAxis : [ {
				show : false,
				type : 'category',
				boundaryGap : false,
				data : [ '周一', '周二', '周三', '周四', '周五', '周六' ]
			} ],
			yAxis : [ {
				show : false,
				minInterval: 0.3,
				type : 'value'/*,
				max : 'auto',
				min : 'auto'*/
			} ],
			series : [ {
				smooth : true,
				silent : true,
				type : 'line',
				stack : '总量',
				lineStyle : {
					normal: {
						color: 'rgb(0,167,189)',
						width: 8,
						type: 'solid',
						opacity: 1,
						}
				},
				areaStyle : {
					normal: {
						color: 'rgba(0,167,189,0.40)',
						opacity: '0.8'
						}
				},
				data : []
			} ]
		};

		weatherChart.option.series[0].data = [];
//		var dailyForcastData = weatherForecast.data['HeWeather data service 3.0'][0].daily_forecast;
//		var dailyForcastData = weatherForecast.data['HeWeather6'][0].daily_forecast;
		var dailyForcastData = weatherForecast.data;
		for (var i = 1; i < 7 && i < dailyForcastData.length; i++) {
			weatherChart.option.series[0].data.push(dailyForcastData[i].temp_high);
		}
		
		return weatherForecast;
	},
	
	fullfillDayForecast: function(weatherForecast){
//		var weatherData = weatherForecast.data['HeWeather data service 3.0'][0];
		var weatherData = weatherForecast.data;
		var dailyForcastData = weatherData;
//		var dailyForcastData = weatherData.daily_forecast;
//		var simpEnDayArray = new Array("Sun", "Mon", "Tue", "Wed", "Thu",
//				"Fri", "Sat");
		var simpEnDayArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
		var $nextDayTmpContainerRight = weatherForecast.options.weatherContainer.find(
				'.next-6-day-tempr-container');
		
		$nextDayTmpContainerRight.removeClass('active', 500, function(){
			$nextDayTmpContainerRight.empty();
			$nextDayTmpContainerRight.addClass('active', 500, function(){
				function append(i){
					var dailyHtml = '<div class="day-tempr-item">\
					       				<div class="axis-y-line"></div>\
					       				<div class="item-body">\
						       				<div class="weekday">Mon</div>\
						       				<div class="weather-condition"><img alt="天气图标" src="../../images/101.png"></div>\
						       				<div class="tempr">19</div>\
					       				</div>\
					   				</div>';
					var $dailyHtml = $(dailyHtml);
					console.log(WeatherForecast.transformIcon(weatherData[i].weatid))
					var date = new Date(dailyForcastData[i].days);
					$dailyHtml.find('.weekday').text(simpEnDayArray[date.getDay()]);
					$dailyHtml.find('.weather-condition>img').attr('src',
							'../../images/weather/' + WeatherForecast.transformIcon(weatherData[i].weatid) + '.png');
//					$dailyHtml.find('.weather-condition>img').attr('src',
//							'../../images/weather/' + dailyForcastData[i].cond.code_d + '.png');
//					$dailyHtml.find('.weather-condition>img').attr('src',
//							'./css/images/icon/' + dailyForcastData[i].cond_code_d + '.png');
					$dailyHtml.find('.tempr').text(dailyForcastData[i].temp_high);
					$nextDayTmpContainerRight.append($dailyHtml);
				}
				
				var i = 1;
				append(i);
				i++;
				
				if(weatherForecast.intervalAppendNextDayWeatherRight){
					clearInterval(weatherForecast.intervalAppendNextDayWeatherRight);
				}
				weatherForecast.intervalAppendNextDayWeatherRight = setInterval(function(){
					if(i >= 7 || i >= dailyForcastData.length){
						clearInterval(weatherForecast.intervalAppendNextDayWeatherRight);
						return;
					}
					append(i);
					i++;
				},500);
			});
		});
		return weatherForecast;
	},
	
	fullfillRightPane: function(weatherForecast){
		weatherForecast.options.weatherContainer.find('.right-pane-title').removeClass('active',500,function(){
			weatherForecast.options.weatherContainer.find('.right-pane-title').addClass('active');
		});
		
		weatherForecast.options.weatherContainer.find('.bg-anim-container').removeClass('active',500,function(){
			WeatherForecast.updateWeatherChat(weatherForecast);
			weatherForecast.options.weatherContainer.find('.bg-anim-container').addClass('active',500,function(){
				weatherForecast.weatherChart.setOption(weatherForecast.weatherChart.option);
				//右侧下方底图滑出完毕，开始滑出竖线
				setTimeout(function(){
					WeatherForecast.fullfillDayForecast(weatherForecast);
				},1500);
				//开始滑出右上方
				setTimeout(function(){
					WeatherForecast.fullfilTopRightWeather(weatherForecast);
				},4500);
				return weatherForecast;
			});
		});
	},
	transformIcon: function(weatid){
		var code = "";
		switch (weatid){
			case "1":
				code = "100";
				break;
			case "2":
				code = "101";
				break;
			case "3":
				code = "104";
				break;
			case "4":
				code = "300";
				break;
			case "5":
				code = "302";
				break;
			case "6":
				code = "304";
				break;
			case "7":
				code = "404";
				break;
			case "8":
				code = "305";
				break;
			case "9":
				code = "306";
				break;
			case "10":
				code = "307";
				break;
			case "11":
				code = "310";
				break;
			case "12":
				code = "311";
				break;
			case "13":
				code = "312";
				break;
			case "14": //阵雪
				code = "400";
				break;
			case "15":
				code = "400";
				break;
			case "16":
				code = "401";
				break;
			case "17":
				code = "402";
				break;
			case "18":
				code = "403";
				break;
			case "19":
				code = "501";
				break;
			case "20":
				code = "313";
				break;
			case "21":
				code = "507";
				break;
			case "22":	//小雨转中雨
				code = "305";
				break;
			case "23":	//中雨转大雨
				code = "306";
				break;
			case "24":	//大雨转暴雨
				code = "307";
				break;
			case "25":	//暴雨转大暴雨
				code = "310";
				break;
			case "26":	//大暴雨转特大暴雨
				code = "311";
				break;
			case "27":	//小雪转中雪
				code = "400";
				break;
			case "28":	//中雪转大雪
				code = "401";
				break;
			case "29":	//大雪转暴雪
				code = "402";
				break;
			case "30":
				code = "504";
				break;
			case "31":
				code = "503";
				break;
			case "32":
				code = "508";
				break;
			case "33":
				code = "502";
				break;
			default:
				code = "100";
				break;
		}
		return code;
	},
	createNew : function(opts) {
		var opts_default = {
			weatherContainer : $('.gallery-weather-forecast'),
			sign : '',
			weaid : 1,
			appkey : '',
			interval : 20000,
		};

		var weatherForecast = {};
		weatherForecast.options = $.extend(true, opts_default, opts);
		WeatherForecast.updateClock(weatherForecast);
		WeatherForecast.getData(weatherForecast);
		setInterval(function() {
			WeatherForecast.getData(weatherForecast);
		}, weatherForecast.options.interval);
		return weatherForecast;
	},
	
	clearPage: function(weatherForecast){
		weatherContainer = weatherForecast.options.weatherContainer;
		weatherContainer.find('.left-pane').removeClass('active', 300);
		weatherContainer.find('.right-pane-title').removeClass('active',300);
		weatherContainer.find('.top-right div').removeClass('active');
		weatherContainer.find('.next-6-day-tempr-container').removeClass('active', 300);
		weatherContainer.find('.bg-anim-container').removeClass('active',300);
		return weatherForecast;
	},
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	var conf = ModuleConfigHelper.getConfigByModuleName('ns.weather');
	if(conf){
		var citis =  conf.cities.split(',');
		if(cities.length > 0){
			$('#cities').empty();
		}
		$(citis).each(function(index, item){
			$('<option>').appendTo('#cities').html(item);
		});
		WeatherForecast.createNew({
			weatherContainer : $('.weather-forecast-page'),
			sign : conf.sign,
			weaid : citis[0],
			appkey : conf.appkey,
			interval : 600000,
		});
	}
	$('#cities').change(function(e){
		var city = $(this).val();
		WeatherForecast.createNew({
			weatherContainer : $('.weather-forecast-page'),
			sign : conf.sign,
			weaid : city,
			appkey : conf.appkey,
			interval : 600000,
		});
	});
});
