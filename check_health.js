// ==UserScript==
// @name        Напоминалка про мало здоровья
// @domain      https://pernatsk.ru/*
// @namespace   https://pernatsk.ru/*
// @include     https://pernatsk.ru/*
// @match       https://pernatsk.ru/*
// @grant       none
// ==/UserScript==

var addr = location.pathname;

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

function check_health(){
  tmp = $("div[onMouseOver*='Как на кошке'] > div").first().html();
  if (tmp.indexOf('%')>0) {
    t = tmp.slice(0,tmp.indexOf('%'));
    if (parseInt(t)<10) {
      loka = $("div[onMouseOver*='Иммунитет']").next().next().next().html();
      if (loka.split("\"")[3] == "/location/forest") {
        view_ask_window("Здоровья мало! Съесть подорожник?","https://pernatsk.ru/location/forest/heal");
      } else {
        view_ask_window("Здоровья мало! В гнездо за пузырьком?","https://pernatsk.ru/nest/bird");
      }
    }
  }
}


$(function(){
  check_health();
});
