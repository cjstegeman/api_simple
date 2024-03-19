const express = require('express')
const app = express()
const port = 3002

require('./routes.js')(app);

const cors = require('cors');
app.use(cors({
    origin: 'https://locahost'
}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})