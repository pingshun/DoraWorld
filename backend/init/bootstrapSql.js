var all_sqls = [

    //"CREATE DATABASE DoraWorld DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci",

    //"ALTER DATABASE DoraWorld CHARACTER SET utf8",
    //"ALTER DATABASE DoraWorld COLLATE utf8_general_ci ",

    "DROP TABLE IF EXISTS dw_user",
    "DROP TABLE IF EXISTS dw_picture",

    "CREATE TABLE dw_user ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "user_name VARCHAR(100) NOT NULL, " +
        "gender INTEGER, " +
        "role INTEGER DEFAULT 1, " +
        "password VARCHAR(100) NOT NULL, " +
        "email VARCHAR(100) NOT NULL, " +
        "token VARCHAR(10000), " +
        "reset_pw_req_time BIGINT," +
        "reset_pw_req_id VARCHAR(36)," +

        "PRIMARY KEY (id) " +
    ")",

    "CREATE TABLE dw_picture ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "uploader VARCHAR(100) NOT NULL, " +
        "file_name VARCHAR(100) NOT NULL, " +
        "message VARCHAR(10000), " +

        "PRIMARY KEY (id) " +
    ")",

    "INSERT INTO dw_user (user_name, role, password, email, token) values ('admin', 0, 'admin', 'admin@emontech.cn', 'admin')",
];


module.exports = {
    sqls: all_sqls,
};
