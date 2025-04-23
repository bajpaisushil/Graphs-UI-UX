export function parseLogData() {
    const sampleData = []
  
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
  
    const destPorts = [
      22, 80, 443, 1433, 3306, 5432, 5060, 5900, 5901, 5902, 5903, 5800, 5801, 5802, 1521, 8080, 8443, 3389, 23, 21,
    ]
  
    const protocols = ["TCP", "UDP"]
  
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
  
    const startDate = new Date("2019-01-02T03:50:00Z")
    const endDate = new Date("2019-01-02T06:50:00Z")
  
    for (let i = 0; i < 200; i++) {
      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
  
      sampleData.push({
        timestamp: timestamp.toISOString(),
        src_ip: sourceIps[Math.floor(Math.random() * sourceIps.length)],
        dest_ip: "138.68.3.71",
        dest_port: destPorts[Math.floor(Math.random() * destPorts.length)],
        proto: protocols[Math.floor(Math.random() * protocols.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        severity: Math.floor(Math.random() * 4) + 1,
      })
    }
  
    return sampleData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
  