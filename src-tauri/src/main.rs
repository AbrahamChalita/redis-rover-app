#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod services {
    pub mod redis_client;
}


use services::redis_client::RedisClient;
use std::sync::Mutex;
use std::collections::HashMap;
//use tauri::Builder;


#[tauri::command]
async fn test_redis_connection(redis_url: String, port: String, state: tauri::State<'_, Mutex<RedisClient>>) -> Result<(), String> {
    // Assuming redis_url does not contain the scheme and port part
    let full_url = format!("redis://{}:{}", redis_url, port);
    println!("full_url: {}", full_url);
    
    match RedisClient::new(&full_url) {
        Ok(client) => {
            let mut managed_client = state.lock().unwrap();
            *managed_client = client;
            Ok(())
        },
        Err(err) => {
          let error = err.to_string();
          Err(error)
        }
    }
}

#[tauri::command]
async fn get_all_keys(client: tauri::State<'_, Mutex<RedisClient>>) -> Result<HashMap<String, Vec<String>>, String> {
    let mut client = client.lock().unwrap();
    let keys = match client.get_all_keys() {
        Ok(keys) => keys,
        Err(err) => {
            println!("Error: {}", err);
            return Err("Internal Server Error".to_string());
        },
    };

    let mut data_by_type = std::collections::HashMap::new();

    for key in keys {
        let key_type = match client.get_key_type(&key) {
            Ok(key_type) => key_type,
            Err(err) => {
                println!("Error: {}", err);
                continue;
            },
        };

        data_by_type.entry(key_type).or_insert(Vec::new()).push(key);
    }

    Ok(data_by_type)
}

// get all keys from given database with keys type
#[tauri::command]
async fn get_keys_from_database(db: usize, client: tauri::State<'_, Mutex<RedisClient>>) -> Result<HashMap<String, Vec<String>>, String> {
    let mut client = client.lock().unwrap();
    let keys = match client.get_keys_from_database(db) {
        Ok(keys) => keys,
        Err(err) => {
            println!("Error: {}", err);
            return Err("Internal Server Error".to_string());
        },
    };

    let mut data_by_type = std::collections::HashMap::new();

    for key in keys {
        let key_type = match client.get_key_type(&key) {
            Ok(key_type) => key_type,
            Err(err) => {
                println!("Error: {}", err);
                continue;
            },
        };

        data_by_type.entry(key_type).or_insert(Vec::new()).push(key);
    }

    Ok(data_by_type)
}


// function to retrieve current client url and port
#[tauri::command]
async fn get_current_client_url_and_port(state: tauri::State<'_, Mutex<RedisClient>>) -> Result<String, String> {
    let client = state.lock().unwrap();
    let current_url = client.get_current_url();
    Ok(current_url.to_string())
}

// function to check connection
#[tauri::command]
async fn check_connection(state: tauri::State<'_, Mutex<RedisClient>>) -> Result<String, String> {
    let mut client = state.lock().unwrap();
    let pong = match client.check_connection() {
        Ok(pong) => pong,
        Err(err) => {
            println!("Error: {}", err);
            return Err("Internal Server Error".to_string());
        },
    };
    Ok(pong)
}

#[tauri::command]
async fn list_databases(state: tauri::State<'_, Mutex<RedisClient>>) -> Result<Vec<(usize, bool)>, String> {
    let mut client = state.lock().unwrap();
    match client.list_databases() {
        Ok(databases) => Ok(databases),
        Err(err) => {
            println!("Error: {}", err);
            Err("Internal Server Error".to_string())
        },
    }
}


#[tauri::command]
async fn get_key_value(
    key: String, 
    key_type: String, 
    state: tauri::State<'_, Mutex<RedisClient>>
) -> Result<(String, usize), String> {
    let mut client = state.lock().unwrap();
    let value = match key_type.as_str() {
        "string" => {
            client.get_string_value(&key)
                .map_err(|err| err.to_string())?
        },
        "list" => {
            let list: Vec<String> = client.get_list_value(&key)
                .map_err(|err| err.to_string())?;
            serde_json::to_string(&list).unwrap()
        },
        "set" => {
            let set: Vec<String> = client.get_set_value(&key)
                .map_err(|err| err.to_string())?;
            serde_json::to_string(&set).unwrap()
        },
        "hash" => {
            let hash: Vec<(String, String)> = client.get_hash_value(&key)
                .map_err(|err| err.to_string())?;
            serde_json::to_string(&hash).unwrap()
        },
        "zset" => {
            let zset: Vec<(String, f64)> = client.get_sorted_set_value(&key)
                .map_err(|err| err.to_string())?;
            serde_json::to_string(&zset).unwrap()
        },
        _ => return Err("Unsupported key type".to_string()),
    };

    let memory_usage = client.get_memory_usage(&key)
        .map_err(|err| err.to_string())?;

    Ok((value, memory_usage))
}



fn main() {
  let redis_client = RedisClient::new("redis://localhost:6379").unwrap(); // replace with your default Redis client

  tauri::Builder::default()
      .manage(Mutex::new(redis_client)) // manage the state of your Redis client
      .invoke_handler(tauri::generate_handler![
        test_redis_connection, 
        get_all_keys, 
        get_current_client_url_and_port, 
        check_connection,
        list_databases,
        get_keys_from_database,
        get_key_value
        ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
