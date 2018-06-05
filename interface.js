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
var leftPanel = document.getElementById("leftPanel");
var leftStickerHide = document.getElementById("leftStickerHide");
var leftStickerShow = document.getElementById("leftStickerShow");
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
var drawImageVar = document.getElementById("drawImageVar");
var backToAnimate = document.getElementById("backToAnimate");
var chooseLine = document.getElementById("chooseLine");
var flipImage = document.getElementById("flipImage");
var biggerImage = document.getElementById("biggerImage");
var smallerImage = document.getElementById("smallerImage");
var narrowerImage = document.getElementById("narrowerImage");
var createSkeleton = document.getElementById("createSkeleton");
var currentSkeleton = document.getElementById("currentSkeleton");
var currentSkeletonContainer = document.getElementById("currentSkeletonContainer0");
var currentSkeletonContainerOut = document.getElementById("currentSkeletonContainerOut");
var savedSkeletons = document.getElementById("savedSkeletons");
var saveSkeleton = document.getElementById("saveSkeleton");
var savedSkeletonsContainer = document.getElementById("savedSkeletonsContainer");
var canvasAnimation;
var canvasDraw;
var lineCounter = 0;

function toAnimate() {
  init.style.display = "none";
  animatePanel.style.display = "flex";
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
  if (chooseLine.style.display == "flex") {
    chooseLine.style.display = "none";
    displayCharacter();
  }
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
  canvasDraw.ctx.strokeStyle = 'red';
  canvasDraw.ctx.lineWidth = 5;
}

function paintYellow() {
  canvasDraw.ctx.strokeStyle = 'yellow';
  canvasDraw.ctx.lineWidth = 5;
}

function paintBlue() {
  canvasDraw.ctx.strokeStyle = 'blue';
  canvasDraw.ctx.lineWidth = 5;
}

function paintViolet() {
  canvasDraw.ctx.strokeStyle = 'violet';
  canvasDraw.ctx.lineWidth = 5;
}

function paintPurple() {
  canvasDraw.ctx.strokeStyle = 'mediumPurple';
  canvasDraw.ctx.lineWidth = 5;
}

function paintOrange() {
  canvasDraw.ctx.strokeStyle = 'orange';
  canvasDraw.ctx.lineWidth = 5;
}

function paintGreen() {
  canvasDraw.ctx.strokeStyle = 'green';
  canvasDraw.ctx.lineWidth = 5;
}

function paintBlack() {
  canvasDraw.ctx.strokeStyle = 'black';
  canvasDraw.ctx.lineWidth = 5;
}

function paintWhite() {
  canvasDraw.ctx.strokeStyle = 'white';
  canvasDraw.ctx.lineWidth = 5;
}

function paintEraser() {
  canvasDraw.ctx.strokeStyle = canvasDraw.canvas.backgroundColor;
  canvasDraw.ctx.lineWidth = 20;
}

function fromDrawToAnimate() {
  animatePanel.style.display= "grid";
  drawPanel.style.display = "none";
  backToAnimate.style.display = "none";
  initAnimate();
}

