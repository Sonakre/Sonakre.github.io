function Tree() {
	this.root = null;
	this.selected = true;
}

function Node( px, py ) {
	this.translation = createVector( px, py, 1 );
	this.rotation = 0;
	this.scale = 0;
	this.localMatrix = mat3create();
	this.globalMatrix = mat3create();
	this.children = [];
	this.parent = null;
	this.distance = null;
	this.selected = true;
	this.dim = 20;
	this.images = [];
	this.name = "";
}

function SceneImage( img ) {
	this.img = img || new Image();
	this.translation = createVector( 0, 0, 1 );
	this.rotation = 0;
	this.scale = 0;
	this.localMatrix = mat3create();
	this.selected = true;
	this.transform = new TransformImage( this );
	this.parent = null;
	this.name = "";
}

function TransformImage( img ) {
	this.p1 = createVector(img.translation[0], img.translation[1], img.translation[2]);
	this.p2 = createVector(img.img.width, img.translation[1], 1);
	this.p3 = createVector(img.translation[0], img.img.height, 1);
	this.p4 = createVector(img.img.width, img.img.height, 1);
	this.rotateP = createVector(img.img.width + 20, img.img.height/2, 1);
	this.p1.selected = true;
	this.p2.selected = false;
	this.p3.selected = false;
	this.p4.selected = false;
	this.rotateP.selected = false;
	this.radius = 10;
	this.img = img;
	this.parent = img.parent;
}


SceneImage.prototype.updateImageVertices = function() {
	this.transform.updatePoints();
	this.transform.parent = this.parent;
}

TransformImage.prototype.updatePoints = function() {
	this.p1[0] = this.img.translation[0], this.p1[1] = this.img.translation[1];
	this.p2[0] = this.img.translation[0] + this.img.img.width, this.p2[1] = this.img.translation[1];
	this.p3[0] = this.img.translation[0], this.p3[1] = this.img.translation[1] + this.img.img.height;
	this.p4[0] = this.img.translation[0] + this.img.img.width, this.p4[1] = this.img.translation[1] + this.img.img.height;
	this.rotateP[0] = this.img.translation[0] + this.img.img.width/2, this.rotateP[1] = this.img.translation[1] - 40;



}


function createVector( x, y, z ) {
	var vec = vec3create();
	return vec = [x, y, z]; 
}

Tree.prototype.addRoot = function( point ) {
	var node = new Node( point[0], point[1] );
	node.localMatrix = [ 1, 0, 0, 0, 1, 0, node.translation[0], node.translation[1], 1 ];
	node.calculateGlobalMatrix();
	node.name = "node" + 1;
	this.root = node;
}

Node.prototype.findImageContainingPoint = function( point ) {
	for ( var i = 0; i < this.images.length; i++ ) {
		if ( this.images[i].containsPoint( point ) )
			return this.images[i];
	}
}

Node.prototype.imageHasPoint = function( point ) {
	var image = this.findImageContainingPoint( point );
	if ( image != null ) return image;
		
	for ( var i = 0; i < this.children.length; i++ ) {
		var image2 = this.children[i].imageHasPoint( point );
		if ( image2 != null )
			return image2;
	}
	return null;
}

TransformImage.prototype.transformContainsPoint = function( point ) {
	var arr = [this.p1, this.p2, this.p3, this.p4, this.rotateP];
	for ( var i = 0; i < arr.length; i++ ) {
		var t = containsPoint( this.img.parent, arr[i], point );
		if ( t ) return arr[i];
	}
}



function containsPoint( node, point1, point2 ) {
	var local = node.getPointinLocal( point2 );
	var distsq = (local[0] - point1[0]) * (local[0] - point1[0]) + (local[1] - point1[1]) * (local[1] - point1[1]);
  	var rsq = 100;

  	return distsq < rsq;
}

Node.prototype.findImageTransformContainingPoint = function( point ) {
	for ( var i = 0; i < this.images.length; i++ ) {
		var transform = this.images[i].transform.transformContainsPoint( point );
		if ( transform != null )
			return transform;
	}
}

Node.prototype.transformHasPoint = function( point ) {

	var transform = this.findImageTransformContainingPoint( point );
	if ( transform != null ) return transform;
		
	for ( var i = 0; i < this.children.length; i++ ) {
		var transform2 = this.children[i].transformHasPoint( point );
		if ( transform2 != null )
			return transform2;
	}
	return null;

}

Node.prototype.nodeHasPoint = function( point ) {
	if ( this.contains( point ) ) return this;
		
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].nodeHasPoint( point ) != null )
			return this.children[i].nodeHasPoint( point );
	}
	return null;
}

Node.prototype.contains = function( point ) {
	var local = this.getPointinLocal( point );
  	var distsq = (local[0] ) * (local[0]) + (local[1]) * (local[1]);
  	var rsq = this.dim * this.dim;

  	return distsq < rsq;
}

