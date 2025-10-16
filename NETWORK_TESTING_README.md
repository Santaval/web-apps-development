# ECCI Network Infrastructure - Testing Guide

## Network Overview

This document provides comprehensive testing procedures for the ECCI network infrastructure consisting of two buildings connected via fiber optic cable, with a centralized Data Center providing all network services.

## Network Architecture Summary

### Buildings
- **Main Building (Anexo)**: Contains Data Center + 2 floors with laboratories
- **Secondary Building (Edificio Secundario)**: 2 floors with laboratories
- **Connection**: Fiber optic link between buildings

### VLANs Configuration
- **VLAN 101**: Lab 2 - Floor 1 (Main Building)
- **VLAN 102**: Lab 2 - Floor 2 (Main Building)
- **VLAN 103**: Lab 2 - Floor 1 (Secondary Building)
- **VLAN 104**: Lab 2 - Floor 2 (Secondary Building)
- **VLAN 201**: Wireless Network (All access points)

### IP Addressing Scheme
- **Network**: 10.1.X.X/16
- **Third Octet**: Identifies VLAN number
  - VLAN 101 → 10.1.101.X/16
  - VLAN 102 → 10.1.102.X/16
  - VLAN 103 → 10.1.103.X/16
  - VLAN 104 → 10.1.104.X/16
  - VLAN 201 → 10.2.201.X/16

### Public IP Pools
- **NAT Pool**: 163.178.104.64/29 (4 usable addresses: .65-.68)
- **Services Pool**: 163.178.104.72/29 (6 usable addresses: .73-.78)

---

## Pre-Testing Checklist

Before running tests, verify:
- [ ] All switches are powered on
- [ ] Layer 3 switches (MDF) are configured
- [ ] Trunk links are established
- [ ] DHCP server is running in Data Center
- [ ] DNS server is configured
- [ ] NAT is configured on the main router/firewall
- [ ] Access points are powered and connected

---

## Test Scenarios

### 1. DHCP Functionality Test

#### Test 1.1: VLAN 101 DHCP Assignment
**Objective**: Verify DHCP server assigns correct IP to devices in Lab 1, Floor 1 (Main Building)

**Steps**:
1. Connect a PC to VLAN 101 (Lab 2 - Main Building, Floor 1)
2. Configure PC to obtain IP automatically (DHCP)
3. Wait for IP assignment (or run `ipconfig /renew` on Windows, `dhclient` on Linux)

**Expected Results**:
- IP Address: 10.1.101.X (where X is between 2-254)
- Subnet Mask: 255.255.0.0
- Default Gateway: 10.1.101.1 (or configured gateway)
- DNS Server: 10.2.200.10 (or Data Center DNS IP)

**Verification Commands**:
```bash
# Windows
ipconfig /all

# Linux
ip addr show
ip route
cat /etc/resolv.conf
```

#### Test 1.2: VLAN 102 DHCP Assignment
**Objective**: Verify DHCP for Lab 2, Floor 2 (Main Building)

**Steps**:
1. Connect PC to VLAN 102
2. Request DHCP

**Expected Results**:
- IP Address: 10.1.102.X/16
- Proper gateway and DNS configuration

#### Test 1.3: VLAN 103 DHCP Assignment
**Objective**: Verify DHCP for Lab 1, Secondary Building

**Steps**:
1. Connect PC to VLAN 103
2. Request DHCP

**Expected Results**:
- IP Address: 10.1.103.X/16
- Connectivity through fiber link

#### Test 1.4: VLAN 104 DHCP Assignment
**Objective**: Verify DHCP for Lab 2, Secondary Building

**Steps**:
1. Connect PC to VLAN 104
2. Request DHCP

**Expected Results**:
- IP Address: 10.1.104.X/16

#### Test 1.5: Wireless VLAN 201 DHCP Assignment
**Objective**: Verify wireless clients receive DHCP

