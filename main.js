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