function initDraw() {
  canvasDraw = new CanvasStateD(document.getElementById("canvasSelectorD"));

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

function ImageForCanvas( img, p1, p2, rotation, height, counter, heightOffset, widthOffset, rotationOffset ) {
  this.img = img || 0;
  this.p1 = p1 || 0;
  this.p2 = p2 || 0;
  this.rotation = rotation || 0;
  this.height = height || 0;
  this.counter = counter || 0;
  this.heightOffset = heightOffset || 0;
  this.widthOffset = widthOffset || 0;
  this.rotationOffset = rotationOffset || 0;
}

ImageForCanvas.prototype.putImageOnCanvas = function(ctx, myState) {
  ctx.save();
    this.p1.draw(ctx);

    var dx = this.p2.x - this.p1.x;
  var dy = this.p2.y - this.p1.y;
  var distance = dist(this.p1, this.p2);
  var rotation = Math.atan2(dy, dx);
  var angleDegrees = rotation * (180/Math.PI);
  var radians = (angleDegrees - 90) * (Math.PI/180);
    this.rotation = radians;
    this.height = distance;

    ctx.translate(this.p1.x, this.p1.y);
  ctx.rotate(this.rotation + this.rotationOffset);
  ctx.drawImage(this.img, -this.img.width/2 - this.widthOffset/2, -this.heightOffset/2, this.img.width + this.widthOffset, this.height + this.heightOffset);
  ctx.restore();
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
  this.skeletonImages = [];
  
  this.skeleton = [];

  this.skeletonCollection = [];

  this.skeletonCounter = 0;

  this.mouse = null;
  this.drag = false;
  this.drawing = false;
  this.moveMouse = null;
  this.selection = null;
  this.isMoving = false;
  this.nearest = null;
  this.imageSlelected = null;
  this.lineDivSelected = null;

  var myState = this; 
    
  this.addInitialSkeletonPoints();

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
        var images = myState.skeletonImages;
        var li = images.length;
        var lines = myState.lines;
        //var dx = mouse.x - myState.mouse.x;
      //var dy = mouse.y - myState.mouse.y;
      
      for ( var i = 0; i <= length - 1; i++ ) {
        points[i].x = mouse.x;
        points[i].y = mouse.y;
      }
      /*
      for (var i = 0; i <= li -1; i++ ){
        var dx = lines[i][1].x - lines[i][0].x;
    var dy = lines[i][1].y - lines[i][0].y;
    var distance = dist(lines[i][0], lines[i][1]);
    var rotation = Math.atan2(dy, dx);
    var angleDegrees = rotation * (180/Math.PI);
    var radians = (angleDegrees - 90) * (Math.PI/180);
        images[i].rotation = radians;
        images[i].height = distance;
      }
      */
    }

  }, true);

  requestAnimationFrame( function() { myState.draw() } );
}

