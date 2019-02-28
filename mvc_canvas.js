//Model
function Tree() {
	this.root = null;
	this.selected = true;
}

function Node( px, py ) {
	this.translation = {x: px, y: py};
	this.rotation = 0;
	this.scale = null;
	this.localMatrix = create();
	this.globalMatrix = create();
	this.children = [];
	this.parent = null;
	this.distance = null;
	this.selected = true;
	this.dim = 10;
	this.orgRot = 0;
}




//Controller
//function CanvasState( canvas, node1 ) {
function CanvasState( canvas, rotate ) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.rotate = rotate;
	//this.trees = [];
	this.tree = null;
	this.mouse = {x: 0, y: 0};
	this.drag = false;

	var myState = this;
	

	myState.canvas.addEventListener( "mousedown", function( e ) {
		myState.mouseDown( e );
	});

	myState.canvas.addEventListener( "mouseup", function( e ) {
		myState.mouseUp( e );
	});

/*
	var node1 = new Node( 250, 250 );
	/*
	node1.translation.x = 250;
	node1.translation.y = 250;
	
	node1.localMatrix = [ 1, 0, 0, 0, 1, 0, node1.translation.x, node1.translation.y, 1 ];
	node1.calculateGlobalMatrix();
	var node2 = new Node( 300, 300 );
	var node3 = new Node( 200, 400 );

	node1.addChild( node2 );
	node2.addChild( node3 );
*/




	//console.log( node1 );

	requestAnimationFrame( function() { myState.paint( myState.trees ) } );
	//return node1;
}

CanvasState.prototype.mouseUp = function( e ) {
	var mouse = this.getMouse( e );

	if ( mouse.x == this.mouse.x && mouse.y == this.mouse.y ) {
		var node = null;
		if ( this.hasTree() ) {
			//var tree = new Tree();
			//tree.addRoot( mouse );
			//this.tree = tree;
			node = treeHasPoint( this.tree.root, this.mouse );
		} 
		if ( node == null ) {
			if ( this.hasTree() ) this.tree.root.findSelected().addChild( mouse );
			else {
				var tree = new Tree();
				tree.addRoot( mouse );
				this.tree = tree;	
			}
			
		} else {
			this.tree.root.findSelected().selected = false;
			node.selected = true;
		}
	} else {
		this.tree.root.findSelected().addChild( mouse );
	}

}

Tree.prototype.addRoot = function( point ) {
	var node = new Node( point.x, point.y );
	node.localMatrix = [ 1, 0, 0, 0, 1, 0, node.translation.x, node.translation.y, 1 ];
	node.calculateGlobalMatrix();
	this.root = node;
}

Node.prototype.contains = function( point ) {
	return this.translation.x <= point.x && 
			point.x <= this.translation.x + this.dim &&
            this.translation.y <= point.y && 
            point.y <= this.translation.y + this.dim;
}

Node.prototype.findSelected = function() {
	if ( this.selected ) return this;

	var node = null;
	
	for ( var i = 0; i < this.children.length; i++ ) {
		node = this.children[i].findSelected();
	}
	return node;	
}

function treeHasPoint( node, point ) {
	if ( node.contains( point ) ) return node;
	
	if ( node.children.length == 0 ) {
		return null;
	}	
	//var a = null;
	for ( var i = 0; i < node.children.length; i++ ) {
		return treeHasPoint( node.children[i], point );
	}
	//return a;
}

CanvasState.prototype.mouseDown = function( e ) {
	this.mouse = this.getMouse( e );
	
	if ( !this.hasTree() ) return;
	/*
	var tree = null;
	for ( var i = 0; i < this.trees.length; i++ ) {
		if ( this.trees[i].selected ) tree = this.trees[i];
	}
	*/
	var node = treeHasPoint( this.tree.root, this.mouse );
	if ( node == null ) return;

	this.tree.root.findSelected().selected = false;
	node.selected = true;
	this.drag = true;
}

CanvasState.prototype.hasTree = function() {
	if ( this.tree != null ) return true;
	else return false;
}

Node.prototype.calculateGlobalMatrix = function() {
	if ( this.parent == null ) {
		this.globalMatrix = this.localMatrix;
	} else {
		multiply( this.globalMatrix, this.parent.globalMatrix, this.localMatrix );
	}
}

Node.prototype.calculateLocalMatrix = function() {
	var translationM = create();
	var rotationM = create();
	//translationM = [ 1, 0, 0, 0, 1, 0, this.distance * Math.cos( this.rotation ), this.distance * Math.sin( this.rotation ), 1 ];
	//rotationM = [ Math.cos( this.rotation ), Math.sin( this.rotation ), 0, - Math.sin( this.rotation ), Math.cos( this.rotation ), 0, 0, 0, 1 ];
	translationM = [ 1, 0, 0, 0, 1, 0, this.translation.x, this.translation.y, 1 ];
	rotationM = [ Math.cos( this.rotation ), Math.sin( this.rotation ), 0, - Math.sin( this.rotation ), Math.cos( this.rotation ), 0, 0, 0, 1 ];
	multiply( this.localMatrix, translationM, rotationM );	
}

Node.prototype.addChild = function( point ) {
	/*
	this.selected = false;
	var parent = this;
	var node = new Node( point.x, point.y );
	
	var dist = parent.getDistance( node );
	var rad = parent.getRotation( node );
	node.distance = dist;
	node.rotation = rad;
	node.calculateLocalMatrix();
	node.parent = parent;
	parent.children.push( node );
	node.calculateGlobalMatrix();
	*/
	this.selected = false;
	var local = this.getPointinLocal( point );
	var parent = this;

	var node = new Node( local.x, local.y );

	var dist = parent.getDistance( node );
	var rad = parent.getRotation( node );
	node.distance = dist;
	node.rotation = rad;
	node.calculateLocalMatrix();
	node.parent = parent;
	parent.children.push( node );
	node.calculateGlobalMatrix();
}