**Steps**:
1. Connect smartphone/laptop to wireless network
2. Verify DHCP assignment

**Expected Results**:
- IP Address: 10.2.201.X/16
- All access points should provide same VLAN

---

### 2. VLAN Isolation Test

#### Test 2.1: Inter-VLAN Communication Blocking
**Objective**: Verify devices in different VLANs cannot communicate

**Steps**:
1. Note IP of PC1 in VLAN 101 (e.g., 10.1.101.5)
2. Note IP of PC2 in VLAN 102 (e.g., 10.1.102.5)
3. From PC1, ping PC2:
   ```bash
   ping 10.1.102.5
   ```

**Expected Results**:
- ❌ Ping should FAIL
- Request timeout or Destination unreachable

#### Test 2.2: Multiple VLAN Isolation Tests
**Test Matrix**:

| Source VLAN | Target VLAN | Expected Result |
|-------------|-------------|-----------------|
| 101         | 102         | ❌ FAIL         |
| 101         | 103         | ❌ FAIL         |
| 101         | 104         | ❌ FAIL         |
| 101         | 201         | ❌ FAIL         |
| 102         | 103         | ❌ FAIL         |
| 102         | 104         | ❌ FAIL         |
| 103         | 104         | ❌ FAIL         |

**Steps**: Repeat ping tests for each combination

---

### 3. Intra-VLAN Communication Test

#### Test 3.1: Same VLAN Communication
**Objective**: Verify devices within the same VLAN can communicate

**Steps**:
1. Connect PC1 and PC2 to same VLAN (e.g., VLAN 101)
2. Note both IPs
3. From PC1, ping PC2:
   ```bash
   ping <PC2_IP>
   ```

**Expected Results**:
- ✅ Ping should SUCCEED
- Reply from destination
- Low latency (<10ms typically)

#### Test 3.2: Test All VLANs
Repeat Test 3.1 for:
- VLAN 102
- VLAN 103
- VLAN 104
- VLAN 201 (wireless)

---

### 4. Trunk Link Test

#### Test 4.1: VLAN Traffic Through Trunks
**Objective**: Verify trunk links carry multiple VLANs

**Steps**:
1. Connect devices to different VLANs on same floor
2. Verify both receive DHCP from centralized server
3. Check switch trunk status:
   ```
   # Cisco Switch CLI
   show interfaces trunk
   show vlan brief
   ```

**Expected Results**:
- All VLANs visible on trunk ports
- Native VLAN configured (typically VLAN 1)

---

### 5. Layer 3 Switch (MDF) Routing Test

#### Test 5.1: Gateway Reachability
**Objective**: Verify Layer 3 switches route to Data Center

**Steps**:
1. From any PC, ping the default gateway:
   ```bash
   ping 10.1.101.1  # Example for VLAN 101
   ```

**Expected Results**:
- ✅ Gateway responds
- Consistent response times

#### Test 5.2: Cross-Building Routing
**Objective**: Verify fiber link carries traffic between buildings

**Steps**:
1. Verify Data Center services are reachable from Secondary Building
2. From PC in VLAN 103 or 104, ping DNS server:
   ```bash
   ping 10.2.200.10
   ```

**Expected Results**:
- ✅ Successful ping through fiber link
- Latency should be reasonable (<5ms for fiber)

---

### 6. DNS Service Test

#### Test 6.1: DNS Resolution
**Objective**: Verify DNS server resolves domain names

**Steps**:
1. From any PC, perform DNS lookup:
   ```bash
   # Windows
   nslookup www.google.com
   
   # Linux
   dig www.google.com
   host www.google.com
   ```

**Expected Results**:
- DNS server IP shows as 10.2.200.X
- Domain resolves to IP address
- No timeout errors

#### Test 6.2: Internal DNS (if configured)
**Steps**:
1. Query internal hostname:
   ```bash
   nslookup server.ecci.local
   ```

**Expected Results**:
- Internal names resolve
- Points to correct internal IPs

