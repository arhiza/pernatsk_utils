// ==UserScript==
// @name        Напоминалка про мало здоровья
// @domain      https://pernatsk.ru/*
// @namespace   https://pernatsk.ru/*
// @include     https://pernatsk.ru/*
// @match       https://pernatsk.ru/*
// @grant       none
// ==/UserScript==

function check_health(){
  tmp = $("div[onMouseOver*='Как на кошке'] > div").first().html();
  if (tmp.indexOf('%')>0) {
    t = tmp.slice(0,tmp.indexOf('%'));
    if (parseInt(t)<10) {
      alert ('Здоровья всего '+t+'%! Срочно лечись!');
    }
  }
}


$(function(){
  check_health();
});
