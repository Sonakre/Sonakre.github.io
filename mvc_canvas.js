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

Node.prototype.addChild = function( node, tree ) {
	var n = this;
	if ( node == null ) {
		n.getLocal( false );
		//n.globalMatrix = n.localMatrix;
		n.getGlobal( false );
		n.updatePoint( false );
		tree.root = n;
	} else {
		node.selected = false;
		node.children.push( n );
		n.parent = node;
		
		n.getLocal( true );
		n.getGlobal( true );
		n.updatePoint( true );
	}
}

Node.prototype.getGlobal = function( b ) {
	var node = this;
	if ( !b ) {
		node.globalMatrix = node.localMatrix;
	} else {
		multiply( node.globalMatrix, node.parent.globalMatrix, node.localMatrix);
	}
}

Node.prototype.getLocal = function( b ) {
	var translateMatrix = this.translate( b );
	var rotateMatrix = this.rotate( b );

	multiply( this.localMatrix, rotateMatrix, translateMatrix );
}

Node.prototype.updatePoint = function( b ) {
	var n = this;
	if ( !b ) {
		n.point.x = n.localMatrix[6];
		n.point.y = n.localMatrix[7];
	} else {
		n.point.x = n.globalMatrix[6];
		n.point.y = n.globalMatrix[7];
	}
}

Node.prototype.translate = function( b ) {
	var point = this.point;
	if ( !b ) {
		var parent = {x: 0, y: 0};
	} else {
		var parent = this.parent.point;	
	}

	var dist = (point.x - parent.x) * (point.x - parent.x) + (point.y - parent.y) * (point.y - parent.y);
	var translateMatrix = create();

	fromTranslation(translateMatrix, [Math.sqrt(dist), 0]);


	return translateMatrix;
}

Node.prototype.rotate = function( b ) {
	var point = this.point;
	if ( !b ) {
		var parent = {x: 0, y: 0};
	} else {
		var parent = this.parent.point;	
	}

	var dx = point.x - parent.x;
	var dy = point.y - parent.y;
	var rot = Math.atan2(dy, dx);

	var rotateMatrix = create();

	fromRotation( rotateMatrix, rot );

	return rotateMatrix;
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
function CanvasState( canvas ) {
	var wrapper = document.getElementById("canvasWrapper");
	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;
	
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.mouse = null;
	this.drag = false;
	
	var myState = this;
	var tree = new Tree();
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
	
	//n.getLocal();
	//n.getGlobal();

	//n.updatePoint();

	//n.point.x = mouse.x;
	//n.point.y = mouse.y;

	
	console.log(n);
}

Node.prototype.update = function( mouse ) {
	var n = this;
	n.point.x = mouse.x;
	n.point.y = mouse.y;
	if ( n.parent == null ) {
		n.getLocal( false );
		n.getGlobal( false );
		n.updatePoint( false );
		/*
		if ( n.children.length != 0 ) {
			for ( var i = 0; i < n.children.length; i++ ) {
				n.children[i].getLocal( false );
				n.children[i].getGlobal( n.children[i].globalMatrix );
				n.children[i].updatePoint( false );
			}
		}
		*/
	} else {
		n.getLocal( true );
		n.getGlobal( true );
		n.updatePoint( true );
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

CanvasState.prototype.mouseup = function( mouse, tree  ) {
	var myState = this;

	//console.log(mouse);
	//console.log(myState.mouse);
	if ( mouse.x == myState.mouse.x && mouse.y == myState.mouse.y ) {
		console.log( mouse );
		var node = null;
		if ( tree.root != null ) {
			var m = new Point( mouse );
			node = m.findBFS( tree );
			//console.log(p);
		}
		if ( node == null ) {
			myState.createNode( /*selectedNode,*/ mouse, tree );
			//console.log(selectedNode);
		} else {
			tree.findSelected().selected = false;
			node.selected = true;
		}
	}
	console.log(tree);
}

CanvasState.prototype.createNode = function( /*selectedNode,*/ mouse, tree ) {
	var node = new Node();

	node.point = new Point( mouse );
	var selectedNode = null;

	if ( tree.root != null )
		selectedNode = tree.findSelected();

	node.addChild( selectedNode, tree );

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

CanvasState.prototype.drawPoint = function(p, ctx) {
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

// Paint skeleton tree on canvas myState
CanvasState.prototype.paintSkeleton = function( tree, myState ) {
	var queue = [tree.root];
  	while(queue.length) {
    	var node = queue.shift();
    	if (node.selected) node.point.fill="#ff0000";
    	else node.point.fill="#aaaaaa";
    	if (node.parent != null) this.drawLine(node.point, node.parent.point, myState.ctx);
    	this.drawPoint( node.point, myState.ctx );

    	for(var i = 0; i < node.children.length; i++) {
      		queue.push(node.children[i]);
    	}
  	}
}























//
function init() {
	var canvas = new CanvasState(document.getElementById("canvas"));
}






