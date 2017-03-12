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
        fill: "#c0cad8"
    });
}

function fillEvenBox(shape){
    shape.attr({
        fill: "#292a2b"
    });
}

function drawChess(svg,x,y,code,opt){
    let chess = svg.text(x,y,code);
    chess.attr({
        'font-size' : opt.fontSize,
        'text-anchor' : 'middle',
        'fill' : opt.color,
        'stroke' : 'black'
    });
    return chess;
}


function drawBoard(svg,width,height,number){
    let space = width/2;
    for(var row = 0 ; row < number;row++){
        for(var col = 0; col < number;col++){
            let r = drawRect(svg,col * width + space,row * height + space,width,height);
            if(checkOdd(row,col)) fillOddBox(r) 
            else fillEvenBox(r); 
            // draw A,B,C,1,2,3
            if(row == 0 ){
                svg.text(col * width + width,row * height + space/2,String.fromCharCode(65 + col));
            }
            if(col == 0){
                svg.text(col * width + space/2,row * height + height,row + 1);
            }
        }
    }  
}

exports.drawBoard = drawBoard;
exports.drawChess = drawChess;
exports.drawRect = drawRect;