Node.prototype.getPointinLocal = function( point ) {
	var inv = this.inverseGlobal();
	var a = createVec();
	var local = createVec();
	a[0] = point.x;
	a[1] = point.y;
	a[2] = 1;
	transformMat3( local, a, inv );
	return {x: local[0], y: local[1]};
}

Node.prototype.inverseGlobal = function() {
	var inv = create();
	invert( inv, this.globalMatrix );
	return inv;
}

Node.prototype.getDistance = function( node ) {
	//var dx = node.translation.x - this.translation.x;
	//var dy = node.translation.y - this.translation.y;
	var dx = node.translation.x;
	var dy = node.translation.y;
	return Math.sqrt( (dx) * (dx) + (dy) * (dy) );
}

Node.prototype.getRotation = function( node ) {
	//var dx = node.translation.x - this.translation.x;
	//var dy = node.translation.y - this.translation.y;
	var dx = node.translation.x;
	var dy = node.translation.y;
	var rad = Math.atan2( dy, dx );
	node.orgRot = rad;
	var angle = rad / Math.PI * 180.0;
	var pangle = this.orgRot / Math.PI * 180.0;
	//var r = angle - pangle;
	//var rot = r * Math.PI / 180.0; 
	return rad;
}


Node.prototype.translatePoint = function() {
	this.translation.x = this.parent.translation.x + this.distance * Math.cos( this.rotation );
	this.translation.y = this.parent.translation.y + this.distance * Math.sin( this.rotation );
}


Node.prototype.updateMatrices = function() {
	this.updateLocal();
	this.updateGlobal();
}

Node.prototype.updateLocal = function() {
	this.calculateLocalMatrix();
}

Node.prototype.updateGlobalPoint = function() {
	//var a = [ this.translation.x, this.translation.y, 1 ];
	//var b = createVec();

	//transformMat3( b, a, this.globalMatrix );
	this.translation.x = this.globalMatrix[6];
	this.translation.y = this.globalMatrix[7]; 
}

Node.prototype.updateGlobal = function() {
	this.calculateGlobalMatrix();

	for ( var i = 0; i < this.children.length; i++ ) {
		this.children[i].updateGlobal();
		this.children[i].updateGlobalPoint();
	}
}

function rotatePoint( point, origin, angle ) {
//function rotatePoint( myState, node1, angle ) {
	
	var radians = angle * Math.PI / 180.0,
	cos = Math.cos(radians),
	sin = Math.sin(radians),
	dX = point.translation.x - origin.translation.x,
	dY = point.translation.y - origin.translation.y;
	//var dist = Math.sqrt( (dX) * (dX) + (dY) * (dY) );
	point.translation.x = cos * dX - sin * dY + origin.translation.x;
	point.translation.y = sin * dX + cos * dY + origin.translation.y;
	
	var rad = origin.getRotation( point );
	
	point.rotation = rad;

	

/*
	var radians = angle * Math.PI / 180.0;
	var rotateMatrix = create();
	var translationM = create();
	fromRotation( rotateMatrix, radians );
	point.rotation = radians;
	translationM = [ 1, 0, 0, 0, 1, 0, point.distance * Math.cos( point.rotation ), point.distance * Math.sin( point.rotation ), 1 ];
	multiply( point.localMatrix, translationM, rotateMatrix );
*/
	point.updateMatrices();
	
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


//View
CanvasState.prototype.isRotating = function() {
	return this.rotate;
}
CanvasState.prototype.activateRotation = function() {
	this.rotate = true;
}
CanvasState.prototype.desactivateRotation = function() {
	this.rotate = false;
}
CanvasState.prototype.paint = function( trees ) {
	var myState = this;

	myState.ctx.clearRect( 0, 0, myState.canvas.width, myState.canvas.height );
	
	if ( myState.tree != null )
	myState.paintSkeleton( myState.tree.root );	
	
	 

	var d = new Date();
	
	if ( myState.rotate ) {
		//for ( var i = 0; i < trees[0].root.children.length; i++ ) {
			rotatePoint( myState.tree.root.children[0], myState.tree.root, d.getSeconds()/ 10 );
		//}
		
	}

	requestAnimationFrame( function() { myState.paint( trees ) } );
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
/*
	this.ctx.save();
	this.ctx.translate( node.translation.x, node.translation.y );
	this.ctx.rotate( node.rotation );
	this.ctx.strokeStyle = "#000000";
  	this.ctx.beginPath();
  	this.ctx.rect(0, 0, 10, 10);
  	this.ctx.stroke();
  	this.ctx.restore();
*/
	var m = node.globalMatrix;
	this.ctx.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );
  	//this.ctx.setTransform( 1, 0, 0, 1, node.translation.x, node.translation.y );
  	//this.ctx.rotate( node.rotation );
  	this.ctx.strokeStyle = "#000000";
  	this.ctx.beginPath();
  	this.ctx.rect(-5, -5, 10, 10);
  	this.ctx.stroke();
  	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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


	rotate.addEventListener("click", function() {
		//console.log( canvasState );
		if ( canvasState.isRotating() )
			canvasState.desactivateRotation();
		else canvasState.activateRotation();
	})
}















