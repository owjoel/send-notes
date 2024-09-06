package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
)

func GetDBConnectionString() string {
	username := getEnvironmentValue("DB_USERNAME")
	password := getEnvironmentValue("DB_PASSWORD")
	host := getEnvironmentValue("DB_HOST")
	return fmt.Sprintf("mongodb+srv://%s:%s@%s/", username, password, host)
}

func GetApplicationPort() int {
	portStr := getEnvironmentValue("APPLICATION_PORT")
	port, err := strconv.Atoi(portStr)

	if err != nil {
		log.Fatalf("port: %s is invalid", portStr)
	}

	return port
}

func getEnvironmentValue(key string) string {
	if os.Getenv(key) == "" {
		log.Fatalf("%s environment variable is missing.", key)
	}
	return os.Getenv(key)
}
