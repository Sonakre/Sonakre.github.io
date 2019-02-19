// Model
function Tree() {
	this.root = null;
}

Tree.prototype.findSelected = function() {
  	var queue = [this.root];
  	while(queue.length) {
    	var node = queue.shift();
    	if(node.selected) {
     		return node;
    	}
    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
  	return null;
};

function Node() {
	this.point = null;
	this.parent = null;
	this.children = [];
	this.selected = true;
	this.localMatrix = create();
	this.globalMatrix = create();
	this.images = [];
}

Node.prototype.translate = function() {
	var node = this;
	var point = this.point;
	
	if ( node.parent != null ){
		var px = node.parent.point.x;
		var py = node.parent.point.y;
	} else {
		var px = 0;
		var py = 0;
	}

	var dist = (point.x - px) * (point.x - px) + (point.y - py) * (point.y - py);
	var translateMatrix = create();

	fromTranslation(translateMatrix, [Math.sqrt(dist),0]);

	return translateMatrix;
}

Node.prototype.rotate = function() {
	var node = this;
	var point = node.point;
	
	if ( node.parent != null ){
		var px = node.parent.point.x;
		var py = node.parent.point.y;
	} else {
		var px = 0;
		var py = 0;
	}
	var dx = point.x - px;
	var dy = point.y - py;
	var rot = Math.atan2(dy, dx);
	var newRot = rot < 0 ? Math.PI + rot : 0;
	var rotateMatrix = create();

	if ( node.parent != null ) {
		if ( node.parent.globalMatrix[1] < 0 && node.parent.globalMatrix[0] > 0 ) var rotParent = Math.asin( node.parent.globalMatrix[1] );
		else if ( node.parent.globalMatrix[1] < 0 && node.parent.globalMatrix[0] < 0 ) var rotParent = - Math.acos( node.parent.globalMatrix[0] );
		else var rotParent = Math.acos( node.parent.globalMatrix[0] );
		var sign = rot > rotParent ? 1 : -1;
		rot = rot - rotParent;
		//var K = -sign * Math.PI * 2;
    	//var rot = (Math.abs(K + rot) < Math.abs(rot))? K + rot : rot;
	}

	fromRotation( rotateMatrix, rot );

	return rotateMatrix;
}

Node.prototype.getLocal = function() {
	//console.log(this.parent.;
	var translateMatrix = this.translate();
	var rotateMatrix = this.rotate();

	//this.localMatrix = [rotateMatrix[0], rotateMatrix[1], rotateMatrix[2], rotateMatrix[3], rotateMatrix[4], rotateMatrix[5], translateMatrix[6], translateMatrix[7], translateMatrix[8]];
	multiply( this.localMatrix, rotateMatrix, translateMatrix );	
}

Node.prototype.getGlobal = function() {
	var node = this;
	if ( node.parent == null ) {
		node.globalMatrix = node.localMatrix;
	} else {

		multiply( node.globalMatrix, node.parent.globalMatrix, node.localMatrix );

	}
}

Node.prototype.updatePoint = function() {
	var n = this;
	if ( n.parent == null ) {
		n.point.x = n.localMatrix[6];
		n.point.y = n.localMatrix[7];
	} else {
		console.log(Math.acos(n.globalMatrix[0]) * 180/Math.PI);
		var p = [];
		transformMat3(p, [0,0], n.globalMatrix);
		n.point.x = p[0];
		n.point.y = p[1];
	}

}

Node.prototype.addChild = function( node, tree ) {
	var n = this;
	
	n.selected = false;
	n.children.push( node );
	node.parent = n;
		
	node.getLocal();
	node.getGlobal();
	node.updatePoint();
}

Node.prototype.update = function( mouse ) {
	var n = this;
	
	n.point.x = mouse.x;
	n.point.y = mouse.y;
	
	n.globalMatrix[6] = mouse.x;
	n.globalMatrix[7] = mouse.y;
	
	for ( var i = 0; i < n.children.length; i++ ) {
		n.children[i].updateSubtree();
	}
}

Node.prototype.updateSubtree = function() {
	var queue = [this];
  	while(queue.length) {
    	var node = queue.shift();
    	node.getGlobal();
		node.updatePoint();
    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
}

Node.prototype.updateSubtreeLocal = function() {
	var queue = [this];
  	while(queue.length) {
    	var node = queue.shift();
    	node.getLocal();
    	node.getGlobal();
		node.updatePoint();
    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
}

function Point( p ) {
	this.x = p.x || 0;
	this.y = p.y || 0;
	this.radius = 40;
	this.fill = "";
}

Point.prototype.contains = function( mx, my ) {
  	var distsq = (mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y);
  	var rsq = this.radius * this.radius;

  	return distsq < rsq;
}

Point.prototype.findBFS = function( tree ) {
  	var queue = [tree.root];
  	var p = this;
  	while(queue.length) {
    	var node = queue.shift();
    	if(node.point.contains(p.x, p.y)) {
     		return node;
    	}
    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
  	return null;
};


// Controller
function CanvasState( canvas, tree ) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.mouse = null;
	this.drag = false;
	
	var myState = this;
	//var selectedNode = new Node();

	canvas.addEventListener( "mousemove", function( e ) {
		if ( myState.drag ) {
			myState.movePoint( e, tree );
		}
	});

	canvas.addEventListener( "mousedown", function( e ) {
		myState.mouse = myState.getMouse( e );
		myState.mousedown( myState.mouse, tree );

	});

	canvas.addEventListener( "mouseup", function( e ) {
		var mouse = myState.getMouse( e );
		myState.mouseup( mouse, tree );
		myState.drag = false;
	});

	myState.render( tree );
}

CanvasState.prototype.movePoint = function( e, tree ) {
	var myState = this;
	var mouse = myState.getMouse( e );
	var n = tree.findSelected();

	n.update( mouse );
	//console.log(n);
}

CanvasState.prototype.mouseup = function( mouse, tree ) {
	var myState = this;
	var m = new Point( mouse );
	//myState.createNode( m, tree );
	if ( mouse.x == myState.mouse.x && mouse.y == myState.mouse.y ) {
		console.log( mouse );
		var node = null;
		if ( tree.root != null ) {
			var m = new Point( mouse );
			node = m.findBFS( tree );
			
		}
		if ( node == null ) {
			myState.createNode(  mouse, tree );
			//console.log(selectedNode);
		} else {
			tree.findSelected().selected = false;
			node.selected = true;
		}
	} else {
		var node = tree.findSelected();
		console.log(tree);	
		node.getLocal();
		node.updateSubtreeLocal();
		//node.getGlobal();
		//node.updatePoint();
	}
}


CanvasState.prototype.mousedown = function( mouse, tree ) {
	var myState = this;
	if ( tree.root != null ) {
		var m = new Point( mouse );
		var node = m.findBFS( tree );
		if ( node != null ) {
			tree.findSelected().selected = false;
			node.selected = true;
			myState.drag = true;
		}
	}
}



CanvasState.prototype.createNode = function( mouse, tree ) {
	var node = new Node();

	node.point = new Point( mouse );
	var selectedNode = null;
	
	if ( tree.root != null ) {
		selectedNode = tree.findSelected();
		selectedNode.addChild( node, tree );	
	} else {
		node.getLocal();
		node.getGlobal();
		node.updatePoint();
		tree.root = node;
	}


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
	  
	return {x: mx, y: my};

}

// View
CanvasState.prototype.render = function( tree ) {
	var myState = this;

  	myState.ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if(tree.root != null){
  		myState.paintSkeleton( tree, myState );
  	}
  
   
  	requestAnimationFrame( function() { myState.render( tree ) } );
}

CanvasState.prototype.drawPoint = function( p, ctx ) {
  	ctx.strokeStyle = p.fill;
  	ctx.beginPath();
  	ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
  	ctx.stroke();
  	ctx.save();
  	var image = new Image();
	image.src = 'theme/image/point.png';
	image.width = "20";
	image.height = "20";
	//ctx.drawImage( image, -image.width/2, 0, image.width, image.height );
	ctx.drawImage( image, p.x-image.width/2, p.y-image.height/2, image.width, image.height );
	ctx.restore();
}

// Draw line from p1 to p2 in canvas myState
CanvasState.prototype.drawLine = function( p1, p2, ctx ) {
	//ctx.beginPath();
	//ctx.moveTo(p1.x, p1.y);
	//ctx.lineTo(p2.x, p2.y);
	//ctx.closePath();
	//ctx.stroke();
	ctx.save();
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	var distance = Math.hypot( p2.x - p1.x, p2.y - p1.y );
	var rotation = Math.atan2(dy, dx);
	var angleDegrees = rotation * (180/Math.PI);
	var radians = (angleDegrees - 90) * (Math.PI/180);
   	
	ctx.translate( p1.x, p1.y );
	ctx.rotate(radians);
  	var image = new Image();
	image.src = 'theme/image/line.png';
	image.width = "40";
	image.height = "100";
	//ctx.drawImage( image, -image.width/2, 0, image.width, image.height );
	ctx.drawImage( image, -image.width/2, 40, image.width, distance - 50 );
	ctx.restore();
}

CanvasState.prototype.drawBody = function( node, ctx ) {
	if ( !node.imageNode && !node.imageLine ) return;
	
	if ( node.imageNode ) {
		ctx.save();
		ctx.drawImage( node.imageNode, node.point.x-node.imageNode.width/2, node.point.y-node.imageNode.height/2, node.imageNode.width, node.imageNode.height );
		ctx.restore();
			
	} 
	if ( node.imageLine ) {

		//var n = node.children[0];
		ctx.save();
			
		var dx = node.point.x - node.parent.point.x;
		var dy = node.point.y - node.parent.point.y;
		var distance = Math.hypot( node.point.x - node.parent.point.x, node.point.y - node.parent.point.y );
		var rotation = Math.atan2(dy, dx);
		var angleDegrees = rotation * (180/Math.PI);
		var radians = (angleDegrees - 90) * (Math.PI/180);
		   	
		ctx.translate( node.parent.point.x, node.parent.point.y );
		ctx.rotate(radians);
		  
		ctx.drawImage( node.imageLine, -node.imageLine.width/2, 0, node.imageLine.width, node.imageLine.height );
		ctx.restore();
	
	}
}

// Paint skeleton tree on canvas myState
CanvasState.prototype.paintSkeleton = function( tree, myState ) {
	var queue = [tree.root];
	
  	while(queue.length) {
    	var node = queue.shift();
    	if (node.selected) node.point.fill="#ff0000";
    	else node.point.fill="#0000ff";
    	if (node.parent != null) this.drawLine(node.point, node.parent.point, myState.ctx);
    	this.drawPoint( node.point, myState.ctx );
    	this.drawBody( node, myState.ctx );

    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
}


/*
function myFunction() {
  points.sort(function(a, b){return a-b});
  document.getElementById("demo").innerHTML = points;
}
*/
























function closeTab( tab, hover ) {
	if ( !hover ) return;
	
	tab.style.display = "none";
	

}


function loadImages( myState, tree, imagesWrapper, genContainer ) {
	var head = document.getElementById("head");
	var neck = document.getElementById("neck");
	var body = document.getElementById("body");
	var lowerBody = document.getElementById("lower-body");
	var leftUpperArm = document.getElementById("left-upper-arm");
	var leftLowerArm = document.getElementById("left-lower-arm");
	var leftHand = document.getElementById("left-hand");
	var rightUpperArm = document.getElementById("right-upper-arm");
	var rightLowerArm = document.getElementById("right-lower-arm");
	var rightHand = document.getElementById("right-hand");
	var leftUpperLeg = document.getElementById("left-upper-leg");
	var leftLowerLeg = document.getElementById("left-lower-leg");
	var leftFoot = document.getElementById("left-foot");
	var rightUpperLeg = document.getElementById("right-upper-leg");
	var rightLowerLeg = document.getElementById("right-lower-leg");
	var rightFoot = document.getElementById("right-foot");
	var overlay = document.getElementById("overlayPointLine");
	var back = document.getElementById("backPointLine");
	var line = document.getElementById("onLine");
	var point = document.getElementById("onPoint");
	
	head.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "head";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	neck.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "neck";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	body.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "body";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	lowerBody.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "lower-body";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftUpperArm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "upper-arm";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftLowerArm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "lower-arm";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftHand.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "hand";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightUpperArm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "upper-arm-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightLowerArm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "lower-arm-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightHand.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "hand-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftUpperLeg.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "upper-leg";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftLowerLeg.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "lower-leg";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	leftFoot.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "foot";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightUpperLeg.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "upper-leg-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightLowerLeg.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "lower-leg-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	rightFoot.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.name = "foot-right";
		if ( selectedNode.parent != null ) {
			line.style.display = "flex";
			point.style.right = "auto";
			point.style.marginLeft = "30px";
		}
		else {
			line.style.display = "none";
			point.style.right = "0";
			point.style.marginLeft = "auto";
		}
		overlay.style.display = "block";
	});
	
	back.addEventListener("click", function(e){
		overlay.style.display = "none";
		//genContainer.style.backgroundColor = "#ffffff";
		//wrapper.style.zindex = "-1";
	});
	point.addEventListener("click", function( e ) {
		var selectedNode = tree.findSelected();
		selectedNode.imageNode = new Image();
		selectedNode.imageNode.src = 'mob/' + selectedNode.name + '.png';
		selectedNode.imageNode.width = "50";
		selectedNode.imageNode.height = "100";
		selectedNode.onNode = true;
		//selectedNode.images.push(selectedNode.image);
		imagesWrapper.style.display = "none";
		overlay.style.display = "none";
		genContainer.style.backgroundColor = "#ffffff";
	});
	line.addEventListener("click", function( e ) {
		var selectedNode = tree.findSelected();
		selectedNode.imageLine = new Image();
		selectedNode.imageLine.src = 'mob/' + selectedNode.name + '.png';
		selectedNode.imageLine.width = "50";
		selectedNode.imageLine.height = "100";
		selectedNode.onNode = false;
		imagesWrapper.style.display = "none";
		overlay.style.display = "none";
		genContainer.style.backgroundColor = "#ffffff";
	});
}

function createTree() {
	var tree = new Tree();

	return tree;
}






//
function init() {
	var option_newTree = document.getElementById("new-tree");
	var wrapper = document.getElementById("canvasWrapper");
	var canvas = document.getElementById("canvas");
	var canvasState = null;
	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;
	var wrapper = document.getElementById("wrapper");
	var option = document.getElementById("first");
	var imagesWrapper = document.getElementById("imagesWrapper");
	var back = document.getElementById("back");
	var genContainer = document.getElementById("generalContainer");
	var newSkeleton = document.getElementById("new-skeleton");
	var tree = null;

	var hover = null;
	option_newTree.addEventListener("click", function( e ){
		tree = createTree();
		canvasState = new CanvasState( canvas, tree );
		genContainer.style.backgroundColor = "#ffffff";
		newSkeleton.style.display = "none";
	});
	/*
	option.addEventListener("mouseover", function(e){
		imagesWrapper.style.display = "block";
		//wrapper.style.zindex = "2";
		hover = true;
	});
	*/
	option.addEventListener("click", function(e){
		imagesWrapper.style.display = "block";
		genContainer.style.backgroundColor = "#aaaaaa";
		loadImages( canvas, tree, imagesWrapper, genContainer );
		//wrapper.style.zindex = "2";
		hover = false;
	});
	/*
	option.addEventListener("mouseout", function(e){
		closeTab( imagesWrapper, hover );
	});
	*/
	back.addEventListener("click", function(e){
		imagesWrapper.style.display = "none";
		genContainer.style.backgroundColor = "#ffffff";
		//wrapper.style.zindex = "-1";
	});
	if ( canvasState == null ) {
		newSkeleton.style.display = "block";
	} else {
		newSkeleton.style.display = "none";
	}
	
	
}