---

### 7. Internet Connectivity Test

#### Test 7.1: Outbound Internet Access
**Objective**: Verify NAT allows internet access

**Steps**:
1. From any PC, ping external IP:
   ```bash
   ping 8.8.8.8
   ```
2. Ping domain name:
   ```bash
   ping www.google.com
   ```
3. Access website:
   ```bash
   # Linux
   curl -I https://www.google.com
   
   # Or use web browser
   ```

**Expected Results**:
- ✅ External IPs reachable
- ✅ DNS resolution works
- ✅ HTTP/HTTPS traffic passes

#### Test 7.2: NAT Pool Verification
**Objective**: Verify NAT uses correct public IP pool

**Steps**:
1. From PC, check your public IP:
   - Visit: https://whatismyipaddress.com
   - Or use: `curl ifconfig.me`

**Expected Results**:
- Public IP should be from 163.178.104.65 - 163.178.104.68
- Different devices may get different IPs from pool

#### Test 7.3: NAT from All VLANs
**Steps**: Repeat Test 7.1 from:
- VLAN 101
- VLAN 102
- VLAN 103
- VLAN 104
- VLAN 201 (wireless)

**Expected Results**: All VLANs can access Internet

---

### 8. Wireless Network Test

#### Test 8.1: Access Point Connectivity
**Objective**: Verify all 4 access points work

**Test Locations**:
1. Main Building - Floor 1 AP
2. Main Building - Floor 2 AP
3. Secondary Building - Floor 1 AP
4. Secondary Building - Floor 2 AP

**Steps** (for each AP):
1. Connect wireless device to AP
2. Verify DHCP assignment (10.2.201.X)
3. Ping gateway
4. Access Internet

**Expected Results**:
- All APs provide connectivity
- All use VLAN 201
- Seamless roaming between APs (same SSID)

#### Test 8.2: Wireless to Wired Isolation
**Objective**: Verify wireless VLAN 201 is isolated from wired VLANs

**Steps**:
1. From wireless device (VLAN 201), ping device in VLAN 101

**Expected Results**:
- ❌ Should FAIL (VLAN isolation)

---

### 9. Data Center Services Test

#### Test 9.1: Public Services Access
**Objective**: Verify services on public pool are accessible

**Public Pool**: 163.178.104.73 - 163.178.104.78

**Steps**:
1. From external network (or simulated), access services:
   ```bash
   # Example for web server
   curl http://163.178.104.73
   
   # Example for mail server
   telnet 163.178.104.74 25
   ```

**Expected Results**:
- Services respond on public IPs
- Firewall allows necessary ports

#### Test 9.2: Service Availability
**Test each service**:
- Web Server (HTTP/HTTPS - ports 80/443)
- Mail Server (SMTP - port 25, IMAP - port 143)
- DNS Server (port 53)
- Any other configured services

---

### 10. Failover and Redundancy Test (if configured)

#### Test 10.1: Switch Redundancy
**Objective**: Verify network continues if trunk switch fails

**Steps**:
1. Note current connectivity
2. Simulate trunk switch failure (power off)
3. Verify if backup path activates

**Expected Results** (if STP/redundancy configured):
- Brief interruption (<30 seconds)
- Network recovers automatically

---

### 11. Performance Tests

#### Test 11.1: Bandwidth Test
**Objective**: Measure network throughput

**Steps**:
1. Use iperf3 between two PCs:
   ```bash
   # Server side
   iperf3 -s
   
   # Client side
   iperf3 -c <server_ip>
   ```

**Expected Results**:
- Gigabit links: ~940 Mbps
- FastEthernet: ~94 Mbps
- Fiber between buildings: Near gigabit speeds

#### Test 11.2: Latency Test
**Steps**:
```bash
# Continuous ping
ping -t <destination>  # Windows
ping <destination>     # Linux (Ctrl+C to stop)
```

