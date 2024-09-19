const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter, collection, addDoc } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json')

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore();

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.render("primeira_pagina");
});

app.post("/cadastrar", (req, res) => {
    const { nome, telefone, origem, data_contato, observacao } = req.body;
    db.collection('clientes').add({
        nome: nome,
        telefone: telefone,
        origem: origem,
        data_contato: data_contato,
        observacao: observacao
    }).then(() => {
        console.log('Dados cadastrados');
        res.redirect('/');  
    }).catch(err => {
        console.log('Erro ao cadastrar: ', err);
        res.status(500).send('Erro ao cadastrar');
    });
});


app.listen(8081, function () {
  console.log('Servidor rodando na url http://localhost:8081');
});
