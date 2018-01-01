var all_sqls = [

    //"CREATE DATABASE DoraWorld DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci",

    //"ALTER DATABASE DoraWorld CHARACTER SET utf8",
    //"ALTER DATABASE DoraWorld COLLATE utf8_general_ci ",

    "DROP TABLE IF EXISTS dw_user",
    "DROP TABLE IF EXISTS dw_picture",
    "DROP TABLE IF EXISTS user_activity",
    "DROP TABLE IF EXISTS picture_from_wx",

    "DROP VIEW IF EXISTS v_dw_picture",

    "CREATE TABLE dw_user ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "user_name VARCHAR(100) NOT NULL, " +
        "gender INTEGER, " +
        "role INTEGER DEFAULT 0, " +
        "password VARCHAR(100) NOT NULL, " +
        "email VARCHAR(100) NOT NULL, " +
        "photo VARCHAR(100) DEFAULT 'default', " +
        "create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), " +
        "token VARCHAR(10000), " +
        "reset_pw_req_time TIMESTAMP NOT NULL DEFAULT '1970-01-01 12:00:01', " +
        "reset_pw_req_id VARCHAR(36), " +

        "PRIMARY KEY (id) " +
    ")",

    "CREATE TABLE dw_picture ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "uploader_id VARCHAR(100) NOT NULL, " +
        "file_name VARCHAR(100) NOT NULL, " +
        "message VARCHAR(10000), " +
        "from_wx INT NOT DEFAULT 0, " +
        "add_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), " +

        "PRIMARY KEY (id) " +
    ")",

    "CREATE TABLE user_activity ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "user_id INT NOT NULL, " +
        "time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(), " +
        "activity VARCHAR(1000), " +

        "PRIMARY KEY (id) " +
    ")",

    "CREATE TABLE picture_from_wx ( " +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "wx_user_id VARCHAR(100) NOT NULL, " +
        "process_start INT NOT NULL DEFAULT 0, " +
        "image_url VARCHAR(500), " +
        "message VARCHAR(2000), " +
        "process_end INT NOT NULL DEFAULT 0, " +
        "last_update BIGINT DEFAULT 0, " +

        "PRIMARY KEY (id) " +
    ")",



    //views
    "CREATE VIEW v_dw_picture AS " +
        "SELECT picture.*, user.user_name uploader FROM dw_picture picture, dw_user user WHERE picture.uploader_id = user.id ",

    "INSERT INTO dw_user (user_name, role, password, email, token) values ('admin', 1, '1aefc03c3abee2e111f77bd88d79436ffa1e133694ddf7a61735', 'admin@emontech.cn', 'admin')",
];


module.exports = {
    sqls: all_sqls,
};
