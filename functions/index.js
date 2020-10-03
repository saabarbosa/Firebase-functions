const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require("express");
//const cors = require("cors");
const app = express();

//app.use(cors({ origin: true }));

admin.initializeApp();

const db = admin.firestore();

// product: create
app.post("/product", (req, res) => {
    (async () => {
        try {
			let docRefCategory = db.collection("Category").doc(req.params.id); 
            await db.collection('Product').doc()
                .create({
                    //id: req.body.id,
                    Name: req.body.name,
                    Description: req.body.description,
                    Photo: req.body.photo, //gravar a imagem no storage e referenciar aqui Uid/photo/filename
					Category: docRefCategory
                })
            return res.status(200).send('ok');
        }
        catch (error) {
            console.warn(error);
            return res.status(500).send('erro: ' + error);
        }
    })()
});

// product: read
app.get("/product/:id", (req, res) => {
    (async () => {
        try {
            const document = db.collection('Product').doc(req.params.id);
            let company = await document.get();
            let response = company.data();
            return res.status(200).send(response);
        }
        catch (error) {
            console.warn(error);
            return res.status(500).send('erro: ' + error);
        }
    })()
});

// product: read all
app.get("/products", (req, res) => {
    (async () => {
        try {
            let query = db.collection('Product');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
  
                for (let doc of docs) {
                    const seletecdIem = {
                        id: doc.id,
                        name: doc.data().Name,
                        description: doc.data().Description,
                        photo: doc.data().Photo,
						category: doc.data().Category
                    };
                    response.push(seletecdIem);
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (error) {
            console.warn(error);
            return res.status(500).send('erro: ' + error);
        }
    })()
});

// product: update 
app.put("/product/:id", (req, res) => {
    (async () => {
        try {
            const document = db.collection('Product').doc(req.params.id);
            await document.update({
                name: req.body.Name,
				description: req.body.Description,
                photo: req.body.Photo,
				category: req.body.Category
            });
            return res.status(200).send();
        }
        catch (error) {
            console.warn(error);
            return res.status(500).send('erro: ' + error);
        }
    })()
});

// product: delete 
app.delete("/product/:id", (req, res) => {
    (async () => {
        try {
            const document = db.collection('Product').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch (error) {
            console.warn(error);
            return res.status(500).send('erro: ' + error);
        }
    })()
});

app.get('/HelloWorld', (req, res) => {
    return res.status(200).send('HelloWorld Boy!');
});

// exporta com nome api/metodo
exports.api = functions.https.onRequest(app);

