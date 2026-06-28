use hidapi::HidApi;
use serialport::SerialPort;
use std::sync::Mutex; //mutex port, mark here for future reference and how it links back to each thread.
use tauri::Manager;


struct DeviceConnection(Mutex<Option<Box<dyn SerialPort>>>);

pub fn run() {
    tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .manage(DeviceConnection(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            scan_devices_hid, 
            scan_devices_serial,
            device_connected,
            device_disconnected
        ]) //connected to invoke within frontend
        .run(tauri::generate_context!())//config reader
        .expect("error while running app");
}

//================================================================================================
//Device connection + Testing Area
//================================================================================================

//================================================================================================
//For Hid class devices here
//================================================================================================
#[tauri::command]
//TAURI COMMAND RETURN TYPE VEC STR (TYPE: "NAME")
//scan devices is only for HID applications right now
fn scan_devices_hid() -> Result<Vec<String>, String> {
    let api = HidApi::new().map_err(|e| e.to_string())?;
    //err mapping
    let mut results: Vec<String> = Vec::new(); //list
    for d in api.device_list() {
    //scan and return list here
    //print test case first
    //formating, push into a vector str. so saved instead of delete unlike scan
        results.push(format!
            ("HID: {:04x}:{:04x}", 
            d.vendor_id(), 
            d.product_id()
        ));
    }
    Ok(results) //returning list
}

//turn this into, if cannot scan then enter false message in the future
#[tauri::command]
fn scan_devices_serial() -> Vec<String> {
    let mut results: Vec<String> = Vec::new();
    let ports = serialport::available_ports().unwrap_or_default();
    for p in ports {
        results.push(p.port_name)
    }
    results
}

//================================================================================================
//for serial devices here
//================================================================================================

//connected
#[tauri::command]
//open serial port
fn device_connected(port: String, state: tauri::State<DeviceConnection>) -> Result<(), String> {
    let serial = serialport::new(&port, 115200)
        .timeout(std::time::Duration::from_millis(1000))
        .open()
        .map_err(|e| e.to_string())?;
        //if err return immedietly
    *state.inner().0.lock().unwrap() = Some(serial); //* is
    Ok(())
}

//disconnected
#[tauri::command]
//close serial port here
fn device_disconnected(state: tauri::State<DeviceConnection>) -> Result<(), String> {
    *state.inner().0.lock().unwrap() = None; //mutex lock
    Ok(())
}

//port checking if port is what we are looking for then accept otherwise reject
//HIRO REMEMBER RIGHT FRONT END !!!!!
const RPI_VENDOR_ID: u16 = 0X2E8A;

#[tauri::command]
//port checker added by Hiro 
fn port_checking(port: String) -> Result<(), String> {
    let ports = serialport::available_ports()
        .map_err(|e| format!("Failed to list any ports {e}"))?;

        //iter until we find port name which is equal to port
        let matched = ports.iter().find(|p| p.port_name == port)

        //match uses shape, while else uses bool logic to match
        //cannot mix match and bool together
        //match has a lot of factors regarding it (3 types of factors in total)

        match matched {
            Some(info) => match &info.port_type {
                //if serial port is equal to vendor id prot then run
                serialport::SerialPortTYPE::UsbPort(usb) if usb.vid == RIP_VENDOR_ID => Ok(()),
                _ => Err(format!("Port `{port}` is not a RasberryPi device"),)
            },
            None => Err(format!("Port `{port}` not found"))
        }
}

//================================================================================================
//Skin upload + saving
//================================================================================================

fn save_skin_media(app: tauri::AppHandle, filmename: String, data: String) -> Result<String, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string(()))?;
    let media_dir = dir.join("skins");

    if !media_dir.exists() {
        println!("skins folder not found - creating it")
        // creating a file if it doesn't exist
        std::fs::create_dir_all(&media_dir).map_err(|e| e.to_string())?;
    } else {
        println!("skins folder already exists")
    }

    let bytes = /* base64 decode data */;
    let path = media_dir.join(&filename)

    //decode what frontend sent back into a real img
    std::fs::write(&path, bytes).map_err(|e| e.to_string())?;
    //if ok change the path into string
    Ok(path.to_string_lossy().to_string()) //returning save path
}







//handshake verifictation needed to be completed
//sending recieving data to be worked on asw

