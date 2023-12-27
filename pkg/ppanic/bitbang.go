package ppanic

import (
	"encoding/binary"
	"errors"
	"net"

	"golang.org/x/net/ipv4"
)

type UdpHeader struct {
	SrcPort      uint16 `json:"srcPort"`
	DstPort      uint16 `json:"dstPort"`
	Length       uint16 `json:"length"`
	Checksum     uint16 `json:"checksum"`
}
 // FromBytes initializes the UdpHeader from a slice of bytes.
func (h *UdpHeader) FromBytes(data []byte) error {
	if len(data) < 8 {
		return errors.New("data slice too short to be a valid UDP header")
	}

	h.SrcPort = binary.BigEndian.Uint16(data[0:2])
	h.DstPort = binary.BigEndian.Uint16(data[2:4])
	h.Length = binary.BigEndian.Uint16(data[4:6])
	h.Checksum = binary.BigEndian.Uint16(data[6:8])

	return nil
}

type IpHeader struct {
	Version  int         `json:"version"`    // protocol version
	Len      int         `json:"len"`        // header length
	TOS      int         `json:"tos"`        // type-of-service
    // ip frag
	TotalLen int         `json:"totalLen"`   // packet total length
	ID       int         `json:"id"`         // identification
	Flags    int         `json:"flags"`      // flags
	FragOff  int         `json:"fragOff"`    // fragment offset
    // not ip frag
	TTL      int         `json:"ttl"`        // time-to-live
	Protocol int         `json:"protocol"`   // next protocol
	Checksum int         `json:"checksum"`   // checksum
	Src      string      `json:"srcIp"`        // source address
	Dst      string      `json:"dstIp"`        // destination address
	// Options  []byte      `json:"options"`    // options, extension headers
}

 // Just copy an ipv4.Header struct to an identical struct for json purposes
func (h *IpHeader) CopyFromIPv4Header(ipv4Header *ipv4.Header) {
	h.Version = ipv4Header.Version
	h.Len = ipv4Header.Len
	h.TOS = ipv4Header.TOS
	h.TotalLen = ipv4Header.TotalLen
	h.ID = ipv4Header.ID
	h.Flags = int(ipv4Header.Flags) // Assuming Flags in your Header is an int
	h.FragOff = ipv4Header.FragOff
	h.TTL = ipv4Header.TTL
	h.Protocol = ipv4Header.Protocol
	h.Checksum = ipv4Header.Checksum
	h.Src = string(ipv4Header.Src)
	h.Dst = string(ipv4Header.Dst)
	h.Options = ipv4Header.Options
}

func onesComplementAdd(a, b uint32) uint32 {
  sum := a + b
  return sum + (sum >> 16)
}

func UpdateUdpChecksum(header *ipv4.Header, udpHeader, udpPayload []byte) {
  udpHeader[6] = 0
  udpHeader[7] = 0
  checksum := ComputeUDPChecksum(header.Src, header.Dst, udpHeader, udpPayload)
  // fmt.Printf("checksum: 0x%x%x", byte(checksum >> 8), byte(checksum & 0xFF))
  // checksum2 := UpdateChecksumForNewIPs(udpHeader[6:8], oldSrc, oldDst, header.Src, header.Dst)

  udpHeader[6] = byte(checksum >> 8) // update header w/ new checksum
  udpHeader[7] = byte(checksum & 0xFF)
}

func ComputeUDPChecksum(src, dst net.IP, udpHeader, udpPayload []byte) uint16 {
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

// Fix UDP checksum which is for some reason based on src and dest IP addresses
// from the IP packet header even though UDP is layer 4...
func UpdateChecksumForNewIPs(oldChecksum []byte, oldSrc, oldDst, newSrc, newDst net.IP) uint16 {
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


