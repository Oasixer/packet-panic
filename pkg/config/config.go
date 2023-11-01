package config

import (
	"fmt"
	"net"

	"github.com/spf13/viper"
)

type config struct {
	Debug             bool          `mapstructure:"debug"`
	LogCli            bool          `mapstructure:"log-cli"`
	IFaceCidrStr      string        `mapstructure:"net_iface_cidr"`
	OFaceCidrStr      string        `mapstructure:"net_oface_cidr"`
	NetReturnAddrStr  string        `mapstructure:"net_return_addr"`
	IName             string        `mapstructure:"interface"`
	IFaceAddr         net.IP
	OFaceAddr         net.IP // OuterFace (outgoing interface hehe)
	NetReturnAddr     net.IP        
	IFaceNetwork      *net.IPNet
	OFaceNetwork      *net.IPNet
}

var Config config

// config.UnmarshalInitConfig: unmarshal viper to config.InitConfig global instance of config.initConfig
func UnmarshalConfig() error {
	err := viper.Unmarshal(&Config)
	if err != nil {
		return fmt.Errorf("config.UnmarshalConfig: %w", err)
	}

	return nil
}
