//import * as mat3 from "./matrix/mat3.js";
//var mat3 = import("./matrix/mat3.js");

function Tree() {
	this.root = null;
	this.selectedNode = null;
	this.toPrint = [];
}

Tree.prototype.add = function(node) {
	this.selectedNode.children.push(node);
	node.parent = this.selectedNode;
	this.selectedNode = node;
}

Tree.prototype.postorder = function(node) {
	if( node !== null ) {
		for ( var i = 0; i < node.children.length; i++ ) {
	      	this.postorder(node.children[i]);
      	}
      	this.toPrint.push(node);
	}
}

Tree.prototype.print = function() {
	for ( var i = 0; i < this.toPrint.length; i++ ) {
		console.log(this.toPrint[i]);
	}
}

Tree.prototype.findBFS = function(point) {
  var queue = [this.root];
  while(queue.length) {
    var node = queue.shift();
    if(node.point.contains(point.x, point.y)) {
      return node;
    }
    for(var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
  return null;
};

function Node() {
	this.parent = null;
	this.children = [];
	this.name = "no name";
	this.point = null;
	//this.translateMatrix = create();
	//this.rotateMatrix = create();
	//this.scaleMatrix = create();
	this.localMatrix = create();
	this.globalMatrix = create();
}

function Point( x, y, r, fill ) {
  	this.x = x || 0;
  	this.y = y || 0;
  	this.radius = r || 0;
  	this.fill = fill || '#AAAAAA';
}

Point.prototype.contains = function( mx, my ) {
  	var distsq = (mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y);
  	rsq = this.radius * this.radius;

  	return distsq < rsq;
}


function renderMVC() {

}

// Draw point p in canvas myState
renderMVC.prototype.drawPoint = function(p, ctx) {
  	ctx.fillStyle = p.fill;
  	ctx.beginPath();
  	ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
  	ctx.fill();
}

// Draw line from p1 to p2 in canvas myState
renderMVC.prototype.drawLine = function( p1, p2, ctx ) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
}

// Paint skeleton tree on canvas myState
renderMVC.prototype.paintSkeleton = function( tree, myState ) {
	var queue = [tree.root];
  	while(queue.length) {
    	var node = queue.shift();
    	if (node == tree.selectedNode) node.point.fill="#ff0000";
    	else node.point.fill="#aaaaaa";
    	if (node.parent != null) this.drawLine(node.point, node.parent.point, myState.ctx);
    	this.drawPoint( node.point, myState.ctx);

    	for(var i = 0; i < node.children.length; i++) {
      	queue.push(node.children[i]);
    	}
  	}
}


var render = new renderMVC();

function CanvasState(canvas) {

	var wrapper = document.getElementById("canvasWrapper");

	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.drag = false;
	this.mouse = null;
	var tree = new Tree();

	var translateMatrix = create();
	var rotateMatrix = create();


	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;

	var myState = this;
	var p = null;

	canvas.addEventListener("mousedown", function(e) {
		myState.drag = true;
		myState.mouse = myState.getMouse(e);
		if (tree.root != null)
			p = tree.findBFS(myState.mouse);
		if ( p != null ) 
			tree.selectedNode = p;
	});

	canvas.addEventListener("mouseup", function(e) {
		myState.selectMode( translateMatrix, rotateMatrix, tree, e );
		myState.drag = false;
		tree.toPrint = [];
		tree.postorder(tree.root);
		
		console.log(tree);
	});

	var mouse = null;
	var node = null;

	canvas.addEventListener("mousemove", function(e) {
	    if (myState.drag) {
	    	mouse = myState.getMouse(e);
	    	movePoint( tree.selectedNode, mouse, tree );
	    }
	});

	if (tree.root != null)
		requestAnimationFrame( function() { myState.draw( tree ) } );

}



CanvasState.prototype.selectMode = function( translateMatrix, rotateMatrix, tree, e ) {
	var myState = this;
	var mouse = myState.getMouse(e); 
	var p = null;
	if ( myState.mouse.x == mouse.x && myState.mouse.y == mouse.y ) {
		if (tree.root != null)
			p = tree.findBFS(mouse);
		if ( p == null ) {
			myState.click( translateMatrix, rotateMatrix, tree, mouse );
			
		}
	} 

}

CanvasState.prototype.click = function( translateMatrix, rotateMatrix, tree, mouse ) {
	var node = new Node();
	var point = new Point(mouse.x, mouse.y, 10);
	
	var rotateMatrix = create();
	var localMatrix = create();

	node.point = point;
	var p2 = {x: 0, y: 0};
	if ( tree.root != null ) {
		p2.x = tree.selectedNode.point.x;
		p2.y = tree.selectedNode.point.y;
	}
	node.translation( translateMatrix, tree, p2 );
	node.rotation( rotateMatrix, tree, p2 );


  	if (tree.root == null) {
  		tree.root = node;
  		tree.selectedNode = node;
  	} else {
  		multiply( node.localMatrix, translateMatrix, rotateMatrix );
  		tree.add(node, this);
  	}

  	node.getGlobal( node.globalMatrix );

  	this.draw( tree );
}

/*
Node.prototype.getLocal = function( local, t, r ) {
	multiply(local, t, r);
}
*/

function movePoint( node, mouse, tree ) {
	if(node != null) {
	    node.point.x = mouse.x;
	    node.point.y = mouse.y;
	    node.updateLocal( tree );
	}
}

Node.prototype.updateLocal = function( tree ) {
	var node = this;
	var translateMatrix = create();
	var rotateMatrix = create();
	var g = node.globalMatrix;
	var p2 = {x: 0, y: 0};
	if ( tree.root != null ) {
		p2.x = tree.selectedNode.parent.point.x;
		p2.y = tree.selectedNode.parent.point.y;
	}
	node.translation( translateMatrix, tree, p2 );
	node.rotation( rotateMatrix, tree, p2 );
	multiply( node.localMatrix, translateMatrix, rotateMatrix );
	node.getGlobal( node.globalMatrix );

	node.point.update( node.point, g, node.localMatrix );
	console.log(node.point);

}

Point.prototype.update = function( p, g, l ) {
	var inv = create();
	var p1 = [];

	invert( inv, g );
	transformMat3(p1, [p.x, p.y, 0], inv);
	transformMat3(p1, p1, l);


	var p = {x: p1[0], y: p1[1]};

	return p;
}

Node.prototype.getGlobal = function( g ) {
	var node = this;
	if ( node.parent != null ) {
		multiply( node.globalMatrix, node.parent.getGlobal(node.parent.globalMatrix), node.localMatrix);
	}

	var g = node.globalMatrix;

	return g;
}

Node.prototype.rotation = function( rotateMatrix, tree, p2 ) {
	var p1 = this.point;
	

	var dx = p2.x - p1.x;
	var dy = p1.y - p2.y;
	var rot = Math.atan2(dy, dx);


	fromRotation( rotateMatrix, rot );

	return rotateMatrix;

}

Node.prototype.translation = function( translateMatrix, tree, p2 ) {
	var p1 = this.point;

	var dist = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
	fromTranslation(translateMatrix, [Math.sqrt(dist), 0]);

	return translateMatrix;
}

function init(){

	var canvas = new CanvasState(document.getElementById("canvas"));
	var createMode = document.getElementById("createMode");
	var selectMode = document.getElementById("selectMode");
	var changeName = document.getElementById("changeName");
	var tree = document.getElementById("tree");

	canvas.changeName = changeName;

	changeName.addEventListener("click", function(e) {
		var nodeName = prompt("Please enter a name:", "");
		canvas.selectedNode.name = nodeName;
	});
	tree.addEventListener("click", function(e) {
		if (canvas.tree.root != null) 
			canvas.tree.print();
	});

	createMode.style.borderColor = "#ff0000";
	

	createMode.addEventListener("click", function(e) {
		if (!canvas.createMode) {
			canvas.createMode = true;
			canvas.selectMode = false;
			selectMode.style.borderColor = "black";
			createMode.style.borderColor = "#ff0000";
		}
	});
	selectMode.addEventListener("click", function(e) {
		if (!canvas.selectMode) {
			canvas.selectMode = true;
			canvas.createMode = false;
			selectMode.style.borderColor = "#ff0000";
			createMode.style.borderColor = "black";
		}
	});

}

CanvasState.prototype.getMouse = function(e) {
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

// Draws the Canvas State
CanvasState.prototype.draw = function( tree ) {
  	var myState = this;
  
  	myState.ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if(tree.root != null){
  		render.paintSkeleton( tree, myState );
  	}
  
   
  requestAnimationFrame( function() { myState.draw( tree ) } );
}