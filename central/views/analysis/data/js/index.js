
/**
* 温岭台数据分析页面
*/
var Top = new Vue({
    el:"#top",
    data:{
    	topic: {
    		topicName:'',
    		topicInfo:''
    	},
    }
})
//初始化 List对象
var List = new Vue({
    el:"#list",
    data:{
        paramForId:{
    	        "date":"",
    	        "category":"",
    	        "page":1,
    	        "page_size":10,
    	        "flag":"hourly"
    	},
    	paramTopicId:{
    		topicId: ''
    	},
    	topicIds:[],
        topicIdUrl: "/central/api/data/route?url=http://www.newsbigbang.com/auton/lsg/interface/getTopicList.do",
        apiUrl: '/central/api/data/route?url=http://www.newsbigbang.com/auton/lsg/interface/getTopicOpinion.do',
        resData: [],
        listData: [],
        height: '',
        interval: '',
        topicName:'',
        topicInfo:'',
        topicData:[]
    },
//    mounted: function() {
//        this.$nextTick(function () {
//            this.getTopicId();
//        })
//    },
    updated: function(){
    	this.height = $('.left-pane .list').find('.item:first').height();
    },
    methods: {
    	getTopicId: function() {
        	this.paramForId.date = Utils.parseTime(new Date().getTime(), 'ymd', true);
        	this.$http.post(this.topicIdUrl, this.paramForId).then(
    			function(resp){
    				this.resData = JSON.parse(resp.body).RspBodyContent;
    				for(var i = 0; i < this.resData.length; i++){
    					var obj = {};
    					this.topicIds.push(this.resData[i].topic_id);
    					obj.topicName = this.resData[i].topic_name;
    					obj.topicInfo = this.resData[i].topic_info;
    					this.topicData.push(obj);
    				}
    				this.paramTopicId.topicId = this.topicIds[0];
    				Top.topic.topicName = this.topicData[0].topicName;
    				Top.topic.topicInfo = this.topicData[0].topicInfo;
    				this.getList();
        	})
        },
        getList: function(){
//        	this.$set(this,'listData', []);
        	this.$http.post(this.apiUrl, this.paramTopicId).then(
    			function(resp){
    				var data = JSON.parse(resp.body).RspBodyContent.opinion_list;
    				this.$set(this,'listData', data.concat(data));
    				this.interval = setInterval(function(){
    					List.autoScroll(".left-pane", List.height)
    				},1000);
    		    	Words.getWordData();
    		    	Emotion.getEmotionData()
    		})
    			
        },
        autoScroll: function(obj, height){
        	$(obj).find(".list").animate({  
        		marginTop : -height-10 + 'px'
        	},500,function(){  
        		$(obj).find(".list").css({marginTop : "0px"}).find("div:first").appendTo(this);  
        	})  
        }
    }
});


var Words = new Vue({
	el:"#hotwords",
//	mounted: function() {
//        this.$nextTick(function () {
//            this.getWordData();
//        })
//    },
    data: {
    	url:"/central/api/data/route?url=http://www.newsbigbang.com/auton/lsg/interface/getTopicHotWords.do",
    	wordsList:'',
    },
    updated: function(){
    	this.showWords();
    },
	methods: {
		getWordData: function(){
        	this.$set(this,'wordsList', []);
        	this.$http.post(this.url, List.paramTopicId).then(
    			function(resp){
    				var list = JSON.parse(resp.body).RspBodyContent.cloud_word_list;
    				list = list.splice(0,40);
    				this.$set(this,'wordsList', list);
    		})
		},
		showWords: function(){
			words();
		}
	}
})


