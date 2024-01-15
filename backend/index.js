import cors from "@fastify/cors";
import Fastify from "fastify";
import path from "path";
import fs from "fs/promises";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

const habitsPath = path.join(process.cwd(), "habits.json");

// Test si le serveur fonctionne
fastify.get("/", async () => {
  return { hello: "world" };
});

// Récupération des habitudes
fastify.get("/habits", async () => {
  const habits = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
  return habits;
});

// Ajout d'une habitude
fastify.post("/habits", async (request, reply) => {
  try {
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const habits = data.habits;

    // Trouver le plus grand ID existant
    const maxId = habits.reduce(
      (max, habit) => (habit.id > max ? habit.id : max),
      0
    );

    const newHabit = {
      id: maxId + 1, // Utiliser le prochain ID séquentiel
      title: request.body.title,
      completed: false,
      daysDone: {},
    };

    habits.push(newHabit);
    await fs.writeFile(habitsPath, JSON.stringify(data, null, 2));
    reply.send({ habit: newHabit });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une nouvelle habitude:", error);
    reply
      .code(500)
      .send({ error: "Erreur lors de l'ajout d'une nouvelle habitude." });
  }
});

// Metre à jour une habitude
fastify.patch("/habits/:id", async (request, reply) => {
  try {
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const habits = data.habits;

    const habit = habits.find(
      (habit) => habit.id === parseInt(request.params.id)
    );

    if (!habit) {
      reply.code(404).send({ error: "Habitude non trouvée." });
      return;
    }

    habit.title = request.body.title;
    await fs.writeFile(habitsPath, JSON.stringify(data, null, 2));
    reply.send({ habit });
  } catch (error) {
    console.error("Erreur lors de la mise à jour d'une habitude:", error);
    reply
      .code(500)
      .send({ error: "Erreur lors de la mise à jour d'une habitude." });
  }
});

// Récupération des habitudes pour aujourd'hui
fastify.get("/habits/today", async (request, reply) => {
  try {
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const habits = data.habits;

    // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Filtrer les habitudes qui ont été complétées aujourd'hui
    const habitsToday = habits.filter((habit) => habit.daysDone[today]);

    reply.send({ habits: habitsToday });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des habitudes pour aujourd'hui:",
      error
    );
    reply.code(500).send({
      error: "Erreur lors de la récupération des habitudes pour aujourd'hui.",
    });
  }
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
