import { initBotId } from "botid/client/core";

// Invisible bot checks (Vercel BotID) on the endpoints that write to the database.
initBotId({
  protect: [
    { path: "/api/orders", method: "POST" },
    { path: "/api/track", method: "POST" },
  ],
});