CanvasStateA.prototype.addInitialSkeletonPoints = function() {
  var myState = this;

  myState.addPoint(new Point(605, 30, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(605, 125, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(605, 125, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(534, 135, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(605, 125, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(664, 135, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(605, 125, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(605, 247, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(605, 247, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(601, 318, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(534, 135, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(498, 223, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(498, 223, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(440, 298, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(440, 298, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(413, 341, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(664, 135, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(695, 220, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(695, 220, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(752, 298, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(752, 298, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(775, 336, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(601, 318, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(548, 325, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(601, 318, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(650, 325, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(548, 325, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(539, 459, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(539, 459, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(536, 594, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(536, 594, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(485, 612, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(650, 325, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(657, 450, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(657, 450, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(657, 596, 10, 'rgb(0,255,0)'));
  
  myState.addPoint(new Point(657, 596, 10, 'rgb(0,255,0)'));
  myState.addPoint(new Point(705, 604, 10, 'rgb(0,255,0)'));
  

  myState.pointsDrag = [];

  myState.skeleton.push(myState.points);
  myState.skeleton.push(myState.lines);
  myState.skeleton.push(myState.skeletonImages);
  myState.skeleton.push(myState.skeletonCounter);
  
  myState.skeletonCollection.push(myState.skeleton);
}

// Add new Point
CanvasStateA.prototype.addPoint = function(point) {
  var myState = this;

  myState.points.push(point);
  if (isEven(myState.points.length)) {
    myState.addLines(myState.points);
    var l = myState.points.length;
    addNewLineDiv(myState.points[l-2], myState.points[l-1], myState);
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
  var image = myState.skeletonImages;
  var li = image.length;

  clearC(myState);

  

  // Draw Images
  for ( var i = 0; i <= li- 1; i++) {
    image[i].putImageOnCanvas(myState.ctx, myState);

  }

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
function clearC( canvas ) {
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function clear( canvas ) {
  canvas.ctx.clearRect(0, 0, this.width, this.height);
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






function addNewLineDiv(p1, p2, myState) {
  var newLineDiv = document.createElement("div");
  newLineDiv.className = "lineActualDiv";
  newLineDiv.id = "lineActualDiv" + lineCounter;

  var newLine = document.createElement("textarea");
  newLine.className = "lineDiv";
  newLine.id = "lineDiv" + lineCounter;
  //newLine.title = lineCounter;
  newLine.innerHTML = "new line";

  var deleteLineDiv = document.createElement("div");
  deleteLineDiv.className = "deleteLineDiv";
  deleteLineDiv.id = "deleteLineDiv" + lineCounter;

  
  var imageContainer = document.createElement("div");
  imageContainer.className = "imageContainer";
  imageContainer.id = "imageOnLine" + lineCounter;
  imageContainer.style.display = "none";
  imageContainer.title = lineCounter;
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

  newLine.onclick = function() {
    canvasAnimation.lineDivSelected = newLine;
    //canvasAnimation.imageSlelected = imageContainer;
    if (chooseLine.style.display == "flex")
      addImageToLine(chooseLine, imageContainer, p1, p2);
    else showImageOnLine();
  }

  deleteLineDiv.onclick = function() {
    deleteLine(subSkeleton, imageContainer, newLineDiv, p1, p2);
  }

  currentSkeleton.style.display = "flex";
  currentSkeletonContainerOut.style.flexGrow = "1";
  currentSkeletonContainerOut.style.display = "flex";
  currentSkeleton.style.height = "10%";
  currentSkeleton.style.flexGrow = "0";
  savedSkeletons.style.flexGrow = "0";
  createSkeleton.style.flexGrow = "0";
  savedSkeletons.style.height = "10%";
  createSkeleton.style.height = "10%";

  saveSkeleton.style.display = "flex";
  saveSkeleton.style.height = "60px";

/*
  var arrow = document.createElement("div");
  arrow.className = "arrow";

  subSkeleton.appendChild(arrow);
*/

  newLineDiv.appendChild(newLine);
  newLineDiv.appendChild(deleteLineDiv);

/*
  if(currentSkeletonContainer.title != myState.skeletonCounter) {
    currentSkeletonContainer = document.createElement("div");
    currentSkeletonContainer.className = "subOptions";
    currentSkeletonContainer.id = "currentSkeletonContainer" + canvasAnimation.skeletonCounter;
    currentSkeletonContainerOut.appendChild(currentSkeletonContainer);
  }
  */
  currentSkeletonContainer.appendChild(newLineDiv);
  currentSkeletonContainer.appendChild(imageContainer);

  //imageOnLine = document.getElementById("imageOnLine" + lineCounter);
  lineCounter++;
}

function showImageOnLine() {
}

function addImageToLine(chooseLine, imageContainer, p1, p2) {
  var lineImage = document.createElement("div");
  lineImage.className = "lineImage";
  lineImage.id = "lineImage" + imageContainer.title;
  var deleteFromSkeleton = document.createElement("div");
  deleteFromSkeleton.className = "addToSkeleton";
  deleteFromSkeleton.id = "deleteFromSkeleton";


  var image = document.createElement("img");
  image.src = "images/" + chooseLine.title;
  image.id = chooseLine.title + imageContainer.title;
  image.className = "pImages";
  image.title = imageContainer.title;
  image.width = "70";
  image.height = "100";

  imageContainer.onclick = function() {
    if ( imageContainer.hasChildNodes() )
      canvasAnimation.imageSlelected = image;

  }

  deleteFromSkeleton.onclick = function() {
    deleteImageFromSkeleton(image, lineImage, imageContainer);
  }

  


  imageContainer.style.display = "block";
  imageContainer.style.height = "auto";
  imageContainer.style.flexGrow = "0";

  lineImage.appendChild(image);
  lineImage.appendChild(deleteFromSkeleton);
  imageContainer.appendChild(lineImage);

  chooseLine.style.display = "none";

  addImageToCanvas(p1, p2, image.src, image.id, imageContainer.title);
  imageOnCanvasShowOptions();
}

function imageOnCanvasShowOptions() {
  leftPanel.style.display = "flex";
  leftStickerHide.style.display = "flex";
}

function deleteLine(subSkeleton, imageContainer, newLineDiv, p1, p2) {
  newLineDiv.parentNode.removeChild(newLineDiv);
  imageContainer.parentNode.removeChild(imageContainer);
  var images = canvasAnimation.skeletonImages;
  var legnth = images.length;
  var points = canvasAnimation.points;
  var lines = canvasAnimation.lines;
  var lp = points.length;
  var ll = lines.length;
  var imageToSplice = 0;
  var pointsToDelete = 0;
  var linesToDelete = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == imageContainer.title)
      imageToSplice = i;
  }
  images.splice(imageToSplice, 1);
  for ( var i = 0; i <= lp - 1; i ++ ) {
    if (points[i] == p1) {
      if (points[i+1] == p2)
        pointsToDelete = i
    }
  }
  points.splice(pointsToDelete, 2);
  for ( var i = 0; i <= ll - 1; i++) {
    if (lines[i][0] == p1) {
      if (lines[i][1] == p2)
        linesToDelete = i
    }
  }
  lines.splice(linesToDelete, 1);

  if (!currentSkeletonContainer.hasChildNodes()) {
    saveSkeleton.style.display = "none";
  }
}

function deleteImageFromSkeleton(image, lineImage, imageContainer) {
  lineImage.parentNode.removeChild(lineImage);
  imageContainer.style.display = "none";
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == image.title)
      imageToSplice = i;
      
  }
  images.splice(imageToSplice, 1);
  canvasAnimation.imageSlelected = null;
  //canvasAnimation.skeletonImages.pop(image);
}

function addImageToCanvas(p1, p2, src, id, counter) {
  //distance = dist(p1, p2);
  //distance = dist/2;  

  //console.log(canvasA.ctx);


  var sticky = document.getElementById(id);
  //var sticky = document.getElementById("imagetotry");
  
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var rotation = Math.atan2(dy, dx);
  var angleDegrees = rotation * (180/Math.PI);
  var radians = (angleDegrees - 90) * (Math.PI/180);

  var image = new ImageForCanvas(sticky, p1, p2, radians, dist(p1, p2), counter);
  
  canvasAnimation.skeletonImages.push(image);
  //canvasA.ctx.drawImage(sticky, 100, 100);
  //sticky.src = src;
  //canvasA.drawImageOnCanvas = function() {
    
  //};
  //sticky.onload = canvasA.drawImageOnCanvas;

  

}


function projectImagesPreview() {
  //everytime that an image is added, save the filename somewhere
  var wrapper = document.createElement("div");
  wrapper.className = "imageWrapper";

  var addToSkeleton = document.createElement("div");
  addToSkeleton.className = "addToSkeleton";
  var text = document.createElement("span");
  text.className = "addToSkeleton text";
  text.innerHTML = "Add Image to Skeleton"

  addToSkeleton.appendChild(text);

  var image = document.createElement("img");
  
  image.src = "images/imagetry.png";
  image.id = "imagetry.png";
  image.className = "pImages";
  image.width = "70";
  image.height = "100";

  addToSkeleton.onclick = function(){
    chooseLine.style.display = "flex";
    chooseLine.title = image.id;
    displaySkeleton();
  };


  wrapper.appendChild(image);
  wrapper.appendChild(addToSkeleton);
  imageContainer.appendChild(wrapper);

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
  if (chooseLine.style.display == "flex") {
    subSkeleton.style.zIndex = "1";
  }
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
  if (chooseLine.style.display == "flex") {
    chooseLine.style.display = "none";
    displayCharacter();
  }

  aSkeleton.style.height = "15%";
  aSkeleton.style.flexGrow = "0";
  aSave.style.marginTop = "300px";
  aCharacter.style.height = "15%";
  aSpriteSheet.style.height = "15%";
  aSave.style.height = "15%";
  subSkeleton.style.display = "none";
  subSkeleton.style.zIndex = "0";
}

function displayCharacter() {
  if (subSkeleton.style.display == "flex")
    closeSkeleton();
  if (aSpriteSheet.style.flexGrow == "1")
    closeSpriteSheet();
  if (chooseLine.style.display == "flex")
    chooseLine.style.display = "none";
  console.log(canvasA);
  //
  //
  //;
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
  if (chooseLine.style.display == "flex") {
    chooseLine.style.display = "none";
    displayCharacter();
  }
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
  drawImageVar.style.flexGrow = "0";
  uploadImage.style.flexGrow = "0";
  imageContainer.style.display = "flex";
  projectImagesPreview();
}

function closeProjectImages() {
  projectImage.style.flexGrow = "1";
  drawImageVar.style.flexGrow = "1";
  uploadImage.style.flexGrow = "1";
  imageContainer.style.display = "none";
}

function hideChooseLine() {
  if (chooseLine.style.display == "flex") {
    chooseLine.style.display = "none";
    displayCharacter();
  }

}

function flipImageOnCanvas() {
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == canvasAnimation.imageSlelected.title) {
      images[i].rotationOffset = images[i].rotationOffset + (180 * Math.PI / 180);
      var p1, p2;
      p2 = images[i].p1;
      p1 = images[i].p2;
      images[i].p1 = p1;
      images[i].p2 = p2;
    } 
  }
}

function biggerImageOnCanvas() {
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == canvasAnimation.imageSlelected.title) {
      images[i].heightOffset = images[i].heightOffset + 10;
    } 
  }
}

function smallerImageOnCanvas() {
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == canvasAnimation.imageSlelected.title) {
      images[i].heightOffset = images[i].heightOffset - 10;
    } 
  }
}

function widerImageOnCanvas() {
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == canvasAnimation.imageSlelected.title) {
      images[i].widthOffset = images[i].widthOffset + 10;
    } 
  }
}

function narrowerImageOnCanvas() {
  var images = canvasAnimation.skeletonImages;
  var length = images.length;
  var imageToSplice = 0;
  for ( var i = 0; i <= length - 1; i++ ) {
    if (images[i].counter == canvasAnimation.imageSlelected.title) {
      images[i].widthOffset = images[i].widthOffset - 10;
    } 
  }
}

function leftStickerHidePanel() {
  leftPanel.style.display = "none";
  leftStickerHide.style.display = "none";
  leftStickerShow.style.display = "flex";
}

function leftStickerShowPanel() {
  leftPanel.style.display = "flex";
  leftStickerHide.style.display = "flex";
  leftStickerShow.style.display = "none";
}

function createSkeletonFun() {
  var result = false;
  if (currentSkeletonContainer.hasChildNodes()) {
    result = confirm("If you Create a new Skeleton, the current skeleton will we deleted. Do you wish to continue?");
  }
  if (result) {
    /*
    while (currentSkeletonContainer.firstChild) {
        currentSkeletonContainer.removeChild(currentSkeletonContainer.firstChild);
    }
    */
    currentSkeletonContainer.style.display = "none";
    canvasAnimation.points = [];
    canvasAnimation.lines = [];
    canvasAnimation.skeletonImages = [];
    canvasAnimation.skeleton = [];
    canvasAnimation.skeletonCounter = canvasAnimation.skeletonCounter + 1;
  }
  if (currentSkeletonContainer.hasChildNodes()) {
    saveSkeleton.style.display = "flex";
    saveSkeleton.style.height = "60px";
  }
  currentSkeletonContainer = document.createElement("div");
  currentSkeletonContainer.className = "subOptions";
  currentSkeletonContainer.id = "currentSkeletonContainer" + canvasAnimation.skeletonCounter;
  currentSkeletonContainer.title = canvasAnimation.skeletonCounter;

  currentSkeletonContainerOut.appendChild(currentSkeletonContainer);

  currentSkeleton.style.display = "flex";
  currentSkeletonContainerOut.style.flexGrow = "1";
  currentSkeletonContainerOut.style.display = "flex";
  currentSkeleton.style.height = "10%";
  currentSkeleton.style.flexGrow = "0";
  savedSkeletons.style.flexGrow = "0";
  createSkeleton.style.flexGrow = "0";
  savedSkeletons.style.height = "10%";
  createSkeleton.style.height = "10%";
  savedSkeletonsContainer.style.display = "none";
  if (savedSkeletonsContainer.hasChildNodes()) {
    while (savedSkeletonsContainer.firstChild) {
        savedSkeletonsContainer.removeChild(savedSkeletonsContainer.firstChild);
    }
  }

}

function saveSkeletonFun() {
  //var length = canvasAnimation.skeletonCollection.length;
  //var result = false;
  canvasAnimation.skeleton.push(canvasAnimation.points);
  canvasAnimation.skeleton.push(canvasAnimation.lines);
  canvasAnimation.skeleton.push(canvasAnimation.skeletonImages);
  canvasAnimation.skeleton.push(canvasAnimation.skeletonCounter);
/*
  for ( var i = 0; i <= length - 1; i++ ) {
    if ( canvasAnimation.skeletonCollection[i][3] == myState.skeletonCounter ) {
      result = confirm("There is ")
    }
  }
*/
  canvasAnimation.skeletonCollection.push(canvasAnimation.skeleton);
}

function showSavedSkeletons() {
  var length = canvasAnimation.skeletonCollection.length;
  var result = false;
  currentSkeleton.style.display = "flex";
  savedSkeletonsContainer.style.flexGrow = "1";
  savedSkeletonsContainer.style.display = "flex";
  currentSkeletonContainerOut.style.display = "none";
  saveSkeleton.style.display = "none";
  currentSkeleton.style.height = "10%";
  currentSkeleton.style.flexGrow = "0";
  savedSkeletons.style.flexGrow = "0";
  createSkeleton.style.flexGrow = "0";
  savedSkeletons.style.height = "10%";
  createSkeleton.style.height = "10%";
  for ( var i = 0; i <= length -1; i++ ) {
    showSavedSkeletonsDiv(i);
  }
}

function hideSavedSkeletons() {
  savedSkeletonsContainer.style.display = "none";
  if (savedSkeletonsContainer.hasChildNodes()) {
    while (savedSkeletonsContainer.firstChild) {
        savedSkeletonsContainer.removeChild(savedSkeletonsContainer.firstChild);
    }
  }
  hideSkeletons();
}

function selectShowSavedSkeletons() {
  if ( savedSkeletonsContainer.style.display == "flex" )
    hideSavedSkeletons();
  else showSavedSkeletons();
}

function showSavedSkeletonsDiv(i) {
  var skeleton = document.createElement("div");
  skeleton.id = "skeleton" + i;
  skeleton.className = "imageContainer";
  skeleton.title = i;
  skeleton.style.flexGrow = "0";
  skeleton.style.height = "70px";
  var j = i+ 1;
  skeleton.innerHTML = "Skeleton #" + j;

  var deleteSkeletonDiv = document.createElement("div");
  deleteSkeletonDiv.className = "deleteLineDiv";
  deleteSkeletonDiv.id = "deleteSkeletonDiv" + i;
  deleteSkeletonDiv.title = i;

  var newSkeletonDiv = document.createElement("div");
  newSkeletonDiv.className = "imageContainerDiv";
  newSkeletonDiv.id = "newSkeletonDiv" + i;

  skeleton.onclick = function() {
    result = confirm("If you change skeletons now, some changes might not be saved. Are you sure you want to continue?");
    if (result) {
      canvasAnimation.points = [];
      canvasAnimation.lines = [];
      canvasAnimation.skeletonImages = [];
      canvasAnimation.skeleton = [];
      canvasAnimation.skeletonCounter = 0;
      canvasAnimation.skeleton = canvasAnimation.skeletonCollection[skeleton.title];
      canvasAnimation.points = canvasAnimation.skeleton[0];
      canvasAnimation.lines = canvasAnimation.skeleton[1];
      canvasAnimation.skeletonImages = canvasAnimation.skeleton[2]; 
      canvasAnimation.skeletonCounter = canvasAnimation.skeleton[3]; 
      changeCurrentSkeletonDiv(canvasAnimation.skeletonCounter);
    }
  }
  deleteSkeletonDiv.onclick = function() {
    canvasAnimation.skeletonCollection.splice(skeleton.title, 1);
    savedSkeletonsContainer.removeChild(newSkeletonDiv);  

  }
  newSkeletonDiv.appendChild(skeleton);
  newSkeletonDiv.appendChild(deleteSkeletonDiv);
  savedSkeletonsContainer.appendChild(newSkeletonDiv);
}

function changeCurrentSkeletonDiv(count) {
  currentSkeletonContainer.style.display = "none";
  currentSkeletonContainer = document.getElementById("currentSkeletonContainer" + count);
  currentSkeletonContainer.style.display = "flex";
}

function showSkeletons() {
  currentSkeleton.style.display = "flex";
  currentSkeletonContainerOut.style.flexGrow = "1";
  currentSkeletonContainerOut.style.display = "flex";
  currentSkeleton.style.height = "10%";
  currentSkeleton.style.flexGrow = "0";
  savedSkeletons.style.flexGrow = "0";
  createSkeleton.style.flexGrow = "0";
  savedSkeletons.style.height = "10%";
  createSkeleton.style.height = "10%";
  if (currentSkeletonContainerOut.hasChildNodes())
    saveSkeleton.style.display = "flex";
  savedSkeletonsContainer.style.display = "none";
  if (savedSkeletonsContainer.hasChildNodes()) {
    while (savedSkeletonsContainer.firstChild) {
        savedSkeletonsContainer.removeChild(savedSkeletonsContainer.firstChild);
    }
  }
}

function hideSkeletons() {
  currentSkeleton.style.flexGrow = "1";
  currentSkeletonContainerOut.style.display = "none";
  currentSkeleton.style.height = "auto";
  savedSkeletons.style.flexGrow = "1";
  createSkeleton.style.flexGrow = "1";
  savedSkeletons.style.height = "auto";
  createSkeleton.style.height = "auto";
  saveSkeleton.style.display = "none";
}

function selectShowSkeletons() {
  if (currentSkeletonContainerOut.style.display == "flex")
    hideSkeletons();
  else showSkeletons();
}

function initAnimate() {
    canvasAnimation = new CanvasStateA(document.getElementById("canvasSelectorA"));
  
  //canvasAnimation.drawImageOnCanvas(sticky);

    aSkeleton.removeEventListener("click", selectSkeletonOption, false);
    aSkeleton.addEventListener("click", selectSkeletonOption, false);
  
  aCharacter.removeEventListener("click", selectCharacterOption, true);
  aCharacter.addEventListener("click", selectCharacterOption, true);
  
  aSpriteSheet.removeEventListener("click", selectSpriteSheetOption, false);
  aSpriteSheet.addEventListener("click", selectSpriteSheetOption, false);
  
  projectImage.removeEventListener("click", selectProjectImageOption, false);
  projectImage.addEventListener("click", selectProjectImageOption, false);
  
  drawImageVar.removeEventListener("click", drawToAnimate, false);
  drawImageVar.addEventListener("click", drawToAnimate, false); 

  chooseLine.removeEventListener("click", hideChooseLine, false);
  chooseLine.addEventListener("click", hideChooseLine, false);

  flipImage.removeEventListener("click", flipImageOnCanvas, false);
  flipImage.addEventListener("click", flipImageOnCanvas, false);

  biggerImage.removeEventListener("click", biggerImageOnCanvas, false);
  biggerImage.addEventListener("click", biggerImageOnCanvas, false);

  smallerImage.removeEventListener("click", smallerImageOnCanvas, false);
  smallerImage.addEventListener("click", smallerImageOnCanvas, false);

  widerImage.removeEventListener("click", widerImageOnCanvas, false);
  widerImage.addEventListener("click", widerImageOnCanvas, false);

  narrowerImage.removeEventListener("click", narrowerImageOnCanvas, false);
  narrowerImage.addEventListener("click", narrowerImageOnCanvas, false);

  leftStickerHide.removeEventListener("click", leftStickerHidePanel, false);
  leftStickerHide.addEventListener("click", leftStickerHidePanel, false);

  leftStickerShow.removeEventListener("click", leftStickerShowPanel, false);
  leftStickerShow.addEventListener("click", leftStickerShowPanel, false);

  createSkeleton.removeEventListener("click", createSkeletonFun, false);
  createSkeleton.addEventListener("click", createSkeletonFun, false);

  saveSkeleton.removeEventListener("click", saveSkeletonFun, false);
  saveSkeleton.addEventListener("click", saveSkeletonFun, false);

  savedSkeletons.removeEventListener("click", selectShowSavedSkeletons, false);
  savedSkeletons.addEventListener("click", selectShowSavedSkeletons, false);  

  currentSkeleton.removeEventListener("click", selectShowSkeletons, false);
  currentSkeleton.addEventListener("click", selectShowSkeletons, false);  
}







function webGLStart() {
    init();
}