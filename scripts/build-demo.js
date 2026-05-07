/**
 * Demo build script for GitHub Pages.
 *
 * GitHub Pages only serves static files. Next.js `output: 'export'` cannot
 * include API route handlers. This script temporarily renames `src/app/api`
 * to `src/app/_api` (which Next.js App Router ignores because of the `_`
 * prefix), runs `next build` with the GITHUB_PAGES and NEXT_PUBLIC_DEMO_MODE
 * env vars, then restores the directory name regardless of build outcome.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const apiDir = path.join(root, "src", "app", "api");
const apiDirHidden = path.join(root, "src", "app", "_api");

let renamed = false;

function restore() {
  if (renamed && fs.existsSync(apiDirHidden)) {
    fs.renameSync(apiDirHidden, apiDir);
    console.log("Restored src/app/api ✓");
    renamed = false;
  }
}

// Restore on any exit path
process.on("exit", restore);
process.on("SIGINT", () => {
  restore();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restore();
  process.exit(143);
});

try {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiDirHidden);
    renamed = true;
    console.log("Moved src/app/api → src/app/_api (excluded from build)");
  }

  execSync("npx next build", {
    stdio: "inherit",
    cwd: root,
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_DEMO_MODE: "true",
    },
  });
} catch (err) {
  console.error("Demo build failed:", err.message);
  process.exitCode = 1;
}
