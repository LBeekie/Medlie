function setBackground(volume) {
                
                if(volume <= 0.15) {
                    o++;
                    //console.log("<=0.15");
                    console.log("o: " + o);
                    b--;
                    s--;
                    if(o>5) {
                        document.getElementById("mainWrap").style.backgroundColor = "blue";
                        b = 0;
                        s = 0;
                        o = 0;
                    }
                } else if (volume > 0.15 && volume <= 0.25){
                    b++;
                    o--;
                    s--;
                    //console.log(">0.15 & <=0.25");
                    console.log("b: " + b);
                    if(b>5) {
                        document.getElementById("mainWrap").style.backgroundColor = "pink";
                        o = 0;
                        s = 0;
                        b = 0;
                    }
                } else if (volume > 0.25) {
                    s++;
                    o--;
                    b--;
                    //console.log(">0.25");
                    console.log("s: " + s);
                    if(s>5) {
                        document.getElementById("mainWrap").style.backgroundColor = "red";
                        o = 0;
                        b = 0;
                        s = 0;
                    }
                }
            }