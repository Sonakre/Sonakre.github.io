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
	this.radius = 10;
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
  	ctx.fillStyle = p.fill;
  	ctx.beginPath();
  	ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI);
  	ctx.fill();
}

// Draw line from p1 to p2 in canvas myState
CanvasState.prototype.drawLine = function( p1, p2, ctx ) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
}

CanvasState.prototype.drawBody = function( node, ctx ) {
	if ( !node.image ) return;
	ctx.save();
	if ( node.parent == null ) 
		return;
	
	var dx = node.point.x - node.parent.point.x;
	var dy = node.point.y - node.parent.point.y;
	var distance = Math.hypot( node.point.x - node.parent.point.x, node.point.y - node.parent.point.y );
	var rotation = Math.atan2(dy, dx);
	var angleDegrees = rotation * (180/Math.PI);
	var radians = (angleDegrees - 90) * (Math.PI/180);
   	
	ctx.translate( node.parent.point.x, node.parent.point.y );
	ctx.rotate(radians);
  
	ctx.drawImage( node.image, -node.image.width/2, 0, node.image.width, node.image.height );
	ctx.restore();
}

// Paint skeleton tree on canvas myState
CanvasState.prototype.paintSkeleton = function( tree, myState ) {
	var queue = [tree.root];
  	while(queue.length) {
    	var node = queue.shift();
    	if (node.selected) node.point.fill="#ff0000";
    	else node.point.fill="#aaaaaa";
    	if (node.parent != null) this.drawLine(node.point, node.parent.point, myState.ctx);
    	this.drawPoint( node.point, myState.ctx );
    	this.drawBody( node, myState.ctx );

    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
}



























function closeTab( tab, hover ) {
	if ( !hover ) return;
	
	tab.style.display = "none";
	

}


function loadImages( myState, tree, imagesWrapper, genContainer ) {
	var arm = document.getElementById("first-image");
	var foreArm = document.getElementById("second-image");
	var hand = document.getElementById("third-image");
	
	arm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.image = new Image();
		selectedNode.image.src = 'images/arm.png';
		selectedNode.image.width = "50";
		selectedNode.image.height = "100";
		imagesWrapper.style.display = "none";
		genContainer.style.backgroundColor = "#ffffff";
	});
	foreArm.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.image = new Image();
		selectedNode.image.src = 'images/fore-arm.png';
		selectedNode.image.width = "50";
		selectedNode.image.height = "100";
		imagesWrapper.style.display = "none";
		genContainer.style.backgroundColor = "#ffffff";
	});
	hand.addEventListener("click", function( e ){
		if ( tree == null ) {
			imagesWrapper.style.display = "none";
			return;
		}
		var selectedNode = tree.findSelected();
		selectedNode.image = new Image();
		selectedNode.image.src = 'images/hand.png';
		selectedNode.image.width = "50";
		selectedNode.image.height = "50";
		imagesWrapper.style.display = "none";
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












