//import * as mat3 from "./matrix/mat3.js";
//var mat3 = import("./matrix/mat3.js");

function Tree() {
	this.root = null;
}

function Node() {
	this.parent = null;
	this.children = [];
	this.name = "no name";
	this.point = null;
	//this.translateMatrix = [1,0,0,1,0,0,0,0,1];
}

function Point(x, y, r, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.radius = r || 0;
  this.fill = fill || '#AAAAAA';
}

Point.prototype.contains = function(mx, my) {
  var distsq = (mx-this.x) * (mx-this.x) + (my-this.y) * (my-this.y);
  rsq = this.radius * this.radius;

  return distsq < rsq;
}

Point.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Draws line
Point.prototype.drawLine = function( point, ctx ) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(point.x, point.y);
  ctx.closePath();
  ctx.stroke();
}

Tree.prototype.add = function(node, canvasState) {
	canvasState.selectedNode.children.push(node);
	node.parent = canvasState.selectedNode;
	canvasState.selectedNode = node;
}

Tree.prototype.print = function() {
	var queue = [this.root];
  	while(queue.length) {
    	var node = queue.shift();
    	
    	console.log(node.name);
    
    	for(var i = 0; i < node.children.length; i++) {
    	  	queue.push(node.children[i]);
    	}
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


Tree.prototype.traversePaintBFS = function(myState) {
  var queue = [this.root];
  while(queue.length) {
    var node = queue.shift();
    if (node == myState.selectedNode) node.point.fill="#ff0000";
    else node.point.fill="#aaaaaa";
    if (node.parent != null) node.point.drawLine(node.parent.point, myState.ctx);
    node.point.draw(myState.ctx);

    for(var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i]);
    }
  }
};

function CanvasState(canvas) {

	var wrapper = document.getElementById("canvasWrapper");

	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.tree = new Tree();

	canvas.height = wrapper.offsetHeight;
	canvas.width = wrapper.offsetWidth;

	this.selectedNode = null;
	this.selectMode = false;
	console.log(this.selectMode);
	this.createMode = true;
	
	var myState = this;
	canvas.addEventListener("click", function(e) {
		if (myState.selectMode) myState.selectNode(e);
		else myState.click(e);
		if (myState.selectedNode != null && myState.changeName.style.display != "block") myState.changeName.style.display = "block";

	});

	if (this.tree.root != null)
		requestAnimationFrame( function() { myState.draw() } );

}



CanvasState.prototype.click = function(e) {

	var mouse = this.getMouse(e); //coordenades de món
	//var mousex = e.pageX - this.canvas.offsetLeft;
	//var mousey = e.pageY - this.canvas.offsetTop;
	var node = new Node();
	var point = new Point(mouse.x, mouse.y, 10);
	this.mouse = mouse;

	if (this.selectedNode != null) {
		//var newCtx = multiply(this.selectedNode.translateMatrix, [mouse.x,mouse.y]);
		//console.log(newCtx);
	}
	

	node.point = point;
	console.log(node.point);
	console.log(this.selectMode);
		
	//node.translateMatrix[4] = node.point.x;
	//node.translateMatrix[5] = node.point.y;
	//console.log(node.translateMatrix);
	
	
/*
	this.ctx.transform(node.translateMatrix[0], node.translateMatrix[1], node.translateMatrix[2],
		node.translateMatrix[3], node.translateMatrix[4], node.translateMatrix[5]);
	this.ctx.fillStyle='lightblue';
  */	

  	if (this.tree.root == null) {
  		this.tree.root = node;
  		this.selectedNode = node;
  	} else {
  		this.tree.add(node, this);
  	}
  	this.draw();
		/*
		if (tree.root == null) {
		}
		*/
	console.log(this.tree);
}

CanvasState.prototype.selectNode = function(e) {
	console.log(this.selectMode);
	var mouse = this.getMouse(e); 
	var node = this.tree.findBFS(mouse);
	console.log(node);
	if (node != null) {
		this.selectedNode = node;
	}
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
/*
function multiply(a, b) {
	console.log(a);
	console.log(b);
	var first = a[0] * b[0] + a[2] * b[1] + a[4] * 1;
	var second = a[1] * b[0] + a[3] * b[1] + a[5] * 1;
	var third = 1;
/*
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  *//*
  return [first, second, third];
}*/

// Draws the Canvas State
CanvasState.prototype.draw = function() {
  var myState = this;
  //var points = myState.points;
  //var length = points.length;
  
  myState.ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(this.tree.root != null){
  	this.tree.traversePaintBFS(myState);	
  }
  
/*
  // Draw lines
  for ( var i = 0; i <= l - 1; i ++ ) {
    drawLine(lines[i], myState.ctx);
  }
*/
  // Draw Points
  /*
  for ( var i = 0; i <= length - 1; i++) {
    if (i == 0) {
      points[i].draw(myState.ctx); 
      continue;
    }
    
    points[i - 1].draw(myState.ctx);
    points[i].draw(myState.ctx);
  }
*/

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