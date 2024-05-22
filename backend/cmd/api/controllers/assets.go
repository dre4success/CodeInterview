package controllers

import (
	"database/sql"
	"interview/cmd/api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAssets(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		host := c.Query("host")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "100"))
		offset := (page - 1) * limit

		assets, err := models.GetAssets(db, host, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"assets": assets})
	}
}

func GetAssetCount(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		count, err := models.GetAssetCount(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"count": count})
	}
}
