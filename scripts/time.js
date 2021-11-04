(function () {

    var clockElement = document.getElementById("orario-lbl");
  
    function updateClock ( clock ) {
      clock.innerHTML = new Date().toLocaleTimeString();
    }
  
    setInterval(function () {
        updateClock(clockElement );
    }, 1000);
  
  }());