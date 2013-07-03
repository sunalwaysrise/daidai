/*
author: luwenbin@live.com
*/
var l={
  getArgs:function(argName){
    if(!argName){return}
    var args = {},query = location.search.substring(1),pairs = query.split("&"); 
    for(var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=');
      if (pos == -1) continue;
      var argname = pairs[i].substring(0,pos),value = pairs[i].substring(pos+1);
      value = decodeURIComponent(value);
      if(argName==argname){return value;}
    }
  },
  setPosition:function(_obj){
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    var viewHeight = $(window).height(), viewWidth = $(window).width(), _objHeight = _obj.height(), _objWidth = _obj.width();
    var dialogTop = (viewHeight / 2) - (_objHeight / 2) + t;
    var dialogLeft = (viewWidth / 2) - (_objWidth / 2);
    _obj.css({top : dialogTop,left : dialogLeft});
  },
  throttle:function(fn, delay, mustRunDelay){
    var timer = null;
    var t_start;
    return function(){
      var context = this, args = arguments, t_curr = +new Date();
      clearTimeout(timer);
      if(!t_start){
        t_start = t_curr;
      }
      if(t_curr - t_start >= mustRunDelay){
        fn.apply(context, args);
        t_start = t_curr;
      }else {
        timer = setTimeout(function(){
          fn.apply(context, args);
        }, delay);
      }
    }
  },
  tabs:function(config){
    var lTabNav=config.nav,lContent=config.content,lActive=config.active;
    var T=$("#"+lTabNav),C=$("#"+lContent);
    T.children("li").eq(0).addClass(lActive);
    C.children("li").eq(0).show();
    T.children("li").click(function(){
      var _this=$(this),_index=_this.index();
      T.children("li").removeClass(lActive);
      _this.addClass(lActive);
      C.children("li").hide();
      C.children("li").eq(_index).show();
    });
  },
  ajax:{},
  jsonPage:{},
  dialog:{},
  client:function(){
    var engine = {ie : 0,gecko : 0,webkit : 0,khtml : 0,opera : 0,ver : null},
    browser = {ie : 0,firefox : 0,safari : 0,konq : 0,opera : 0,chrome : 0,ver : null},
    system = {win : false,mac : false,x11 : false,iphone : false,ipod : false,ipad : false,ios : false,android : false,nokiaN : false,winMobile : false,wii : false,ps : false};
    var ua = navigator.userAgent;
    if(window.opera) {
      engine.ver = browser.ver = window.opera.version();
      engine.opera = browser.opera = parseFloat(engine.ver);
    } else if(/AppleWebKit\/(\S+)/.test(ua)) {
      engine.ver = RegExp["$1"];
      engine.webkit = parseFloat(engine.ver);
      if(/Chrome\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"];
        browser.chrome = parseFloat(browser.ver);
      } else if(/Version\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"];
        browser.safari = parseFloat(browser.ver);
      } else {
        var safariVersion = 1;
        if(engine.webkit < 100) {
          safariVersion = 1;
        } else if(engine.webkit < 312) {
          safariVersion = 1.2;
        } else if(engine.webkit < 412) {
          safariVersion = 1.3;
        } else {
          safariVersion = 2;
        }
        browser.safari = browser.ver = safariVersion;
      }
    } else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
      engine.ver = browser.ver = RegExp["$1"];
      engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
      engine.ver = RegExp["$1"];
      engine.gecko = parseFloat(engine.ver);
      if(/Firefox\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"];
        browser.firefox = parseFloat(browser.ver);
      }
    } else if(/MSIE ([^;]+)/.test(ua)) {
      engine.ver = browser.ver = RegExp["$1"];
      engine.ie = browser.ie = parseFloat(engine.ver);
    }
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    if(system.win) {
      if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if(RegExp["$1"] == "NT") {
          switch(RegExp["$2"]) {
            case "5.0":
              system.win = "2000";
              break;
            case "5.1":
              system.win = "XP";
              break;
            case "6.0":
              system.win = "Vista";
              break;
            case "6.1":
              system.win = "7";
              break;
            default:
              system.win = "NT";
              break;
          }
        } else if(RegExp["$1"] == "9x") {
          system.win = "ME";
        } else {
          system.win = RegExp["$1"];
        }
      }
    }
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    if(system.win == "CE") {
      system.winMobile = system.win;
    } else if(system.win == "Ph") {
      if(/Windows Phone OS (\d+.\d+)/.test(ua)) {;
        system.win = "Phone";
        system.winMobile = parseFloat(RegExp["$1"]);
      }
    }
    if(system.mac && ua.indexOf("Mobile") > -1) {
      if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
        system.ios = parseFloat(RegExp.$1.replace("_", "."));
      } else {
        system.ios = 2;
      }
    }
    if(/Android (\d+\.\d+)/.test(ua)) {
      system.android = parseFloat(RegExp.$1);
    }
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    return {
      engine : engine,
      browser : browser,
      system : system
    };
  },
  getLocation:function(event){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        l.ajax.get({
          url:"/m/method/regeocoding.php",
          data:{lat:lat,lon:lon,type:'010'},
          success:function(data){
            var data=eval("("+data+")");
            if(data&&data.addrList&&data.addrList[0].status===1){
              var admName=data.addrList[0].admName,sheng,shi=data.addrList[0].name;
              admName=admName.split(",");
              sheng=admName[0];
              shi=admName[1];
              if(typeof(event)=="function"){
                event({statu:"success",sheng:sheng,shi:shi});
              }
            }
          }
        })
      },function(error){
        if(typeof(event)=="function"){
          event({statu:"fail",error:'无法获得位置'});
        }
      });
    }else{
      if(typeof(event)=="function"){
        event({statu:"fail",error:'不支持定位'});
      }
    }
  },
  cookie:{
    get : function(name){
      if(document.cookie==null){return;}
      var tmpDate=document.cookie,tmpStart=tmpDate.indexOf(name+"=");
      if(tmpStart==-1){return null;}
      tmpStart+=name.length+1;
      var tmpEnd=tmpDate.indexOf(";",tmpStart);
      if(tmpEnd==-1){return decodeURI(tmpDate.substring(tmpStart))};
      return decodeURI(tmpDate.substring(tmpStart,tmpEnd));
    },
    set : function(name,value,expires,path,domain,secure){
      if(document.cookie==null){return;}
      var tmpCookie=name+"="+encodeURI(value);
      if(expires){
        var exp = new Date();
        exp.setTime(exp.getTime() + expires*24*60*60*1000);
        tmpCookie+=";expires="+exp.toGMTString();
      }
      if(path){tmpCookie+=";path="+path;}
      if(domain){tmpCookie+=";domain="+domain;}
      if(secure){tmpCookie+=";secure="+secure;}
      document.cookie=tmpCookie;
    },
    remove : function(name,path,domain){
      if(document.cookie==null){return;}
      var tmpCookie=name+"=null;expires="+new Date(new Date().getTime()-1000000000000).toGMTString();
      if(path!=null){tmpCookie+=";path="+path;}
      if(domain!=null){tmpCookie+=";domain="+domain;}
      document.cookie=tmpCookie;
    },
    clear : function(path,domain){
      if(document.cookie==null){return;}
      var tmpCookie=document.cookie.split(";"),tmpName;
      for(var i=0;i<tmpCookie.length;i++){
        tmpName=tmpCookie[i].split("=")[0].strip();
        Cookie.remove(tmpName,path,domain);
      }
    }
  }
}
l.ajax={
  basic:function(config){
    var xhr=window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    var url=config.url,method=config.method,data=config.data,anysc=config.anysc,before=config.before,success=config.success,error=config.error,tmpdata,tempdate2=[];
    if(!url){return false;}
    anysc!=false ? anysc=true:anysc=false;
    if(typeof(data)=="string" || typeof(data)=="number"){
      tmpdata=data;
    }
    if(typeof(data)=="object"){
      for (i in data){
        tempdate2.push(i+"="+data[i]);
      }
      tmpdata=tempdate2.join("&");
    }
    if(typeof(data)=="undefined"){
      tmpdata="null";
    }
    method=method.toUpperCase();
    if(method!="GET"){
      xhr.open("POST",url,anysc);
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xhr.send(tmpdata);
    }else{
      xhr.open("GET",url+"?"+tmpdata+"&noCache="+new Date().getTime(),anysc);
      xhr.send();
    }
    xhr.onreadystatechange=function(){
      if(xhr.readyState==0 || xhr.readyState==1){
        //准备中；
      }else if(xhr.readyState==2){
        if(typeof(before)=="function"){
          before();
        }
      }else if(xhr.readyState==4){
        if(xhr.status==200){
          if(typeof(success)=="function"){
            success(xhr.responseText);
            delete xhr;
            xhr = null;
          }
        }else if(xhr.status==404){
          if(typeof(error)=="function"){
            error();
          }
        }
      }
    }
  },
  get:function(_config){
    var config={};
    if(!_config.url){return false;}
    config.url=_config.url;
    config.method="get";
    config.anysc=true;
    if(_config.data){config.data=_config.data;}
    if(_config.before){config.before=_config.before;}
    if(_config.success){config.success=_config.success;}
    if(_config.error){config.error=_config.error;}
    l.ajax.basic(config);
  },
  post:function(_config){
    var config={};
    if(!_config.url){return false;}
    config.url=_config.url;
    config.method="post";
    config.anysc=true;
    if(_config.data){config.data=_config.data;}
    if(_config.before){config.before=_config.before;}
    if(_config.success){config.success=_config.success;}
    if(_config.error){config.error=_config.error;}
    l.ajax.basic(config);
  }
}
//实例 l.ajax.get({url:"url",data:"data",before:"before",success:"success",error:"error"});
//实例 l.ajax.baisc({url:"url",data:"data",method:"post",anysc:false,before:"before",success:"success",error:"error"});
l.jsonPage={
  _data:"",
  _nav:"",
  _content:"",
  _length:"",
  _perPageLength:"",
  index:function(data,perPageLength,nav,content){
    this._perPageLength=perPageLength;
    this._data=data;
    this._length=data.length;
    this._nav=$(nav);
    this._content=$(content);
    this.setPage();
    if(this._perPageLength>=this._length){
      this.setContent(0,this._length);
    }else{
      this.setContent(0,this._perPageLength);
    }
  },
  setPage:function(){
    if(!this._length){return }
    if(this._length>=this._perPageLength){
      var max=Math.ceil(this._length / this._perPageLength),tmp=[],next;
      max>2 ? next=this._perPageLength*2 : next=this._length;
      //tmp.push("<a data_beginRow='"+ 0 +"' data_endRow='"+ this._perPageLength +"'></a>");
      for(var i=0;i<max;i++){
        var beginRow = i * this._perPageLength,endRow = Number(beginRow) + Number(this._perPageLength);
        if (endRow > this._length) {endRow = this._length;}
        if(i==0){
          tmp.push("<a data_beginRow='" + beginRow + "' data_endRow='" + endRow + "' class='NavOn'>"+(i+1)+"</a>");
        }else{
          tmp.push("<a data_beginRow='" + beginRow + "' data_endRow='" + endRow + "'>"+(i+1)+"</a>");
        }
      }
      //tmp.push("<a data_beginRow='"+ this._perPageLength +"' data_endRow='"+ next +"'></a>");
      this._nav.html("");
      this._nav.html(tmp.join(""));
    }else{
      this._nav.html("<a class='NavOn'>1</a>");
    }
  },
  setContent:function(beginRow,endRow){
    if(!this._data){return}
    var tmp=[];
    this._content.html("");
    for (beginRow; beginRow < endRow; beginRow++){
      tmp.push('<li>' + this._data[beginRow].content +'</li>');
    }
    this._content.html(tmp.join(""));
  },
  selected:function(o){
    var beginRow=o.attr("data_beginRow"),endRow=o.attr("data_endRow"),prev,prev2,next;
    beginRow>this._perPageLength ? prev=beginRow-this._perPageLength : prev=0;
    this._length>endRow ? prev2=endRow : prev2=beginRow ;
    next=endRow+this._perPageLength;
    if(next>this._length){next=this._length;}
    o.siblings().removeClass("NavOn");o.addClass("NavOn");
    this._nav.eq(0).attr({"data_beginRow":prev,"data_endRow":beginRow});
    this._nav.last().attr({"data_beginRow":prev2,"data_endRow":next});
    this.setContent(beginRow,endRow);
  }
};
/*
l.jsonPage.index(data,"10","#nav","#content");
$("#nav").live("click",function(){var o=$(this);l.jsonPage.selected(o);});
*/
l.dialog={
  locker:false,
  creater:function(){
    if($("#lDialogBox").length==0){
      $("body").append('<div id="lDialogBox"><div class="lDialogBoxTitle"><div id="lDialogBoxTitle"></div><div id="lDialogClose"></div></div><div id="lDialogBoxContent"></div><div id="lDialogBoxBtn"></div></div>');
    }
    $("#lDialogBox").css({
      "position":"absolute"
      ,"zIndex":"1000"
      //,"width":""
      //,"height":""
    }).show();
    l.setPosition($("#lDialogBox"));
  },
  alert:function(config){
    this.creater();
    var title=config.title,content=config.content,btn=config.btn,event=config.event;
    if(!title){title="error";}
    if(!content){content="error";}
    if(!btn){btn="确定";}
    $("#lDialogBoxTitle").html(title);
    $("#lDialogBoxContent").html(content);
    $("#lDialogBoxBtn").html('<a id="lDialogTrue">'+btn+'</a>');
    if(config.lock=="lock"){
      this.locker=true;
      this.lock();
      $(window).resize(function(){
        if(l.dialog.locker){
          l.throttle(l.dialog.lock(), 50, 100);
          l.throttle(l.setPosition($("#lDialogBox")), 50, 100);
        }
      });
    }
    this.selected(event);
  },
  confirm:function(config){
    this.creater();
    var title=config.title,content=config.content,btn1=config.btn1,btn2=config.btn2,event=config.event,event2=config.event2;
    if(!title){title="error";}
    if(!content){content="error";}
    if(!btn1){btn1="确定";}
    if(!btn2){btn2="取消";}
    $("#lDialogBoxTitle").html(title);
    $("#lDialogBoxContent").html(content);
    $("#lDialogBoxBtn").html('<a id="lDialogTrue">'+btn1+'</a><a id="lDialogFalse">'+btn2+'</a>');
    if(config.lock=="lock"){
      this.locker=true;
      this.lock();
      $(window).resize(function(){
        if(l.dialog.locker){
          l.throttle(l.dialog.lock(), 50, 100);
          l.throttle(l.setPosition(), 50, 100);
        }
      });
    }
    this.selected(event,event2);
  },
  selected:function(o,o2){
    $("#lDialogTrue").click(function(){
      if(typeof(o)=="function"){
        o();
      }
      l.dialog.close();
    });
    $("#lDialogFalse").click(function(){
      if(typeof(o2)=="function"){
        o2();
      }
      l.dialog.close();
    });
    $("#lDialogClose").click(function(){
      l.dialog.close();
    });
  },
  close:function(){
    this.locker=false;
    $("#lDialogBox,#lDialogLock").hide();
    $("#lDialogBoxTitle,#lDialogBoxContent,#lDialogBoxBtn").html("");
  },
  lock:function(){
    if($("#lDialogLock").length==0){
      $("body").append('<div id="lDialogLock"></div>');
    }
    var lockWidth=$(window).width(),lockHeight=$(document).height();
    $("#lDialogLock").css({
      "width":lockWidth,
      "height":lockHeight,
      "position":"absolute",
      "zIndex":"999",
      "top":0,
      "left":0,
      "background":"#ddd",
      "opacity":"0.8",
      "filter":"Alpha(opacity=30)"
    }).fadeIn();
  }
};
//l.dialog.confirm({title:"title",content:"content",lock:"lock",btn1:"OK",btn2:"CANCEL",event:fn});
l.event = {
    live:function(element, type, fn){
        this.add(document.body,type, fn);
    },
    add: function(element, type, fn){
        if (element.addEventListener){
            element.addEventListener(type, fn, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, fn);
        } else {
            element["on" + type] = fn;
        }
    },
    del: function(element, type, fn){
        if (element.removeEventListener){
            element.removeEventListener(type, fn, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, fn);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    thisElement: function(event){
        this.getEvent(event);
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        this.getEvent(event);
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        this.getEvent(event);
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
//瀑布流
l.fall={
    load:function(op){
        var content=$("#"+op.content)
        ,box=content.children("li")
        ,len=box.length
        ,_width=op.width?op.width:"230"
        ,_margin=op.margin?op.margin:"10";
        content.css({"position":"relative"});
        var n=n?n:3
            ,minPerLine=Math.floor((document.documentElement.clientWidth+_margin)/(_width+_margin))//当前一行显示的数量。
            ,perLines
            ,minHeight=box.eq(0).offsetHeight;
        minPerLine>n?perLines=minPerLine:perLines=n;//perLines 为最终一行显示的数量。
        box.css({"position":"absolute","width":_width});
        var _lie=Math.ceil(len/perLines),lie=[];
        for(var i=0;i<_lie;i++){
           var arr=[];
            for(var j=0;j<len;j++){
                if( j>=perLines*i && j<perLines*(i+1) ){
                    arr.push(box.eq(j));
                }
            }
            lie[i]=arr;
        }
        var HeightList=[],x=0,xlen=lie.length;
        for(x;x<xlen;x++){
            var y=0,ylen=lie[x].length;
            if(x==0){
                for(y;y<ylen;y++){
                    var _left=(Number(_width)+Number(_margin))*y;
                    lie[x][y].css({"top":"0","left":_left});
                    HeightList.push(lie[x][y].height());
                }
            }else{
                for(y;y<ylen;y++){
                    var _left=(Number(_width)+Number(_margin))*y,top,HL=HeightList.length;
                    lie[x][y].css({"top":HeightList[HL-perLines]+Number(_margin),"left":_left});
                    HeightList.push(lie[x][y].height()+HeightList[HL-perLines]+Number(_margin));
                }
            }
        }
    }
};
//懒加载
l.lazyLoad={
  objs:[],
  load:function(name,n){
  var List=$("."+name),i=0,len=List.length;
    this.objs=[];
    for(i;i<len;i++){
      if(!List.eq(i).attr("src")){
        this.objs.push(List.eq(i));
      }
    }
    var _objsLength=this.objs.length,_i=0;
    if(_objsLength==0){return false}
    var wHeight=$(window).height(),sHeight=$(document).scrollTop();
    for(_i;_i<_objsLength;_i++){
      var eTop=this.objs[_i].offset().top;
      if(eTop<(wHeight+sHeight)+n){
          this.objs[_i].attr({"src":this.objs[_i].attr("data_src")});
      }
    }
    $(window).scroll(function(){l.throttle(l.lazyLoad.load(name,10), 50, 1000);});
  }
};
//以下是对原生对象的基本扩展
String.prototype.empty=function(){
  return this ==null || this=="" || this.length==0;
}
String.prototype.encode=function(){
  return encodeURIComponent(this);
}
String.prototype.decode=function(){
  return decodeURIComponent(this);
}
String.prototype.trim=function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.replaceAll=function(rgExp, replaceText){
  var tmpStr = this;
  while (tmpStr.indexOf(rgExp) != -1){
    tmpStr = tmpStr.replace(rgExp, replaceText);
  }
  return tmpStr;
}
String.prototype.repChinese=function(){
  var _tmp = this,ChineseNumber=['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'],i=0;
  for(i;i<10;i++){
    if(ChineseNumber[i]==_tmp){
      _tmp = _tmp.replaceAll(ChineseNumber[i], i);
      //break;
    }
  }
  return _tmp;
}
String.prototype.isEmail=function(){
  var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return myreg.test(this);
}
String.prototype.isNumber=function(){
  return /^[0-9]+$/.test(this);
}
String.prototype.hasChinese=function() {
  return escape(this).indexOf("%u") != -1;
}
String.prototype.isIDCard=function() {
  return /^(\d{15}|\d{18}|\d{17}(X|x))$/.test(this);
}
String.prototype.isID=function(){
  var errors=['0', '身份证号码位数不对!', '身份证号码出生日期超出范围或含有非法字符!', '身份证号码校验错误!', '身份证地区非法!'];
  var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
  var idcard=this,Y,JYM,S,M; 
  var idcard_array=idcard.split(''); 
  //地区检验
  if(!area[parseInt(idcard.substr(0,2))]) return errors[4];
  //身份号码位数及格式检验
  switch(idcard.length)
  {
    case 15: 
      var ereg;
       if ((parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )) 
        ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;  
        else
        ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;  
      if(ereg.test(idcard))
        return errors[0];
      else 
        return errors[2];
      break;
    case 18:
      if(parseInt(idcard.substr(6,4))%4==0||(parseInt(idcard.substr(6,4))%100==0&&parseInt(idcard.substr(6,4))%4==0))
        ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合
      else
        ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
      if(ereg.test(idcard))
      {
        S=(parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
        + parseInt(idcard_array[7]) * 1
        + parseInt(idcard_array[8]) * 6
        + parseInt(idcard_array[9]) * 3; 
        Y = S % 11; 
        M = "F"; 
        JYM = "10X98765432"; 
        M = JYM.substr(Y,1);//判断校验位 
        if(M == idcard_array[17])
          return errors[0]; //检测ID的校验位 
        else 
          return errors[3];
      }
      else 
        return errors[2]; 
      break; 
    default: 
      return errors[1]; 
  }
}
Array.prototype.inArray=function(o){
  var i=0,len=this.length,tf=false;
  for(i;i<len;i++){
    if(this[i]==o){
      tf = true;
      break;
    }
  }
  return tf;
}
Array.prototype.max=function(){
  var max,i=0,len=this.length;
  for(i;i<len;i++){
     max = i==0?Number(this[i]):(Number(this[i])>max?Number(this[i]):max);
  }
  return max;
}
Array.prototype.min=function(){
  var min,i=0,len=this.length;
  for(i;i<len;i++){
     min = i==0?Number(this[i]):(Number(this[i])<min?Number(this[i]):min);
  }
  return min;
}
Array.prototype.clone=function(){
  var a=[],i=0;len=this.length;
  for(i;i<len;i++){
    a[i] = this[i];
  };
  return a;
}
Array.prototype.delRepeat=function(){
  var str = [],i=0,len=this.length;
  for(i;i < len;i++){
    ! RegExp(this[i],"g").test(str.join(",")) && (str.push(this[i]));
  }
  return str;
}
Array.prototype.random=function() {
  var tmpArr=[],num=this.length,arr=[],x = 0, y=0, z = 0;
  for (x ; x < num; x++) {
    tmpArr[x] = x;
  }
  for (y ; y < num; y++) {
    var iRand = parseInt(num * Math.random()), temp = tmpArr[y];
    tmpArr[y] = tmpArr[iRand];
    tmpArr[iRand] = temp;
  }
  for(z;z<num;z++){
    arr.push(this[tmpArr[z]]);
  }
  return arr;
}

 