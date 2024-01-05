package ppanic

import (
	// "encoding/base64"
	"encoding/binary"
	"encoding/hex"

	// "encoding/json"
	"errors"
	"fmt"
	"net"

	"github.com/rs/zerolog/log"

	"github.com/google/uuid"
	"github.com/orcaman/concurrent-map/v2"
	"golang.org/x/net/ipv4"

	"time"

	"github.com/Oasixer/packet-panic/pkg/config"
)

type pp struct {
  connections cmap.ConcurrentMap[string, *ConnectionData]
}
type Packet struct {
  ipHeader *ipv4.Header
  payload []byte
}

var PP pp

// var Connections := 

const (
  updateDisplayPacketFreqMs = 500
  // nDisplayPackets = 10 
  nDisplayConnections = 8
)

// func (c KnownClient) Hash(reverse bool) string {



//type ReadableMetadata struct {
//  nPacketsStr string
//  speedStr string
//  srcIP string
//  dstIP string
//}
//// readableMetadata: *ReadableMetadata,
//


// type IpHeader struct {
//   Version        uint8   // 4 bits
//   IHL            uint8   // 4 bits
//   TypeOfService  uint8   // 8 bits
//   TotalLength    uint16  // 16 bits
//   Identification uint16  // 16 bits
//   Flags          uint8   // 3 bits
//   FragmentOffset uint16  // 13 bits
//   TimeToLive     uint8   // 8 bits
//   Protocol       uint8   // 8 bits
//   HeaderChecksum uint16  // 16 bits
//   SourceIP       net.IP  // 32 bits
//   DestinationIP  net.IP  // 32 bits
//   Options        []byte  // variable length, optional
//   Padding        []byte  // variable length, optional
//   Data           UdpHeader     // Payload - UDP struct defined later

type SkippedPacket struct {
  PacketSizeBits int
  Ts int64
}

type ConnectionUpdate struct {
  ConnectionId string `json:"id"`
  // SpeedGBps float32 `json:"speedGBps"`
  NewPackets []DisplayPacket `json:"newPackets"`
  SkippedPackets []SkippedPacket `json:"skippedPackets"`
}

type ConnectionData struct {
  Id string `json:"id"`
  NPackets uint64 `json:"nPackets"`
  SrcIP net.IP `json:"srcIP"`
  DstIP net.IP `json:"dstIP"`
  SrcPort uint16 `json:"srcPort"`
  DstPort uint16 `json:"dstPort"`
  Protocol string `json:"protocol"`
  // SpeedGBps float32 `json:"speedGBps"`
  // DisplayPackets []DisplayPacket `json:"displayPackets"`
  LastPacketTs int64 `json:"lastPacketTs"`
}

type InfoUpdate struct {
  NewConnections []ConnectionData `json:"connections"`
  ConnectionUpdates []ConnectionUpdate `json:"connectionUpdates"`
}


type Manipulation struct {
  ManipulatorType string `json:"manipulatorType"`// type of manipulator. TODO: implement the strings to provide these
  Data string `json:"data"` // jsonified struct detailing the specific params of the manipulation, the structure of which is dependent on ManipulatorType
}

type DisplayPacket struct {
  Id string `json:"id"`
  ConnectionId string `json:"connectionId"`
  ConnPacketNum int64 `json:"connPacketNum"`
  IpHeader IpHeader
  UdpHeader UdpHeader
  IpHeaderRaw string `json:"ipHeader"`
  L3HeaderRaw string `json:"l3HeaderRaw"`
  Ts int64 `json:"ts"`
  Len int32 `json:"len"`
  Manips []Manipulation `json:"manips"`
}

