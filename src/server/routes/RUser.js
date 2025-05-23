import { Router } from "express";
const router = Router();
import Token from "../../middleware/token.js";
import * as CUser from "../controllers/CUser.js";

router.post("/login", async (req, res) => {
  const response = await CUser.loginUser(req.body);
  res.status(200).json(response);
});

router.post("/register", async (req, res) => {
  const response = await CUser.registerUser(req.body);
  res.status(200).json(response);
});

router.get("/info", Token.verifyToken, async (req, res) => {
  const response = await CUser.infoUser(req.body);
  res.status(200).json(response);
});

router.post("/create-professor", Token.verifyToken, Token.validateRole(["Coordinador"]), async (req, res) => {
  const response = await CUser.createUserWithRole(req.body, "Profesor");
  res.status(200).json(response);
});

router.post("/create-student", Token.verifyToken, Token.validateRole(["Profesor", "Coordinador"]), async (req, res) => {
  const response = await CUser.createUserWithRole(req.body, "Estudiante");
  res.status(200).json(response);
});

router.get("/all/students", Token.verifyToken, Token.validateRole(["Coordinador", "Profesor"]), async (req, res) => {
  const response = await CUser.getAllUserWithRole("Estudiante");
  res.status(200).json(response);
});

router.get("/all/professors", Token.verifyToken, Token.validateRole(["Coordinador"]), async (req, res) => {
  const response = await CUser.getAllUserWithRole("Profesor");
  res.status(200).json(response);
});

router.put("/update/:userId", Token.verifyToken, Token.validateRole(["Coordinador"]), async (req, res) => {
  const response = await CUser.updateUser(req.params.userId, req.body);
  res.status(200).json(response);
});

router.delete("/delete/:userId", Token.verifyToken, Token.validateRole(["Coordinador"]), async (req, res) => {
  const response = await CUser.deleteUser(req.params.userId);
  res.status(200).json(response);
});

export default router;
