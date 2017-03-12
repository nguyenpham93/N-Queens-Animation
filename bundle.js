(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const nqueen = require('./nqueen').nqueen;

$("#btnChess").click(function(){
    let num = $("#inputNum").val();
    $("#mysolve,#status,#end").text("");
    run.runner(num,function(err){
        if(err) $("#status").text(err);
    });
});

$("#btnNext").click(function(){
    run.runManual();        
});

$("#btnAuto").click(function(){
    run.runAuto(700);        
});

// Run app
let run = new nqueen();
run.init();
},{"./nqueen":3}],3:[function(require,module,exports){
// Maked by Nguyen Pham
/**
* @param arrChess : chứa những quân hậu đạt điều kiện
* @param arrCross : chứa giá trị đưòng chéo chính của các quân hậu
* @param arrCross1 : chứa giá trị đưòng chéo phụ của các quân hậu
* @param total_solutions : chứa tối đa tất cả các solutions có thể tìm đuợc  
*/
// N-Queens Problem

const draw = require('./drawBoard'); 

class nqueen {
    constructor(){
        this.arrChess = [];
        this.arrCross = []; // i + j
        this.arrCross1 = []; // j - i + end
        this.total_solutions = [];
        this.i = 0; // row
        this.j = []; //col
        this.s = Snap("#mysvg");
        this.statusGroup = this.s.group();
        this.acceptChess = []; 
        this.mainchess = '',
        this.interval = '',
        this.isBack = false,
        this.findOut = false,
        this.endLooking = false,
        this.length = 4,
        //default options
        this.options = {
            'chessColor' : 'orange',
            'chessSize' : 60,
            'width' : 80,
            'height' : 80,
            'codeText' : '\u265A'
        };
    }
    solve_n_queens(i,j,n){
        let flag = true,
        color = 'green',
        isBack = this.isBack,
        findOut = this.findOut,
        arrChess = this.arrChess,
        arrCross = this.arrCross,
        arrCross1 = this.arrCross1,
        width = this.options.width,
        height = this.options.height,
        statusGroup = this.statusGroup,
        drawStateChess = this.drawStateChess,
        s = this.s,
        calXBox = this.calXBox,
        calYBox = this.calYBox;

        if(!j[i]) j[i] = 0;
        if(this.checkEnd(i,j[i],n)){
            this.endLoop = true;
            return;
        }

        if(j[i] > (n - 1)){
            flag = false;
            color = 'red';
            j[i]--;
        }
        if(isBack || findOut){
            isBack = findOut = false;
            this.acceptChess[i].remove();
        } 
        this.movingAnimate(this.mainchess,i,j[i]);

        let cross = i + j[i];
        let cross1 = j[i] - i + (n-1);
        let len = arrChess.length;
        let whereError = [];
        
        // Kiểm tra xem quân hậu hiện tại có bị khống chế không, nếu có thì flag = false
        for(let k = 0; k < len ; k++){
            // Kiểm tra hàng dọc
            if(k == arrChess[k][0] && j[i] == arrChess[k][1]){
                flag = false;
                whereError[0] = 1;
            }
            // Kiểm tra 2 hàng chéo
            if (cross == arrCross[k]){
                flag = false;
                whereError[1] = 2;
            }
            if(cross1 == arrCross1[k]){
                flag = false;
                whereError[2] = 3;
            }
        }
        if(!flag) color = 'red';
        // push chess to last
        this.s.append(this.mainchess);
        // Hien thi trang thai quan hau
        for(let e = 0; e < n;e++){
            for(let f = 0;f < n; f++){
                let temp = e + f;
                let temp1 = f - e + (n-1);
                if(!whereError.length){
                    if(temp == cross || temp1 == cross1 || f == j[i]){
                        let t = drawStateChess(s,calXBox(f,width),calYBox(e,height),width,height,{'color' : color});
                        statusGroup.append(t);
                    }
                }else{
                    whereError.forEach(function(val){
                        if(val === 1 && f == j[i]){
                            let t = drawStateChess(s,calXBox(f,width),calYBox(e,height),width,height,{'color' : color});
                            statusGroup.append(t);
                        }
                        if(val === 2 && temp == cross){
                            let t = drawStateChess(s,calXBox(f,width),calYBox(e,height),width,height,{'color' : color});    
                            statusGroup.append(t);
                        }
                        if(val === 3 && temp1 == cross1){
                            let t = drawStateChess(s,calXBox(f,width),calYBox(e,height),width,height,{'color' : color});     
                            statusGroup.append(t);
                        }
                    });
                }
            }
        }

        if(flag){
            arrChess.push([i,j[i]]);
            arrCross.push(cross);
            arrCross1.push(cross1);
            //Count chess 
            let flagChess = draw.drawChess(s,(j[i] * width) + width,(i * height) + (height + 15),'' + parseInt(i + 1),{
                'fontSize' : this.options.chessSize,
                'color' : this.options.chessColor
            });   
            this.animateFont(flagChess,150,function(){
                flagChess.animate({
                    'font-size' : '60px'
                },700);
            });
            this.acceptChess[i] = flagChess;
            // Kiểm tra xem đã đủ n quân hậu chưa, nếu đủ thì lưu solution đó lại
            if(arrChess.length == n){
                let solution = arrChess.slice(0);
                this.total_solutions.push(solution);
                this.popArr([arrChess,arrCross,arrCross1]);
                j[i]++;
                findOut = true;
            }else{
                i++;
                j[i] = 0;
            }    
        }else{
            if(j[i] >= (n-1)){
                i--;
                this.popArr([arrChess,arrCross,arrCross1]);
                isBack = true;
            }
            j[i]++;
        }
        this.remark(i,j,arrChess,arrCross,arrCross1,isBack,findOut);
    }

    animateFont(text,size,cb){
        text.animate({
            'font-size' : size + 'px'
        },700,cb);
    }

    calXBox(x,width){
        return x * width + (width/2);
    }

    calYBox(y,height){
        return y * height + (height/2);
    }
    drawStateChess(s,x,y,w,h,opts){
        let rect = draw.drawRect(s,x,y,w,h);
        rect.attr({
            'stroke' : opts.stroke || 'black',
            'fill' : opts.color || 'green',
            'opacity' : opts.opacity || 0.5
        });
        return rect;
    }

    remark(i,j,arrChess,arrCross,arrCross1,isBack,findOut){
        this.i = i;
        this.j = j;
        this.arrChess = arrChess;
        this.arrCross = arrCross;
        this.arrCross1 = arrCross1;
        this.isBack = isBack;
        this.findOut = findOut;    
    }

    checkEnd(x,y,n){
        if(x == 0 && (y > (n - 1))){
            $("#end").text("End");
            return true;
        }
        return false;
    }

    popArr(arrays){
        $.each(arrays,function(index,value){
            value.pop();
        })
    }

    movingAnimate(chess,x,y){
        chess.animate(
        {
            'x': (y * this.options.width) + this.options.width,
            'y' : (x * this.options.height) + (this.options.height + 15)
        }, 500);
    }

    //clear snap
    reset(){
        this.s.clear();
        this.statusGroup.remove();
        this.i = 0;
        this.j = [];
        this.arrChess = [];
        this.arrCross = [];
        this.arrCross1 = [];
        this.total_solutions = [];
        this.acceptChess = [];
        this.statusGroup = this.s.group();
        this.isBack = false;
        this.endLoop = false;
        this.length = 4;
        this.findOut = false;
        this.resetOptions();
        this.autoOff();
    }

    resetOptions(){
        this.options = {
            'chessColor' : 'orange',
            'chessSize' : 60,
            'width' : 80,
            'height' : 80,
            'codeText' : '\u265B'
        };
    }

    validateInput(num){
        if(!num){
            throw new Error("Enter number");
        }else if(num > 8 || num < 4){
            throw new Error("4 < Input > 10");
        }
    }

    init(){
        //default table
        draw.drawBoard(this.s,this.options.width,this.options.height,this.length);
        // //default chess
        this.mainchess = draw.drawChess(this.s,-1,-1,this.options.codeText,{
            'fontSize' : this.options.chessSize,
            'color' : this.options.chessColor
        });   
    }

    checkOption(opt){
        if(opt){
            for(let p in opt){
                let prop = this.options;
                if(prop[p]) prop[p] = opt[p]; 
            }
        }
    }

    runAuto(timeout){
        if(!this.interval){
            let _this = this;
            _this.interval = setInterval( function(){
                if(_this.endLooking) _this.autoOff();
                _this.next();
            } ,timeout || 800);
        }
    }

    autoOff(){
        if(this.interval) clearInterval(this.interval);
        this.interval = '';
    }

    runManual(){
        this.autoOff();
        this.next();
    }

    next(){
        this.statusGroup.clear();
        this.statusGroup = this.s.group();
        this.solve_n_queens(this.i,this.j,this.length);
        $("#mysolve").text("Solutions : " + this.total_solutions.length);
    }

    // Run app
    runner(num,cb,opt){
        this.reset();
        try{
            this.validateInput(num);
            this.length = num;
            this.checkOption(opt);   
            cb(null);
        }catch(err){
            cb(err);
        }finally{
            this.init();
        }
    }
}

exports.nqueen = nqueen;
},{"./drawBoard":1}]},{},[2]);
