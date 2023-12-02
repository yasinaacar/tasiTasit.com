const District=require("../models/district");
const Province=require("../models/province");
const logger = require("../startup/logger");

const apiUrl="https://turkiyeapi.dev/api/v1/provinces";


async function dummyData(){
    const provinceCount=await Province.count(); 
    
    if(provinceCount==0){
        fetch(apiUrl)
        .then(response=>{
            if(!response.ok){
                logger.error("Turkey API Network response was not OK")
                throw new Error("Turkey API Network response was not ok");
            }
            return response.json();
        })
        .then(async (datas)=>{
            for (const data of datas.data) {
                const province=await Province.create({id:data.id, name:data.name});                
                for (const district of data.districts) {
                    await District.create({id: district.id, name: district.name, provinceId:province.id});
                }
            }
            logger.info("Provinces and districts are added")
        })
        .catch(err=>{logger.error(`FETCH ERROR: ${err}`)});
    }

}



module.exports=dummyData;