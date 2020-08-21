var hrs, mins, secs;
var testTime, testDay;
var trueChart;
var remainingTime;

$(document).ready(()=>{
   
var language = localStorage.getItem("language");
  if( language=="en" || language=="zh"){
      return  exeCmd();
  }

  var lang = navigator.language;
  lang = lang.toLowerCase();

  if( lang=="zh" || lang=="zh-cn"){
    localStorage.setItem("language", "zh");
  } else {
    localStorage.setItem("language", "en");
  }
  return exeCmd();
});


function exeCmd() {
    var date = new Date();
    var offset = date.getTimezoneOffset();
    console.log(offset);
    var data = timeline.data;
    // var date = new Date();
    // var offset = date.getTimezoneOffset();
    // var minutes = a.getMinutes();
    // date.setMinutes(minutes+offset)

   var language = localStorage.getItem("language");
   if(language=="zh"){
    document.getElementsByTagName("title")[0].innerText ="活动时间表"
   } else {
    document.getElementsByTagName("title")[0].innerText ="EventsTimetable"
   }

   //转换时区
   var newChart = {};
   for(var i = 0; i < data.length; i++){
      var eve = data[i];
      if(!newChart[eve.day + "_" + eve.time]){
         newChart[eve.day + "_" + eve.time] = [];
      }
      newChart[eve.day + "_" + eve.time].push(eve);
   }

    var timeOffset = (offset / 60);//小时 8
    var eventOffset = Math.floor(Math.abs(timeOffset / 4)) * (timeOffset < 0 ? -1 : 1);
    var remain = Math.abs(timeOffset) % 4;
    var currentDay = (date.getDay() - 1 < 0 ? 6 : date.getDay() - 1);
    var currentHour = date.getHours();
    console.log("eventOffset", eventOffset);//-2
    console.log("remain", remain);//0
    console.log("currentDay", currentDay);
    console.log("currentHour", currentHour);
    trueChart = {};
    for (var _day = 0; _day < 7; _day++) {
        for (var _time = 0; _time < 6; _time++) {
            var day = _day;
            var time
            if (eventOffset < 2) {
                time = _time + eventOffset;
            } else {
                time = _time + eventOffset + 1;
            }
            
            if (time >= 6) {
                time -= 6;
                day++;
            } else if (time < 0) {
                time += 6;
                day--;
            }

            if (day < 0) {
                day += 7;
            } else if (day >= 7) {
                day -= 7;
            }
            trueChart[_day + "_" + _time] = newChart[day + "_" + time];
        }
    }
    console.log("trueChart", trueChart);
    // 填充表格
    var timeRow = $('tr[id=time]');
    // timeRow.html(timeRow.html() + '<td>英文</td>');
    var language = localStorage.getItem("language");
    if (language == "zh") {
        timeRow.html(timeRow.html() + '<td data="changelang" style="font-weight:bold;color:red" >EN<br><font color="black">(597-Cat)</td>');
    } else {
        timeRow.html(timeRow.html() + '<td data="changelang" style="font-weight:bold;color:red" >中文<br><font color="black">(597-Cat)</td>');
    }


   for(var i = 0; i < 6; i++){
      var from = (i * 4 + remain + 24) % 24;
      var to = ((i + 1) * 4 + remain) % 24;
      var fromStr = (from < 10 ? '0' : '') + from + ":" + "00";
      var toStr = (to < 10 ? '0' : '') + to + ":" + "00";
      timeRow.html(timeRow.html() + '<td>' + fromStr + '<br>~<br>' + toStr + '</td>');
   }

   var dataChart = $('tbody');

   for(var _day = 0; _day < 7; _day++){
      dataChart.html(dataChart.html() + '<tr id="day' + _day + '"></tr>');
      var dayStr = '';
      var language = localStorage.getItem("language");
      if(language=="zh"){
      switch (_day) {
         case 0:
            dayStr = '星期一';
            break;
         case 1:
            dayStr = '星期二';
            break;
         case 2:
            dayStr = '星期三';
            break;
         case 3:
            dayStr = '星期四';
            break;
         case 4:
            dayStr = '星期五';
            break;
         case 5:
            dayStr = '星期六';
            break;
         case 6:
            dayStr = '星期日';
            break;
      }
      } else{
      switch (_day) {
         case 0:
            dayStr = 'MON';
            break;
         case 1:
            dayStr = 'TUE';
            break;
         case 2:
            dayStr = 'WED';
            break;
         case 3:
            dayStr = 'THU';
            break;
         case 4:
            dayStr = 'FRI';
            break;
         case 5:
            dayStr = 'SAT';
            break;
         case 6:
            dayStr = 'SUN';
            break;
         }
      }
      var curRow = $('tr[id=day' + _day + ']');
      curRow.html(curRow.html() + '<td>' + dayStr + '</td>');
      for(var _time = 0; _time < 6; _time++){
         var eve = trueChart[_day + '_' + _time][0];
         testDay = currentDay;
         var _testTime = currentHour - remain;
         if(_testTime < 0){
            _testTime += 24;
            testDay--;
            if(testDay < 0){
               testDay += 7;
            }
         }

         var eventStr = getEventDisplayName(eve.event);


         if(trueChart[_day + '_' + _time].length > 1){
            var language = localStorage.getItem("language");
            if(language=="zh"){
               eventStr = '<div id="tiger">剑齿虎</div>' + eventStr;
            } else{
               eventStr = '<div id="tiger">Tigers</div>' + eventStr;   
            } 
         }

         testTime = Math.floor(_testTime / 4);
         var isNow = (testDay == _day && testTime == _time);
         var cls = eve.event + (eve.length > 1 ? ' tiger' : '') + (trueChart[_day + '_' + _time].length > 1 ? ' tiger' : '') + (isNow ? ' now' : '');
         curRow.html(curRow.html() + '<td data="eve" class="' + cls + '" id="day' + _day + '_time' + _time + '">' + eventStr + '</td>');
      }
   }




   dataChart.html(dataChart.html() + '<tr id="sum"></tr>');
   var sumRow = $('#sum');
   var language = localStorage.getItem("language");
   if(language=="zh"){
      sumRow.html(sumRow.html() + '<td colspan="3">剩余时间</td>');
   } else{
      sumRow.html(sumRow.html() + '<td colspan="3">Time left</td>');  
   } 
   sumRow.html(sumRow.html() + '<td colspan="4" id="remainingTime">00:00</td>');


   dataChart.html(dataChart.html() + '<tr id="sss"></tr>');
   var copyRow = $('#sss');
   var language = localStorage.getItem("language");
   if(language=="zh"){
      copyRow.html(copyRow.html() + '<td colspan="7" id="copy"><font color="#000000"><strong>老区</strong></font>(<font color="#FF0000">597-Cat</font>)</td>');
   } else{
      copyRow.html(copyRow.html() + '<td colspan="7" id="copy"><font color="#000000"><strong>OldServer</strong></font>(<font color="#FF0000">597-Cat</font>)</td>');   
   } 
   // copyRow.html(copyRow.html() + '<td colspan="3">☚扫码进微信群</td>');


   tick();
   setInterval(tick, 1000);

   $('td[data=eve]').click(onCellClick);
   $('td[id=copy]').click(onCickCopy);
   $('td[data=changelang]').click(onChangeLang);
}


