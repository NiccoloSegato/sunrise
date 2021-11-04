var lbl = document.getElementById("giorno-lbl");

var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

var now = new Date();
var day = days[ now.getDay() ];
var number = now.getDate();
var month = months[ now.getMonth() ];
var year = now.getFullYear();

lbl.innerHTML = day + ' ' + number + ' ' + month + ' ' + year