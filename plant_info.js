// ==UserScript==
// @name        Инфа о растении на подоконнике
// @domain      https://pernatsk.ru/*
// @namespace   https://pernatsk.ru/*
// @include     https://pernatsk.ru/*
// @match       https://pernatsk.ru/*
// @grant       none
// ==/UserScript==

// алиас относительного пути
var addr = location.pathname;

// check local storage support
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    console.log('localStorage не работает.');
    return false;
  }
}

function get_plant_info(){
  if (addr.indexOf('/nest/landscape')<0) return false;

  var tmp = document.getElementsByClassName("pot-growing-time");
  var timePlant = 0;
  for (i = 0; i < tmp.length; i++)
  {
    var t = $(tmp[i]).html();
    if (t.indexOf('Срезать')<0) {
      t = parseInt(t.slice(t.indexOf('bTimer')).split(",",2)[1]);
      if ((timePlant==0) || (timePlant>t)) {
        timePlant = t;
      }
    }
  }
  //обновление инфы о ближайшем цветке в хранилище
  if (timePlant==0) {
    localStorage["qpernatsk.timePlant"]=undefined;
  } else {
    localStorage["qpernatsk.timePlant"]=timePlant;
  }
}

function view_ask_window(text,yesbuttonlink)
{
    if (addr!=yesbuttonlink && "https://pernatsk.ru"+addr!=yesbuttonlink)
        $('body').append('<div id="ask" style="text-align: center; width: auto; min-height: 0px; height: 0px;"'+
                         'class="ui-dialog-content ui-widget-content" scrolltop="0" scrollleft="0">'+
                         '<br>'+
                         '<p class="center">'+text+'</p>'+
                         '</div><div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">'+
                         '<div class="ui-dialog-buttonset"><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"'+
                         'role="button" aria-disabled="false"><span class="ui-button-text">Да</span></button>'+
                         '<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"'+
                         'role="button" aria-disabled="false"><span class="ui-button-text">Нет</span></button></div></div></div>);');
    $("#ask").dialog({
        resizable: false,
        modal: true,
        draggable: false,
        width: 400,
        height: 150,
        buttons: {
            "Да": function() {
                $( this ).dialog( "close" );
                $('#noclick').addClass('none');
                window.location = yesbuttonlink;
            },
            "Нет": function() {
                $( this ).dialog( "close" );
                return false;
            }
        }
    });
}

function view_plant_info(){
  var timePlant = 0;
  if (typeof localStorage["qpernatsk.timePlant"] != "undefined"){
      timePlant = localStorage["qpernatsk.timePlant"];
  }

  if (timePlant > 0)
  {
    var element = document.getElementsByClassName("i41-landscape")[0];
    if (element != undefined) { // если ярлычок есть, то нарисуем на нем таймер или раскрасим
      if (timePlant < current_time) {
        $('.i41-landscape').parent().html($('.i41-landscape').parent().html().replace("white","green"));
      } else {
        test_block = '<div class="mini-content-timer rightside">'
          +'<span id="timer-plant">220:56:25</span>'
          +'          <script>'
          +"              bTimer('#timer-plant', "+timePlant+", 'hm', 'none', false, false)"
          +"          </script>"
          +'</div>';
        $('.i41-landscape').after(test_block);
      }
    } else { // если ярлычка не было, то ничего рисовать не будем, только проверим не созрело ли растение
      if (timePlant < current_time) {
        view_ask_window("Растение созрело, срезать?","https://pernatsk.ru/nest/landscape");
      }
    }
  }
}


$(function(){
  if (supportsLocalStorage()){
    get_plant_info();
    view_plant_info();
  }
});
