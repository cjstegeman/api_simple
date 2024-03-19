const conn_db = require("./db");
const bodyParser = require('body-parser')


module.exports = function (app) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    
    let personen = [
        { "vnaam": "Piet", "tv": "", "anaam": "Hein" },
        { "vnaam": "Zeur", "tv": "de", "anaam": "Piet" },
        { "vnaam": "Jan", "tv": "", "anaam": "Tromp" },
    ]

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.get('/home', (req, res) => {
        res.send('Hello HOME World!')
    })

    app.get('/personen', (req, res) => {
        res.send(personen)
    })

    app.get('/personen/sorted', (req, res) => {
        let p = personen.sort((a, b) => (a.vnaam > b.vnaam) ? 1 : ((b.vnaam > a.vnaam) ? -1 : 0))
        res.send(personen)
    })

    app.get('/bieren', function (req, res) {
        let sql = "SELECT * FROM b__bier";
        conn_db.query(sql, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.send(rows)
            }
        })
    });

    app.get('/bieren/:id', function (req, res) {
        console.log("req.params:", req.params)
        let sql = `SELECT * FROM b__bier WHERE id=${req.params.id}`;
        conn_db.query(sql, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.send(rows)
            }
        })
    });

    app.get('/bieren/brouwer/:string', function (req, res) {
        console.log("req.params:", req.params)
        let sql = `SELECT * FROM b__bier WHERE brouwer LIKE "${'%'+req.params.string+'%'}"`;
        conn_db.query(sql, function (err, rows) {
            if (err) {
                throw err;
            } else {
                console.log("sql:", sql)
                res.send(rows)
            }
        })
    });

    app.post('/bieren/create', function (req, res) {
        console.log("req.body:", req.body)
        // b__bier: id, naam, brouwer, type, gisting, perc, inkoop_prijs, id_brouwer
        
        //const { naam, brouwer } = req.body;
        //console.log("Te inserten naam = "+naam+" en brouwer = "+brouwer )
        let sql = `INSERT INTO b__bier (naam, brouwer) `;
            sql += `VALUES("${req.body.naam}", "${req.body.brouwer}")`
        //res.send(sql) // ter controle of het sql-statement klopt

        conn_db.query(sql, function (err, json) {
            if (err) {
                throw err;
            } else {
                console.log("json:", json)
                res.send(`gelukt, er is een biertje met id=${json.insertId} toegevoegd`)
            }
        })
        // de gereturnde "json" bevat o.a. "insertId" (= lastInsertedId in DB) en "affectRows" (= 1 bij INSERT)
    });
}