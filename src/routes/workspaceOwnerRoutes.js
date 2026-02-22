const express = require("express");
const router = express.Router();
const workspaceOwnerController = require("../controllers/workspaceOwnerController");

router.post("/", workspaceOwnerController.createWorkspaceOwner);
router.get("/", workspaceOwnerController.getWorkspaceOwners);
router.get("/:id", workspaceOwnerController.getWorkspaceOwner);
router.put("/:id", workspaceOwnerController.updateWorkspaceOwner);
router.delete("/:id", workspaceOwnerController.deleteWorkspaceOwner);

module.exports = router;