Node.prototype.findSelected = function() {
	if ( this.selected ) return this;

	//var node = null;
	
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].findSelected() != null )//node = this.children[i].findSelected();
		return this.children[i].findSelected();
	}
	return null;
	//return node;	
}

Node.prototype.findSelectedImage = function() {
	if ( this.images.length > 0 ) {
		for ( var i = 0; i < this.images.length; i++ ) {
			if ( this.images[i].selected ) return this.images[i];
		}
	}
	

	//var node = null;
	
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].findSelectedImage() != null )//node = this.children[i].findSelected();
		return this.children[i].findSelectedImage();
	}
	return null;
}

Node.prototype.findSelectedTransform = function() {
	if ( this.images.length > 0 ) {
		for ( var i = 0; i < this.images.length; i++ ) {
			if ( this.images[i].findSelectedTransform() ) 
				return this.images[i].findSelectedTransform();
		}
	}
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].findSelectedTransform() != null )//node = this.children[i].findSelected();
		return this.children[i].findSelectedTransform();
	}
	return null;
}

SceneImage.prototype.findSelectedTransform = function() {
	if ( this.transform.p1.selected ) return [this.transform.p1, this];
	else if ( this.transform.p2.selected ) return [this.transform.p2, this];
	else if ( this.transform.p3.selected ) return [this.transform.p3, this];
	else if ( this.transform.p4.selected ) return [this.transform.p4, this];
	else if ( this.transform.rotateP.selected ) return [this.transform.rotateP, this];
	else return null;
}

Node.prototype.countNodes = function( counter ) {
	if ( this.children.length == 0 ) return counter+1;

	//var node = null;
	var returnValue = 0;
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].countNodes( counter) != null )//node = this.children[i].findSelected();
		returnValue = returnValue + this.children[i].countNodes(counter);
	}
	return returnValue + 1;
	//return node;	
}

Node.prototype.extractData = function() {
	if ( this.children.length == 0 ) {
		var s = "<ul class='noChildren'>";
		s = s + this.htmlNode();
		return s + "</ul>";
	}

	//var node = null;
	var returnValue = "";
	returnValue = this.htmlNodeChildren();
	for ( var i = 0; i < this.children.length; i++ ) {
		if ( this.children[i].extractData() != "" ) {
			
			returnValue = returnValue + this.children[i].extractData();

		}
	}
	return "<ul class='hasChildren' id='" + this.name + "'>" + returnValue + "</ul></ul>";
}

Node.prototype.htmlNodeChildren = function() {
	var string = "";
	string = "<li id='" + this.name + "'><div class='ul-element'>"+this.name+"<ul>";
	var images = "<li><div class='ul-element'>";
	images = images + this.extractImages();
	images = images + "</div></li>";
	string = string + images;
	string = string + "<li><div class='ul-element'>Children";
	return string;
}

Node.prototype.htmlNode = function() {
	var string = "";
	string = "<li id='" + this.name + "'><div class='ul-element'>"+this.name+"<ul>";
	var images = "<li><div class='ul-element'>";
	images = images + this.extractImages();
	images = images + "</div></li>";
	string = string + images;
	string = string + "<li><div class='ul-element'>Children</div></li></ul></div></li>";
	return string;
}

Node.prototype.extractImages = function() {
	var string = "";
	if ( this.images.length == 0 ) return "images";
	string = string + "<ul>";
	for ( var i = 0; i < this.images.length; i++ ) {
		string = string + this.images[i].htmlImages();
	}
	string = string + "</ul>";
	return string;
}

SceneImage.prototype.htmlImages = function() {
	var string = "<li class='hasChildren' id='" + this.name + "'><div class='ul-element'>" + this.name + "</div></li>";
	return string;
}

Node.prototype.findImageSelected = function() {
	for ( var i = 0; i < this.images.length; i++ ) {
		if ( this.images[i].selected ) 
			return this.images[i];
	}
}

Node.prototype.calculateGlobalMatrix = function() {
	if ( this.parent == null ) {
		this.globalMatrix = this.localMatrix;
	} else {
		mat3multiply( this.globalMatrix, this.parent.globalMatrix, this.localMatrix );
	}
}

Node.prototype.calculateLocalMatrix = function() {
	var translationM = mat3create();
	var rotationM = mat3create();
	translationM = [ 1, 0, 0, 0, 1, 0, this.translation[0], this.translation[1], this.translation[2] ];
	rotationM = [ Math.cos( this.rotation ), Math.sin( this.rotation ), 0, - Math.sin( this.rotation ), Math.cos( this.rotation ), 0, 0, 0, 1 ];
	mat3multiply( this.localMatrix, translationM, rotationM );	
}
/*
function SceneImage( img ) {
	this.img = img || new Image();
	this.translation = createVector( 0, 0, 1 );
	this.rotation = 0;
	this.scale = 0;
	this.localMatrix = mat3create();
	this.selected = true;
	this.transform = new TransformImage( this );
	this.parent = null;
	this.name = "";
}
*/

