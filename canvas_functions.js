function CanvasState( canvas ) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.tree = null;
	this.mouse = createVector( 0, 0, 1 );
	this.dragPoint = null;
	this.dragImage = null;
	this.dragTransform = null;
	this.showSkeleton = true;
	this.translate = true;
	this.rotate = false;
	this.selectImage = false;

	this.mouseUpTimer = 0;
	this.mouseDownTimer = 0;

	var myState = this;
	

	myState.canvas.addEventListener( "mousedown", function( e ) {
		mouseDown( myState, e );
	});

	myState.canvas.addEventListener( "mouseup", function( e ) {
		mouseUp( myState, e );
	});

	myState.canvas.addEventListener( "mousemove", function( e ) {
		mousemove( myState, e );
	});

	requestAnimationFrame( function() { myState.paint( myState.tree ) } );

}

function mousemove( myState, e ) {
	if ( myState.dragPoint ) {
		if ( myState.rotate ) 
				rotatingPoint( myState, e );
			else draggingPoint( myState, e );
	} else if ( myState.dragTransform ) {
		draggingTransform( myState, e );
	} else if ( myState.dragImage ) {
		draggingImage( myState, e );
	}
}

function rotatingPoint( myState, e ) {
	var mouse = myState.getMouse( e );
	var n = myState.tree.root.findSelected();

	//var point = {x: n.translation.x, y: n.translation.y};
	
	var rad = 0;
	if ( n.parent != null ) {
		var local = n.parent.getPointinLocal( mouse );
		//console.log(local);
	//	n.translation.x = local.x;
	//	n.translation.y = local.y;
		//rad = n.parent.getRotation( local );
		//var rot = rad / Math.PI * 180.0;
		//console.log(rot);
	//n.translation.x = point.x;
	//n.translation.y = point.y;
	//var rotation =  n.rotation - rad;
	
		n.rotatePoint( local );
	} else {

	}
}

function draggingPoint( myState, e ) {
	var mouse = myState.getMouse( e );
	var n = myState.tree.root.findSelected();
	if ( n.parent != null )
		var local = n.parent.getPointinLocal( mouse );
	else var local = createVector( mouse[0], mouse[1], 1 );
	n.translation[0] = local[0];
	n.translation[1] = local[1];
	if ( n.parent != null )
		var dist = n.parent.getDistance( n );
	else var dist = Math.sqrt( (n.translation[0]) * (n.translation[0]) + (n.translation[1]) * (n.translation[1]) );
	//var rad = n.parent.getRotation( n );
	n.distance = dist;
	//n.rotation = rad;
	//n.translation.x = n.distance * Math.cos( n.rotation );
	//n.translation.x = n.distance * Math.sin( n.rotation );

	n.updateMatrices();
}

function draggingImage( myState, e ) {
	var mouse = myState.getMouse( e );
	var n = myState.tree.root.findSelectedImage();
	if ( n.parent != null )
		var local = n.parent.getPointinLocal( mouse );
	else var local = createVector( mouse[0], mouse[1], 1 );
	n.translation[0] = local[0] - n.img.width/2;
	n.translation[1] = local[1] - n.img.height/2;
	if ( n.parent != null )
		var dist = n.parent.getDistance( n );
	else var dist = Math.sqrt( (n.translation[0]) * (n.translation[0]) + (n.translation[1]) * (n.translation[1]) );
	//var rad = n.parent.getRotation( n );
	n.updateMatrices( dist );

}

