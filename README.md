# NAVIQ — Naveed Shaik's AI Engineer Portfolio

**"Don't Read My Resume. Talk To It."**

NAVIQ is an agentic AI portfolio site. Instead of a static resume, visitors chat with a supervisor agent that calls specialized sub-agents to answer questions about my experience, projects, skills, and even how the portfolio itself is built.

**Live site:** https://naveed-portfolio-ashen-two.vercel.app

## How it works

A visitor's question hits a Next.js route handler (`src/app/api/chat/route.ts`), which runs it through a tool-calling agent loop on Groq (`openai/gpt-oss-20b`):

1. **Supervisor Agent** — reads the question and decides which specialist tools to call
2. **Sub-agents** (via function-calling) fetch grounded data — no hallucinated resume facts:
   - **Resume Agent** — work history & education
   - **Project Agent** — case studies, tech stacks, outcomes
   - **Skills Agent** — technical skill inventory
   - **Architecture Agent** — explains how NAVIQ itself is built
   - **Contact Agent** — verified contact details
3. Tool results are appended back into the conversation
4. The model streams a grounded response token-by-token as NDJSON, rendered live in the chat UI

All resume/project/skill data lives in `src/lib/data.ts`, and the tool definitions live in `src/lib/agent-tools.ts` — the agent can only answer with what's actually there.

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React 19, Framer Motion
- **Backend:** Next.js Route Handlers, Node.js streaming (`ReadableStream`)
- **AI:** Groq (`openai/gpt-oss-20b`), tool-calling agent loop, NDJSON streaming protocol
- **Deployment:** Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your GROQ_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `GROQ_API_KEY`, the site still loads but the chat feature returns a 503.

Get a free Groq API key at [console.groq.com/keys](https://console.groq.com/keys).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── api/chat/route.ts   # Agent loop: tool-calling + streaming responses
│   ├── page.tsx            # Landing page
│   └── resume/page.tsx     # Printable resume view
├── components/             # UI: chat agent, terminal, command palette, architecture diagram, etc.
└── lib/
    ├── data.ts             # Source of truth: profile, experience, projects, skills
    ├── agent-tools.ts      # Tool definitions the LLM can call
    ├── chat-context.ts     # System prompt construction
    └── sections.ts
```

## Deployment

Deployed on Vercel with GitHub auto-deploy — every push to `main` triggers a production deployment. Set `GROQ_API_KEY` as an environment variable in Vercel project settings for the chat feature to work in production.
