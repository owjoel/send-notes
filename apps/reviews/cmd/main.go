// Application Entrypoint

package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/owjoel/send-notes/reviews/config"
	"github.com/owjoel/send-notes/reviews/internal/adapters/db"
	"github.com/owjoel/send-notes/reviews/internal/adapters/rest"
	"github.com/owjoel/send-notes/reviews/internal/application/core/api"
)

func main() {
	godotenv.Load()
	dbAdapter, err := db.NewAdapter(config.GetDBConnectionString())
	if err != nil {
		log.Fatalf("Failed to connect to database. Error: %v", err)
	}
	// Creates an application struct, which implements the APIPort interface
	application := api.NewApplication(dbAdapter)
	restAdapter := rest.NewAdapter(application, config.GetApplicationPort())
	restAdapter.Run()
}
