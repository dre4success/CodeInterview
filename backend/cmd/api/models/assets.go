package models

import "database/sql"

type Asset struct {
	ID      int    `json:"id"`
	Host    string `json:"host"`
	Comment string `json:"comment"`
	IP      string `json:"ip"`
	Owner   string `json:"owner"`
}

func InitDB(dbFileName string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		return nil, err
	}

	// create indexes on host
	_, err = db.Exec("CREATE INDEX IF NOT EXISTS idx_host ON assets(host)")
	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetAssets(db *sql.DB, host string, limit, offset int) ([]Asset, error) {
	query := "SELECT id, host, comment, ip, owner FROM assets WHERE host LIKE ? LIMIT ? OFFSET ?"
	rows, err := db.Query(query, "%"+host+"%", limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assets []Asset
	for rows.Next() {
		var asset Asset
		if err := rows.Scan(&asset.ID, &asset.Host, &asset.Comment, &asset.IP, &asset.Owner); err != nil {
			return nil, err
		}
		assets = append(assets, asset)
	}
	return assets, nil
}

func GetAssetCount(db *sql.DB) (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(* FROM assets").Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