func HandleIpPacket(buf []byte, buf_len int, tun2EthQ chan Packet, displayPacketQ chan InfoUpdate, manipulators []PacketManipulator) bool{
  // get the version xxxx0000 is the version in the first byte
  version := buf[0] >> 4
  if int(version) != 4 {
    // log.Printf("ipv6");
    return true// exit if not ipv4
  }
  // log.Debug().Msgf("buf_len: %d", buf_len)

  header, err := ipv4.ParseHeader(buf)
  if err != nil {
    log.Printf("Error parsing header")
    return false
  }

  // log.Printf("HandleIpPacket: len(buf), buf_len %v, %v", len(buf), buf_len)
  log.Printf("buf[:buf_len+5]: %v", buf[:buf_len])
  // oldSrc := header.Src
  // oldDst := header.Dst
  // header.Src = config.Config.IFaceAddr
  // header.Src = oldDst
  header.TotalLen = buf_len
  header.Checksum = 0 // checksum is recalculated in the socket write

  payload := buf[header.TotalLen:]
  headerRaw := buf[:header.TotalLen]

  var displayPacket *DisplayPacket = nil
  log.Printf("proto: %v", header.Protocol);
  if (header.Protocol == 6) {
    // TODO: handle TCP
    log.Printf("skipping TCP!")
    return false
  } else if (header.Protocol == 17) { // UDP
    _displayPacket, err := handleUdpPacket(header, headerRaw, payload, displayPacketQ, buf)

    if (err != nil){
      log.Printf("Failed to parse UDP packet %v", err)
      return false
    } else {
      displayPacket = _displayPacket
    }
  } else {
    log.Printf("Header was not UDP!: %v", header.Protocol)
    return false
  }

  if (displayPacket == nil){
    fmt.Println("error: nil packet")
    return false // for sanity
  }
  packet := Packet{
    ipHeader: header,
    payload: payload,
  }
  for _, manipulator := range manipulators {
    manipulator.DecideManipulations(&packet, displayPacket)
  }
  
  // race conditions???
  _connections := PP.connections.Items() // well this does copy...
  connections := make([]ConnectionData, len(_connections))
  i := 0
  for _, value := range _connections { // now we copy again... lol
    connections[i] = *value
    i++
  }
  newPackets := []DisplayPacket{*displayPacket}
  connectionUpdate := ConnectionUpdate{
    ConnectionId: displayPacket.ConnectionId,
    NewPackets: newPackets,
    SkippedPackets: make([]SkippedPacket, 0),
  }
  connectionUpdates := []ConnectionUpdate{connectionUpdate}

  infoUpdate := InfoUpdate{
    NewConnections: connections,
    ConnectionUpdates: connectionUpdates,
  }
  // enqueue the info before actually running delays etc.
  displayPacketQ <- infoUpdate

  for _, manipulator := range manipulators {
    manipulator.Manipulate(&packet, displayPacket)
  }

  tun2EthQ <- packet
  return true
}

// func timeToUpdateDisplayPackets(curConnection *ConnectionData, nowMillis int64) bool{
// func timeToUpdateDisplayPackets(curConnection *ConnectionData) bool{
//   // firstPacketEver := curConnection.lastPacketTs == 0
//   nowMillis := time.Now().UnixMilli()
//   displayPackets := curConnection.displayPackets
//   n := len(displayPackets)
//   if len(displayPackets) < nDisplayPackets {
//     return true
//   }
  // if (nowMillis - displayPackets[n-1].lastPacketTs > updateDisplayPacketFreqMs){
    // return true
  // }
//   return false
// }


func ConnectionFromKnownClients(knownClients []config.KnownClient, udpSrcPort, udpDstPort uint16) (*ConnectionData, bool){
  log.Printf("knownClients len: %v", len(knownClients));
  for i := 0; i < len(knownClients); i++ {
    knownClient := knownClients[i]
    p1 := uint16(knownClient.Port1)
    p2 := uint16(knownClient.Port2)
    ports_match := p1 == udpSrcPort && p2 == udpDstPort   
    backward_match := p2 == udpSrcPort && p1 == udpDstPort
    log.Printf("checking %v:%v", p1, p2);
    log.Printf("checking %v:%v", p1, p2);
    log.Printf("ports_match: %v", ports_match);
    log.Printf("proto_match: %v", knownClient.Protocol == "UDP");
  
    // todo mild refactor
    if (ports_match || backward_match) && knownClient.Protocol == "UDP" {
      srcIP := net.ParseIP(knownClient.IP1)
      dstIP := net.ParseIP(knownClient.IP2)
      if backward_match{ // if 2->1 rather than 1->2 which is assumed
        srcIP = net.ParseIP(knownClient.IP2)
        dstIP = net.ParseIP(knownClient.IP1)
      }
      return &ConnectionData{
        Id: uuid.New().String(),
        NPackets: 1,
        SrcIP: srcIP,
        DstIP: dstIP,
        SrcPort: udpSrcPort,
        DstPort: udpDstPort,
        Protocol: knownClient.Protocol,
        // DisplayPackets: make([]DisplayPacket, 0),
        LastPacketTs: 0, // because we haven't assigned the packet yet...
      }, true
    } // end if
  } // end for knownClients
  return nil, false
}

