// Variables
var logo = document.getElementById("logo");
var init = document.getElementById("init");
var letsDraw = document.getElementById("options1");
var letsAnimate = document.getElementById("options2");
var drawPanel = document.getElementById("drawPanel");
var animatePanel = document.getElementById("animatePanel");
var rightStickerShowD = document.getElementById("rightStickerShowD");
var rightStickerHideD = document.getElementById("rightStickerHideD");
var rightStickerShowA = document.getElementById("rightStickerShowA");
var rightStickerHideA = document.getElementById("rightStickerHideA");
var rightPanelD = document.getElementById("rightPanelD");
var rightPanelA = document.getElementById("rightPanelA");
var saveD = document.getElementById("saveD");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var blue = document.getElementById("blue");
var pink = document.getElementById("pink");
var purple = document.getElementById("purple");
var orange = document.getElementById("orange");
var green = document.getElementById("green");
var black = document.getElementById("black");
var white = document.getElementById("white");
var eraser = document.getElementById("eraser");
var aSkeleton = document.getElementById("aSkeleton");
var aCharacter = document.getElementById("aCharacter");
var aSpriteSheet = document.getElementById("aSpritesheet");
var subSkeleton = document.getElementById("subSkeleton");
var subCharacter = document.getElementById("subCharacter");
var subSpriteSheet = document.getElementById("subSpriteSheet");
var subCharOpts = document.getElementById("subCharOpts");
var aSave = document.getElementById("aSave");
var projectImage = document.getElementById("projectImage");
var imageContainer = document.getElementById("imageContainer");
var uploadImage = document.getElementById("uploadImage");
var drawImage = document.getElementById("drawImage");
var backToAnimate = document.getElementById("backToAnimate");


function toAnimate() {
	init.style.display = "none";
	animatePanel.style.display = "grid";
	initAnimate();
}

function toDraw() {
	init.style.display = "none";
	drawPanel.style.display = "grid";
	initDraw();
}


function start() {

	rightStickerShowD.addEventListener("click", function(){
		showRightPanelD();
	});

	rightStickerHideD.addEventListener("click", function(){
		hideRightPanelD();
	});

	rightStickerShowA.addEventListener("click", function(){
		showRightPanelA();
	});

	rightStickerHideA.addEventListener("click", function(){
		hideRightPanelA();
	});

	logo.addEventListener("click", function(){
		backToInit();
	});
}

function backToInit() {
	if (drawPanel.style.display != "none") 
		drawPanel.style.display = "none";
	else if (animatePanel.style.display != "none") 
		animatePanel.style.display = "none";
	
	init.style.display = "grid";

}

function showRightPanelD()
{
	rightPanelD.style.display = "flex";
	rightStickerHideD.style.display = "flex";
	rightStickerShowD.style.display = "none";
}

function hideRightPanelD()
{
	rightPanelD.style.display = "none";
	rightStickerHideD.style.display = "none";
	rightStickerShowD.style.display = "flex";
}

function showRightPanelA()
{
	rightPanelA.style.display = "flex";
	rightStickerHideA.style.display = "flex";
	rightStickerShowA.style.display = "none";
}

function hideRightPanelA()
{
	rightPanelA.style.display = "none";
	rightStickerHideA.style.display = "none";
	rightStickerShowA.style.display = "flex";
}