var Emotion = new Vue({
	el: "#emotion",
//	mounted: function() {
//        this.$nextTick(function () {
//            this.getEmotionData();
//        })
//    },
    data: {
    	url: "/central/api/data/route?url=http://www.newsbigbang.com/auton/lsg/interface/getTopicEmotion.do",
    	emotionData: [],
    },
    updated: function(){
//    	this.getChartOption();
    },
    methods:{
    	getEmotionData: function(){
    		this.$set(this,'emotionData', []);
        	this.$http.post(this.url, List.paramTopicId).then(
    			function(resp){
    				var emotions = JSON.parse(resp.body).RspBodyContent.list;
    				if(emotions.length>=1){
    					var posNum = 0;
        				var negNum = 0;
        				var neuNum = 0;
        				for (var i = 0; i < emotions.length; i++) {
        					posNum += parseInt(emotions[i].pos_num);
        					negNum += parseInt(emotions[i].neg_num);
        					neuNum += parseInt(emotions[i].neu_num);
        				}
    				}
    				var eObj = {};
    				eObj.posNum = posNum;
    				eObj.negNum = negNum;
    				eObj.neuNum = neuNum;
    				this.$set(this,'emotionData', eObj);
    				this.getChartOption();
    		})
    	},
    	getChartOption: function(){
    		var dom = $('.chart-pane')[0];
    		var pieCharts = echarts.init(dom);
    		var fontSize = Utils.getEchartsFontSize(20, 1920);
    		var colorList = [
    							'#cc7c00', '#a53614',"#0087b1"
    						];
    		var option = {
    				animationDurationUpdate: 3000,
    				animationDuration: 3000,
    				tooltip: {
    					trigger: 'item',
    					formatter: "{b}",
    					axisPointer: { // 坐标轴指示器，坐标轴触发有效
    						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    					}
    				},
    				legend: {
    					orient: 'vertical',
    					x: 'left',
    					y: 'center',
    					itemGap: 18,
    					textStyle: {
    						color: '#DEFDFF',
    						fontFamily: "Microsoft Yahei",
    						fontSize: 18
    					},
    					itemWidth: fontSize,
    					itemHeight: fontSize,
    					data:[]
    				},
    				series: [
    					{
    					    type:'pie',
    					    center: ['50%', '48%'],
    					    radius : [20, 100],
    			            label: {
    			                normal: {
    			                	 show: false
    			                }
    			            },
//    			            roseType: 'radius',
    						labelLine: {
    							show: false
    						},
    					    itemStyle: {
    							normal: {
    								color: function(params) {
    									return colorList[params.dataIndex]
    								},
    			                    shadowBlur: 100,
    			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
    							}
    						},
    					    data:[],
    					}
    				]
    			};
    			var legendData = [{
    				name: '正面新闻 ' + this.emotionData.posNum + '个'
    			}, {
    				name: '负面新闻 ' + this.emotionData.negNum + '个'
    			}, {
    				name: '中性新闻 ' + this.emotionData.neuNum + '个'
    			}];
    			var seriesDataPart = [{
    				value: this.emotionData.posNum,
    				name: '正面新闻 ' + this.emotionData.posNum + '个'
    			}, {
    				value: this.emotionData.negNum,
    				name: '负面新闻 ' + this.emotionData.negNum + '个'
    			}, {
    				value: this.emotionData.neuNum,
    				name: '中性新闻 ' + this.emotionData.neuNum + '个'
    			}];
    			option.legend.data = legendData;
    			option.series[0].data = seriesDataPart;
    			
    			pieCharts.setOption(option);
    	},
    }
})

