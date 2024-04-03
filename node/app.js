// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// ------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
const port = 3000;
const NEO4J_URI = process.env.NEO4J_URI || "http://neo4j:7474/db/neo4j/tx/commit";
const NEO4J_AUTH = ["neo4j", "1234"];

//TODO: Write a function that sends the new order to Neo4j via HTTP

app.get('/order', (_req, res) => {
    fetch(`${stateUrl}/order`)
        .then((response) => {
            if (!response.ok) {
                throw "Could not get state.";
            }

            return response.text();
        }).then((orders) => {
            res.send(orders);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({message: error});
        });
});

app.post('/neworder', (req, res) => {
    const data = req.body.data;
    const orderId = data.orderId;
    console.log("Got a new order! Order ID: " + orderId);

    const state = [{
        key: "order",
        value: data
    }];

    fetch(stateUrl, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw "Failed to persist state.";
        }

        console.log("Successfully persisted state.");

        // // ** Persist the order in Neo4j **
        // fetch(NEO4J_URI, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         "statements": [
        //             {
        //                 "statement": "MERGE (o:Order {orderId: $orderId})",
        //                 "parameters": {
        //                     "orderId": orderId
        //                 }
        //             }
        //         ]
        //     }),
        //     headers: {
        //         "Content-Type": "application/json"
        //     }, 
        //     auth: NEO4J_AUTH
        // }).then((response) => {
        //     if (!response.ok) {
        //         throw "Failed to persist in Neo4j.";
        //     }
        //     console.log("Successfully persisted in Neo4j.");
        // })
        // // ** Persist the order in Neo4j **
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));