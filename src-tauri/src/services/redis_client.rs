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

    pub fn get_string_value(&mut self, key: &str) -> RedisResult<String> {
        let value: String = self.connection.get(key)?;
        Ok(value)
    }

    pub fn get_hash_value(&mut self, key: &str) -> RedisResult<Vec<(String, String)>> {
        let value: Vec<(String, String)> = self.connection.hgetall(key)?;
        Ok(value)
    }

    pub fn get_list_value(&mut self, key: &str) -> RedisResult<Vec<String>> {
        let value: Vec<String> = self.connection.lrange(key, 0, -1)?;
        Ok(value)
    }

    pub fn get_set_value(&mut self, key: &str) -> RedisResult<Vec<String>> {
        let value: Vec<String> = self.connection.smembers(key)?;
        Ok(value)
    }

    pub fn get_sorted_set_value(&mut self, key: &str) -> RedisResult<Vec<(String, f64)>> {
        let value: Vec<(String, f64)> = self.connection.zrange_withscores(key, 0, -1)?;
        Ok(value)
    }

    pub fn get_memory_usage(&mut self, key: &str) -> RedisResult<usize> {
        let memory_usage: usize = redis::cmd("MEMORY")
            .arg("USAGE")
            .arg(key)
            .query(&mut self.connection)?;
        Ok(memory_usage)
    }

}   