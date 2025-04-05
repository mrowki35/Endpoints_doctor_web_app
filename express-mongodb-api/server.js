const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const AbsencjaModel = require("./model/absencja.model");
const DostepnoscModel = require("./model/dostepnosc.model");
const LekarzModel = require("./model/lekarz.model");
const PacjentModel = require("./model/pacjent.model");
const RezerwacjaModel = require("./model/rezerwacja.model");
const CommentModel = require("./model/comment.model");
const UserModel = require("./model/user.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = "YOUR_JWT_SECRET_KEY";

const app = express();
const PORT = 5000;

const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(bodyParser.json());

const mongoURI =
  "";
mongoose
  .connect(mongoURI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const watchAndEmitChanges = (model, eventName) => {
  const changeStream = model.watch();

  changeStream.on("change", async (change) => {
    console.log(`Change detected in ${eventName}:`, JSON.stringify(change));
    try {
      const updatedData = await model.find();
      io.emit(eventName, updatedData);
    } catch (error) {
      console.error(`Error fetching updated data for ${eventName}:`, error);
    }
  });
};

watchAndEmitChanges(AbsencjaModel, "absencja");
watchAndEmitChanges(DostepnoscModel, "dostepnosc");
watchAndEmitChanges(LekarzModel, "lekarz");
watchAndEmitChanges(PacjentModel, "pacjent");
watchAndEmitChanges(RezerwacjaModel, "rezerwacje");
watchAndEmitChanges(CommentModel, "comments");

app.get("/absencja", async (req, res) => {
  try {
    const filter = req.query;
    const absencje = await AbsencjaModel.find(filter);
    res.status(200).json(absencje);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Absencja data", error });
  }
});

app.get("/absencja/:id", async (req, res) => {
  try {
    const absencja = await AbsencjaModel.findOne({ id: req.params.id });
    if (!absencja) {
      return res.status(404).json({ message: "Absencja not found" });
    }
    res.status(200).json(absencja);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Absencja", error });
  }
});

app.post("/absencja", async (req, res) => {
  try {
    const { lekarzId, data } = req.body;
    const newAbsencja = new AbsencjaModel({ lekarzId, data });
    await newAbsencja.save();
    res
      .status(201)
      .json({ message: "Absencja added successfully", newAbsencja });
  } catch (error) {
    res.status(500).json({ message: "Error adding Absencja", error });
  }
});

app.put("/absencja/:id", async (req, res) => {
  try {
    const updatedAbsencja = await AbsencjaModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAbsencja) {
      return res.status(404).json({ message: "Absencja not found" });
    }
    res.status(200).json({ message: "Absencja updated", updatedAbsencja });
  } catch (error) {
    res.status(500).json({ message: "Error updating Absencja", error });
  }
});

app.delete("/absencja/:id", async (req, res) => {
  try {
    const deletedAbsencja = await AbsencjaModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedAbsencja) {
      return res.status(404).json({ message: "Absencja not found" });
    }
    res.status(200).json({ message: "Absencja deleted", deletedAbsencja });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Absencja", error });
  }
});

app.get("/dostepnosc", async (req, res) => {
  try {
    const filter = req.query;
    const dostepnosci = await DostepnoscModel.find(filter);
    res.status(200).json(dostepnosci);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Dostepnosc data", error });
  }
});

app.get("/dostepnosc/:id", async (req, res) => {
  try {
    const dostepnosc = await DostepnoscModel.findOne({ id: req.params.id });
    if (!dostepnosc) {
      return res.status(404).json({ message: "Dostepnosc not found" });
    }
    res.status(200).json(dostepnosc);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Dostepnosc", error });
  }
});

app.post("/dostepnosc", async (req, res) => {
  try {
    const newDostepnosc = new DostepnoscModel(req.body);
    await newDostepnosc.save();
    res
      .status(201)
      .json({ message: "Dostepnosc added successfully", newDostepnosc });
  } catch (error) {
    res.status(500).json({ message: "Error adding Dostepnosc", error });
  }
});

app.put("/dostepnosc/:id", async (req, res) => {
  try {
    const updatedDostepnosc = await DostepnoscModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDostepnosc) {
      return res.status(404).json({ message: "Dostepnosc not found" });
    }
    res.status(200).json({ message: "Dostepnosc updated", updatedDostepnosc });
  } catch (error) {
    res.status(500).json({ message: "Error updating Dostepnosc", error });
  }
});

app.delete("/dostepnosc/:id", async (req, res) => {
  try {
    const deletedDostepnosc = await DostepnoscModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedDostepnosc) {
      return res.status(404).json({ message: "Dostepnosc not found" });
    }
    res.status(200).json({ message: "Dostepnosc deleted", deletedDostepnosc });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Dostepnosc", error });
  }
});

app.get("/lekarz", async (req, res) => {
  try {
    const filter = req.query;
    const lekarze = await LekarzModel.find(filter);
    res.status(200).json(lekarze);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Lekarz data", error });
  }
});

