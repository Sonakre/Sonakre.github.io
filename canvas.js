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
	this.translateMatrix = create();
	this.rotateMatrix = create();
	this.scaleMatrix = create();
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

// Draw point p in canvas myState
function draw(p, ctx) {
  ctx.fillStyle = p.fill;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Draw line from p1 to p2 in canvas myState
function drawLine( p1, p2, ctx ) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
}

// Paint skeleton tree on canvas myState
/*
function paintSkeleton( tree, myState ) {
	//tree.toPrint = [];
	//tree.postorder(tree.root);
	for( var i = 0; i < tree.toPrint.length; i++ ) {
		if ( i != 0 )
			drawLine( tree.toPrint[i].point, tree.toPrint[i-1].point, myState.ctx);
		draw( tree.toPrint[i].point, myState.ctx);
	}
}
*/

function paintSkeleton( tree, myState ) {
  var queue = [tree.root];
  while(queue.length) {
    var node = queue.shift();
    if (node == tree.selectedNode) node.point.fill="#ff0000";
    else node.point.fill="#aaaaaa";
    if (node.parent != null) drawLine(node.point, node.parent.point, myState.ctx);
    draw( node.point, myState.ctx);

    for(var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
};

function CanvasState(canvas) {

	var wrapper = document.getElementById("canvasWrapper");

	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.drag = false;
	var tree = new Tree();

	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;

	var myState = this;
/*
	canvas.addEventListener("mousedown", function(e) {
		myState.drag = true;
		myState.selectMode( tree, e );
	});

	canvas.addEventListener("mouseup", function(e) {
		myState.drag = false;
	});

	canvas.addEventListener("mousemove", function(e) {
	    if (myState.drag) {
	    	movePoint( tree, e, myState );
	    }
	});
	*/
	canvas.addEventListener("click", function(e) {
		myState.selectMode( tree, e );
	});

	if (tree.root != null)
		requestAnimationFrame( function() { myState.draw( tree ) } );

}
/*
function movePoint( tree, e, myState ) {
	var mouse = myState.getMouse(e);
	var node = tree.findBFS(mouse);
	if(node != null) {
	    node.point.x = mouse.x;
	    node.point.y = mouse.y;
	    console.log(node.point);
	    //fromTranslation(node.translateMatrix, myState.distanceUpdate(node));
	    //myState.calculateLocal(node);
		//invert(node.localToGlobal, node.localMatrix);

	    //node.updateMatrix(myState);
	}
}
*/
CanvasState.prototype.selectMode = function( tree, e ) {
	var myState = this;
	var mouse = myState.getMouse(e); 
	var p = null;
	if (tree.root != null)
		p = tree.findBFS(mouse);
	if ( p != null ) {
		tree.selectedNode = p;
		
		if ( myState.drag )
			console.log("move node");
		//myState.move( tree, mouse );
			
	} else {
		
		myState.click( tree, mouse );
	}
}

CanvasState.prototype.click = function( tree, mouse ) {
	var node = new Node();
	var point = new Point(mouse.x, mouse.y, 10);

	node.point = point;
	//console.log(node.point);	

  	if (tree.root == null) {
  		tree.root = node;
  		tree.selectedNode = node;
  	} else {
  		tree.add(node, this);
  	}
  	this.draw( tree );
	
	console.log(tree);
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
  		paintSkeleton( tree, myState );
  	}
  
   
  requestAnimationFrame( function() { myState.draw( tree ) } );
}