function draggingTransform( myState, e ) {
	var mouse = myState.getMouse( e );
	//var image = myState.tree.root.findSelectedImage();
	var transform = myState.tree.root.findSelectedTransform();
	var n = transform[0];
	var image = transform[1];
	/*
	if ( n == image.transform.p1 ) {

	}

	if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
    if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

    if (clicked.onLeftEdge) {
      var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
      if (currentWidth > minWidth) {
        pane.style.width = currentWidth + 'px';
        pane.style.left = e.clientX + 'px';	
      }
    }

    if (clicked.onTopEdge) {
      var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
      if (currentHeight > minHeight) {
        pane.style.height = currentHeight + 'px';
        pane.style.top = e.clientY + 'px';	
      }
    }
*/
	if ( n == image.transform.rotateP ) {
		var local = image.parent.getPointinLocal( mouse );
		image.rotateImage( local );
		return;
	}


	if ( image.parent != null )
		var local = image.parent.getPointinLocal( mouse );
	else var local = createVector( mouse[0], mouse[1], 1 );
	n[0] = local[0];
	n[1] = local[1];


	
	image.getNewWidthAndHeight();
	//var dist = Math.sqrt( (n[0]) * (n[0]) + (n[1]) * (n[1]) );
	
}


function mouseUp( myState, e ) {
	var d = new Date();
	myState.mouseUpTimer = d.getTime();

	if ( myState.mouseUpTimer - myState.mouseDownTimer < 200 ) {
		click( myState, e );
		return;
	}

	var mouse = myState.getMouse( e );

	if ( myState.dragPoint != null ) {
		myState.dragPoint = null;
	} else if ( myState.dragImage != null ) {
		myState.dragImage = null;
	} else if ( myState.dragTransform != null ) {
		myState.dragTransform = null;
	} else if ( !myState.hasTrees() ){
		var tree = new Tree();
		//myState.trees.push( tree );
		myState.tree = tree;
		tree.addRoot( mouse );
	} else {
		myState.tree.root.findSelected().addChild( mouse );
	}

	

}

function mouseDown( myState, e ) {
	var d = new Date();
	myState.mouseDownTimer = d.getTime();

	if ( myState.mouseDownTimer - myState.mouseUpTimer < 200 ) {
		doubleclick( myState, e );
		return;
	}

	myState.mouse = myState.getMouse( e );
	
	if ( !myState.hasTrees() ) return;

	var a = null, b = null, c = null;

	a = myState.tree.root.nodeHasPoint( myState.mouse );
	b = myState.tree.root.imageHasPoint( myState.mouse );
	c = myState.tree.root.transformHasPoint( myState.mouse );

	if ( a != null ) {
		myState.tree.root.findSelected().selected = false;
		a.selected = true;
		b = null;
		c = null;
	}
	else if ( c != null ) {
		myState.tree.root.findSelectedTransform()[0].selected = false;
		c.selected = true;
		a = null;
		b = null;
	}
	else if ( b != null ) {
		myState.tree.root.findSelectedImage().selected = false;
		b.selected = true;
		a = null;
		c = null;
	}
	
	
	

	myState.dragPoint = a;
	myState.dragImage = b;
	myState.dragTransform = c;

}

function click( myState, e ) {
	
	var mouse = myState.getMouse( e );

	if ( myState.dragPoint != null ) {
		myState.dragPoint = null;
	} else if ( myState.dragImage != null ) {
		myState.dragImage = null;
	} else if ( myState.dragTransfrom != null ) {
		myState.dragTransform = null;
	} else if ( !myState.hasTrees() ){
		var tree = new Tree();
		//myState.trees.push( tree );
		myState.tree = tree;
		tree.addRoot( mouse );
	} else {
		var counter = 0;
		if ( myState.tree != null )
			counter = myState.tree.root.countNodes(counter);
		myState.tree.root.findSelected().addChild( mouse, counter );
	}
	if ( myState.tree != null ) {
		var s = myState.tree.root.extractData();s
		updateTreeStructure( s );
	}
}

function updateTreeStructure( htmlObject ) {
	var treeStructure = document.getElementById("treeStructure");
	treeStructure.innerHTML = "<ul class='listNodes'>" + htmlObject + "</ul>";
}

CanvasState.prototype.hasTrees = function() {
	if ( this.tree == null ) return false;
	else return true;
}

CanvasState.prototype.getMouse = function( e ) {
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
	  
	return createVector(mx, my, 1);

}

