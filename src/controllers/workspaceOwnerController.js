const WorkspaceOwner = require("../models/WorkspaceOwner");

exports.createWorkspaceOwner = async (req, res) => {
  try {
    const { user, workspaceName } = req.body;
    const owner = new WorkspaceOwner({ user, workspaceName });
    await owner.save();
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getWorkspaceOwners = async (req, res) => {
  try {
    const owners = await WorkspaceOwner.find().populate("user", "name email");
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkspaceOwner = async (req, res) => {
  try {
    const owner = await WorkspaceOwner.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!owner)
      return res.status(404).json({ error: "Workspace owner not found" });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorkspaceOwner = async (req, res) => {
  try {
    const owner = await WorkspaceOwner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!owner)
      return res.status(404).json({ error: "Workspace owner not found" });
    res.json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWorkspaceOwner = async (req, res) => {
  try {
    const owner = await WorkspaceOwner.findByIdAndDelete(req.params.id);
    if (!owner)
      return res.status(404).json({ error: "Workspace owner not found" });
    res.json({ message: "Workspace owner deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