function CanvasStateD(canvas) {
	var wrapper = document.getElementById("canvasD");
  	canvas.width = wrapper.offsetWidth;
  	canvas.height = wrapper.offsetHeight;
  	canvas.backgroundColor = "#ffffff";
  	this.canvas = canvas;
  	this.width = canvas.width;
  	this.height = canvas.height;
  	this.ctx = canvas.getContext("2d");

  	this.mouse = {x: 0, y: 0};
	this.last_mouse = {x: 0, y: 0};

  	this.ctx.strokeStyle = "#ff0000";
	this.ctx.lineJoin = "round";
	this.ctx.lineWidth = 5;

  	this.drawPoints = [];
	var clickDrag = [];
	this.paint = false;

  	var myState = this;

  	this.ctx.lineWidth = 5;
	this.ctx.lineJoin = 'round';
	this.ctx.lineCap = 'round';
	this.ctx.strokeStyle = 'blue';

	canvas.addEventListener("mousedown", function(e) {
		
		myState.mouse = myState.getMouse(e);
		myState.last_mouse.x = myState.mouse.x;
		myState.last_mouse.y = myState.mouse.y;
				
		myState.paint = true;

		myState.addPoint(myState.mouse.x - 2, myState.mouse.y - 2);
		
		//myState.draw();
	
	}, true);

	canvas.addEventListener("mouseup", function(e) {				
		myState.paint = false;
	
	}, true);

	canvas.addEventListener("mousemove", function(e) {		
		if ( myState.paint ) {
			myState.last_mouse.x = myState.mouse.x;
			myState.last_mouse.y = myState.mouse.y;
			
			myState.mouse.x = myState.getMouse(e).x;
			myState.mouse.y = myState.getMouse(e).y;
			

			myState.addPoint(myState.mouse.x - 2, myState.mouse.y - 2, true);
			myState.draw();
		}		
	}, true);
}

CanvasStateD.prototype.addPoint = function( x, y ) {
	this.drawPoints.push(x);
	this.drawPoints.push(y);
}

CanvasStateD.prototype.draw = function() {
	var myState = this;
	var ctx = myState.ctx;
	var points = myState.drawPoints;
	clear(myState);

	ctx.beginPath();
	ctx.moveTo(myState.last_mouse.x, myState.last_mouse.y);
	ctx.lineTo(myState.mouse.x, myState.mouse.y);
	ctx.closePath();
	ctx.stroke();	
}

function paintRed() {
	s.ctx.strokeStyle = 'red';
	s.ctx.lineWidth = 5;
}

function paintYellow() {
	s.ctx.strokeStyle = 'yellow';
	s.ctx.lineWidth = 5;
}

function paintBlue() {
	s.ctx.strokeStyle = 'blue';
	s.ctx.lineWidth = 5;
}

function paintViolet() {
	s.ctx.strokeStyle = 'violet';
	s.ctx.lineWidth = 5;
}

function paintPurple() {
	s.ctx.strokeStyle = 'mediumPurple';
	s.ctx.lineWidth = 5;
}

function paintOrange() {
	s.ctx.strokeStyle = 'orange';
	s.ctx.lineWidth = 5;
}

function paintGreen() {
	s.ctx.strokeStyle = 'green';
	s.ctx.lineWidth = 5;
}

function paintBlack() {
	s.ctx.strokeStyle = 'black';
	s.ctx.lineWidth = 5;
}

function paintWhite() {
	s.ctx.strokeStyle = 'white';
	s.ctx.lineWidth = 5;
}

function paintEraser() {
	s.ctx.strokeStyle = s.canvas.backgroundColor;
	s.ctx.lineWidth = 20;
}

function fromDrawToAnimate() {
	animatePanel.style.display= "grid";
	drawPanel.style.display = "none";
	backToAnimate.style.display = "none";
	initAnimate();
}

function initDraw() {
	s = new CanvasStateD(document.getElementById("canvasSelectorD"));

	red.removeEventListener("click", paintRed, true);
	red.addEventListener("click", paintRed, true);

	yellow.removeEventListener("click", paintYellow, true);
	yellow.addEventListener("click", paintYellow, true);
	
	blue.removeEventListener("click", paintBlue, true);
	blue.addEventListener("click", paintBlue, true);

	pink.removeEventListener("click", paintViolet, true);
	pink.addEventListener("click", paintViolet, true);
	
	purple.removeEventListener("click", paintPurple, true);
	purple.addEventListener("click", paintPurple, true);
	
	orange.removeEventListener("click", paintOrange, true);
	orange.addEventListener("click", paintOrange, true);
	
	green.removeEventListener("click", paintGreen, true);
	green.addEventListener("click", paintGreen, true);
	
	black.removeEventListener("click", paintBlack, true);
	black.addEventListener("click", paintBlack, true);
	
	white.removeEventListener("click", paintWhite, true);
	white.addEventListener("click", paintWhite, true);
	
	eraser.removeEventListener("click", paintEraser, true);
	eraser.addEventListener("click", paintEraser, true);
	
	saveD.addEventListener("click", function(){
		var dataURL = s.canvas.toDataURL();
		//console.log(dataURL);
	});

	backToAnimate.removeEventListener("click", fromDrawToAnimate, true);
	backToAnimate.addEventListener("click", fromDrawToAnimate, true);
}





