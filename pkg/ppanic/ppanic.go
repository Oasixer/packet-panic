package ppanic

import (
	"errors"
	"fmt"
	"net"
	"time"

	"github.com/Oasixer/packet-panic/pkg/config"

	"github.com/songgao/water"
	"golang.org/x/net/ipv4"
	// ""
)

type Packet struct {
  header *ipv4.Header
  payload []byte
}

const (
  maxIPPacketSize = 65535
)

// func computeUDPChecksum(src, dst net.IP, udpHeader, udpPayload []byte) uint16 {
//   pseudoHeader := append(src.To4(), dst.To4()...)
//   pseudoHeader = append(pseudoHeader, byte(0))
//   pseudoHeader = append(pseudoHeader, byte(17)) // UDP protocol number
//   udpLength := uint16(len(udpHeader) + len(udpPayload))
//   // fmt.Printf("udp len: %d\n", udpLength);
//   pseudoHeader = append(pseudoHeader, byte(udpLength>>8), byte(udpLength))
//
//   buf := append(pseudoHeader, udpHeader...)
//   buf = append(buf, udpPayload...)
//
//   // If the total length is odd, append a zero-byte padding
//   if len(buf)%2 != 0 {
//     buf = append(buf, 0)
//   }
//
//   var sum uint32
//   for i := 0; i < len(buf); i += 2 {
//     sum += uint32(buf[i])<<8 | uint32(buf[i+1])
//   }
//   for sum>>16 != 0 {
//     sum = (sum & 0xFFFF) + (sum >> 16)
//   }
//   return ^uint16(sum)
//
func computeUDPChecksum(src, dst net.IP, udpHeader, udpPayload []byte) uint16 {
    udpLength := uint16(len(udpHeader) + len(udpPayload))

    var sum uint32

    // Sum pseudo-header
    pseudoHeader := []byte{
        src.To4()[0], src.To4()[1], src.To4()[2], src.To4()[3],
        dst.To4()[0], dst.To4()[1], dst.To4()[2], dst.To4()[3],
        0, 17,
        byte(udpLength >> 8), byte(udpLength),
    }
    for i := 0; i < len(pseudoHeader); i += 2 {
        sum += uint32(pseudoHeader[i])<<8 | uint32(pseudoHeader[i+1])
    }

    // Sum UDP header
    for i := 0; i < len(udpHeader); i += 2 {
        sum += uint32(udpHeader[i])<<8 | uint32(udpHeader[i+1])
    }

    // Sum UDP payload
    for i := 0; i < len(udpPayload); i += 2 {
        if i == len(udpPayload)-1 {
            sum += uint32(udpPayload[i]) << 8 // If odd number of bytes, pad with zero
        } else {
            sum += uint32(udpPayload[i])<<8 | uint32(udpPayload[i+1])
        }
    }

    // Finalize checksum calculation
    for sum>>16 != 0 {
        sum = (sum & 0xFFFF) + (sum >> 16)
    }
    return ^uint16(sum)
}
func onesComplementAdd(a, b uint32) uint32 {
  sum := a + b
  return sum + (sum >> 16)
}


func updateChecksumForNewIPs(oldChecksum []byte, oldSrc, oldDst, newSrc, newDst net.IP) uint16 {
    if len(oldChecksum) != 2 {
        panic("Checksum slice should be 2 bytes long")
    }

    oldChksum16 := uint16(oldChecksum[0])<<8 | uint16(oldChecksum[1])
    var diff uint32

    // Subtract effect of old IPs
    for i := 0; i < 4; i++ {
        diff = onesComplementAdd(diff, ^uint32(oldSrc[i])<<8 | ^uint32(oldDst[i]))
    }

    // Add effect of new IPs
    for i := 0; i < 4; i++ {
        diff = onesComplementAdd(diff, uint32(newSrc[i])<<8 | uint32(newDst[i]))
    }

    // Add the diff to the old checksum
    newChecksum := onesComplementAdd(diff, uint32(oldChksum16))

    return ^uint16(newChecksum)
}

func Dispatcher(iface *water.Interface, tun2EthQ chan Packet) error {
  buf := make([]byte, maxIPPacketSize)
  for {
    n, err := iface.Read(buf)
    if err != nil {
      // TODO fix that error, its useless(stupid copy paste). Change it to be the same behavior(interface close)
      if errors.Is(err, net.ErrClosed) {
        return nil
      }

      return fmt.Errorf("ppanic.dispatcher: %w", err)
    }

    cop := buf[:n]
    // byte array to fix use-after-free
    // goroutine on anon func
    go func(buf []byte, n int) {

      // get the version xxxx0000 is the version in the first byte
      version := cop[0] >> 4
      if int(version) != 4 {
        return // exit if not ipv4
      }

      header, err := ipv4.ParseHeader(cop)
      if err != nil {
        fmt.Printf("Error parsing header")
        return 
      }
      oldSrc := header.Src
      oldDst := header.Dst
      header.Dst = config.Config.OFaceAddr // TODO: return addr table
      header.Src = config.Config.OFaceAddr
      header.Dst = config.Config.OFaceAddr // TODO: return addr table
      header.TotalLen = len(cop)
      header.Checksum = 0 // checksum is recalculated in the socket write

      payload := cop[header.Len:]

      // Check if the protocol is UDP.
      if (header.Protocol == 17) {
        udpStart := header.Len

        udpHeader := cop[udpStart : udpStart+8] // 8 bytes of UDP header
        // udpPayload := cop[udpStart+8 : n]

        // Zero out the current checksum.
        udpHeader[6], udpHeader[7] = 0, 0
        
        // Calculate the new checksum.
        checksum := updateChecksumForNewIPs(udpHeader[6:8], oldSrc, oldDst, header.Src, header.Dst)
        // checksum := computeUDPChecksum(header.Src, header.Dst, udpHeader, udpPayload)
        //
        // // Insert the new checksum into the UDP header.
        udpHeader[6] = byte(checksum >> 8)
        udpHeader[7] = byte(checksum & 0xFF)

      } else {
        fmt.Printf("Header was not UDP!: %v", header.Protocol)
      }
      packet := Packet{
        header: header,
        payload: payload,
      }

      tun2EthQ <- packet
    }(cop, n)
  }
}

func PacketSender(conn *ipv4.RawConn, tun2EthQ chan Packet) error{
  startTime := time.Now()
  gotFirstPacket := false
	lifetimeBytesSent := 0
  nPackets := 0
  for {
    packet := <-tun2EthQ
    packetSizeBytes := packet.header.TotalLen
		lifetimeBytesSent += packetSizeBytes

    // send packet
    err := conn.WriteTo(packet.header, packet.payload, nil)
    if err != nil { // if connection is closed, exit nicely
      if errors.Is(err, net.ErrClosed) {
        return nil
      }
      return fmt.Errorf("Error: %w", err)
    }
    nPackets += 1

    // fmt.Printf("sent packet to %s\n", packet.header.Dst.String())
    if (gotFirstPacket == false){
      startTime = time.Now()
      gotFirstPacket = true
    }
    if (nPackets % 10000 == 0) {
      elapsedTime := time.Now().Sub(startTime)
      speedGBps := float64(lifetimeBytesSent) / (1024 * 1024 * 1024) / elapsedTime.Seconds()
      fmt.Printf("Speed: %.2f P/s, %.2f Gb/s %.2f GB/s\n", float64(nPackets) / elapsedTime.Seconds(), speedGBps*8, speedGBps)
    }
	}
}
