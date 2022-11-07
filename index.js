const express = require ('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  

const uri = `mongodb+srv://${process.env.MG_DB}:${process.env.MG_password}@cluster0.1mrcu36.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function  run() {
try{
    const productCollection = client.db('E-commerce').collection('product')
    const orderCollection = client.db('E-commerce').collection('orders')

    app.get('/product', async(req,res)=>{
        const query = {}
        const cursor = productCollection.find(query)
        const products = await cursor.toArray()
        res.send(products)        
    })
    app.post('/addProduct',async(req,res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    // order
    app.post('/orders',async(req,res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order)
      res.send(result)

    })

    app.get('/orders', async(req,res)=>{
      const query = {}
      const cursor = orderCollection.find(query)
      const orders = await cursor.toArray()
      res.send(orders)

    })
    // delete 
    app.delete('/delete/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      // console.log(id)
      const result = await orderCollection.deleteOne(query) 
      res.send(result)
    })

}
finally{

}


  }
  run().catch(error=>{
    console.log(error)
  })
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