function onCickCopy(){
   var language = localStorage.getItem("language");
   if(language=="zh"){
   swal('老区活动表', '<br><a href="https://tieba.baidu.com/p/5520296574">【183-飞鸟】最详细的走心攻略</a><br><a href="https://cantgis.gitlab.io/ymsd-new">【新区每日活动表】</a><br><a href="https://tieba.baidu.com/p/5782383071">【野蛮时代赛季伙伴天梯图-热度榜】</a><br><img src="img/WechatIMG.jpeg" width="200" height="200" /><br><font color="#FF0000">长按图片-识别二维码感谢支持!</font>');
   } else{
   swal('Releases', 'Author:597-Cat<br>Daily Events Timetable.<br><a href="https://www.facebook.com/groups/BrutalAge">Brutal Age Events&Partner Discussion Groups</a><br><a href="https://cantgis.gitlab.io/ymsd-new">【New Server Daily Events Timetable】</a><br><a href="https://www.facebook.com/BrutalAgeEvents">【Partner Ladder Diagram - Strength List】</a><br>Add WeChat Enter The Partner Group<br><img src="img/PayPal.jpeg" width="200" height="250" /><br>Contact Wechat：Cantgis'); 
   } 

};

function onChangeLang(){

  var language = localStorage.getItem("language");
  if(language=="zh"){
    localStorage.setItem("language", "en");
  } else {
    localStorage.setItem("language", "zh");
  }
  
  window.location.reload();

}

