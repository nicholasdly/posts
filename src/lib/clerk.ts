import "server-only";

import { env } from "@/env";
import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export default clerk;
