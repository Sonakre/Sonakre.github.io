CanvasState.prototype.loadCharacter = function() {

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

