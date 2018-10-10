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
                console.log(avg);
                if(avg <= 0.15) {
                    document.getElementById("mainWrap").style.backgroundColor = "blue";
                } else if (avg > 0.15 && avg <= 0.25){
                    document.getElementById("mainWrap").style.backgroundColor = "pink";
                } else if (avg > 0.25) {
                    document.getElementById("mainWrap").style.backgroundColor = "red";
                }
            }
		}