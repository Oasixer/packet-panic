package config

import (
	"fmt"
	"net"

	"github.com/spf13/viper"
)

type KnownClient struct {
	IP1    string  `mapstructure:"ip1"`
	IP2    string  `mapstructure:"ip2"`
	IP1_   net.IP
	IP2_   net.IP
	Port1  int     `mapstructure:"port1"`
	Port2  int     `mapstructure:"port2"`
	Protocol string  `mapstructure:"protocol"`
}

func (c KnownClient) Hash(reverse bool) string {
	if reverse{
		return fmt.Sprintf("%s:%d-%d", c.Port2, c.Port1, c.Protocol)
	}
	return fmt.Sprintf("%s:%d-%d", c.Port1, c.Port2, c.Protocol)
}

type config struct {
	Debug         bool          `mapstructure:"debug"`
	LogCli        bool          `mapstructure:"log-cli"`
	IFaceCidrStr  string        `mapstructure:"net_iface_cidr"`
	IName         string        `mapstructure:"interface_name"`
	IFaceAddr     net.IP
	IFaceNetwork  *net.IPNet
	KnownClients  []KnownClient `mapstructure:"known_clients"`
}

// type config struct {
// 	Debug             bool          `mapstructure:"debug"`
// 	LogCli            bool          `mapstructure:"log-cli"`
// 	IFaceCidrStr      string        `mapstructure:"net_iface_cidr"`
// 	OFaceCidrStr      string        `mapstructure:"net_oface_cidr"`
// 	NetReturnAddrStr  string        `mapstructure:"net_return_addr"`
// 	IName             string        `mapstructure:"interface_name"`
// 	IFaceAddr         net.IP
// 	OFaceAddr         net.IP // OuterFace (outgoing interface hehe)
// 	NetReturnAddr     net.IP        
// 	IFaceNetwork      *net.IPNet
// 	OFaceNetwork      *net.IPNet
// }
//
var Config config

// config.UnmarshalInitConfig: unmarshal viper to config.InitConfig global instance of config.initConfig
func UnmarshalConfig() error {
	err := viper.Unmarshal(&Config)
	if err != nil {
		return fmt.Errorf("config.UnmarshalConfig: %w", err)
	}

	return nil
}