CanvasState.prototype.paint = function( tree ) {
	var myState = this;

	myState.ctx.clearRect( 0, 0, myState.canvas.width, myState.canvas.height );
	
	if ( myState.tree != null ) {
		myState.paintImages( myState.tree.root );
		if ( myState.showSkeleton ) {
			myState.paintSkeleton( myState.tree.root );	
			myState.paintLines( myState.tree.root );
		}
		
		/*if ( this.imagesOn )
			myState.paintImages( myState.tree.root );
			*/
	}
	//var d = new Date();

	requestAnimationFrame( function() { myState.paint( myState.tree ) } );
}

CanvasState.prototype.paintSkeleton = function( node ) {
	this.paintNode( node );
	

	if ( node.children.length == 0 ) return;

	for ( var i = 0; i < node.children.length; i++ ) {
		//this.paintNode( node.children[i] );
		this.paintSkeleton( node.children[i] );
	}
	
}
CanvasState.prototype.paintLines = function( node ) {
	this.paintLine( node );
	
	if ( node.children.length == 0 ) return;

	for ( var i = 0; i < node.children.length; i++ ) {
		//this.paintNode( node.children[i] );
		this.paintLines( node.children[i] );
	}
}
CanvasState.prototype.paintLine = function( node ) {

	var m = node.globalMatrix;
	this.ctx.strokeStyle = "#000000";

	for ( var i = 0; i < node.children.length; i++ ) {
		this.ctx.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );

		this.ctx.beginPath();
		this.ctx.moveTo( 0, 0 );
		this.ctx.lineTo( node.children[i].translation[0], node.children[i].translation[1] );
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

}


CanvasState.prototype.paintNode = function( node ) {
	var m = node.globalMatrix;
	this.ctx.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );

  	if ( node.selected )
  		this.ctx.strokeStyle = "#ff0000";
  	else
  		this.ctx.strokeStyle = "#000000";
  	this.ctx.beginPath();
  	this.ctx.rect(-5, -5, 10, 10);
  	this.ctx.stroke();
  	if ( node.selected )
  		this.ctx.strokeStyle = "#ff0000";
  	else
  		this.ctx.strokeStyle = "#000000";
  	this.ctx.beginPath();
  	this.ctx.arc(0, 0, node.dim, 0, 2 * Math.PI);
  	this.ctx.stroke();
  	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}
CanvasState.prototype.paintImages = function( node ) {
	if ( node.images.length > 0 ) {
		for ( var i = 0; i < node.images.length; i++ ) {
			this.paintImage( node, node.images[i] );	
		}
	}

	if ( node.children.length == 0 ) return;

	for ( var i = 0; i < node.children.length; i++ ) {
		this.paintImages( node.children[i] );
	}
	
}

CanvasState.prototype.paintImage = function( node, image ) {
	var m = node.globalMatrix;
	this.ctx.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );
  	//this.ctx.setTransform( 1, 0, 0, 1, node.translation.x, node.translation.y );
  	//this.ctx.rotate( node.rotation );
  	//this.ctx.drawImage( node.image, node.image.style.x, node.image.style.y, node.image.width, node.image.height );
  	this.ctx.drawImage( image.img, image.translation[0], image.translation[1], image.img.width, image.img.height );
  	
  	if ( this.showSkeleton ) {
  	this.ctx.strokeStyle = "#0000ff";
  	this.ctx.beginPath();
  	this.ctx.rect( image.translation[0], image.translation[1], image.img.width, image.img.height );
  	this.ctx.stroke();
  	
  	
  	drawDragAnchor(image.transform.p1, image.transform.radius, this.ctx);
    drawDragAnchor(image.transform.p2, image.transform.radius, this.ctx);
    drawDragAnchor(image.transform.p3, image.transform.radius, this.ctx);
    drawDragAnchor(image.transform.p4, image.transform.radius, this.ctx);
    //drawDragAnchor(image.transform.rotateP, image.transform.radius, this.ctx);
  	}

  	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawDragAnchor( point, radius, ctx ) {
		ctx.strokeStyle = "#0000ff";
		ctx.fillStyle = "#72bcd4";
        ctx.beginPath();
        ctx.rect( point[0] - radius/2, point[1] - radius/2, radius, radius );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    }


