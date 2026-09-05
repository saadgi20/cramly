import Notes from "../models/notes.model.js";

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getMyNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.userId })
      .select("topic classLevel examType revisionMode includeDiagram includeChart createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser notes error ${error}` });
  }
};

export const getSingleNotes = async (req, res) => {
  try {
    const notes = await Notes.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!notes) {
      return res.status(404).json({
        error: "Notes not found",
      });
    }

    return res.json({
      content: notes.content,
      topic: notes.topic,
      createdAt: notes.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: `getSingle notes error ${error}` });
  }
};

export const searchMyNotes = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      const notes = await Notes.find({ user: req.userId })
        .select("topic classLevel examType revisionMode includeDiagram includeChart createdAt")
        .sort({ createdAt: -1 })
        .limit(8);

      return res.status(200).json(notes);
    }

    const pattern = new RegExp(escapeRegex(query), "i");

    const notes = await Notes.find({
      user: req.userId,
      $or: [
        { topic: pattern },
        { classLevel: pattern },
        { examType: pattern },
      ],
    })
      .select("topic classLevel examType revisionMode includeDiagram includeChart createdAt")
      .sort({ createdAt: -1 })
      .limit(8);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: `search notes error ${error}` });
  }
};