SceneImage.prototype.calculateLocalMatrix = function() {
	var translationM = mat3create();
	var rotationM = mat3create();
	translationM = [ 1, 0, 0, 0, 1, 0, this.translation[0], this.translation[1], this.translation[2] ];
	rotationM = [ Math.cos( this.rotation ), Math.sin( this.rotation ), 0, - Math.sin( this.rotation ), Math.cos( this.rotation ), 0, 0, 0, 1 ];
	mat3multiply( this.localMatrix, translationM, rotationM );	
}
/*
SceneImage.prototype.calculateGlobalMatrix = function() {
	if ( this.parent == null ) {
		this.globalMatrix = this.localMatrix;
	} else {
		mat3multiply( this.globalMatrix, this.parent.globalMatrix, this.localMatrix );
	}
}
*/

Node.prototype.addChild = function( point, counter ) {
	counter = counter + 1;
	this.selected = false;
	var local = this.getPointinLocal( point );
	var parent = this;

	var node = new Node( local[0], local[1] );

	var dist = parent.getDistance( node );
	var rad = parent.getRotation( node );
	node.distance = dist;
	node.rotation = rad;
	node.calculateLocalMatrix();
	node.parent = parent;
	parent.children.push( node );
	node.calculateGlobalMatrix();
	node.name = "node" + counter;
}

Node.prototype.getPointinLocal = function( point ) {
	var inv = this.inverseGlobal();
	//var a = createVec();
	var local = vec3create();
	//a[0] = point.x;
	//a[1] = point.y;
	//a[2] = 1;
	vec3transformMat3( local, point, inv );
	return local;
}

Node.prototype.getPointinGlobal = function( point ) {
	//var inv = this.inverseGlobal();
	//var a = createVec();
	var globalPoint = vec3create();
	//a[0] = point.x;
	//a[1] = point.y;
	//a[2] = 1;
	vec3transformMat3( globalPoint, point, this.globalMatrix );
	return globalPoint;
}

Node.prototype.inverseGlobal = function() {
	var inv = mat3create();
	mat3invert( inv, this.globalMatrix );
	return inv;
}

Node.prototype.getDistance = function( node ) {
	//var dx = node.translation.x - this.translation.x;
	//var dy = node.translation.y - this.translation.y;
	var dx = node.translation[0];
	var dy = node.translation[1];
	return Math.sqrt( (dx) * (dx) + (dy) * (dy) );
}

Node.prototype.getRotation = function( node ) {
	//var dx = node.translation.x - this.translation.x;
	//var dy = node.translation.y - this.translation.y;
	var dx = node.translation[0];
	var dy = node.translation[1];
	var rad = Math.atan2( dy, dx );
	//node.orgRot = rad;
	var angle = rad / Math.PI * 180.0 - 90;
	var rot = angle * Math.PI / 180.0;
	//var r = angle - pangle;
	//var rot = r * Math.PI / 180.0; 
	return rot;
}

SceneImage.prototype.updateMatrices = function( dist ) {
	this.updateLocal( dist );
}

SceneImage.prototype.updateLocal = function( dist ) {
	this.calculateLocalMatrix();
	this.updateImageVertices();
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
	this.translation.x = this.localMatrix[6];
	this.translation.y = this.localMatrix[7]; 
}

Node.prototype.updateGlobal = function() {
	this.calculateGlobalMatrix();

	for ( var i = 0; i < this.children.length; i++ ) {
		this.children[i].updateGlobal();
		this.children[i].updateGlobalPoint();
	}
}

Node.prototype.rotatePoint = function( local ) {

	var dx = local[0];
	var dy = local[1];
	var rad = Math.atan2( dy, dx );

	var angle = rad / Math.PI * 180.0;
	var radians = (angle - 90) * Math.PI / 180.0,

	cos = Math.cos(rad),
	sin = Math.sin(rad);

	this.translation[0] = cos * this.distance;
	this.translation[1] = sin * this.distance;
	
	this.rotation = radians;

	this.updateMatrices();	
}

SceneImage.prototype.rotateImage = function( local ) {
	var dx = local[0];
	var dy = local[1];
	var rad = Math.atan2( dy, dx );

	var angle = rad / Math.PI * 180.0;
	var radians = (angle - 90) * Math.PI / 180.0,

	cos = Math.cos(rad),
	sin = Math.sin(rad);

	//var dist = this.parent.getDistance( this );

	//this.translation[0] = cos * dist;
	//this.translation[1] = sin * dist;

	this.rotation = radians;
	
	this.updateMatrices( 0 );
}

