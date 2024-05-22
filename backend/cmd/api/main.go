package main

import (
	"interview/cmd/api/controllers"
	"interview/cmd/api/models"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

const dbFileName = "assets.db"

func main() {
	db, err := models.InitDB(dbFileName)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	router := gin.Default()

	router.GET("/assets", controllers.GetAssets(db))

	router.GET("/assets/count", controllers.GetAssetCount(db))

	router.Run(":8080")
}
