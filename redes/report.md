# Documento de Configuración de Red ECCI

## 1. Switches MDF (Principal y Secundario)

### 1.1 Configuración de VLANs
```cisco
vlan 101
 name LAB1-ANEXO-PISO-1
vlan 102
 name LAB2-ANEXO-PISO-2
vlan 103
 name LAB3-SECUNDARIO-PISO-1
vlan 104
 name LAB4-SECUNDARIO-PISO-2
vlan 201
 name WIRELESS
vlan 200
 name DATA_CENTER
```
**Propósito**: Crear las VLANs necesarias para segmentar la red por laboratorio y servicios.

### 1.2 Interfaces VLAN (SVIs)
```cisco
interface vlan 101
 ip address 10.1.101.1 255.255.255.0
 ip helper-address 10.2.200.10
 ip access-group VLAN101_ACL in
 no shutdown
```
**Propósito**: 
- Asignar dirección IP de gateway para cada VLAN
- Configurar ip helper-address para DHCP relay
- Aplicar ACL para seguridad entre VLANs

### 1.3 Configuración de Puertos Trunk
```cisco
interface GigabitEthernet1/0/1
 switchport mode trunk
 switchport trunk allowed vlan 101,102,201
 no shutdown
```
**Propósito**: Permitir tráfico de múltiples VLANs entre switches.

### 1.4 Configuración de Puertos de Acceso
```cisco
interface range FastEthernet0/1-23
 switchport mode access
 switchport access vlan 101
 spanning-tree portfast
```
**Propósito**: Asignar puertos a VLANs específicas para dispositivos finales.

### 1.5 Ruteo Entre VLANs
```cisco
ip routing
```
**Propósito**: Habilitar el switch capa 3 para enrutar entre VLANs.

### 1.6 Ruta por Defecto
```cisco
ip route 0.0.0.0 0.0.0.0 192.168.100.1
```
**Propósito**: Dirigir tráfico hacia Internet a través del router.

### 1.7 ACLs de Seguridad
```cisco
ip access-list extended VLAN101_ACL
 permit udp any eq bootpc any eq bootps
 permit udp any eq bootps any eq bootpc
 permit ip any 10.2.200.0 0.0.0.255
 deny ip any 10.1.102.0 0.0.0.255
 deny ip any 10.1.103.0 0.0.0.255
 deny ip any 10.1.104.0 0.0.0.255
 deny ip any 10.1.201.0 0.0.0.255
 permit ip any any
```
**Propósito**:
- Permitir DHCP (bootpc/bootps)
- Permitir acceso al Data Center (10.2.200.0/24)
- Denegar comunicación entre VLANs diferentes
- Permitir acceso a Internet

## 2. Switches de Acceso (Anexo y Secundario)

### 2.1 Configuración de VLANs
```cisco
vlan 101
vlan 102
vlan 201
```
**Propósito**: Crear VLANs locales que coincidan con los switches MDF.

### 2.2 Puertos de Acceso
```cisco
interface range FastEthernet0/1-23
 switchport mode access
 switchport access vlan 101
```
**Propósito**: Conectar dispositivos finales a la VLAN correspondiente.

### 2.3 Puerto para Access Point
```cisco
interface FastEthernet0/24
 switchport mode access
 switchport access vlan 201
```
**Propósito**: Conectar Access Point en VLAN dedicada para wireless.

### 2.4 Trunk hacia MDF
```cisco
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 101,102,201
```
**Propósito**: Enlace troncal hacia switch MDF.

## 3. Router Principal

### 3.1 Interfaces
```cisco
interface GigabitEthernet0/0/1
 description Conexion a MDF
 ip address 192.168.100.1 255.255.255.252
 ip nat inside
 no shutdown

interface GigabitEthernet0/0/0
 description Conexion a ISP
 ip address 163.178.104.65 255.255.255.248
 ip nat outside
 no shutdown
```
**Propósito**: Configurar interfaces inside/outside para NAT.

### 3.2 Rutas Estáticas
```cisco
ip route 10.1.101.0 255.255.255.0 192.168.100.2
ip route 10.1.102.0 255.255.255.0 192.168.100.2
ip route 10.1.103.0 255.255.255.0 192.168.100.2
ip route 10.1.104.0 255.255.255.0 192.168.100.2
ip route 10.2.200.0 255.255.255.0 192.168.100.2
ip route 10.2.201.0 255.255.255.0 192.168.100.2
ip route 0.0.0.0 0.0.0.0 163.178.104.70
```
**Propósito**: 
- Rutas hacia redes internas a través del MDF
- Ruta por defecto hacia ISP

### 3.3 NAT Configuration
```cisco
ip nat pool NAT_POOL 163.178.104.66 163.178.104.68 netmask 255.255.255.248
access-list 1 permit 10.1.0.0 0.0.255.255
access-list 1 permit 10.2.200.0 0.0.0.255
ip nat inside source list 1 pool NAT_POOL overload
```
**Propósito**: 
- Crear pool de IPs públicas
- Definir redes que pueden usar NAT
- Configurar PAT (Port Address Translation) con overload

### 3.4 NAT Estático para Servidores
```cisco
ip nat inside source static 10.2.200.11 163.178.104.73
ip nat inside source static 10.2.200.12 163.178.104.74
```
**Propósito**: Publicar servidores internos con IPs públicas fijas.

## 4. ISP Router

### 4.1 Interface hacia Router Principal
```cisco
interface GigabitEthernet0/0/0
 ip address 163.178.104.70 255.255.255.248
 no shutdown
```

### 4.2 Loopback para Simular Internet
```cisco
interface Loopback0
 ip address 8.8.8.8 255.255.255.255
```
**Propósito**: Simular destinos de Internet para pruebas.

### 4.3 Ruta de Retorno
```cisco
ip route 10.0.0.0 255.0.0.0 163.178.104.65
```
**Propósito**: Permitir que tráfico regrese a la red interna.

## 5. Switch Data Center

### 5.1 VLAN Data Center
```cisco
vlan 200
 name DATA_CENTER

interface range FastEthernet0/1-10
 switchport mode access
 switchport access vlan 200

interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 200
```
**Propósito**: Segmentar servidores en VLAN dedicada.

## 6. Configuración de Servidores

### 6.1 DHCP Server (10.2.200.10)
- **IP**: 10.2.200.10/24
- **Gateway**: 10.2.200.1
- **Pools**:
  - VLAN101: 10.1.101.10-254, GW: 10.1.101.1
  - VLAN102: 10.1.102.10-254, GW: 10.1.102.1
  - VLAN103: 10.1.103.10-254, GW: 10.1.103.1
  - VLAN104: 10.1.104.10-254, GW: 10.1.104.1
  - VLAN201: 10.1.201.10-254, GW: 10.1.201.1

### 6.2 DNS Server (10.2.200.11)
- **IP**: 10.2.200.11/24
- **Gateway**: 10.2.200.1

## Resumen de Comandos Clave

| Comando | Función |
|---------|---------|
| `ip routing` | Habilita enrutamiento en switch capa 3 |
| `ip helper-address` | Reenvía broadcasts DHCP al servidor |
| `ip nat inside/outside` | Define interfaces para NAT |
| `ip access-group ACL in` | Aplica ACL a tráfico entrante |
| `switchport mode trunk` | Configura puerto como trunk |
| `switchport access vlan X` | Asigna puerto a VLAN |
| `ip route 0.0.0.0 0.0.0.0` | Ruta por defecto |

## Verificación

### Comandos de Verificación
```cisco
show vlan brief
show interfaces trunk
show ip interface brief
show ip route
show ip nat translations
show access-lists
show running-config
```