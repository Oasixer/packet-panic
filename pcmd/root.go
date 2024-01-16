/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package pcmd

import (
	"os"
	"fmt"
	"time"

	"net"

	"github.com/Oasixer/packet-panic/pkg/config"
	"github.com/Oasixer/packet-panic/pkg/ppanic"
	"github.com/Oasixer/packet-panic/pkg/tun"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"golang.org/x/net/ipv4"
	"golang.org/x/sync/errgroup"
)

var cfgFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "packet-panic",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	Run: Root,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute() 
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.
	pFlags := rootCmd.PersistentFlags()

	pFlags.StringVar(&cfgFile, "config", "", "config file (default is $HOME/.packet-panic.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	// rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	pFlags.StringP("net_iface_cidr", "i", "", "CIDR of network to join")
	viper.BindPFlag("net_iface_cidr", pFlags.Lookup("fleet"))
	
	pFlags.StringP("interface", "x", "by1", "The internal network interface name")
	viper.BindPFlag("interface", pFlags.Lookup("interface"))

}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {

		// search config in defualt directory(/etc/buoy)
		// with name `buoy.yaml`
		// viper.AddConfigPath("/etc/pp/")
		viper.SetConfigType("yaml")
		viper.SetConfigName("ppanic")
	}

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't read in config")
	}

	// viper.AutomaticEnv() // read in environment variables that match

	// unmarshal viper to config.InitConfig
	err = config.UnmarshalConfig()
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't unmarshal config")
	}
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnixMs

	for i := 0; i < len(config.Config.KnownClients); i++ {
		client := config.Config.KnownClients[i]
		client.IP1_ = net.ParseIP(client.IP1)
		client.IP2_ = net.ParseIP(client.IP2)
	}
          // client := connections[i]
	// config.Config.OFaceAddr, config.Config.OFaceNetwork, err = net.ParseCIDR(config.Config.OFaceCidrStr)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't parse Outgoing interface CIDR")
	}

	config.Config.IFaceAddr, config.Config.IFaceNetwork, err = net.ParseCIDR(config.Config.IFaceCidrStr)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't parse Incoming interface CIDR")
	}

	// config.Config.NetReturnAddr = net.ParseIP(config.Config.NetReturnAddrStr)

	// config.Config.Password = []byte(config.Config.PasswordStr)

	// set to info level first
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	// if debug true then set to debug level
	if config.Config.Debug {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}

	// if LogCli true then log to stderr with pretty formatting
	if config.Config.LogCli {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC1123Z})
	} else {
		// this is thread safe because the underlying file write sys
		// calls are blocking and so they are thread safe
		f, err := os.OpenFile("/var/log/ppanic.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal().
				Err(err).
				Msg("Couldn't open file /var/log/ppanic.log")
		}

		log.Logger = log.Output(f)
	}

	log.Debug().Msgf("Using config file: %s", viper.ConfigFileUsed())

	log.Debug().
		Bool("Debug", config.Config.Debug).
		Bool("Log-Cli", config.Config.LogCli).
		Str("IName", config.Config.IName).
		Str("IFaceAddr", config.Config.IFaceAddr.String()).
		Str("IFaceNetwork", config.Config.IFaceNetwork.String()).
		Msg("Config")
}


func Root(cmd *cobra.Command, args []string) {
	fmt.Printf("config: %#v\n\n", config.Config)
	// TODO look into creating interface in tunrouter
	iface, err := tun.New(config.Config.IName,
		config.Config.IFaceAddr, config.Config.IFaceNetwork)
	if err != nil {
		log.Fatal().Err(err).Msg("Tun Creation Error")
	}

	eg := new(errgroup.Group)

	tun2EthQ := make(chan ppanic.Packet, 1)
	infoUpdateQ := make(chan ppanic.InfoUpdate, 1)

	// same conn used to forward packets btw
	conn, err := net.ListenPacket("ip4:tcp", "0.0.0.0")
	if err != nil {
		log.Fatal().Err(err).Msg("Error creating raw IPv4 connection")
		return
	}
	defer conn.Close()
	// Convert the PacketConn to a RawConn
	rawConn, err := ipv4.NewRawConn(conn)
	if err != nil {
		log.Fatal().Err(err).Msg("Error creating RawConn")
		return
	}

	corrupterConfig := ppanic.NewCorruptorConfig(true, 0, 0, 0)
	corrupter := ppanic.NewCorruptor(corrupterConfig)
	// delayerConfig := ppanic.NewDelayerConfig(200*time.Millisecond, 800*time.Millisecond)
	// delayer := ppanic.NewDelayer(delayerConfig)
	manips := []ppanic.PacketManipulator{
		// delayer,
		corrupter,
	}

	eg.Go(func() error {
		return ppanic.Dispatcher(iface, tun2EthQ, infoUpdateQ, manips)
	})

	eg.Go(func() error {
		return ppanic.PacketSender(rawConn, tun2EthQ)
	})

	eg.Go(func() error {
		return ppanic.DataServer(infoUpdateQ)
	})
 

	if err = eg.Wait(); err != nil {
		log.Fatal().Err(err).Msg("PPanic Run Failed")
	}
}
