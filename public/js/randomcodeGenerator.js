module.exports=function(codeHead,element){
    const randomNumber=Math.floor(Math.random()*100)+1;
    const code=`${codeHead + element.id + "0" + randomNumber}`;
    return code
}