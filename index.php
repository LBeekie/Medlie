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
        <div id="micWrap">
            <div id="micContent">
                <h1 id="volume">0</h1>
            </div>
        </div>
    </div>
</body>
</html>
