function CanvasState( canvas ) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	//this.trees = [];
	this.tree = null;
	this.mouse = createVector( 0, 0, 1 );
	this.dragPoint = null;
	this.dragImage = null;
	this.dragTransform = null;
	this.imagesOn = false;
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
	} else if ( myState.dragImage ) {
		draggingImage( myState, e );
	} else if ( myState.dragTransform ) {
		draggingTransform( myState, e );
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
	else var dist = Math.sqrt( (n.translation.x) * (n.translation.x) + (n.translation.y) * (n.translation.y) );
	//var rad = n.parent.getRotation( n );
	n.distance = dist;
	//n.rotation = rad;
	//n.translation.x = n.distance * Math.cos( n.rotation );
	//n.translation.x = n.distance * Math.sin( n.rotation );

	n.updateMatrices();
}

function draggingImage( myState, e ) {

}

function draggingTransform( myState, e ) {

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
	} else if ( myState.dragTransfrom != null ) {
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
	}
	else if ( b != null ) {
		myState.tree.root.findSelected().selected = false;
		b.selected = true;
	}
	else if ( c != null ) {
		myState.tree.root.findSelected().selected = false;
		c.selected = true;
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
		myState.paintSkeleton( myState.tree.root );	
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
CanvasState.prototype.paintNode = function( node ) {
	var m = node.globalMatrix;
	this.ctx.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );
  	//this.ctx.setTransform( 1, 0, 0, 1, node.translation.x, node.translation.y );
  	//this.ctx.rotate( node.rotation );
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
	this.width = this.width + spriteToCanvas.width * this.scaleConstant;
	this.canvas.width = this.width;
	this.ctx.drawImage(fakeCanvas,0,0);
}

SpriteSheet.prototype.calculateHeight = function( spriteToCanvas ) {
	console.log(spriteToCanvas.height);
	if ( this.flagDownload ) this.height = spriteToCanvas.height;
	else this.height = spriteToCanvas.height * this.scaleConstant;

	this.canvas.height = this.height;
}

SpriteSheet.prototype.calculateWidth = function( spriteToCanvas ) {
	console.log(spriteToCanvas.width);
	if ( this.flagDownload ) this.width = spriteToCanvas.width;
	else this.width = spriteToCanvas.width * this.scaleConstant * 4; //el 4 és una constant que pot variar, de moment es queda així hardcoded

	this.canvas.width = this.width;
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

	spriteSheetToDownload.ctx.save();
	spriteSheetToDownload.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToDownload.ctx.restore();

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

function previewFile() {
	var reader  = new FileReader();
	var img = document.createElement("img");
	var file    = document.querySelector('input[type=file]').files[0];
	img.height = 200;
	img.width = 200;
	reader.onloadend = function () {
           img.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           img.src = "";
       }
    var parent = document.querySelector("input[type=file]").parentElement;
	console.log(parent);
    parent.appendChild(img);
}

//init
function init() {
	var wrapper = document.getElementById("canvasWrapper");
	var canvas = document.getElementById("canvas");
	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;
	//var node1 = new Node();
	//var canvasState = new CanvasState( canvas, node1 );
	var canvasState = new CanvasState( canvas, false );
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

	/*
	rotate.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isRotating() )
			canvasState.desactivateRotation();
		else canvasState.activateRotation();
		//console.log( canvasState.tree );
	});

	translate.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isTranslating() )
			canvasState.desactivateTranslation();
		else canvasState.activateTranslation();
		//console.log( canvasState.tree );
	});

	images.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isImagesOn() )
			canvasState.putImagesOff();
		else canvasState.putImagesOn();
		console.log( canvasState.tree );
	});
	*/

}