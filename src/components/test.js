

console.log("执行test.js")
testArr(0);


var x = myFunction(7, 8);        // 调用函数，返回值被赋值给 x
console.log(x)

function myFunction(a, b) {
    return a * b;                // 函数返回 a 和 b 的乘积
}

function testArr(a){
    console.log(a)
    console.log("执行testArr")
    var arr = [1, 2, 3, 4]
    for(var i=0;i<arr.length;i++)    {
          console.log(i+"#######"+arr[i])
    }
    return null;
}


function testJson() {

    var chaomao = [1, 2, 3, 4, 5]
    chaomao.splice(2, 1, 8, 9)
    console.log(chaomao)
    var jArr = []
    var json = {}
    json[1] = 'value';
    json.text2 = 'value2';
    jArr[1] = json
    jArr[2] = json
    jArr[3] = json
    jArr[4] = json
    console.log(json)
    console.log(jArr)

}