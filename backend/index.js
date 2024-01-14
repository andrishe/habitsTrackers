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

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
