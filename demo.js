CanvasState.prototype.loadCharacter = function() {
	
	var tree = new Tree();
	this.tree = tree;
	var counter = 0;

	var rootPoint = [360,58];
	tree.addRoot(rootPoint);

	var treePoint1 = [346,155,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint1, counter );
	var node1 = this.tree.root.findSelected();
	addImagesss("neck", node1, [-31,-21], 66, 43, this );
	addImagesss("head", node1, [-46,-125.4], 96, 112, this );
	
	var treePoint2 = [347,174,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint2, counter );
	var nodeChildren1 = this.tree.root.findSelected();
	nodeChildren1.selected = false;

	var treePoint3 = [289,161,1];
	counter = this.tree.root.countNodes(counter);
	nodeChildren1.addChild( treePoint3, counter );

	var treePoint6 = [248,269,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint6, counter );
	var node3 = this.tree.root.findSelected();
	addImagesss("upper-arm", node3, [-19,-108], 43, 123, this );

	var treePoint7 = [297,353,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint7, counter );
	var node4 = this.tree.root.findSelected();
	addImagesss("hand", node4, [-13,-12], 30, 72, this );
	addImagesss("lower-arm", node4, [-20,-117], 45, 116, this );

	var treePoint8 = [330,414.5,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint8, counter );

	this.tree.root.findSelected().selected = false;


	var treePoint4 = [409,151,1];
	counter = this.tree.root.countNodes(counter);
	nodeChildren1.addChild( treePoint4, counter );

	var treePoint9 = [444,249,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint9, counter );
	var node5 = this.tree.root.findSelected();
	addImagesss("upper-arm-right", node5, [-25,-92], 41, 128, this );

	var treePoint10 = [382,340,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint10, counter );
	var node6 = this.tree.root.findSelected();
	addImagesss("hand-right", node6, [-18,-13], 32, 72, this );
	addImagesss("upper-arm-right", node6, [-8,-110], 42, 105, this );

	var treePoint11 = [361,380.5,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint11, counter );

	this.tree.root.findSelected().selected = false;

	var treePoint5 = [348,297,1];
	counter = this.tree.root.countNodes(counter);
	nodeChildren1.addChild( treePoint5, counter );
	var node2 = this.tree.root.findSelected();
	addImagesss("lower-body", node2, [-63.65,8], 127, 106, this );
	addImagesss("body", node2, [-71,-144.5], 146, 211, this );

	var treePoint12 = [343,384,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint12, counter );
	var nodeChildren2 = this.tree.root.findSelected();
	nodeChildren2.selected = false;

	var treePoint13 = [308,385,1];
	counter = this.tree.root.countNodes(counter);
	nodeChildren2.addChild( treePoint13, counter );

	var treePoint15 = [307,495,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint15, counter );
	var node3 = this.tree.root.findSelected();
	addImagesss("upper-leg", node3, [-26,-111], 70, 146, this );

	var treePoint16 = [299,637,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint16, counter );
	var node4 = this.tree.root.findSelected();
	addImagesss("lower-leg", node4, [-23,-130.5], 54, 148, this );

	var treePoint17 = [299,693,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint17, counter );
	var node5 = this.tree.root.findSelected();
	addImagesss("foot", node5, [-46.6,-57], 70, 53, this );

	this.tree.root.findSelected().selected = false;


	var treePoint14 = [418,365,1];
	counter = this.tree.root.countNodes(counter);
	nodeChildren2.addChild( treePoint14, counter );

	var treePoint18 = [424,492,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint18, counter );
	var node6 = this.tree.root.findSelected();
	addImagesss("upper-leg-right", node6, [-73,-110], 66, 153, this );

	var treePoint19 = [430,623,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint19, counter );
	var node7 = this.tree.root.findSelected();
	addImagesss("lower-leg-right", node7, [-62,-116.5], 53, 139, this );

	var treePoint20 = [426.5,687,1];
	counter = this.tree.root.countNodes(counter);
	this.tree.root.findSelected().addChild( treePoint20, counter );
	var node8 = this.tree.root.findSelected();
	addImagesss("foot-right", node8, [-55.7,-51.7], 66, 55, this );

	//this.tree.root.findSelected().selected = false;

}

function addImagesss( name, node, point, width, height, myState ) {
	var img = new Image();
	img.src = "mob/"+ name +".png";
	img.height = height;
	img.width = width;
	
    img.onload = function(event){
        var image = new Image();
        image.onload = function(){
        	image.height = img.height;
        	image.width = img.width;
            var imageNode = addImagesssToNode( image, node );
            updateMoves( imageNode, point );
        }
        image.src = img.src;
    }
      
    var parent = document.getElementById("imageList");
	console.log(parent);
    parent.appendChild(img);
}

function addImagesssToNode( image, node ) {
	var selectedNode = node;
	var img = new SceneImage( image );
	img.img.width = image.width;
	img.img.height = image.height;
	img.translation[0] = -image.width / 2;
	img.translation[1] = -image.height / 2;
	img.img.style.x = 0;
	img.img.style.y = 0;
	img.parent = selectedNode;
	img.calculateLocalMatrix();
	img.updateImageVertices();
	selectedNode.images.push( img );
	return img;
}

function updateMoves( image, local ) {
	image.translation[0] = local[0];
	image.translation[1] = local[1];
	var dist = image.parent.getDistance( image );
	
	image.updateMatrices( dist );
}

CanvasState.prototype.loadAnimation = function( spriteToCanvas ) {
	var spriteSheet_show = document.getElementById("canvas2");
	
	
	var spriteSheetToShow = new SpriteSheet( false, spriteSheet_show );
	spriteSheetToShow.scaleConstant = 0.2;
	spriteSheetToShow.calculateHeight(spriteToCanvas);
	spriteSheetToShow.canvas.width = spriteToCanvas.width * spriteSheetToShow.scaleConstant;
	spriteSheetToShow.width = spriteSheetToShow.canvas.width;
	//spriteSheetToShow.height = 150;
	//spriteSheetToShow.width = 2400;
	spriteSheetToShow.counter = 16;
	spriteSheetToShow.frameHeight = 0;
	spriteToCanvas.frameIndex = 0;
	spriteSheetToShow.frameWidth = 668;
	spriteSheetToShow.numberOfFrames = 15;
	spriteSheetToShow.newFrame = [0,0,1];
	spriteSheetToShow.origin = [0,0,1];
	spriteSheetToShow.canvas.parentElement.style.display = "block";
	spriteSheetToShow.ctx.save();
	spriteSheetToShow.ctx.scale( spriteSheetToShow.scaleConstant, spriteSheetToShow.scaleConstant );
	spriteSheetToShow.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToShow.recalculateWidth( spriteToCanvas );

	var spriteSheet_download = document.createElement('canvas');
	var spriteSheetToDownload = new SpriteSheet( true, spriteSheet_download );
	spriteSheetToDownload.calculateHeight( spriteToCanvas );
	spriteSheetToDownload.calculateWidth( spriteToCanvas );
	spriteSheetToDownload.saveImageInSpriteSheet( spriteToCanvas );
	spriteSheetToDownload.frameHeight = 747;
	spriteSheetToDownload.frameWidth = 668;
	spriteSheetToDownload.numberOfFrames = 15;
	spriteSheetToShow.ctx.restore();

	return [spriteSheetToShow, spriteSheetToDownload];
}

