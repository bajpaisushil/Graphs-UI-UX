// This is a utility function to parse and process the log data
// In a real application, this would process the actual log data from the API
// For this example, we'll generate sample data based on the log format

export function parseLogData() {
    // In a real application, this would parse the actual log data
    // For this example, we'll generate sample data that mimics the structure
  
    // Sample data based on the log format in the attachment
    const sampleData = []
  
    // Common source IPs from the logs
    const sourceIps = [
      "8.42.77.171",
      "92.63.194.33",
      "185.176.27.6",
      "176.119.4.12",
      "61.176.222.167",
      "80.211.246.121",
      "37.49.231.178",
      "185.53.91.29",
      "92.63.194.38",
      "185.244.25.145",
      "5.188.206.22",
    ]
  
    // Common destination ports from the logs
    const destPorts = [
      22, 80, 443, 1433, 3306, 5432, 5060, 5900, 5901, 5902, 5903, 5800, 5801, 5802, 1521, 8080, 8443, 3389, 23, 21,
    ]
  
    // Common protocols from the logs
    const protocols = ["TCP", "UDP"]
  
    // Common categories from the logs
    const categories = [
      "Potentially Bad Traffic",
      "Attempted Information Leak",
      "Misc Attack",
      "Not Suspicious Traffic",
      "ET SCAN Potential SSH Scan",
      "ET SCAN Suspicious inbound to MSSQL port 1433",
      "ET SCAN Suspicious inbound to mySQL port 3306",
      "ET SCAN Potential VNC Scan 5900-5920",
    ]
  
    // Generate sample data
    const startDate = new Date("2019-01-02T03:50:00Z")
    const endDate = new Date("2019-01-02T06:50:00Z")
  
    // Generate 200 sample alerts
    for (let i = 0; i < 200; i++) {
      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
  
      sampleData.push({
        timestamp: timestamp.toISOString(),
        src_ip: sourceIps[Math.floor(Math.random() * sourceIps.length)],
        dest_ip: "138.68.3.71", // Common destination IP from the logs
        dest_port: destPorts[Math.floor(Math.random() * destPorts.length)],
        proto: protocols[Math.floor(Math.random() * protocols.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        severity: Math.floor(Math.random() * 4) + 1, // 1-4, where 1 is most severe
      })
    }
  
    // Sort by timestamp
    return sampleData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
  