const connect_To_mongo = require("./db")
const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000
connect_To_mongo()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))
// router decLARE
app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))


app.get('/', (req, res) => {
  res.send("hello world")
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})