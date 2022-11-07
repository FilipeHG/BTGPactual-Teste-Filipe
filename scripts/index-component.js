function buildWall() {
	var amountBricks = (Math.floor(Math.random() * (20000 - 1)) + 1);
	var maxBricksPerRow = 1;
	var wallMaxRows = 1;

	switch (true) {
	  case (amountBricks <= 3):
		maxBricksPerRow = 1;
		wallMaxRows = 1;
		break;
	  case (amountBricks <= 20):
		maxBricksPerRow = 2;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
		break;
	  case (amountBricks <= 100):
		maxBricksPerRow = 10;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
		break;
	  case (amountBricks <= 300):
		maxBricksPerRow = 20;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
		break;
	  case (amountBricks <= 2000):
		maxBricksPerRow = 50;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
		break;
	  case (amountBricks <= 10000):
		maxBricksPerRow = 100;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
		break;
	  default:
		maxBricksPerRow = 150;
		wallMaxRows = Math.round(amountBricks / maxBricksPerRow);
	}

	var htmlRow = "";
	var rowsBricksSizes = [];
	
	while (wallMaxRows > 0) {
		var wallRowObject = buildRow(maxBricksPerRow);
		
		htmlRow += wallRowObject._html;
		rowsBricksSizes.push(wallRowObject._sizes);
		
		wallMaxRows--;
	}
	
	var positions = getPositions(rowsBricksSizes);
	var maxUncutBricksPosition = Math.max(...positions.map((e) => e.numberUncutBricks));
	var bestWidthPosition = positions.find((e) => e.numberUncutBricks == maxUncutBricksPosition);
	
	var positionsString = JSON.stringify(positions);
	var bestWidthPositionString = JSON.stringify(bestWidthPosition);

	document.getElementById('txt-log-bricks').innerHTML = positionsString.replace(bestWidthPositionString,'<b>' + bestWidthPositionString + '</b>');
	document.getElementById('brick-wall').innerHTML = htmlRow;
	
	buildVerticalBar(bestWidthPosition);
}

var getPositions = function(rowsBricksSizes) {	
	var positions = [];

	for (var y = 0; y < rowsBricksSizes.length; ++y) {
		if (rowsBricksSizes[y].length > 1) {
			var currentBaseRow = y;
			var currentCompareRow = y + 1;
			var currentBaseColumn = 0;
			
			while(rowsBricksSizes[currentBaseRow][currentBaseColumn]) {

				while(rowsBricksSizes[currentCompareRow]) {
					var size = 0;
					
					if (currentBaseRow == currentCompareRow || 
						!rowsBricksSizes[currentBaseRow] || 
						!rowsBricksSizes[currentBaseRow][currentBaseColumn]
					) {
						currentCompareRow++;
						continue;
					}

					if (rowsBricksSizes[currentCompareRow][currentBaseColumn]) {
						size += rowsBricksSizes[currentCompareRow][currentBaseColumn];
						considerPosition = false;
						
						if (size == rowsBricksSizes[currentBaseRow][currentBaseColumn]) {
							considerPosition = true;
						}
						else {
							var counterSumSizes = currentBaseColumn;
							var sumBaseSizes = rowsBricksSizes[currentBaseRow][counterSumSizes];
							while (size > sumBaseSizes && rowsBricksSizes[currentBaseRow][counterSumSizes + 1])
							{
								counterSumSizes++;
								sumBaseSizes += rowsBricksSizes[currentBaseRow][counterSumSizes];
							}

							if (size == sumBaseSizes) {
								considerPosition = true;
							}
						}
						
						if (considerPosition) {
							var widthPosition = positions.find((bwp) => bwp.position == size);
							if (!widthPosition)
								positions.push({ position: size, numberUncutBricks: 1 });
							else
								widthPosition.numberUncutBricks++;
						}
					}
					
					currentCompareRow++;
				}
				
				currentBaseColumn++;
			}
		}
	}
	
	return positions;
};

var buildRow = function(maxBricksPerRow) {
	var bricksObject = { _html: "", _sizes: null };
	var html = "<div class='wall-row'>";
	var sizes = [];
	
	var brickCounter = 0;
	while (brickCounter < maxBricksPerRow) {
		var brickSize = (Math.floor(Math.random() * (20 - 1)) + 1) * 2;

		if ((brickCounter + brickSize) > maxBricksPerRow)
			brickSize = (maxBricksPerRow - brickCounter);
		
		html += "<div class='brick size-" + brickSize + "' style='width:" + brickSize + "em'>" + brickSize + "</div>";
		sizes.push(Number(brickSize));

		brickCounter += brickSize;
	}

	html += "</div>";

	bricksObject._html = html;
	bricksObject._sizes = sizes;

	return bricksObject;
};

var buildVerticalBar = function(bestWidthPosition) {
	var rightElementOffset = document.querySelector('.size-' + bestWidthPosition.position + ':first-child').getBoundingClientRect().right;
	var barPosition = (Math.round(rightElementOffset) - 15) + 'px';

	document.getElementsByClassName('vertical-cut-bar')[0].style.left = barPosition;
};
