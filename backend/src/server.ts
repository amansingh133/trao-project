import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./shared/config/db.js";
import { env } from "./shared/config/env.js";
import { logger } from "./shared/config/logger.js";

async function main(): Promise<void> {
  await connectDB();

  // If the process died mid-generation on a previous run, those kits would be
  // stuck showing "processing" forever with nothing left to advance them.

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    //Force-exit if connection don't close in time.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error({ err }, "Fatal error during startup");
  process.exit(1);
});
