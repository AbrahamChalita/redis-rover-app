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




// Additional Tauri commands can be added here

fn main() {
  let redis_client = RedisClient::new("redis://localhost:6379").unwrap(); // replace with your default Redis client

  tauri::Builder::default()
      .manage(Mutex::new(redis_client)) // manage the state of your Redis client
      .invoke_handler(tauri::generate_handler![test_redis_connection, get_all_keys])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
