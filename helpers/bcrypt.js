const bcrypt=require("bcrypt");
const saltRounds=10;

async function hash(password){
    return  bcrypt.hash(password, saltRounds);
};

async function compare(password,db_password){
    return bcrypt.compare(password, db_password);
};

module.exports={ hash, compare }
