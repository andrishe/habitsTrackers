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

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