// Class Point
function Point(x, y, r, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.radius = r || 0;
  this.fill = fill || '#AAAAAA';
}

// Checks if Point contains the mouse coordinates
Point.prototype.contains = function(mx, my) {
  var distsq = (mx-this.x) * (mx-this.x) + (my-this.y) * (my-this.y);
  rsq = this.radius * this.radius;

  return distsq < rsq;
}

// Draws Point
Point.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Draws line
function drawLine( line, ctx ) {
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  ctx.lineTo(line[1].x, line[1].y);
  ctx.closePath();
  ctx.stroke();
}

// Class Canvas Animate
function CanvasStateA(canvas) {
  var wrapper = document.getElementById("canvasA");
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext("2d");

  // Keep track of state
  this.point = null;
  this.points = [];
  this.lines = [];
  this.mouse = null;
  this.drag = false;
  this.drawing = false;
  this.moveMouse = null;
  this.selection = null;
  this.isMoving = false;
  this.nearest = null;

  var myState = this;

  // *** Events ***

  // Mouse Up
  /* Cases:
      1. If the mouse is the same as the State mouse
          --> the event is a "click" so it adds a new Point
      2. If the mouse is the same as the State mouse but
        it's dragging --> it just drags so it doesn't add any
        new Points
      3. If the mouse is the same as the State mouse but
        it's NOT dragging --> adds a new Point in the same place
  */
  canvas.addEventListener("mouseup", function(e) {
  	e.preventDefault();
  	e.stopPropagation();
    var mouse = myState.getMouse(e);
    var point = myState.point;

    if (mouse = myState.mouse) {
      if (myState.drag) {
        if (!myState.isMoving) {
          myState.point = myState.addPoint(
            new Point(point.x, point.y, 10, 'rgb(0,255,0)')
          );
        }
      } else {
        myState.point = myState.addPoint(
            new Point(mouse.x -2, mouse.y -2, 10, 'rgb(0,255,0)')
          );
      }
    }
    myState.drag = false;
    myState.pointsDrag = [];
    //
    //isDown=false;
  	//myState.nearest=null;
  	//draw();
	//
  }, true);

  // Mouse Down
  // If the mouse coordinates are in a Point, it can be dragged
  canvas.addEventListener("mousedown", function(e) {
  	e.preventDefault();
  	e.stopPropagation();
    myState.mouse = myState.getMouse(e);
    
    var points = myState.points;
    var length = points.length;

    for ( var i = 0; i <= length -1; i++) {
      if (points[i].contains(myState.mouse.x, myState.mouse.y)) {
        myState.drag = true;
        myState.point = points[i];
        myState.pointsDrag.push(points[i]);
      } 
    }
	//
    //myState.nearest = closestLine(myState.mouse.x, myState.mouse.y);
	//
    /*
	draw();
	// set dragging flag
	isDown=true;
    */

  }, true);

  // Mouse Move
  /* Cases:
      1. If it's not dragging 
        --> changes the Point's colour if it passes above it
      2. If it's dragging
        --> drags the Point
  */
  canvas.addEventListener("mousemove", function(e) {
  	e.preventDefault();
  	e.stopPropagation();
    var mouse = myState.getMouse(e);
    
    if (!myState.drag) {
      isMouseInPoint(mouse, myState.points ,myState.ctx);
      /*
      if (isEven(myState.points.length)) return;
      
      var point = myState.point;
      myState.moveMouse = myState.getMouse(e);
      requestAnimationFrame( function() { myState.draw() } );
      */
    } else {
      	myState.isMoving = true;
      	var points = myState.pointsDrag;
      	var length = points.length;
      	//var dx = mouse.x - myState.mouse.x;
    	//var dy = mouse.y - myState.mouse.y;
      
      for ( var i = 0; i <= length - 1; i++ ) {
        points[i].x = mouse.x;
        points[i].y = mouse.y;
      }
    }

  }, true);

  requestAnimationFrame( function() { myState.draw() } );
}

