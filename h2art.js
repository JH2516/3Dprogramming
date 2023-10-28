var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const debug_on = 0;
const lengMulti = 70;
const BigAmpMulti = -75;
const SmallAmpMulti = 25;
let countUndo = 0;
var undoStack = [];
let histoy = [];
var curConfig = {transX:0, transY:0, length:1, amp:1, deg:0};

var prevConfig=[
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0},
    {transX:0, transY:0, length:1, amp:1, deg:0}
];

//--------------------------------------------------------------------------------------------

function hwTranslateMatrix(x1,y1,curConfig) {
    if(debug_on)console.log("trans",curConfig);
    x1 = x1 + curConfig.transX;
    y1 = y1 + curConfig.transY;
    if(debug_on)console.log("trans",x1,y1,curConfig.transX,curConfig.transY);
    return{x1:x1,y1:y1};
}
function hwScaleMatrix1(x,curConfig,yPos) {
    yPos = SmallAmpMulti*curConfig.amp*(Math.abs(Math.sin(Math.PI*x/(curConfig.length*lengMulti)))); // sin 그래프의 y 값을 조절해 위쪽으로 이동
    if(debug_on)console.log("scale1",x,curConfig.amp,curConfig.length,yPos);
    return{yPos:yPos};
}
function hwScaleMatrix2(x,curConfig,yPos) {
    yPos = BigAmpMulti*curConfig.amp*((Math.sin(Math.PI*x/2/(curConfig.length*lengMulti)))); // sin 그래프의 y 값을 조절해 위쪽으로 이동
    if(debug_on)console.log("scale2",x,curConfig.amp,curConfig.length,xPos,yPos);
    return{yPos:yPos};
}
function hwRotationMatrix(x,x1,y1,xPos,yPos,curConfig) {
    xPos = ((x*Math.cos(curConfig.deg))-(yPos*Math.sin(curConfig.deg)));
    yPos = ((x*Math.sin(curConfig.deg))+(yPos*Math.cos(curConfig.deg)));
    xPos = x1+xPos;
    yPos = y1-yPos;
    if(debug_on)console.log("rot1",x,x1,y1,xPos,yPos,curConfig.deg);
    return {xPos:xPos,yPos:yPos};
}

function hwMatrixMultiply(x1,y1,curConfig,xPos,yPos) {

    if(debug_on) console.log ("곱하기 시작", curConfig);

    var sR;
    var rR;
    if(debug_on)console.log("rot1",x,x1,y1,xPos,yPos,curConfig.deg);

    var tR = hwTranslateMatrix(x1,y1,curConfig);
    //console.log(tR.x1,tR.y1);
    ctx.moveTo(tR.x1, tR.y1);
    //console.log(x1,y1)
    for (var x = 0; x <= 2*(curConfig.length*lengMulti); x += 1){

        sR = hwScaleMatrix1(x,curConfig,yPos);
        //console.log("sc1",sR.yPos);
        rR = hwRotationMatrix(x,tR.x1,tR.y1,xPos,sR.yPos,curConfig);
        //console.log("rot1",rR.xPos,rR.yPos);
        ctx.lineTo(rR.xPos,rR.yPos);
    }
    ctx.moveTo(tR.x1, tR.y1);
    for (var x = 0; x <= 2*(curConfig.length*lengMulti); x += 1){
        sR = hwScaleMatrix2(x,curConfig,yPos);
        rR = hwRotationMatrix(x,tR.x1,tR.y1,xPos,sR.yPos,curConfig);
        ctx.lineTo(rR.xPos,rR.yPos);
    }
    ctx.stroke();
    ctx.closePath();
    console.log("DH",rR.xPos,rR.yPos);
}

function Dheart(ctx,x1,y1,tranX,tranY,length,amp,deg,undo) {

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
  

    var xPos = 0;
    var yPos = 0;

    if (debug_on == 1) {
        console.log(tranX)
    }

    if(debug_on) console.log("before",prevConfig[0],prevConfig[1],curConfig);
    
        curConfig.transX = tranX;
        curConfig.transY = tranY;
        curConfig.length = length;
        curConfig.amp = amp;
        curConfig.deg = deg;

    /////curConfig.length = length*lengMulti;
    if(debug_on) console.log("여긴어디",prevConfig[1],undo, countUndo);

    
    if(debug_on) console.log("곱하기 전",prevConfig[0],prevConfig[1],curConfig);
    //curConfig.deg = ((curConfig.deg*2*Math.PI)/360);

    hwMatrixMultiply(x1,y1,curConfig,xPos,yPos);
}