function onCellClick(){
   //$(this).removeClass('now');
   var cId = $(this).attr('id');
   var re = /day(\d+)_time(\d+)/g;
   var r = "";
   var cDay = 0;
   var cTime = 0;
   var tDay = testDay;
   var tTime = testTime;
   if(r = re.exec(cId)) {
      cDay = r[1];
      cTime = r[2];
   }
   var startCDay = cDay;
   var endCDay = cDay;
   var startCTime = cTime;
   var endCTime = cTime;
   var startCDayTest = cDay;
   var startCTimeTest = cTime;
   var endCDayTest = cDay;
   var endCTimeTest = cTime;
   var prevStream = 0;
   var nextStream = 0;
   var curEvent = trueChart[cDay + '_' + cTime][0].event;
   do{
      startCTimeTest--;
      if(startCTimeTest < 0){
         startCTimeTest = 5;
         startCDayTest--;
         if(startCDayTest < 0){
            startCDayTest = 6;
         }
      }
      var testEvent = trueChart[startCDayTest + '_' + startCTimeTest][0].event;
      if(curEvent == testEvent){
         prevStream++;
         startCTime = startCTimeTest;
         startCDay = startCDayTest;
      }
   }while(curEvent == testEvent);

   do{
      endCTimeTest++;
      if(endCTimeTest > 5){
         endCTimeTest = 0;
         endCDayTest++;
         if(endCDayTest > 6){
            endCDayTest = 0;
         }
      }
      var testEvent = trueChart[endCDayTest + '_' + endCTimeTest][0].event;
      if(curEvent == testEvent){
         nextStream++;
         endCTime = endCTimeTest;
         endCDay = endCDayTest;
      }
   }while(curEvent == testEvent);

   if(!(startCDay == testDay && startCTime == testTime)){
      var count = 0;
      do{
         count++;
         tTime++;
         if(tTime > 5){
            tTime = 0;
            tDay++;
            if(tDay > 6){
               tDay = 0;
            }
         }
         if(count > 100) break;

      }while(tDay != startCDay || tTime != startCTime);

      var remainTime = (count - 1) * (3600 * 4) + remainingTime;
      var endRemainingTime = remainTime + (3600 * 4) * (prevStream + nextStream + 1);
      var d = Math.floor(remainTime / (60*60*24));
      var h = Math.floor((remainTime % (60*60*24)) / 3600);
      var m = Math.floor((remainTime % (60*60)) / 60);
      var s = remainingTime % 60;
      var dd = Math.floor(endRemainingTime / (60*60*24));
      var hh = Math.floor((endRemainingTime % (60*60*24)) / 3600);
      var mm = Math.floor((endRemainingTime % (60*60)) / 60);
      var ss = endRemainingTime % 60;

      var language = localStorage.getItem("language");
      if(language=="zh"){
      swal(getEventFullName(trueChart[cDay + '_' + cTime][0].event),
      '<span style="color:#699; font-weight: bold;">' + (remainTime > (60*60*24) ? d + '天' : '') + (remainTime > (60*60) ? h + '小时' : '') + (remainTime > 60 ? m + '分' : '') + s + '秒</span> 后开始。<br>' +
      '<span style="color:#699; font-weight: bold;">' + (endRemainingTime > (60*60*24) ? dd + '天' : '') + (endRemainingTime > (60*60) ? hh + '小时' : '') + (endRemainingTime > 60 ? mm + '分' : '') + ss + '秒</span> 后结束。\n',
      'info');
      } else{
      swal(getEventFullName(trueChart[cDay + '_' + cTime][0].event),
      '<span style="color:#699; font-weight: bold;">' + (remainTime > (60*60*24) ? d + 'days' : '') + (remainTime > (60*60) ? h + 'hours' : '') + (remainTime > 60 ? m + 'mins' : '') + s + 'secs</span> later start.<br>' +
      '<span style="color:#699; font-weight: bold;">' + (endRemainingTime > (60*60*24) ? dd + 'days' : '') + (endRemainingTime > (60*60) ? hh + 'hours' : '') + (endRemainingTime > 60 ? mm + 'mins' : '') + ss + 'secs</span> later finish.\n',
      'info'); 
      } 

   }

}

