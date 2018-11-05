<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="style.css">
<script src="script.js"></script>
<script src="mic.js"></script>
<title>Medlie - Smart Classroom</title>

<script language="javascript">
    function toggle(source) {
      checkboxes = document.getElementsByName('personality');
      for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = source.checked;
      }
    }
    

</script>    
</head>

<body>
    <div id="modalWrap">
        <div id="modalContent">
            <form action="javascript:mic(); modal(); personality();">
                <input type="checkbox" onClick="toggle(this)" value="0">Toggle all<br>
                <input type="checkbox" name="personality" value="1"> Happy<br>
                <input type="checkbox" name="personality" value="2"> Sad<br>
                <input type="checkbox" name="personality" value="3"> Fussed<br>
                
                <input id="submit" type="submit" value="Start">
                
                <input type="checkbox" name="personality" value="4"> Focused<br>
            </form>
        </div>
    </div>
    <div id="mainWrap">
        <div id="square">
            <div id="timeday">
                <h1 id="hourmin">18:00</h1>
                <h1 id="today">Maandag, 1 december</h1>
            </div>
            <div id="text">
                <h1 id="news">Om 14:00 is er een workshop Git</h1>
            </div>
            <div id="kees">
                <img id="imgKees" src="kees/gefocussed.png">
            </div>
        </div>
        
        <div id="micWrap" style="display: none;">
            <div id="micContent">
                <h1 id="volume">0</h1>
            </div>
        </div>
    </div>
</body>
</html>

<script>
    function setTime() {
        //d = dag
        //dn = nummer van dag
        //m = maand
        
        var dt = new Date();
        document.getElementById("hourmin").innerHTML = dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        var weekday = new Array(7);
        weekday[0] =  "Zondag, ";
        weekday[1] = "Maandag, ";
        weekday[2] = "Dinsdag, ";
        weekday[3] = "Woensdag, ";
        weekday[4] = "Donderdag, ";
        weekday[5] = "Vrijdag, ";
        weekday[6] = "Zaterdag, ";
        var d = weekday[dt.getDay()];
        
        var dn = dt.getDate();
        
        var month = new Array(12);
        month[0] = " januari";
        month[1] = " februari";
        month[2] = " maart";
        month[3] = " april";
        month[4] = " mei";
        month[5] = " juni";
        month[6] = " juli";
        month[7] = " augustus";
        month[8] = " september";
        month[9] = " oktober";
        month[10] = " november";
        month[11] = " december";
        var m = month[dt.getMonth()];
        
        var tot = d + dn + m;
        document.getElementById("today").innerHTML = tot;
        
    }
    
    var t=setInterval(setTime,1000);
</script>