CanvasState.prototype.isRotating = function() {
	return this.rotate;
}
CanvasState.prototype.activateRotation = function() {
	this.rotate = true;
	this.translate = false;
}
CanvasState.prototype.desactivateRotation = function() {
	this.rotate = false;
	this.translate = true;
}
CanvasState.prototype.isTranslating = function() {
	return this.translate;
}
CanvasState.prototype.activateTranslation = function() {
	this.translate = true;
	this.rotate = false;
}
CanvasState.prototype.desactivateTranslation = function() {
	this.translate = false;
	this.rotate = true;
}

CanvasState.prototype.loadSpriteImage = function( spriteImage ) {

}


function SpriteSheet( bool, canvas ) {
	this.flagDownload = bool;
	this.newLine = false;
	this.height = 0;
	this.width = 0;
	this.origin = createVector( 0, 0, 1 );
	this.newFrame = this.origin;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.scaleConstant = 1;
	this.counter = 0;


	this.frameHeight = 0;
	this.frameWidth = 0;
	this.frameIndex = 0;
	this.numberOfFrames = 0;
	this.tickCount = 0;
	this.ticksPerFrame = 4; //15 fps
	this.loop = true;
}

SpriteSheet.prototype.recalculateHeight = function( spriteToCanvas ) {
	var fakeCanvas = document.createElement('canvas');
	fakeCanvas.height = this.height;
	fakeCanvas.width = this.width;
	fakeCanvas.getContext("2d").drawImage(this.canvas, 0, 0);
	this.height = this.height + spriteToCanvas.height * this.scaleConstant;
	this.canvas.height = this.height;
	this.ctx.drawImage(fakeCanvas,0,0);
}

SpriteSheet.prototype.recalculateWidth = function( spriteToCanvas ) {
	if ( this.newFrame[0] < this.width ) return;
	var fakeCanvas = document.createElement('canvas');
	fakeCanvas.height = this.height;
	fakeCanvas.width = this.width;
	fakeCanvas.getContext("2d").drawImage(this.canvas, 0, 0);
	this.width = this.width + this.frameWidth * this.scaleConstant;
	this.canvas.width = this.width;
	this.ctx.drawImage(fakeCanvas,0,0);
}

SpriteSheet.prototype.calculateHeight = function( spriteToCanvas ) {
	console.log(spriteToCanvas.height);
	if ( this.flagDownload ) {
		this.height = spriteToCanvas.height;
		this.frameHeight = spriteToCanvas.height;
	}
	else this.height = spriteToCanvas.height * this.scaleConstant;

	this.canvas.height = this.height;
}

SpriteSheet.prototype.calculateWidth = function( spriteToCanvas ) {
	console.log(spriteToCanvas.width);
	if ( this.flagDownload ) {
		this.width = spriteToCanvas.width;
		this.frameWidth = spriteToCanvas.width;
	}
	else this.width = spriteToCanvas.width * this.scaleConstant * 4; //el 4 és una constant que pot variar, de moment es queda així hardcoded

	this.canvas.width = this.width;
	this.frameWidth = spriteToCanvas.width;
}

SpriteSheet.prototype.saveImageInSpriteSheet = function( spriteToCanvas ) {
	var addedWidth = spriteToCanvas.width ;

	if ( this.flagDownload ) {
		this.recalculateWidth( spriteToCanvas );
	}

	this.ctx.drawImage( spriteToCanvas, this.newFrame[0], this.newFrame[1] );
	this.newFrame[0] = this.newFrame[0] + addedWidth;

	this.counter++;
	if ( this.counter > 3 && !this.flagDownload) {
		this.recalculateWidth( spriteToCanvas );
	} 
	

}

SpriteSheet.prototype.getScale = function( canvas, img ) {
    var scale = Math.min( canvas.width / img.width, canvas.height / img.height );
   	this.scaleConstant = scale;
}

