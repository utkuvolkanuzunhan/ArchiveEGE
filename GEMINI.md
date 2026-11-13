# ArchiveEGE: rules summary

Canonical rules are in `AGENTS.md` (Turkish). Summary:

- Repo: study archive for EGE courses; contains the "Chip Line" device-physics learning game (`oyun/`), `oyunteorisiispat`, and a quantum study plan.
- Language is Turkish. No Turkish characters in file or folder names.
- Do not bulk-read archive content, do not send it to external models; skip any personal data.
- Never write keys, tokens or passwords into the repo. No new dependencies.
- `oyun/dist/oyun.html` is a build artifact: regenerate with `bash oyun/build.sh`, never hand-edit. Schema changes (`oyun/01-veri-semalari.md`) need approval.
- Tests run one by one with Node, e.g. `node oyun/test/core.test.js` (full list in `AGENTS.md`). `smoke.js` needs Playwright and is run manually. No real API calls in tests.
- Always require approval for: schema, security, data deletion, releases, rule files.
