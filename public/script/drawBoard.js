/** 
* @param svg : Snap SVG modules 
* @param width : Box width
* @param height : Box height 
* @param number : Number of cell you want do draw
*/

function drawRect(svg,x,y,width,height){
    return svg.rect(x,y,width,height);
}


function checkOdd(row,col){
    return (row % 2 == 0 && col % 2 == 0) || (row % 2 != 0 && col % 2 != 0);
}

function fillOddBox(shape){
    shape.attr({
        fill: "#edeff2"
    });
}

function fillEvenBox(shape){
    shape.attr({
        fill: "black"
    });
}

function drawChess(svg,x,y,code,opt){
    let chess = svg.text(x,y,code);
    chess.attr({
        'font-size' : opt.fontSize || 60,
        'text-anchor' : 'middle',
        'fill' : opt.color || 'orange',
        'stroke' : 'black'
    });
    return chess;
}

function drawBoard(svg,x,y,width,height,number){
    let space = width/2;
    for(var row = 0 ; row < number;row++){
        for(var col = 0; col < number;col++){
            let r = drawRect(svg,col * width + space + x,row * height + space + y,width,height);
            if(checkOdd(row,col)) fillOddBox(r) 
            else fillEvenBox(r); 
            // draw A,B,C,1,2,3
            if(row == 0 ){
                svg.text(col * width + width + x,row * height + space/2 + y,String.fromCharCode(65 + col));
            }
            if(col == 0){
                svg.text(col * width + space/2 + x,row * height + height + y,row + 1);
            }
        }
    }  
}

function drawChessWithSolution(svg,width,height,number,arrsolution,code,num_solution){
    let space = width/2;
    let cellsOfRow = number > 6 ? 4 : 5; 
    let sizeBoard = width * number + space;
    let thick = Math.floor(num_solution/6); 
    let x = 0;
    let y = thick * sizeBoard;  
    if(num_solution % cellsOfRow != 0){
        x = sizeBoard * num_solution;    
    } 
    drawBoard(svg,x,y,width,height,number);
    arrsolution.forEach(function(arr){
        drawChess(svg,arr[0] * width + width + x,arr[1] * height + height + width/3 + y,code,{'fontSize' : width});
    });   
}

exports.drawBoard = drawBoard;
exports.drawChess = drawChess;
exports.drawRect = drawRect;
exports.drawChessWithSolution = drawChessWithSolution;