SceneImage.prototype.getNewWidthAndHeight = function() {
	var selectedCorner = this.findSelectedTransform()[0];
	var opositeCorner = null;
	if ( selectedCorner == this.transform.p1 )
		opositeCorner = this.transform.p4;
	else if ( selectedCorner == this.transform.p2 )
		opositeCorner = this.transform.p3;
	else if ( selectedCorner == this.transform.p3 )
		opositeCorner = this.transform.p2;
	else if ( selectedCorner == this.transform.p4 )
		opositeCorner = this.transform.p1;

	var gp1 = this.parent.getPointinGlobal( opositeCorner );
	var gp2 = this.parent.getPointinGlobal( selectedCorner );
	
	var maxX = Math.max( gp1[0], gp2[0] );
	var minX = Math.min( gp1[0], gp2[0] );
	var maxY = Math.max( gp1[1], gp2[1] );
	var minY = Math.min( gp1[1], gp2[1] );

	this.updateCorners( selectedCorner, opositeCorner );
	
	this.img.width = Math.sqrt((this.transform.p2[0] - this.transform.p1[0]) * (this.transform.p2[0] - this.transform.p1[0]) + (this.transform.p2[1] - this.transform.p1[1]) * (this.transform.p2[1] - this.transform.p1[1]));
	this.img.height = Math.sqrt((this.transform.p3[0] - this.transform.p1[0]) * (this.transform.p3[0] - this.transform.p1[0]) + (this.transform.p3[1] - this.transform.p1[1]) * (this.transform.p3[1] - this.transform.p1[1]))	
	this.transform.rotateP[0] = this.translation[0] + this.img.width/2, this.transform.rotateP[1] = this.translation[1] - 40;
	
}

SceneImage.prototype.updateCorners = function( selectedCorner, opositeCorner ) {
	if ( selectedCorner == this.transform.p1 ) {
		this.transform.p1[0] = selectedCorner[0], this.transform.p1[1] = selectedCorner[1];
		this.transform.p2[0] = opositeCorner[0], this.transform.p2[1] = selectedCorner[1];
		this.transform.p3[0] = selectedCorner[0], this.transform.p3[1] = opositeCorner[1];
		this.transform.p4[0] = opositeCorner[0], this.transform.p4[1] = opositeCorner[1];
	}
	else if ( selectedCorner == this.transform.p2 ) {
		this.transform.p1[0] = this.translation[0], this.transform.p1[1] = selectedCorner[1];
		this.transform.p2[0] = selectedCorner[0], this.transform.p2[1] = selectedCorner[1];
		this.transform.p3[0] = opositeCorner[0], this.transform.p3[1] = opositeCorner[1];
		this.transform.p4[0] = selectedCorner[0], this.transform.p4[1] = opositeCorner[1];
	}
	else if ( selectedCorner == this.transform.p3 ) {
		this.transform.p1[0] = selectedCorner[0], this.transform.p1[1] = this.translation[1];
		this.transform.p2[0] = opositeCorner[0], this.transform.p2[1] = opositeCorner[1];
		this.transform.p3[0] = selectedCorner[0], this.transform.p3[1] = selectedCorner[1];
		this.transform.p4[0] = opositeCorner[0], this.transform.p4[1] = selectedCorner[1];
	}
	else if ( selectedCorner == this.transform.p4 ) {
		this.transform.p1[0] = opositeCorner[0], this.transform.p1[1] = opositeCorner[1];
		this.transform.p2[0] = selectedCorner[0], this.transform.p2[1] = this.translation[1];
		this.transform.p3[0] = this.translation[0], this.transform.p3[1] = selectedCorner[1];
		this.transform.p4[0] = selectedCorner[0], this.transform.p4[1] = selectedCorner[1];
	}
	this.translation = this.transform.p1;
}


SceneImage.prototype.containsPoint = function( point ) {
	var point1 = this.transform.p1;
	var point2 = this.transform.p2;
	var point3 = this.transform.p3;
	var point4 = this.transform.p4;

	var gp1 = this.parent.getPointinGlobal( point1 );
	var gp2 = this.parent.getPointinGlobal( point2 );
	var gp3 = this.parent.getPointinGlobal( point3 );
	var gp4 = this.parent.getPointinGlobal( point4 );

	var maxX = Math.max( gp1[0], gp2[0], gp3[0], gp4[0] );
	var maxY = Math.max( gp1[1], gp2[1], gp3[1], gp4[1] );
	var minX = Math.min( gp1[0], gp2[0], gp3[0], gp4[0] );
	var minY = Math.min( gp1[1], gp2[1], gp3[1], gp4[1] );

	if (point[0] >= minX &&
        point[0] <= maxX &&
        point[1] >= minY &&
        point[1] <= maxY) {
		//console.log("inside image");
		return true;
	} else return false;
}




