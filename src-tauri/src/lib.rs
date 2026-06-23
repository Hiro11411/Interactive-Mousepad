use hidapi::HidApi;

pub fn run() {
    tauri::Builder::default()
    .manage(DeviceConnection(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            scan_devices_hid, 
            scan_devices_serial,
            device_conected,
            device_disconnected
        ]) //connected to invoke within frontend
        .run(tauri::generate_context!())//config reader
        .expect("error while running app");
}

#[tauri::command]
//TAURI COMMAND RETURN TYPE VEC STR (TYPE: "NAME")
//scan devices is only for HID applications right now
fn scan_devices_hid() -> Result<Vec<String>, String> {
    let api = HidApi::new().map_err(|e| e.to_string())?;
    //err here asw

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
    let ports = serialport::available_ports().expect("failed to list serial ports");
    for p in ports {
        results.push(p.port_name)
    }
    results
}

//for serial devices here 

//connected
#[tarui::command]
//open serial port
const { connected, port, setConnected, setPort} = useDevice();
fn device_connected(port: String, state: tauri::State<DeviceConnection>) -> Result<(), String> {
    let serial = serialport::new(&port)
}

//disconnected
#[tarui::command]
//close serial port here
fn device_disconnected() 
