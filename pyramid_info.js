// ==UserScript==
// @name        Уведомления на пирамиду
// @domain      https://pernatsk.ru/*
// @namespace   https://pernatsk.ru/*
// @include     https://pernatsk.ru/*
// @match       https://pernatsk.ru/*
// @grant       none
// ==/UserScript==

// алиас относительного пути
var addr = location.pathname;

function get_pyramid_info(){
  if (addr.indexOf('/pyramid/cabinet')<0) return false;

  var element = document.getElementsByClassName("i41-pyramid")[0];
  if (element==undefined) {
    $('.balance').after('<div class="cabinet-item"><b>qPernatsk:</b> для уведомлений о датах разморозки вкладов включите вкладку пирамиды</div>');
  }
  
  //поиск вкладов, которые можно закрыть
  var element = document.getElementsByClassName("butt-close")[0];
  if(element==undefined) {
    localStorage.removeItem("qpernatsk.PyramidReady");
  } else {
    localStorage["qpernatsk.PyramidReady"]="OK";
  }

  //поиск замороженных вкладов
  var tmp = document.getElementsByClassName("cabinet-froze");
  var min_date=undefined;
  for (i = 0; i < tmp.length; i++)
  {
    //конвертация строки с инфой про разморозку вклада в формат времени, для удобства сравнения
    var t = $(tmp[i]).html();
    if (t.indexOf('заморожен')>0) {
      t = t.slice(t.indexOf('Дата разморозки'));
      t = t.substr(t.indexOf('>')+1,16);
      t = t.slice(9,11)+'/'+t.slice(6,8)+'/'+t.slice(12,16)+' '+t.slice(0,5);
      var d = new Date(t);
      //поиск ближайшего времени
      if (min_date==undefined) {
        min_date=d;
      } else {
        if (d<min_date) {
          min_date=d;
        }
      }
    }
  }
  //обновление инфы о замороженном вкладе в хранилище
  if (min_date==undefined) {
    localStorage.removeItem("qpernatsk.PyramidNext");
  } else {
    localStorage["qpernatsk.PyramidNext"]=min_date;
  }
}

function view_pyramid_info(){
  var element = document.getElementsByClassName("i41-pyramid")[0];
  if(element!=undefined){ //проверка на наличие вкладки с пирамидой, куда можно дописать инфу
    pyramid_ready = false;
    if (localStorage["qpernatsk.PyramidNext"]!=undefined) {
      //в хранилище есть инфа про замороженный вклад, надо проверить, не разморозился ли очередной
      var next_pyramid=new Date(localStorage["qpernatsk.PyramidNext"]);
      if ((next_pyramid.getTime())/1000<=current_time) {
        pyramid_ready = true;
      }
      //перевод в вид "05:38 09" чтоб помещалось на вкладке
      tmp = next_pyramid.getHours();
      if (tmp>9) {
        text_block = tmp+':';
      } else {
        text_block = '0'+tmp+':';
      }
      tmp = next_pyramid.getMinutes();
      if (tmp>9) {
        text_block = text_block+tmp+' ';
      } else {
        text_block = text_block+'0'+tmp+' ';
      }
      tmp = next_pyramid.getDate();
      if (tmp>9) {
        text_block = text_block+tmp;
      } else {
        text_block = text_block+'0'+tmp;
      }
      test_block = '<div class="mini-content-timer">'+text_block+'</div>';
      $('.i41-pyramid').after(test_block);
    }

    //если что-то из пирамиды уже можно вывести, раскрасить флажок в зеленый
    if (pyramid_ready || (localStorage["qpernatsk.PyramidReady"]=="OK")) {
      $('.i41-pyramid').parent().html($('.i41-pyramid').parent().html().replace("white","green"));
    }
  }
}

$(function(){
  get_pyramid_info();
  view_pyramid_info();
});