var Analysis = {
//	createNew: function(){
//		var opts_default = {
//				container: $('.wechat-billboard-page'),
//        };
//        var analysis = {};
//        analysis.options = $.extend(true, opts_default, opts);
//        Analysis.loadData(analysis, Analysis.loadDataCallBack);
//        //每隔3分钟，重新查询一次最新数据并显示
//        analysis.intervalQuery = setInterval(function () {
//        	Analysis.loadData(analysis, Analysis.loadDataCallBack);
//        }, 120000);
//        return analysis;
//	},
//	loadData: function(){
//		$.ajax({
//			url : "http://www.newsbigbang.com/auton/lsg/interface/getTopicOpinion.jspx?topicId=14209395357033389864"
//		})
//	},
//	loadDataCallBack: function(){
//		
//	}
}
var words = function(){
	var radius = 150;
	var dtr = Math.PI/180;
	var d=300;

	var mcList = [];
	var active = false;
	var lasta = 1;
	var lastb = 1;
	var distr = true;
	var tspeed = 1.2;
	var size = 250;

	var mouseX = 60;
	var mouseY = 80;

	var howElliptical=1;

	var i=0;
	var oTag=null;
	var oDiv = $('.words-pane');
	var aA=oDiv.find('a');
	for(i=0;i<aA.length;i++){
		oTag={};
		oTag.offsetWidth=aA[i].offsetWidth;
		oTag.offsetHeight=aA[i].offsetHeight;
		mcList.push(oTag);
	}
	sineCosine( 0,0,0 );
	positionAll();
	oDiv.mouseover(function(){
		active=true;
	});
	oDiv.mouseout(function(){
		active=false;
	});
	oDiv.mousemove(function(ev){
		var oEvent=window.event || ev;
		mouseX=oEvent.clientX - (oDiv[0].offsetLeft + oDiv[0].offsetWidth/2);
		mouseY=oEvent.clientY-(oDiv[0].offsetTop + oDiv[0].offsetHeight/2);
//		mouseX = oEvent.clientX- oDiv[0].offsetLeft - document.body.scrollLeft - document.documentElement.scrollLeft,
//		mouseY=oEvent.clientY-(oDiv[0].offsetTop + document.body.scrollTop + document.documentElement.scrollTop);

		// mouseX/=5;
		// mouseY/=5;
	});
	setInterval(update, 30);
	
	function update(){
		var a;
		var b;
		if(active){
			a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
			b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
		}else{
			a = lasta;
			b = lastb;
		}
		lasta=a;
		lastb=b;
		if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01){
			return;
		}
		var c=0;
		sineCosine(a,b,c);
		for(var j=0;j<mcList.length;j++){
			var rx1=mcList[j].cx;
			var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
			var rz1=mcList[j].cy*sa+mcList[j].cz*ca;
			
			var rx2=rx1*cb+rz1*sb;
			var ry2=ry1;
			var rz2=rx1*(-sb)+rz1*cb;
			
			var rx3=rx2*cc+ry2*(-sc);
			var ry3=rx2*sc+ry2*cc;
			var rz3=rz2;
			
			mcList[j].cx=rx3;
			// console.log(mcList[1])
			mcList[j].cy=ry3;
			mcList[j].cz=rz3;
			
			per=d/(d+rz3);
			
			mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
			mcList[j].y=ry3*per;
			mcList[j].scale=per;
			mcList[j].alpha=per;
			
			mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
		}
		doPosition();
		depthSort();
	}
	function depthSort(){
		var i=0;
		var aTmp=[];
		for(i=0;i<aA.length;i++){
			aTmp.push(aA[i]);
		}
		aTmp.sort(function (vItem1, vItem2){
			if(vItem1.cz>vItem2.cz){
				return -1;
			}else if(vItem1.cz<vItem2.cz){
				return 1;
			}else{
				return 0;
			}
		});
		for(i=0;i<aTmp.length;i++){
			aTmp[i].style.zIndex=i;
		}
	}

	function positionAll(){
		var phi=0;
		var theta=0;
		var max=mcList.length;
		var i=0;
		
		var aTmp=[];
		var oFragment=document.createDocumentFragment();
		
		for(i=0;i<aA.length;i++){
			aTmp.push(aA[i]);
		}
		
		aTmp.sort(function (){
			return Math.random()<0.5?1:-1;
		});
		
		for(i=0;i<aTmp.length;i++){
			oFragment.appendChild(aTmp[i]);
		}
		
		oDiv.append(oFragment);
		
		for(var i=1; i < max+1; i++){
			if( distr ){
				phi = Math.acos(-1+(2*i-1)/max);
				theta = Math.sqrt(max*Math.PI)*phi;
			}else{
				phi = Math.random()*(Math.PI);
				theta = Math.random()*(2*Math.PI);
			}
			mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
			mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
			mcList[i-1].cz = radius * Math.cos(phi);
			
			aA[i-1].style.left=mcList[i-1].cx+oDiv[0].offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
			aA[i-1].style.top=mcList[i-1].cy+oDiv[0].offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
			aA[i-1].style.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
		}
	}

	function doPosition(){
		var l=oDiv[0].offsetWidth/2;
		var t=oDiv[0].offsetHeight/2;
		for(var i=0;i<mcList.length;i++){
			aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
			aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
			
			aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+15+'px';
			
			aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
			aA[i].style.opacity=mcList[i].alpha;
		}
	}

	function sineCosine( a, b, c){
		sa = Math.sin(a * dtr);
		ca = Math.cos(a * dtr);
		sb = Math.sin(b * dtr);
		cb = Math.cos(b * dtr);
		sc = Math.sin(c * dtr);
		cc = Math.cos(c * dtr);
	}
}

$(function(){
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	var i = 1;
//	List.getTopicId();
	List.paramTopicId.topicId = window.localStorage.getItem("topicId");
	Top.topic.topicName = window.localStorage.getItem("topicName");
	Top.topic.topicInfo = window.localStorage.getItem("topicInfo");
	List.getList();
    //定时发送请求刷新数据
	setInterval(function(){
		if(List.interval){
			clearInterval(List.interval);
		}
		if(i >= List.resData.length){
			i =0;
		}
//    	List.paramTopicId.topicId = List.topicIds[i];
//		Top.topic.topicName = List.topicData[i].topicName;
//		Top.topic.topicInfo = List.topicData[i].topicInfo;
		List.paramTopicId.topicId = window.localStorage.getItem("topicId");
		Top.topic.topicName = window.localStorage.getItem("topicName");
		Top.topic.topicInfo = window.localStorage.getItem("topicInfo");
    	List.getList();
    	i++;
    },5000);
})