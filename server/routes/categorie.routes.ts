const express = require("express");
const router = express.Router();
const Categorie = require("../models/Categorie");

router.get("/", async (req: any, res: any) => {
  const categories = await Categorie.find();
  res.json(categories);
});

// GET all Categories
router.get("/:id", async (req: any, res: any) => {
  const categories = await Categorie.findById(req.params.id);
  res.json(categories);
});

// ADD a new Categorie
router.post("/newcategorie", async (req: any, res: any) => {
  const { name, description, image, price } = req.body;
  const categorie = new Categorie({ name, description, image, price });
  await categorie.save();
  res.json({ status: "Categorie Saved" });
});

// UPDATE a new Categorie
router.put("/:id", async (req: any, res: any) => {
  const { name, description, image, price } = req.body;
  const newCategorie = { name, description, image, price };
  await Categorie.findByIdAndUpdate(req.params.id, newCategorie);
  res.json({ status: "Categorie Updated" });
});

router.delete("/:id", async (req: any, res: any) => {
  await Categorie.findByIdAndRemove(req.params.id);
  res.json({ status: "Categorie Deleted" });
});

module.exports = router;
