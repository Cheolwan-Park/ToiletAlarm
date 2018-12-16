import * as toiletalarm from './toilet.js';

var isHighmenuMenuOriginHovered = false;

function toggleHighmenuMenuOrigin(onOff) {

    if(onOff) {
        highmenuMenuOriginHover();
    }
    else {
        highmenuMenuOriginDehover();
    }
}

function highmenuMenuOriginHover() {
    var submenuHolderOrigin = document.getElementById("submenu-holder-origin");
    submenuHolderOrigin.classList.replace("hide", "show");
    var highmenuTitleOrigin = document.getElementById("highmenu-title-origin");
    highmenuTitleOrigin.classList.replace("dehover", "hover");
    isHighmenuMenuOriginHovered = true;
}

function highmenuMenuOriginDehover() {
    var submenuHolderOrigin = document.getElementById("submenu-holder-origin");
    submenuHolderOrigin.classList.replace("show", "hide");
    var highmenuTitleOrigin = document.getElementById("highmenu-title-origin");
    highmenuTitleOrigin.classList.replace("hover", "dehover");
    isHighmenuMenuOriginHovered = false;
}





window.addEventListener('DOMContentLoaded', function(){ init(); });


function init() {
    var config = {
        apiKey: "AIzaSyA21oDEZt1A6rJ6Bpov4-vB80ah3rRotYk",
        authDomain: "toiletalarm-e06b4.firebaseapp.com",
        databaseURL: "https://toiletalarm-e06b4.firebaseio.com",
        projectId: "toiletalarm-e06b4",
        storageBucket: "toiletalarm-e06b4.appspot.com",
        messagingSenderId: "965770177483"
    };
    firebase.initializeApp(config);

    toiletalarm.addcallback(changeIndex);
    toiletalarm.load();

    callBack();
}



var building = "0";
var floor = "0";
var gender = "male";

function changeIndex() {
    var url = new URL(window.location.href);
    building = url.searchParams.get("building");
    floor = url.searchParams.get("floor");
    gender = url.searchParams.get("gender");

    var contentTitle = document.getElementById("content-title");
    var titleString = "";
    if(building === "0") {
        titleString += "본관 ";
    }
    else if(building === "1") {
        titleString += "신관 ";
    }   
    else {
        return;
    }
    titleString += floor.toString() + "층 ";
    if(gender === "male") {
        titleString += "남자화장실";
    }
    else if(gender === "female") {
        titleString += "여자화장실";
    }
    else {
        return;
    }
    contentTitle.innerText = titleString;

    var restroom = getRestroom();
    console.log(restroom);
    var elementCount = restroom.toilets.length; //칸 개수
    console.log(elementCount);

    var contentContent = document.getElementById("content-content");

    contentContent.innerHTML="";
    for(var i=0;i<elementCount;i=i+1){
        contentContent.innerHTML += "<div class='content-table-element'><div class='element-title'>" + (i + 1).toString() +
            "</div><div class='element-available'>" + "" + "</div><div class='element-time'>" + "" + "</div></div>";
    }

    // root/0/floors/0/female/1/availble
}

function getRestroom() {
    if(0 === toiletalarm.buildings.length)
        return null;
    if(gender === 'male') {
        return toiletalarm.buildings[parseInt(building)].floors[parseInt(floor)].male;
    } else if (gender === 'female') {
        return toiletalarm.buildings[parseInt(building)].floors[parseInt(floor)].female;
    }
    return null;
}

function callBack() {
    var interval = setInterval(frame, 100);

    function frame() {
        var elements = document.getElementsByClassName("content-table-element");

        var restroom = getRestroom();
        if(null == restroom)
            return;
        var toilet = null;

        for(var i=0;i<elements.length;i = i + 1) {
            toilet = restroom.toilets[i];

            var elementAvailable = elements[i].getElementsByClassName("element-available")[0];
            var isAvailable = toilet.available;//이용 가능한지
            var elementTime = null;
            if (!isAvailable) {
                elementAvailable.innerText = "이용중";

                var inTime = toilet.intime; // 들어간시간
                var inSecond = inTime % 100;
                inTime = Math.floor(inTime / 100);
                var inMinute = inTime % 100;
                var inHour = Math.floor(inTime / 100);

                var time = new Date();
                var nowHour = time.getHours();
                var nowMinute = time.getMinutes();
                var nowSecond = time.getSeconds();

                var timeSpan = (nowHour * 24 * 60 + nowMinute * 60 + nowSecond) - (inHour * 24 * 60 + inMinute * 60 + inSecond);
                var second = timeSpan % 60;
                var minute = Math.floor(timeSpan / 60);

                elementTime = elements[i].getElementsByClassName("element-time")[0];
                elementTime.innerText = minute.pad(2) + ":" + second.pad(2);
            }
            else {
                elementAvailable.innerText = "이용가능";
                elementTime = elements[i].getElementsByClassName("element-time")[0];
                elementTime.innerText = "00:00";
            }

        }

    }
}


Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}