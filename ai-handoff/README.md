# AI handoff

1. Read `AI-HANDOFF.json` as the only machine-authoritative deployment instruction.
2. Run `node ai-handoff/verify-ai-handoff.mjs` from the repository root.
3. Deploy only the two frozen static payloads at their exact public prefixes.
4. Return a JSON document matching `DEPLOYMENT-RESULT.schema.json`, starting from the template.
5. Never place credentials or secrets in the result JSON.

