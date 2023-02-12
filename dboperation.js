const config = require("./dbconfig");
const sql = require("mssql");

async function CheckSQLConnection(){
    try {
        let checkConnection = await sql.connect(config);
        console.log("sql server is connected");
    }catch(error){
        console.log("sql server: " + error);
    }
}

async function getdata_withQuery(){
    try {
        let connection = sql.CheckSQLConnection(config);
        
       let response = await connection.request.query('SELECT * FROM computers');
       return response;
    }catch(err){
        console.log("SQL Error: " + err);
    }
}

module.exports = {
    CheckSQLConnection: CheckSQLConnection,
    getdata_withQuery: getdata_withQuery
}