// Add new Point
CanvasStateA.prototype.addPoint = function(point) {
  var myState = this;

  myState.points.push(point);
  if (isEven(myState.points.length)) {
    myState.addLines(myState.points);
    var l = myState.points.length;
    addNewLineDiv(myState.points[l-2], myState.points[l-1]);
  }
  
  requestAnimationFrame( function() { myState.draw() } );
  return point;
}

// Add Lines
CanvasStateA.prototype.addLines = function(points) {
  var myState = this;
  var l = points.length;
  myState.lines.push([points[l-2], points[l-1]]);
  
}

// Draws the Canvas State
CanvasStateA.prototype.draw = function() {
  var myState = this;
  var points = myState.points;
  var lines = myState.lines;
  var length = points.length;
  var l = lines.length;

  clear(myState);

  // Draw lines
  for ( var i = 0; i <= l - 1; i ++ ) {
    drawLine(lines[i], myState.ctx);
  }

  // Draw Points
  for ( var i = 0; i <= length - 1; i++) {
    if (i == 0) {
      points[i].draw(myState.ctx); 
      continue;
    }
    
    points[i - 1].draw(myState.ctx);
    points[i].draw(myState.ctx);
  }


/*  Draw line from Point to cursor
  ----
    if (isEven(myState.points.length)) return;
    var point = myState.point;
    var ctx = myState.ctx;
    var mouse = myState.moveMouse;
    //if ( point == null ) return;
    if ( mouse == null ) return;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
*/
    
  requestAnimationFrame( function() { myState.draw() } );
}

// Get mouse position taking into account paddings and borders
CanvasStateA.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  return {x: mx, y: my};
}

// Get mouse position taking into account paddings and borders
CanvasStateD.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  return {x: mx, y: my};
}