app.get("/lekarz/:id", async (req, res) => {
  try {
    const lekarz = await LekarzModel.findOne({ id: req.params.id });
    if (!lekarz) {
      return res.status(404).json({ message: "Lekarz not found" });
    }
    res.status(200).json(lekarz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Lekarz", error });
  }
});

app.post("/lekarz", async (req, res) => {
  try {
    const newLekarz = new LekarzModel(req.body);
    await newLekarz.save();
    res.status(201).json({ message: "Lekarz added successfully", newLekarz });
  } catch (error) {
    res.status(500).json({ message: "Error adding Lekarz", error });
  }
});

app.put("/lekarz/:id", async (req, res) => {
  try {
    const updatedLekarz = await LekarzModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLekarz) {
      return res.status(404).json({ message: "Lekarz not found" });
    }
    res.status(200).json({ message: "Lekarz updated", updatedLekarz });
  } catch (error) {
    res.status(500).json({ message: "Error updating Lekarz", error });
  }
});

app.delete("/lekarz/:id", async (req, res) => {
  try {
    const deletedLekarz = await LekarzModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedLekarz) {
      return res.status(404).json({ message: "Lekarz not found" });
    }
    res.status(200).json({ message: "Lekarz deleted", deletedLekarz });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Lekarz", error });
  }
});

app.get("/pacjent", async (req, res) => {
  try {
    const filter = req.query;
    const pacjenci = await PacjentModel.find(filter);
    res.status(200).json(pacjenci);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Pacjent data", error });
  }
});

app.get("/pacjent/:id", async (req, res) => {
  try {
    const pacjent = await PacjentModel.findOne({ id: req.params.id });
    if (!pacjent) {
      return res.status(404).json({ message: "Pacjent not found" });
    }
    res.status(200).json(pacjent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Pacjent", error });
  }
});

app.post("/pacjent", async (req, res) => {
  try {
    const newPacjent = new PacjentModel(req.body);
    await newPacjent.save();
    res.status(201).json({ message: "Pacjent added successfully", newPacjent });
  } catch (error) {
    res.status(500).json({ message: "Error adding Pacjent", error });
  }
});

app.put("/pacjent/:id", async (req, res) => {
  try {
    const updatedPacjent = await PacjentModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPacjent) {
      return res.status(404).json({ message: "Pacjent not found" });
    }
    res.status(200).json({ message: "Pacjent updated", updatedPacjent });
  } catch (error) {
    res.status(500).json({ message: "Error updating Pacjent", error });
  }
});

app.delete("/pacjent/:id", async (req, res) => {
  try {
    const deletedPacjent = await PacjentModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedPacjent) {
      return res.status(404).json({ message: "Pacjent not found" });
    }
    res.status(200).json({ message: "Pacjent deleted", deletedPacjent });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Pacjent", error });
  }
});

app.get("/rezerwacje", async (req, res) => {
  try {
    const filter = req.query;
    const rezerwacje = await RezerwacjaModel.find(filter);
    res.status(200).json(rezerwacje);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Rezerwacja data", error });
  }
});

app.get("/rezerwacje/:id", async (req, res) => {
  try {
    const rezerwacja = await RezerwacjaModel.findOne({ id: req.params.id });
    if (!rezerwacja) {
      return res.status(404).json({ message: "Rezerwacja not found" });
    }
    res.status(200).json(rezerwacja);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Rezerwacja", error });
  }
});

app.post("/rezerwacje", async (req, res) => {
  try {
    console.log("Received POST /rezerwacje request with body:", req.body);

    const newRezerwacja = new RezerwacjaModel(req.body);

    const validationError = newRezerwacja.validateSync();
    if (validationError) {
      console.error("Validation Error:", validationError);
      return res
        .status(400)
        .json({ message: "Validation Error", error: validationError });
    }

    await newRezerwacja.save();
    res
      .status(201)
      .json({ message: "Rezerwacja added successfully", newRezerwacja });
  } catch (error) {
    console.error("Error adding Rezerwacja:", error);
    res.status(500).json({ message: "Error adding Rezerwacja", error });
  }
});

app.put("/rezerwacje/:id", async (req, res) => {
  try {
    const updatedRezerwacja = await RezerwacjaModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRezerwacja) {
      return res.status(404).json({ message: "Rezerwacja not found" });
    }
    res.status(200).json({ message: "Rezerwacja updated", updatedRezerwacja });
  } catch (error) {
    res.status(500).json({ message: "Error updating Rezerwacja", error });
  }
});

app.delete("/rezerwacje/:id", async (req, res) => {
  try {
    const deletedRezerwacja = await RezerwacjaModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedRezerwacja) {
      return res.status(404).json({ message: "Rezerwacja not found" });
    }
    res.status(200).json({ message: "Rezerwacja deleted", deletedRezerwacja });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Rezerwacja", error });
  }
});

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1d" }
  );
}

app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      email,
      passwordHash,
      role: role || "Pacjent", 
    });
    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Zarejestrowano użytkownika",
      token,
      role: newUser.role,
      email: newUser.email,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Błąd serwera podczas rejestracji" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Niepoprawne dane logowania" });
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Niepoprawne dane logowania" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );
    console.log("Zalogowane pomyslnie");
    return res.json({
      message: "Zalogowano pomyślnie",
      token,
      role: user.role,
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Błąd serwera podczas logowania" });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const filter = req.query; 
    const comments = await CommentModel.find(filter);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comment", error });
  }
});

app.post("/comments", async (req, res) => {
  try {
    const { reservationId, lekarzId, content, date, rate, userId } = req.body;
    const newComment = new CommentModel({
      reservationId,
      lekarzId,
      content,
      date,
      rate,
      userId,
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", newComment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

app.put("/comments/:id", async (req, res) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment updated", updatedComment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
});

app.delete("/comments/:id", async (req, res) => {
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted", deletedComment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