var tick = ()=>{
   var date = new Date();
   var offset = date.getTimezoneOffset();
   var timeOffset = (offset / 60);
   var eventOffset = Math.floor(Math.abs(timeOffset / 4)) * (timeOffset < 0 ? -1 : 1);
   var remain = Math.abs(timeOffset) % 4;
   var currentDay = (date.getDay() - 1 < 0 ? 6 : date.getDay() - 1);
   var currentHour = date.getHours();
   var currentMinutes = date.getMinutes();
   var currentSeconds = date.getSeconds();
   var stream = 0;

   if(trueChart[testDay + '_' + testTime] && trueChart[testDay + '_' + testTime][0]){
      var curEvent = trueChart[testDay + '_' + testTime][0].event;
      var ptDay = testDay;
      var ptTime = testTime;
      var nextEvent = '';
      do{
         ptTime++;
         if(ptTime >= 6){
            ptTime = 0;
            ptDay++;
            if(ptDay >= 7){
               ptDay = 0;
            }
         }
         nextEvent = trueChart[ptDay + '_' + ptTime][0].event;
         if(curEvent == nextEvent){
            stream++;
         }
      }while(curEvent == nextEvent);
   }


   remainingTime = (3 - ((currentHour - remain) % 4)) * 60 * 60 + (59 - currentMinutes) * 60 + (60 - currentSeconds);
   var displayRemainingTime = (stream * 60 * 60 * 4) + remainingTime;

   if(remainingTime < 0){
      location.reload();
   }

   hrs = Math.floor(displayRemainingTime / (60*60));
   mins = Math.floor((displayRemainingTime % (60*60)) / 60);
   secs = displayRemainingTime % 60;
   $('#remainingTime').html((hrs < 10 ? '0' : '') + hrs + ':' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs);
};

var getEventDisplayName = function(eve){
   var eventStr = 'N/A';
   
   var language = localStorage.getItem("language");
   
   
   if(language=="zh"){
   
    switch (eve) {
       case 'wish':
          eventStr = '许愿';
          break;
       case 'recruit':
          eventStr = '招募';
          break;
       case 'power':
          eventStr = '实力';
          break;
       case 'research':
          eventStr = '研究';
          break;
       case 'build':
          eventStr = '建造';
          break;
       case 'brutal':
          eventStr = '原始<br><font color="red">藏兵';
          break;
       case 'clean':
          eventStr = '扫除';
          break;
       case 'wolf':
          eventStr = '杀狼';
          break;
       case 'rune':
          eventStr = '符文';
          break;
    } 
  }else {
  
      switch (eve) {
         case 'wish':
            eventStr = 'Wish';
            break;
         case 'recruit':
            eventStr = 'Train';
            break;
         case 'power':
            eventStr = 'Power';
            break;
         case 'research':
            eventStr = 'Res';
            break;
         case 'build':
            eventStr = 'Build';
            break;
         case 'brutal':
            eventStr = 'Barb<br><font color="red">Shield';
            break;
         case 'clean':
            eventStr = 'Clean';
            break;
         case 'wolf':
            eventStr = 'Wolves';
            break;
         case 'rune':
            eventStr = 'Runes';
            break;
  
  }

}
   
   
   return eventStr;
}

var getEventFullName = function(eve){
   var eventStr = 'N/A';
   
   var language = localStorage.getItem("language");
   
   if(language=="zh"){
    switch (eve) {
      case 'wish':
         eventStr = '许愿树';
         break;
      case 'recruit':
         eventStr = '极速招募';
         break;
      case 'power':
         eventStr = '实力提升';
         break;
      case 'research':
         eventStr = '研究大师';
         break;
      case 'build':
         eventStr = '全速建造';
         break;
      case 'brutal':
         eventStr = '原始人战争<br><font color="red">开启保护罩';
         break;
      case 'clean':
         eventStr = '大扫除';
         break;
      case 'wolf':
         eventStr = '部落杀狼';
         break;
      case 'rune':
         eventStr = '符文低语';
         break;
      }
   } else {
   
    switch (eve) {
      case 'wish':
         eventStr = 'WISH TREE';
         break;
      case 'recruit':
         eventStr = 'FAST TRAINING';
         break;
      case 'power':
         eventStr = 'POWER UP';
         break;
      case 'research':
         eventStr = 'RESEARCH MASTER';
         break;
      case 'build':
         eventStr = 'FULLSPEED BUILD';
         break;
      case 'brutal':
         eventStr = 'BARBARIAN WAR<br><font color="red">Open Shield';
         break;
      case 'clean':
         eventStr = 'RESOURCE CLEAN UP';
         break;
      case 'wolf':
         eventStr = 'HORDE WOLVES GATHERING';
         break;
      case 'rune':
         eventStr = 'WHISPERING OF RUNES';
         break;
      }
   
   }
   return eventStr;
}