func updateIpUsingConnection(connection *ConnectionData, header* ipv4.Header){
  header.Src = config.Config.IFaceAddr
  header.Dst = connection.DstIP
}

type Change struct{
  Type string // enum? from "delay, corrupt, duplicate?"

}

// header type is from golang.org/x/net/ipv4 btw
func handleUdpPacket(ip_Header* ipv4.Header, ipHeaderRaw []byte, udpRaw []byte, displayPacketQ chan InfoUpdate, raw []byte) (*DisplayPacket, error){
  udpHeader := udpRaw[0:8] // 8 bytes of UDP header
  udpPayload := udpRaw[8:ip_Header.TotalLen]
  // log.Printf("len from handleUdpPacket: %v", len(udpRaw))
  
  udpSrcPort := binary.BigEndian.Uint16(udpHeader[0:2]) // Source port is the first 2 bytes
  udpDstPort := binary.BigEndian.Uint16(udpHeader[2:4]) // Destination port is the next 2 bytes
  // log.Printf("found connection: %d -> %d", udpSrcPort, udpDstPort)
  // log.Printf("UDP Source Port: %d, Destination Port: %d\n", udpSrcPort, udpDstPort)
  // log.Printf("oldSrc %s, oldDst: %s\n", oldSrc, oldDst)

  hash := fmt.Sprintf("%s:%d-%d", "UDP", udpSrcPort, udpDstPort)
  
  var curConnection *ConnectionData = nil

  nowMillis := time.Now().UnixMilli()
  if connect, ok := PP.connections.Get(hash); ok {
    curConnection = connect
  } else {
    connection, found := ConnectionFromKnownClients(config.Config.KnownClients, udpSrcPort, udpDstPort)
    // we will be mutating curConnection later which may or may not have race condition implications
    // with other packets coming in simultaneously and this being a struct referenced by the concurrency-safe
    // concurrent-map. But we are accesing this struct locally which i'm not sure if the concurrent-map 
    // knows to lock() around.
    if !found {
      return nil, errors.New(fmt.Sprintf("Existing client not found for %d -> %d", udpSrcPort, udpDstPort))
    }
    curConnection = connection
    PP.connections.Set(hash, curConnection)
  }

  updateIpUsingConnection(curConnection, ip_Header)
  
  // Fix UDP checksum which is for some reason based on src and dest IP addresses
  // from the IP packet header even though UDP is layer 4... 
  // at this point the header.Src and header.Dst must have been set correctly already!!!
  UpdateUdpChecksum(ip_Header, udpHeader, udpPayload)

  // firstPacketEver := curConnection.lastPacketTs == 0
  // nowMillis := time.Now().UnixMilli()
  // if timeToUpdateDisplayPackets(curConnection){

  var displayIpHeader IpHeader
  var displayUdpHeader UdpHeader
  err := displayUdpHeader.FromBytes(udpHeader)
  if err != nil {
    return nil, errors.New(fmt.Sprintf("Error decoding UDP header: %s", err.Error()))
  }

  // at this point all contents here have either been copied from bytes or encoded to string
  // so no mtability worries
  displayPacket := DisplayPacket{
    Id: uuid.New().String(),
    ConnectionId: curConnection.Id,
    IpHeader: displayIpHeader,
    UdpHeader: displayUdpHeader,
    IpHeaderRaw: hex.EncodeToString(ipHeaderRaw),
    L3HeaderRaw: hex.EncodeToString(udpHeader),
    // todo: potentially use b64 for performance? but ummmmm at that point maybe this isnt the way...
    // B64RawL3Header: base64.StdEncoding.EncodeToString(udpHeader),
    // B64RawL3Payload: base64.StdEncoding.EncodeToString(udpPayload),
    Ts: nowMillis,
    Manips: make([]Manipulation, 0),
  }

  return &displayPacket, nil
}



