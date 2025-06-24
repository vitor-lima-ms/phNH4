const express = require("express");
const router = express.Router();
const multer = require("multer");

const SampleController = require("../controllers/SampleController");
const Sample = require("../models/Sample");

const checkAuth = require("../helpers/auth").checkAuth;

router.get("/list", checkAuth, SampleController.listSamples);

router.post("/delete", checkAuth, SampleController.deleteSample);

router.get("/edit/:id", checkAuth, SampleController.editSampleGet);
router.post("/edit", checkAuth, SampleController.editSamplePost);

const upload = multer({ dest: "uploads" });
router.get("/import", checkAuth, SampleController.importCsvGet);
router.post(
  "/import",
  checkAuth,
  upload.single("csvFile"),
  SampleController.importCsvPost
);

router.get("/delete-import", checkAuth, SampleController.deleteImportGet);
router.post("/delete-import", checkAuth, SampleController.deleteImportPost);

// router.get("/step1/:id", checkAuth, SampleController.step1Get);
// router.post("/step1/:id", checkAuth, SampleController.step1Post);

// router.get("/step2/:id", checkAuth, SampleController.step2Get);
// router.post("/step2/:id", checkAuth, SampleController.step2Post);

// router.get("/step3/:id", checkAuth, SampleController.step3Get);
// router.post("/step3/:id", checkAuth, SampleController.step3Post);

// router.get("/step4/:id", checkAuth, SampleController.step4Get);
// router.post("/step4/:id", checkAuth, SampleController.step4Post);

router.post("/classification", checkAuth, SampleController.classification);

module.exports = router;
