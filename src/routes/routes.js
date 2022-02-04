const express = require("express");

const router = express.Router();

const { addUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const { addArtis, getArtists, getArtis, updateArtis, deleteArtis } = require('../controllers/artis');
const { addPayment, getPayments, getPayment, updatePayment, deletePayment, updateStatusApproved, updateStatusCancel } = require('../controllers/payment');
const {addMusic, getMusics, getMusic} = require('../controllers/music')
const { register, login, checkAuth } = require("../controllers/auth")

const { auth } = require("../middlewares/auth")
const { uploadFile } = require("../middlewares/uploadFile");
const { uploadMusic } = require("../middlewares/uploadMusic");


router.post("/register", register) //req done
router.post("/login", login) // req done
router.get("/check-auth", checkAuth);

router.post("/adduser", addUser);
router.get("/getusers", getUsers);
router.get("/getuser/:id", getUser);
router.patch("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);

router.post("/addpayment", uploadMusic("image"), addPayment  );
router.get("/getpayments", auth, getPayments);
router.get("/getpayment/:id", getPayment);
router.put("/updatepayment/:id", updatePayment);
router.delete("/deletepayment/:id", deletePayment);
router.put("/updatestatusapproved/:id", auth, updateStatusApproved);
router.put("/updatestatuscancel/:id", auth, updateStatusCancel);

router.post("/addartis", auth, addArtis);
router.get("/getartists", getArtists);
router.get("/getartis/:id", getArtis);
router.put("/updateartis/:id", updateArtis);
router.delete("/deleteartis/:id", deleteArtis);

router.post("/addmusic", uploadMusic("image", "music"), auth, addMusic);
router.get("/getmusics", getMusics);

module.exports = router;