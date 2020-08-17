if (process.env.NODE_ENF !== "production") require("dotenv").config();

const SecretStripeKey = process.env.SECRTE_STRIPE_KEY;
const PublicStripeKey = process.env.PUBLIC_STRIPE_KEY;

console.log(SecretStripeKey, PublicStripeKey);

const express = require("express");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/store", function (req, res) {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        items: JSON.parse(data),
      });
    }
  });
});

app.listen(3001);