function saveSpriteSheet( canvasState, spriteSheetToShow, spriteSheetToDownload ) {
	var spriteToCanvas = getImageFromCanvas( canvasState );
	spriteSheetToShow.ctx.save();
	spriteSheetToShow.ctx.scale( spriteSheetToShow.scaleConstant, spriteSheetToShow.scaleConstant );
	spriteSheetToShow.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToShow.ctx.restore();
	spriteSheetToShow.numberOfFrames += 1;

	spriteSheetToDownload.ctx.save();
	spriteSheetToDownload.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToDownload.ctx.restore();
	spriteSheetToDownload.numberOfFrames += 1;

	return [spriteSheetToShow, spriteSheetToDownload];
}

function getImageFromCanvas( canvasState ) {
	var spriteImage = canvasState.ctx.getImageData(0,0,canvasState.canvas.width, canvasState.canvas.height);
	
	var spriteToCanvas = document.createElement('canvas');
	spriteToCanvas.height = spriteImage.height;
	spriteToCanvas.width = spriteImage.width;
	spriteToCanvas.getContext("2d").putImageData(spriteImage, 0, 0);

	return spriteToCanvas;
}


function createStateSprite( canvasState ) {
	var spriteToCanvas = getImageFromCanvas( canvasState );

	var spriteSheet_show = document.getElementById("canvas2");
	var spriteSheetToShow = new SpriteSheet( false, spriteSheet_show );
	spriteSheetToShow.getScale( spriteSheet_show, spriteToCanvas );
	spriteSheetToShow.calculateHeight( spriteToCanvas );
	spriteSheetToShow.calculateWidth( spriteToCanvas );
	spriteSheetToShow.canvas.parentElement.style.display = "block";
	spriteSheetToShow.ctx.save();
	spriteSheetToShow.ctx.scale( spriteSheetToShow.scaleConstant, spriteSheetToShow.scaleConstant );
	spriteSheetToShow.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToShow.ctx.restore();

	var spriteSheet_download = document.createElement('canvas');
	var spriteSheetToDownload = new SpriteSheet( true, spriteSheet_download );
	spriteSheetToDownload.calculateHeight( spriteToCanvas );
	spriteSheetToDownload.calculateWidth( spriteToCanvas );
	spriteSheetToDownload.saveImageInSpriteSheet( spriteToCanvas );

	return [spriteSheetToShow, spriteSheetToDownload];
}

function addImageHTML( element ) {
	var image = document.createElement("img");
	image.src = "mob/" + element.id + ".png";
	image.class = "imagePreview";
	element.insertBefore( image, element );
}

function addImagesToElements( elements ) {
  	for ( var i = 0; i < elements.length-1; i++ ) {
  		addImageHTML( elements[i] );
  	}
};

function previewFile(e) {
	//var reader  = new FileReader();
	var img = document.createElement("img");
	var file    = document.querySelector('input[type=file]').files[0];
	img.height = 200;
	img.width = 200;
	var reader = new FileReader();

    reader.onload = function(event){
        var image = new Image();
        image.onload = function(){
            addImageToNode( image );
        }
        image.src = event.target.result;
        img.src = image.src;
    }
    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        image.src = "";
        img.src = image.src;
    }
      
    var parent = document.getElementById("imageList");
	console.log(parent);
    parent.appendChild(img);

}

function addImageToNode( image ) {
	var selectedNode = canvasState.tree.root.findSelected();
	var img = new SceneImage( image );
	img.scale = 0.25;
	img.img.width = image.width * img.scale;
	img.img.height = image.height * img.scale;
	img.translation[0] = -image.width / 2;
	img.translation[1] = -image.height / 2;
	img.img.style.x = 0;
	img.img.style.y = 0;
	img.parent = selectedNode;
	img.calculateLocalMatrix();
	img.updateImageVertices();
	selectedNode.images.push( img );
/*
	console.log(selectedNode.images[0].img);
	console.log(img.img.src);

	canvasState.ctx.drawImage(selectedNode.images[0].img,selectedNode.images[0].translation[0],selectedNode.images[0].translation[1], selectedNode.images[0].img.width, selectedNode.images[0].img.height );
*/
}
var id;
function animateSprite( canvasAnimate, spritesheet, ctx ) {
	//canvasState.ctx.requestAnimationFrame( animateSprite );
	
	
	updateAnimationSprite( canvasAnimate, spritesheet );
	renderSprite( canvasAnimate, spritesheet, ctx );
	id = requestAnimationFrame( function() { animateSprite( canvasAnimate, spritesheet, ctx ) } );
	if ( !start_stop ) {
		cancelAnimationFrame( id );
		//id = undefined;
	}
	
	//cancelAnimationFrame(id);
}

