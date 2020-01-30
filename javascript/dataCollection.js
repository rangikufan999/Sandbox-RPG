
//This function takes a number of times to loop, a base number to work with, and a multiplier with which to increase the basenum with.
//The goal of the results of the function is to gain perspective on what multipliers would work best when scaling enemies.
function calculate(loopTimes, baseNum, multiplier){
    var result = baseNum;
    for(var i = 0;i<loopTimes;i++){
        result += Math.ceil(result * multiplier);
        console.log("["+ i + "]: " + "Value is: " + result);
    }
}

