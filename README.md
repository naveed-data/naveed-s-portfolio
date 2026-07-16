# NAVIQ — Naveed Shaik's AI Engineer Portfolio

**"Don't Read My Resume. Talk To It."**

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

NAVIQ is an agentic AI portfolio site. Instead of a static resume, visitors chat with a supervisor agent that calls specialized sub-agents to answer questions about my experience, projects, skills, and even how the portfolio itself is built.

**Live site:** https://naveed-portfolio-ashen-two.vercel.app

## How it works

A visitor's question hits a Next.js route handler (`src/app/api/chat/route.ts`), which runs it through a tool-calling agent loop on Groq (`openai/gpt-oss-20b`):

1. **Supervisor Agent** — reads the question and decides which specialist tools to call
2. **Sub-agents** (via function-calling) fetch grounded data — no hallucinated resume facts
3. Tool results are appended back into the conversation
4. The model streams a grounded response token-by-token as NDJSON, rendered live in the chat UI

| Agent | Owns |
| --- | --- |
| **Supervisor** | Reads the question, routes to specialists, assembles the final answer |
| **Resume** | Verified work history & education — dates, companies, degrees |
| **Project** | Case studies — problem, architecture, impact, metrics |
| **Skills** | Technical skill inventory, grouped by category |
| **Architecture** | Explains how NAVIQ itself is built (this README's content, live) |
| **Contact** | Verified contact details & hand-off to a human conversation |

All resume/project/skill data lives in `src/lib/data.ts`, and the tool definitions live in `src/lib/agent-tools.ts` — the agent can only answer with what's actually there.

## Tech stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · next-themes (dark/light) · lucide-react (icons) · react-markdown + remark-gfm (chat rendering)

### Backend & Agent Runtime
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square&logo=groq&logoColor=white)

Next.js Route Handlers · Node.js streaming (`ReadableStream`) · Groq (`openai/gpt-oss-20b`) · tool-calling / function-calling agent loop · NDJSON streaming protocol

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git_Auto--Deploy-F05032?style=flat-square&logo=git&logoColor=white)

Vercel's GitHub integration triggers an automatic production deploy on every push to `main`

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