function renderSprite( canvasAnimate, spritesheet, ctx ) {	
	ctx.clearRect(0, 0, spritesheet.frameWidth, spritesheet.frameHeight);

	ctx.drawImage(spritesheet.canvas, 
	spritesheet.frameIndex * spritesheet.frameWidth,
	0, 
	spritesheet.width,
	spritesheet.height,
	0,
	0,
	spritesheet.width,
	spritesheet.height
	);
}

function updateAnimationSprite( canvasAnimate, spritesheet ) {
	spritesheet.tickCount += 1;
			
    if (spritesheet.tickCount > spritesheet.ticksPerFrame) {
    	spritesheet.tickCount = 0;
    	
    	if (spritesheet.frameIndex < spritesheet.numberOfFrames) {	
            spritesheet.frameIndex += 1;
        } else if (spritesheet.loop) {
            spritesheet.frameIndex = 0;
        }
        //spritesheet.frameIndex += 1; 
    }
}

var canvasState;
var start_stop = false;

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
} 


//init
function init() {
	var wrapper = document.getElementById("canvasWrapper");
	var canvas = document.getElementById("canvas");
	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;
	//var node1 = new Node();
	//var canvasState = new CanvasState( canvas, node1 );
	canvasState = new CanvasState( canvas, false );
	//canvasState.rotate = false;
	var rotate = document.getElementById("rotate");
	var translate = document.getElementById("translate");
	var images = document.getElementById("images");
	var save = document.getElementById("spriteOptionSavePose");
	var timeline = document.getElementById("timelineWrapper");
	var download = document.getElementById("spriteOptionDownload");
	var spriteSheetShow = null;
	var spriteSheetDownload = null;


	save.addEventListener("click", function() {
		if ( timeline.style.display == "" ) timeline.style.display = "flex";
		if ( spriteSheetShow == null && spriteSheetDownload == null) {
			var sprite = createStateSprite( canvasState );
			spriteSheetShow = sprite[0];
			spriteSheetDownload = sprite[1];
		} else {
			var sprite = saveSpriteSheet( canvasState, spriteSheetShow, spriteSheetDownload );
			spriteSheetShow = sprite[0];
			spriteSheetDownload = sprite[1];
		}

	});

	
	download.addEventListener("click", function() {
		var image = spriteSheetDownload.canvas.toDataURL("image/png");
		var link = document.createElement('a');
		link.download = 'filename.png';
		link.href = image;
		link.click();
	});

	var spriteStructure = document.getElementById("spriteStructure");
	var treeStructure = document.getElementById("treeStructure");
	var spriteSheetContainer = document.getElementById("spriteStructureContainer");

	spriteStructure.addEventListener("click", function() {
		if ( spriteSheetContainer.style.display == "none" ) {
			spriteSheetContainer.style.display = "flex";
			treeStructure.style.maxHeight = "50%";
		} else {
			spriteSheetContainer.style.display = "none";
			treeStructure.style.maxHeight = "inherit";
		}
	});

	var imageStructure = document.getElementById("imageStructure");
	var characterImage = document.getElementById("characterImage");

	imageStructure.addEventListener("click", function() {
		if ( characterImage.style.display == "none" ) {
			characterImage.style.display = "flex";
			treeStructure.style.maxHeight = "50%";
		} else {
			characterImage.style.display = "none";
			treeStructure.style.maxHeight = "inherit";
		}
	});

	var timelineContainer = document.getElementById("timelineContainer");
	var showTimeline = document.getElementById("showTimeline");

	showTimeline.addEventListener("click", function() {
		if ( timelineContainer.style.display != "none" ) {
			timelineContainer.style.display = "none";
			timelineWrapper.style.height = "auto";
		} else {
			timelineContainer.style.display = "flex";
			timelineWrapper.style.height = "20%";
		}
	});

	var imageListElements = document.getElementsByClassName("imageElement");

	addImagesToElements( imageListElements );

	var imageLoader = document.getElementById('characterPutImage');
    imageLoader.addEventListener('change', previewFile, false);

    var play_stop = document.getElementById('play-stop');
    var canvasAnimate = document.getElementById("animation");
    var previewCanvas = document.getElementById("previewCanvas");
    var backPreview = document.getElementById("backPreview");
	var ctx = canvasAnimate.getContext("2d");
    canvasAnimate.height = canvas.height;
    canvasAnimate.width = canvas.width;
    var visited = false;


    play_stop.addEventListener("click", function() {
    	if ( canvas.style.display == "none" && start_stop ) {
    		start_stop = false;
    		document.getElementById("icon_play_stop").src="images/icons8-play-50.png";
    		/*canvas.style.display = "block";
    		previewCanvas.style.display = "none";*/
    	} else {
    		start_stop = true;
    		document.getElementById("icon_play_stop").src="images/icons8-pause-48.png";
    		previewCanvas.style.display = "block";
    		canvas.style.display = "none";
    		//if ( !visited ) {
    			animateSprite( canvasAnimate, spriteSheetDownload, ctx );
    		//	visited = true;
    		//}
    	}
    	
    });

    backPreview.addEventListener("click", function() {
    	start_stop = false;
    	canvas.style.display = "block";
    	previewCanvas.style.display = "none";
    });

    var rotate = document.getElementById("rotate");
	var translate = document.getElementById("translate");
	var show_hide = document.getElementById("show-hide");
	
	rotate.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isRotating() ) {
			canvasState.desactivateRotation();
			removeClass(rotate, 'selected');
			addClass(translate, 'selected');
		}
		else { 
			canvasState.activateRotation();
			addClass(rotate, 'selected');
			removeClass(translate, 'selected');
			//rotate.className += ' selected';
		}
		//console.log( canvasState.tree );
	});

	translate.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isTranslating() ) {
			canvasState.desactivateTranslation();
			removeClass(translate, 'selected');
			addClass(rotate, 'selected');
		}
		else { 
			canvasState.activateTranslation();
			addClass(translate, 'selected');
			removeClass(rotate, 'selected');
			//translate.className += ' selected';
		}
		//console.log( canvasState.tree );
	});

	show_hide.addEventListener("click", function() {
		if ( canvasState.showSkeleton ) canvasState.showSkeleton = false;
		else canvasState.showSkeleton = true;
	})

	var collectionImages = document.getElementById("collectionImages");
	var imagesWrapper = document.getElementById("imagesWrapper");
	
	collectionImages.addEventListener("click", function() {
		if ( imagesWrapper.style.display == "none")
			imagesWrapper.style.display = "block";
		else imagesWrapper.style.display = "none";
	});

	var load_character = document.getElementById("load-character");
	var load_animation = document.getElementById("load-animation");

	load_character.addEventListener("click", function() {
		canvasState.loadCharacter();
	});
	load_animation.addEventListener("click", function() {
		if ( timeline.style.display == "" ) timeline.style.display = "flex";
		var spriteToCanvas = new Image();
		spriteToCanvas.src = "mob/mob_animation.png";
		spriteToCanvas.crossOrigin = "Anonymous";
		spriteToCanvas.height = 747;
		spriteToCanvas.width = 10688;
		spriteToCanvas.onload = function() {
			var sprite1 = canvasState.loadAnimation(this);
			spriteSheetShow = sprite1[0];
			spriteSheetDownload = sprite1[1];
		}
	});
/*
	images.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isImagesOn() )
			canvasState.putImagesOff();
		else canvasState.putImagesOn();
		console.log( canvasState.tree );
	});
	*/

}