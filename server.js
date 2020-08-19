if (process.env.NODE_ENF !== "production") require("dotenv").config();

const SecretStripeKey = process.env.SECRTE_STRIPE_KEY;
const PublicStripeKey = process.env.PUBLIC_STRIPE_KEY;

console.log(SecretStripeKey, PublicStripeKey);

const express = require("express");
const app = express();
const fs = require("fs");
const stripe = require("stripe")(SecretStripeKey);

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
        stripePublicKey: PublicStripeKey,
      });
    }
  });
});

app.post("/purchase", function (req, res) {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach(function (item) {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });
      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: "usd",
        })
        .then(function () {
          console.log("Charge Successful");
          res.json({ message: "Successfully purchased items" });
        })
        .catch(function () {
          console.log("Charge Fail");
          res.status(500).end();
        });
    }
  });
});

app.listen(process.env.PORT || 3010);
