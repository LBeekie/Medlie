function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
			var processor = audioContext.createScriptProcessor(512);
			processor.onaudioprocess = volumeAudioProcess;
			processor.clipping = false;
			processor.lastClip = 0;
			processor.volume = 0;
			processor.clipLevel = clipLevel || 0.98;
			processor.averaging = averaging || 0.95;
			processor.clipLag = clipLag || 750;

			// this will have no effect, since we don't copy the input to the output,
			// but works around a current Chrome bug.
			processor.connect(audioContext.destination);

			processor.checkClipping =
				function(){
					if (!this.clipping){
						return false;
                    }
					if ((this.lastClip + this.clipLag) < window.performance.now()){
						this.clipping = false;
                    }
					return this.clipping;
				};

			processor.shutdown =
				function(){
					this.disconnect();
					this.onaudioprocess = null;
				};

			return processor;
		}
		
		function volumeAudioProcess( event ) {
			var buf = event.inputBuffer.getChannelData(0);
			var bufLength = buf.length;
			var sum = 0;
			var x;

			// Do a root-mean-square on the samples: sum up the squares...
			for (var i=0; i<bufLength; i++) {
				x = buf[i];
				if (Math.abs(x)>=this.clipLevel) {
					this.clipping = true;
					this.lastClip = window.performance.now();
				}
				sum += x * x;
			}

			// ... then take the square root of the sum.
			var rms =  Math.sqrt(sum / bufLength);

			// Now smooth this out with the averaging factor applied
			// to the previous sample - take the max here because we
			// want "fast attack, slow release."
			this.volume = Math.max(rms, this.volume*this.averaging);
		}
		
		function mic() {
            var v = 0;
            var vArray = [];
			var audioContext = null;
			var meter = null;
			var rafID = null;
            var isPlaying = false;
				// monkeypatch Web Audio
				window.AudioContext = window.AudioContext || window.webkitAudioContext;

				// grab an audio context
				audioContext = new AudioContext();

				// Attempt to get audio input
				try {
					// monkeypatch getUserMedia
					navigator.getUserMedia = 
						navigator.getUserMedia ||
						navigator.webkitGetUserMedia ||
						navigator.mozGetUserMedia;

					// ask for an audio input
					navigator.getUserMedia(
					{
						"audio": {
							"mandatory": {
								"googEchoCancellation": "false",
								"googAutoGainControl": "false",
								"googNoiseSuppression": "false",
								"googHighpassFilter": "false"
							},
							"optional": []
						},
					}, gotStream, didntGetStream);
				} catch (e) {
					alert('getUserMedia threw exception :' + e);
				}


			function didntGetStream() {
				alert('Stream generation failed.');
			}

			var mediaStreamSource = null;

			function gotStream(stream) {
				// Create an AudioNode from the stream.
				mediaStreamSource = audioContext.createMediaStreamSource(stream);

				// Create a new volume meter and connect it.
				meter = createAudioMeter(audioContext);
				mediaStreamSource.connect(meter);
				
				// kick off the visual updating
				drawLoop();
			}

			function drawLoop() {
                var _volume = meter.volume;
                var volume = _volume.toFixed(3);
				setTimeout(function(){
                    //console.log(volume);
                    document.getElementById("volume").innerHTML = volume;
                    setBackground(volume);
					rafID = window.requestAnimationFrame( drawLoop ); 
					/*xmlhttp.open("GET","functions.php?functions=getVolume",true);
					xmlhttp.send();*/
				}, 500);
			}
            function setBackground(volume) {
                volume = parseFloat(volume);
                vArray[v] = volume;
                v++;
                if (v > 9) {
                    v = 0;
                }
                //alert(vArray);
                var sum = 0;
                for( var d = 0; d < vArray.length; d++ ){
                    sum += vArray[d]; //don't forget to add the base
                }
                //alert (sum);
                var _avg = sum/vArray.length;
                var avg = _avg.toFixed(3);
                //alert (avg);
                //console.log(avg);
                if(avg <= 0.15) {
                    if (isPlaying === false) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var json = JSON.parse(this.responseText);
                                var mArray = ["4"]; //Personality
                                playMp3(json, mArray, 0, 1);
                                
                            }
                        };
                        xmlhttp.open("GET", "info.json", true);
                        xmlhttp.send();
                    }
                    document.getElementById("mainWrap").style.backgroundColor = "blue";
                    lampLow();
                    
                } else if (avg > 0.15 && avg <= 0.25){
                    if (isPlaying === false) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var json = JSON.parse(this.responseText);
                                var mArray = ["4", "1", "3"]; //Personality
                                playMp3(json, mArray, 0, 1);
                                
                            }
                        };
                        xmlhttp.open("GET", "info.json", true);
                        xmlhttp.send();
                    }
                    document.getElementById("mainWrap").style.backgroundColor = "pink";
                    lampMid();
                    
                } else if (avg > 0.25) {
                    if (isPlaying === false) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var json = JSON.parse(this.responseText);
                                var mArray = ["0", "2", "3"]; //Personality
                                playMp3(json, mArray, 0, 1);
                                
                            }
                        };
                        xmlhttp.open("GET", "info.json", true);
                        xmlhttp.send();
                    }
                    document.getElementById("mainWrap").style.backgroundColor = "red";
                    lampHard();
                    
                }
            }
            
            function getRndInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
            }
            
            function playMp3(json, mArray, min, max) {
                var randomIndex = Math.floor(Math.random() * mArray.length);
                var randomElement = mArray[randomIndex];
                var rndm = getRndInt(min, max);
                var mp3 = json.personalities[randomElement].speeches[rndm].audio;
                console.log(mp3);
                var audio = new Audio(mp3);
                    audio.play();
                    isPlaying = true;
                    audio.onended = function () {
                        setTimeout(function() {
                            console.log(isPlaying);
                            isPlaying = false;
                        }, 30 * 1000);
                    };
            }
		}

    function lampLow() {
        var url = "http://192.168.43.102/api/XCiTOVETWF9Gjxj8v6LxkR4ZroBO7iFseJMqEd92/lights/2/state";
        var data = {};
        data.on = true;
        data.xy = [0.1006,0.1193];
        //data.xy = [0.4106,0.1393];
        data.alert = "none";
        var json = JSON.stringify(data);
        //alert(json);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(json);
    }

    function lampMid() {
        var url = "http://192.168.43.102/api/XCiTOVETWF9Gjxj8v6LxkR4ZroBO7iFseJMqEd92/lights/2/state";
        var data = {};
        data.on = true;
        data.xy = [0.4106,0.1393];
        data.alert = "none";
        var json = JSON.stringify(data);
        //alert(json);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(json);
    }

    function lampHard() {
        var url = "http://192.168.43.102/api/XCiTOVETWF9Gjxj8v6LxkR4ZroBO7iFseJMqEd92/lights/2/state";
        var data = {};
        data.on = true;
        data.xy = [0.6679,0.3181];
        data.alert = "none";
        var json = JSON.stringify(data);
        //alert(json);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(json);
    }
