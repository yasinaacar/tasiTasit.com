module.exports=async function(codeHead,element){
    const randomNumber=await Math.floor(Math.random()*100)+1;
    const code=await `${codeHead + element.id + "0" + randomNumber}`;
    return code
};