**Expected Results**:
- Same VLAN: <1ms
- Cross-building (through fiber): <5ms
- Internet: Varies (20-100ms typical)

---

## Troubleshooting Guide

### Issue: No DHCP Assignment

**Checks**:
1. Verify DHCP server is running
2. Check DHCP relay/helper addresses on Layer 3 switches
3. Verify VLAN configuration on switches
4. Check cable connections

**Commands**:
```bash
# Check DHCP pool
show ip dhcp pool
show ip dhcp binding

# Check helper address
show running-config | include helper
```

### Issue: Cannot Ping Gateway

**Checks**:
1. Verify IP address is in correct subnet
2. Check default gateway configuration
3. Verify VLAN assignment on switch port
4. Check Layer 3 interface is up

**Commands**:
```bash
# Check interface status
show ip interface brief
show vlan brief
show interfaces status
```

### Issue: No Internet Access

**Checks**:
1. Verify NAT configuration
2. Check default route to Internet
3. Verify DNS is working
4. Check firewall rules

**Commands**:
```bash
# Check NAT translations
show ip nat translations
show ip nat statistics

# Check routing
show ip route
```

### Issue: VLANs Can Communicate (Should Not)

**Checks**:
1. Verify Layer 3 switch doesn't have inter-VLAN routing enabled
2. Check ACLs are configured
3. Verify firewall rules

**Commands**:
```bash
# Check routing
show ip route
show ip interface brief

# Check ACLs
show access-lists
```

---

## Testing Checklist Summary

### Core Functionality
- [ ] DHCP works in all VLANs (101, 102, 103, 104, 201)
- [ ] VLANs are properly isolated (cannot communicate)
- [ ] Same VLAN devices can communicate
- [ ] Trunk links carry all VLAN traffic
- [ ] Layer 3 switches route to Data Center

### Services
- [ ] DNS resolution works
- [ ] Internet access via NAT
- [ ] NAT uses correct public pool (163.178.104.65-68)
- [ ] Public services accessible (163.178.104.73-78)

### Wireless
- [ ] All 4 access points functional
- [ ] Wireless clients get IPs from VLAN 201
- [ ] Wireless isolated from wired VLANs

### Infrastructure
- [ ] Fiber link between buildings operational
- [ ] MDF switches in both buildings working
- [ ] Trunk switches on each floor working

### Advanced
- [ ] Performance meets expectations
- [ ] Redundancy/failover works (if configured)
- [ ] Security policies enforced

---

## Documentation

### Network Diagram
Refer to the Packet Tracer topology file for visual reference.

### IP Address Allocation

| Device/Service | VLAN | IP Range | Gateway |
|----------------|------|----------|---------|
| Lab 2 Floor 1 (Main) | 101 | 10.1.101.2-254 | 10.1.101.1 |
| Lab 2 Floor 2 (Main) | 102 | 10.1.102.2-254 | 10.1.102.1 |
| Lab 1 Floor 1 (Sec) | 103 | 10.1.103.2-254 | 10.1.103.1 |
| Lab 2 Floor 2 (Sec) | 104 | 10.1.104.2-254 | 10.1.104.1 |
| Wireless Network | 201 | 10.2.201.2-254 | 10.2.201.1 |
| Data Center | - | 10.2.200.0/24 | - |

### Public IP Allocation

| Purpose | IP Range | Subnet Mask |
|---------|----------|-------------|
| NAT Pool | 163.178.104.65-68 | 255.255.255.248 |
| Public Services | 163.178.104.73-78 | 255.255.255.248 |

---

## Contact Information

For issues or questions regarding this network infrastructure, contact:
- Network Administrator: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone]

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-15 | Initial testing guide | System |

---

## Notes

- All tests should be performed in a controlled environment
- Document all test results with timestamps
- Report any failures immediately
- Update this document as network changes are made
- Keep Packet Tracer topology file version-controlled

**End of Testing Guide**
