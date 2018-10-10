function modal(source) {
    document.getElementById("modalWrap").classList.add("hidden");
}

function personality() {
    var personality = document.forms[0];
    var pArray = [];
    var i;
    var x = 0;
    for (i = 0; i < personality.length; i++) {
        if (personality[i].checked === true) {
            pArray[x] = personality[i].value;
            x++;
        }
    }
    //alert(pArray);
}

