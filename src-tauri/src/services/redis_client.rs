//use std::collections::HashMap;
use redis :: { Commands, RedisResult};

pub struct RedisClient {
    pub client: redis::Client,
    pub connection: redis::Connection,
    pub current_url: String,
    pub current_db: usize,
}

impl RedisClient {
    pub fn new(redis_url: &str) -> RedisResult<RedisClient> {
        let client = redis::Client::open(redis_url)?;
        let connection = client.get_connection()?;
        Ok(RedisClient { client, connection, current_url: redis_url.to_string(), current_db: 0 })
    }

    pub fn get_all_keys(&mut self) -> RedisResult<Vec<String>> {
        let keys: Vec<String> = self.connection.keys("*")?;
        Ok(keys)
    }

    pub fn get_keys_from_database(&mut self, db: usize) -> RedisResult<Vec<String>> {
        self.select_database(db)?;
        let keys: Vec<String> = self.connection.keys("*")?;
        Ok(keys)
    }

    pub fn get_key_type(&mut self, key: &str) -> RedisResult<String> {
        self.connection.key_type(key)
    }

    pub fn get_current_url(&self) -> String {
        self.current_url.clone()
    }

    pub fn check_connection(&mut self) -> RedisResult<String> {
        let pong: String = redis::cmd("PING").query(&mut self.connection)?;
        Ok(pong)
    }

    pub fn select_database(&mut self, db: usize) -> RedisResult<()> {
        let _: () = redis::cmd("SELECT").arg(db).query(&mut self.connection)?;
        self.current_db = db; 
        Ok(())
    }

    pub fn list_databases(&mut self) -> RedisResult<Vec<(usize, bool)>> {
        let databases: Vec<String> = redis::cmd("CONFIG")
            .arg("GET")
            .arg("databases")
            .query(&mut self.connection)?;

        let num_databases: usize = databases[1].parse().unwrap();
        let mut result = Vec::new();

        let current_db = self.current_db; // Use the current_db field

        for db in 0..num_databases {
            self.select_database(db)?; // Use the select_database method
            let db_size: usize = redis::cmd("DBSIZE").query(&mut self.connection)?;
            result.push((db, db_size == 0));
        }

        self.select_database(current_db)?; // Switch back to the originally selected database

        Ok(result)
    }

    // pub fn get_key_value(&mut self, key: &str) -> RedisResult<serde_json::Value> {
    //     let key_type = self.get_key_type(key)?;

    //     match key_type.as_str() {
    //         "string" => {
    //             self.connection.get(key).map(|v: String| serde_json::to_value(v).unwrap())
    //         },
    //         "hash" => {
    //             let hash: RedisResult<HashMap<String, String>> = self.connection.hgetall(key);
    //             hash.map(|h| serde_json::to_value(h).unwrap())
    //         },
    //         "list" => {
    //             let list: RedisResult<Vec<String>> = self.connection.lrange(key, 0, -1);
    //             list.map(|l| serde_json::to_value(l).unwrap())
    //         },
    //         "set" => {
    //             let set: RedisResult<Vec<String>> = self.connection.smembers(key);
    //             set.map(|s| serde_json::to_value(s).unwrap())
    //         },
    //         "zset" => {
    //             let zset: RedisResult<Vec<(String, f64)>> = self.connection.zrange_withscores(key, 0, -1);
    //             zset.map(|zs| serde_json::to_value(zs).unwrap())
    //         },
    //         "stream" => {
    //             let stream: RedisResult<Vec<(String, HashMap<String, String>)>> = self.connection.xrange_count(key, "-", "+", 10);
    //             stream.map(|st| serde_json::to_value(st).unwrap())
    //         },
            
        
    //         _ => Err(RedisError::from((
    //             redis::ErrorKind::TypeError,
    //             "Unsupported key type"
    //         ))),
    //     }
    // }
    
    

}   