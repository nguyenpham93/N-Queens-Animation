const nqueen = require('./nqueen').nqueen;

$("#btnChess").click(function(){
    let num = $("#inputNum").val();
    run.runner(num,function(err){
        if(err) $("#status").text(err);
    });
});

$("#btnNext").click(function(){
    run.runManual();        
});

$("#btnAuto").click(function(){
    run.runAuto(200);        
});

// Run app
let run = new nqueen();
run.init();