// Clear Canvas
function clear( canvas ) {
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Checks if the cursor is inside a Point
function isMouseInPoint(mouse, data, ctx) {
  var length = data.length;
  for ( var i = 0; i <= length - 1; i++) {
    if (data[i].contains(mouse.x, mouse.y)) {
      data[i].fill = "rgb(255,0,0)";
      data[i].draw(ctx);
    } else {
      data[i].fill = "rgb(0,255,0)";
      data[i].draw(ctx);
    }
  }
}

// Checks if object is empty
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// Checks if a number is even
function isEven(n) {
   return n % 2 == 0;
}

// Checks if a number is odd
function isOdd(n) {
   return Math.abs(n % 2) == 1;
}

// Computes distance between 2 Points
function dist(p1,p2) {
  return Math.hypot(p2.x-p1.x, p2.y-p1.y);
}






function addNewLineDiv(p1, p2) {
	var newLine = document.createElement("div");
	newLine.className = "lineDiv";
	newLine.innerHTML = "new line";
	//newLine.addEventListener("onmouseover", selectLine, true);
	//newLine.addEventListener("onmouseout", unselectLine, true);
	newLine.onmouseover = function(){
		p1.fill = "#ff0000";
		p2.fill = "#ff0000";
	};
	newLine.onmouseout = function(){
		p1.fill = "#00ff00";
		p2.fill = "#00ff00";
	};

/*
	var arrow = document.createElement("div");
	arrow.className = "arrow";

	subSkeleton.appendChild(arrow);
*/
	subSkeleton.appendChild(newLine);

}

function selectLine(p1,p2) {
	

}

function unselectLine(p1,p2) {
	
}




function projectImagesPreview() {
	//everytime that an image is added, save the filename somewhere
	
	var image = document.createElement("img");
	
	image.src = "images/ilusion_logo.png";
	image.id = "ilusion_logo.png";
	image.className = "pImages";
	image.width = "70";
	image.height = "100";

	imageContainer.appendChild(image);


}



function selectSkeletonOption() {
	if (subSkeleton.style.display == "flex")
  		closeSkeleton();
  	else displaySkeleton();
}

function selectCharacterOption() {
	if (subCharOpts.style.display == "flex")
  		closeCharacter();
  	else displayCharacter();
}

function selectSpriteSheetOption() {
	if (aSpriteSheet.style.flexGrow == "1")
  		closeSpriteSheet();
  	else displaySpriteSheet();
}

function selectProjectImageOption(){
	if (projectImage.style.flexGrow == "1")
		displayProjectImages();
	else closeProjectImages();
}

function displaySkeleton() {
	if (subCharOpts.style.display == "flex")
		closeCharacter();
	if (aSpriteSheet.style.flexGrow == "1")
		closeSpriteSheet();
	//aSkeleton.style.flexGrow = "1";
	subSkeleton.style.display = "flex";
	aSkeleton.style.height = "5%";
	aSave.style.marginTop = 0;
	aCharacter.style.height = "10%";
	aSpriteSheet.style.height = "10%";
	aSave.style.height = "10%";
	//subSkeleton.style.display = "flex";
}

function closeSkeleton() {
	aSkeleton.style.height = "15%";
	aSkeleton.style.flexGrow = "0";
	aSave.style.marginTop = "300px";
	aCharacter.style.height = "15%";
	aSpriteSheet.style.height = "15%";
	aSave.style.height = "15%";
	subSkeleton.style.display = "none";
}

function displayCharacter() {
	if (subSkeleton.style.display == "flex")
		closeSkeleton();
	if (aSpriteSheet.style.flexGrow == "1")
		closeSpriteSheet();
	//aCharacter.style.flexGrow = "1";
	subCharOpts.style.display = "flex";
	aCharacter.style.height = "5%";
	aSave.style.marginTop = 0;
	aSkeleton.style.height = "10%";
	aSpriteSheet.style.height = "10%";
	aSave.style.height = "10%";
	//subCharacter.style.display = "flex";
}

function closeCharacter() {
	aCharacter.style.height = "15%";
	aCharacter.style.flexGrow = "0";
	aSave.style.marginTop = "300px";
	aSkeleton.style.height = "15%";
	aSpriteSheet.style.height = "15%";
	aSave.style.height = "15%";
	subCharOpts.style.display = "none";
}

function displaySpriteSheet() {
	if (subSkeleton.style.display == "flex")
		closeSkeleton();
	if (subCharOpts.style.display == "flex")
		closeCharacter();
	aSpriteSheet.style.flexGrow = "1";
	aSave.style.marginTop = 0;
	aSkeleton.style.height = "10%";
	aCharacter.style.height = "10%";
	aSave.style.height = "10%";
	subSpriteSheet.style.display = "flex";
}

function closeSpriteSheet() {
	aSpriteSheet.style.height = "15%";
	aSpriteSheet.style.flexGrow = "0";
	aSave.style.marginTop = "300px";
	aSkeleton.style.height = "15%";
	aCharacter.style.height = "15%";
	aSave.style.height = "15%";
	subSpriteSheet.style.display = "none";
}

function drawToAnimate() {
	animatePanel.style.display= "none";
	drawPanel.style.display = "grid";
	backToAnimate.style.display = "block";
	
	
	initDraw();
}

function displayProjectImages() {
	projectImage.style.flexGrow = "0";
	drawImage.style.flexGrow = "0";
	uploadImage.style.flexGrow = "0";
	imageContainer.style.display = "flex";
	projectImagesPreview();
}

function closeProjectImages() {
	projectImage.style.flexGrow = "1";
	drawImage.style.flexGrow = "1";
	uploadImage.style.flexGrow = "1";
	imageContainer.style.display = "none";
}

function initAnimate() {
  	s = new CanvasStateA(document.getElementById("canvasSelectorA"));

  	aSkeleton.removeEventListener("click", selectSkeletonOption, false);
  	aSkeleton.addEventListener("click", selectSkeletonOption, false);
	
	aCharacter.removeEventListener("click", selectCharacterOption, false);
	aCharacter.addEventListener("click", selectCharacterOption, false);
	
	aSpriteSheet.removeEventListener("click", selectSpriteSheetOption, false);
	aSpriteSheet.addEventListener("click", selectSpriteSheetOption, false);
	
	projectImage.removeEventListener("click", selectProjectImageOption, false);
	projectImage.addEventListener("click", selectProjectImageOption, false);
	
	drawImage.removeEventListener("click", drawToAnimate, false);
	drawImage.addEventListener("click", drawToAnimate, false);
}







function webGLStart() {
    init();
}