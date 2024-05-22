package main

import (
	cryptoRand "crypto/rand"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net"
	"os"
	"time"

	"github.com/bxcodec/faker/v3"
	_ "github.com/mattn/go-sqlite3"
)

const dbFileName = "assets.db"
const batchSize = 1000

func init() {
	rand.New(rand.NewSource(time.Now().UnixNano()))
}

func randomDomain() string {
	return faker.DomainName()
}

func randomWord() string {
	return faker.Word()
}

func randomComment() string {
	return faker.Sentence()
}

func randomIP() string {
	ip := make(net.IP, 4)
	cryptoRand.Read(ip)
	return ip.String()
}

func randomOwner() string {
	return faker.Name()
}
func main() {
	start := time.Now()

	if _, err := os.Stat(dbFileName); err == nil {
		os.Remove(dbFileName)
	}

	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	createTableSQL := `CREATE TABLE assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host TEXT NOT NULL,
        comment TEXT,
        ip TEXT NOT NULL,
        owner TEXT NOT NULL
    );`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := tx.Prepare("INSERT INTO assets(host, comment, ip, owner) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	for i := 0; i < 100000; i++ {
		host := randomDomain()
		word := randomWord()
		comment := randomComment()
		ip := randomIP()
		owner := randomOwner()

		_, err = stmt.Exec(fmt.Sprintf("%s.%s", word, host), comment, ip, owner)
		if err != nil {
			log.Fatal(err)
		}

		// Commit every 1000 records
		if i > 0 && i%batchSize == 0 {
			err = tx.Commit()
			if err != nil {
				log.Fatal(err)
			}

			// Start a new transaction
			tx, err = db.Begin()
			if err != nil {
				log.Fatal(err)
			}

			// Re-prepare the statement
			stmt, err = tx.Prepare("INSERT INTO assets(host, comment, ip, owner) VALUES(?, ?, ?, ?)")
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}

	duration := time.Since(start)
	fmt.Printf("Database created and populated successfully in %s\n", duration)
	log.Println("Database created and populated successfully")
}