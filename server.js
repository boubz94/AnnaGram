const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

//valeur obtenu grace à une librairie de node qui permet de générer une cle en utilisant cette ligne dans le terminal => require('crypto').randomBytes(64).toString('hex')
RSA_PRIVATE_KEY = '14616b354a64abe35e39c5d790cdb11277e4bdf688e518a01236c77e994d7638ae6c916979209c556edcf186745179b9fad36650d4ed8c3f3aa9ad9cb489bae6';
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.json());

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'redax',
  password: 'redax',
  database: 'annagram'

});

mySqlConnection.connect((err) => {
  if (!err) {
    console.log('vous êtes co');
  } else {
    console.log('vous n\'êtes pas co: ' + JSON.stringify(err, undefined, 2));
  }
});

app.listen(3000, () => console.log('express server tourne au port 3000'));


// permet d'ajouter une un utilisateur à la db
app.post('/postInscriptionUser', (req, res) => {
  const emp = req.body;
  console.log(emp);
  const sql = "INSERT INTO user (lname, fname, pseudo, mail, pass) VALUES (?,?,?,?,?)";
  mySqlConnection.query(sql, [emp.name1, emp.name2, emp.pseud, emp.maill, emp.passworde], (err) => {
    if (!err) {
      res.send('succes');
    } else {
      console.log(err);
    }
  })
});
// récupère les commentaires de la db
app.get("/getComment", (req, res) => {

  mySqlConnection.query('SELECT * FROM comment', (err, rows) => { // requete sql simple pour récupérer une valeur
    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      // console.log(rows[1].name);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});

//récupère les post des user; est utilisé dans home-page.compo
app.get("/getPostFromUsers", (req, res) => {

  mySqlConnection.query('SELECT * FROM postuser JOIN user ON postuser.id_user = user.id_user  ', (err, rows) => { // requete sql simple pour récupérer une valeur

    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      // console.log(rows[1].name);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});


// permet de récupèrer une  données spécifique de la  DB
app.get('/user/:id', (req, res) => { // dans le app.get(/nom de la table à récup)
  mySqlConnection.query('SELECT * FROM user WHERE id_user = ?  ', [req.params.id], (err, rows) => { // requete sql simple pour récupérer une valeur, ajout  de [req.params.id] qui va chopé la valeur de la requete demandé
    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      //console.log(rows[0].prenom);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});

// permet de supprimer une  données spécifique de la  DB
app.delete('/user/:id', (req, res) => { // dans le app.get(/nom de la table à récup)
  mySqlConnection.query('DELETE FROM user WHERE id_user = ?  ', [req.params.id], (err) => { // requete sql simple pour récupérer une valeur, ajout  de [req.params.id] qui va chopé la valeur de la requete demandé
    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      //console.log(rows[0].prenom);
      res.send('parfaitement supprimé');
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});
app.get("/getCommentFromUsers/idPost/:IDPOST", (req, res) => {

  // mySqlConnection.query('SELECT * FROM comment JOIN user ON comment.id_user = user.id_user WHERE comment.id_post = ?  ', req.params.IDPOST,(err, rows) => { // requete sql simple pour récupérer une valeur
  mySqlConnection.query('SELECT * FROM comment JOIN user ON comment.id_user = user.id_user WHERE comment.id_image = ? ', req.params.IDPOST, (err, rows) => { // requete sql simple pour récupérer une valeur

    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      // console.log(rows[1].name);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});


app.post("/getDataConnexion", (req, res) => {

  var pseudo = req.body.pseudo;
  var pass = req.body.pass;
  // DEBUG  check si il prend bien les record
  // console.log(pseudo);
  // console.log(pass);

  mySqlConnection.query(
    "SELECT * FROM user WHERE pseudo = ? AND pass = ?",
    [pseudo, pass],
    (err, row) => {
      if (row.length > 0) { // check si ma query à au moins 1 élément
        const id_user = row[0].id_user;
        const pseudo = row[0].pseudo;

        const tokenJWT = jwt.sign({id_user: id_user, pseudo: pseudo}, RSA_PRIVATE_KEY, {
          algorithm: "HS256", // type d'encodage du token
          expiresIn: 20
        });

        res.status(200).json({token: tokenJWT});
      }
    }
  )
});

app.get('/userPseudo/:id', (req, res) => { // dans le app.get(/nom de la table à récup)

  mySqlConnection.query('SELECT pseudo FROM user WHERE id_user = ?  ', [req.params.id], (err, rows) => { // requete sql simple pour récupérer une valeur, ajout  de [req.params.id] qui va chopé la valeur de la requete demandé
    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      //console.log(rows[0].prenom);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});

// permet d'ajouter une un utilisateur à la db
app.post('/postCommentUser', (req) => {
  const emp = req.body;
  console.log(emp);
  // const sql = "INSERT INTO comment (id_user,id_image,comment) VALUES (?,?,?)";
  const sql = "INSERT INTO `comment` (`id_user`, `id_image`, `comment`) VALUES (?, ?, ?)";
  mySqlConnection.query(sql, [emp.id_user, emp.id_image, emp.commentaire], (err) => {
    if (!err) {
      // res.send('succes');
      console.log('success');
    } else {
      console.log(err);
    }
  })
});

// récupérer le données de l'utilisateur
app.get('/userIdentity/:id', (req, res) => {

  mySqlConnection.query('SELECT * FROM user WHERE id_user = ?  ', [req.params.id], (err, rows) => {
    if (!err) {
      //console.log(' voici id : ' + rows[0].id_user);
      res.send(rows);
    } else {
      console.log("erreur: " + err); // sinon il m'affiche une erreur
    }
  })
});

// changer une photo de profil
app.post('/postImageProfil', (req) => {
  const emp = req.body;
  console.log(emp);
  const sql = "UPDATE user SET imageprofil = ? WHERE id_user = ?";
  mySqlConnection.query(sql, [ emp.imageprofil, emp.id_user], (err) => {
    if (!err) {
      // res.send('succes');
      //console.log(emp.id_user + ' et ' + emp.imageprofil);
    } else {
      console.log(err);
    }
  })
});

// changer les donnés de l'utilisateur
app.post('/postDataUser', (req) => {
  const emp = req.body;
  console.log(emp);
  const sql = "UPDATE user SET lname = ?, fname = ?, profession = ?, aboutme = ?, quote = ?, gsm = ? WHERE id_user = ?";
  mySqlConnection.query(sql, [emp.lname, emp.fname, emp.profession, emp.aboutme, emp.quote, emp.gsm, emp.id_user], (err) => {
    if (!err) {
      //res.send('succes');
      //console.log(emp.id_user + ' et ' + emp.lname+ ' et ' + emp.fname+ ' et ' + emp.aboutme+ ' et ' + emp.gsm);
    } else {
      console.log(err);
    }
  })
});

app.post('/postImgUser', (req) => {
  const emp = req.body;
  // console.log(emp);
  const sql = "INSERT INTO postuser (`id_user`, `titlePost`, `imagePath`, `description`, `geolocalisation`) VALUES (?, ?, ?, ?, ?)";
  mySqlConnection.query(sql, [emp.id_user, emp.titlePost, emp.imagePath, emp.description, emp.geolocalisation], (err) =>{
    if (!err) {
      //res.send('succes');
      console.log('succes')
    } else {
      console.log(err);
    }
  })
});

// récupérer toutes les photos de l'utilisateur courant pour les afficher dans le profil
app.get('/getUserImg/:id', (req, res) => {
  mySqlConnection.query(' SELECT id_post, titlePost, imagePath, description, geolocalisation FROM postuser WHERE id_user = ? ', [req.params.id], (err, rows) => {
    if (!err) {
      // console.log('  ableau : ' + rows[0]);
      res.send(rows);
    } else {
      console.log("erreur: " + err); // sinon il m'affiche une error
    }
  })
});

app.post('/postDeleteImg', (req) => {
  const emp = req.body;
  const sql = "DELETE FROM `postuser` WHERE id_post = ? AND id_user = ?";
  mySqlConnection.query(sql, [emp.id_post, emp.id_user], (err) =>{
    if (!err) {
      //res.send('succes');
      console.log('la photo a bien été supprimé')
    } else {
      console.log(err);
    }
  })
});
app.post('/sendLike', (req, res) => {
  const emp = req.body;
  console.log(emp);
  // const sql = "INSERT INTO comment (id_user,id_image,comment) VALUES (?,?,?)";
  const sql = "INSERT INTO `notation` (`id_user`, `id_post`, `aime`) VALUES (?, ?, ?)";
  mySqlConnection.query(sql, [emp.user, emp.post, emp.like], (err, rows, fields) => {
    if (!err) {
      // res.send('succes');
      console.log("envoyé")
    } else {
      console.log(err);
    }
  })
});

app.post('/changeLike', (req) => {
  const emp = req.body;
  console.log(emp);
  // const sql = "INSERT INTO comment (id_user,id_image,comment) VALUES (?,?,?)";
  const sql = "UPDATE notation SET aime = ? WHERE id_user = ? AND id_post = ? ";
  mySqlConnection.query(sql, [emp.user, emp.post, emp.like], (err, rows, fields) => {
    if (!err) {
      // res.send('succes');
      console.log("valeur changé")
    } else {
      console.log(err);
    }
  })
});

app.get('/getLike/:id', (req, res) => {
  mySqlConnection.query(" SELECT id_user,id_post, aime FROM `notation` WHERE id_user = ? ", [req.params.id], (err, rows) => {
    if (!err) {
      // console.log( rows);
      res.send(rows);
    } else {
      console.log("erreur: " + err); // sinon il m'affiche une error
    }
  })
});

//// ADMIN////
app.post('/deleteUser', (req) => {
  const emp = req.body;
  const sql = "DELETE FROM `user` WHERE id_user = ?";
  mySqlConnection.query(sql, [emp.id_user], (err) =>{
    if (!err) {
      console.log("user supprimé");
    } else {
      console.log(err);
    }
  })
});

// permet de récupèrer les users de la DB
app.get('/utilisateursForAdmin', (req, res) => {

  mySqlConnection.query("SELECT * FROM user WHERE NOT (pseudo = 'admin' AND pass = 'admin')", (err, rows) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  })
});

app.get('/postForAdmin',(req,res)=>{
  mySqlConnection.query("SELECT * FROM postuser JOIN user ON postuser.id_user = user.id_user",(err,rows)=>{
    if(!err){
      res.send(rows);
    }else{
      console.log(err);
    }
  });
});
app.post('/deletePost', (req) => {
  const emp = req.body;
  const sql = "DELETE FROM `postuser` WHERE id_post = ?";
  mySqlConnection.query(sql, [emp.id_post], (err) =>{
    if (!err) {
      console.log("post supprimé");
    } else {
      console.log(err);
    }
  })
});
app.get("/getCommentFromUsersForAdmin/idPost/:IDPOST", (req, res) => {

  // mySqlConnection.query('SELECT * FROM comment JOIN user ON comment.id_user = user.id_user WHERE comment.id_post = ?  ', req.params.IDPOST,(err, rows) => { // requete sql simple pour récupérer une valeur
  mySqlConnection.query('SELECT * FROM comment JOIN user ON comment.id_user = user.id_user WHERE comment.id_image = ? ', req.params.IDPOST, (err, rows) => { // requete sql simple pour récupérer une valeur

    if (!err) { // si il n'y a pas d'erreur alors il m'affiche ma query
      // console.log(rows[1].name);
      res.send(rows);
    } else {
      console.log(err); // sinon il m'affiche une erreur
    }
  })
});
app.post('/deleteComment', (req) => {
  const emp = req.body;
  const sql = "DELETE FROM `comment` WHERE id_comment = ?";
  mySqlConnection.query(sql, [emp.id_post], (err) =>{
    if (!err) {
      console.log("commentaire supprimé");
    } else {
      console.log(err);
    }
  })
});
