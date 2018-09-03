window.addEventListener('load', () => {
	// canvas Declaration
	let canvas = document.querySelector('.rightCanvas');
    let c = undefined; 
	if(canvas.getContext('2d')) {
		c = canvas.getContext('2d');
	}
	else {
		console.log('not supported')
    }
    
    //------------------------------------------------------------------------------------------------------>
    //file upload
    let formFileUploadButton = document.querySelector("form button");
    let formFileSelect = document.querySelector("#file");

    formFileUploadButton.addEventListener('click', (e) => {
        e.preventDefault();
        let file = formFileSelect.files[0];
        if(!(formFileSelect.files.length > 0 && formFileSelect.files[0].name.lastIndexOf("pdf"))) {
            console.log("wrong file extension");
            
        }
        else {
            console.log(file)
            let url = '//cdn.mozilla.net/pdfjs/helloworld.pdf';
            // The workerSrc property shall be specified.
            //pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    
            pdfjsLib.disableWorker = true;
            
            // Download of pdf
            pdfjsLib.getDocument(url).then( (pdf) => {
                
                //First page
                pdf.getPage(1).then ((page) => {
                    
                    let scale = 1;
                    let viewport = page.getViewport(scale);
                    
                    let canvasFileDisplay = document.querySelector(".displayFile");
                    let context = canvasFileDisplay.getContext('2d');
                    canvasFileDisplay.style.height= "100%";
                    canvasFileDisplay.style.width = "100%";
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    
                    let renderTask = page.render(renderContext);
                    renderTask.then(() => {
                      c.drawImage(canvasFileDisplay,0,0);
                    })
                })
            }), function(reason) {
                console.error(reason);
            }
            
        }
    });

    //--------------------------------------------------------------------------------------------------------->
	// Getting Top Buttons
	let buttonsTop = document.querySelectorAll('.topRightIcons button');
	let buttonsTopLength = buttonsTop.length;
	let workingName = undefined;
    let workingStatus = false;
    
    //All BUTTONS STATUS AND THE FUNCTIONS
    //----------------------------------->
    // FUNCTIONS VARIABLES
    //CANVAS -- VARIABLES
	let initialMouse,finalMouse, mouseMove, status, distance;
    let listOfTasks = {
        buttonStatus: [
            {
                name: "pen",
                statusOn: true,
                statusOff: true,
            },
            {
                name: "color",
                statusOn: true,
                statusOff: true
            },
            {
                name: "sync",
                statusOn: true,
                statusOff: true
            },
            {
                name: "dummy",
                statusOn: true,
                statusOff: true
            },
            {
                name: "remove",
                statusOn: true,
                statusOff: true
            },
            {
                name: "undo",
                statusOn: true,
                statusOff: true
            },
            {
                name: "redo",
                statusOn: true,
                statusOff: true
            }
        ],
        dataStorage: {
            click: []
        },
        runningFunctions: {
            penFunction: () => {
                let count = 0;
                let beginpath = true;
                let shift = 0;
                let rect = canvas.getBoundingClientRect();
                canvas.addEventListener('click', () => {
                    initialMouse = {
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top
                    }

                  listOfTasks.dataStorage.click.push([initialMouse.x,initialMouse.y]);
                  let dataLength = listOfTasks.dataStorage.click.length;
                  let arrayReference = listOfTasks.dataStorage.click;
                  if(dataLength == 1) {
                      c.beginPath();
                      c.arc(arrayReference[0][0],arrayReference[0][1],2,0,Math.PI*2,false);
                      c.fill();
                      c.closePath();
                  }
                  else {
                      c.globalAlpha = 0.7;
                      let canvasFileDisplay = document.querySelector(".displayFile");
                      c.clearRect(0,0,canvas.height,canvas.width)
                      c.beginPath();
                      c.moveTo(arrayReference[0][0],arrayReference[0][1]);
                      for(let i = 1; i < dataLength; i++ ){
                        c.lineTo(arrayReference[i][0],arrayReference[i][1]);
                      }
                      c.closePath();
                      c.stroke();
                      c.fillStyle = "#eee";
                      c.fill();
                      c.drawImage(canvasFileDisplay,0,0);
                    
                  }
                       
                })//End of First Click Event
            }
        }

    }
    let functions = [listOfTasks.runningFunctions.penFunction];
	let buttonState = (i) => {
		workingName = listOfTasks.buttonStatus[i].name;
        workingStatus =listOfTasks.buttonStatus[i].statusOn;
        functions[i]();
	}
	// adding Event listeners
	for( i = 0; i < buttonsTopLength; i++){
		buttonsTop[i].addEventListener('click',buttonState.bind(this,i));
	}	
    
    //Sizing Canvas
	let canvasSize = () => {
		let rightWidth = document.querySelector(".right").offsetWidth;
	 	let rightHeight = document.querySelector(".right").offsetHeight;
		canvas.width = rightWidth;
		setTimeout( () => {
			canvas.height = rightHeight;
		},0);
	}
	canvasSize();
	window.onresize = canvasSize;
	
})

