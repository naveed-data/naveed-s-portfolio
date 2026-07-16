export const product = {
  name: "NAVIQ",
  greeting: "Meet NAVIQ",
  category: "My AI Engineer",
  tagline: "Don't Read My Resume.",
  description: "Talk To It.",
};

export const profile = {
  name: "Naveed Shaik",
  initials: "NS",
  title: "AI Engineer",
  tagline: "AI & Data Engineer building agentic, production-grade GenAI systems",
  location: "United States",
  email: "naveedshaik120@gmail.com",
  phone: "+1 940-808-9188",
  linkedin: "https://www.linkedin.com/in/naveed-shaik-50000a2b2/",
  github: "https://github.com/naveed-data",
  summary:
    "AI and Data Engineer with 4+ years of experience building production-grade AI solutions, scalable data platforms, and intelligent applications across banking and healthcare domains. Experienced in developing generative AI, agentic workflows, Retrieval-Augmented Generation (RAG), and cloud-native data pipelines using Python, Azure, AWS, and modern AI frameworks to deliver reliable, business-focused solutions. Adept at translating complex business requirements into secure, high-performance applications while applying AI governance, continuous evaluation, and software engineering best practices to improve quality, scalability, and user experience.",
};

export const skillGroups = [
  {
    title: "Programming Languages",
    skills: ["Python", "SQL", "Java", "JavaScript", "HTML", "CSS", "React", "PySpark"],
  },
  {
    title: "AI Engineering & GenAI",
    skills: [
      "Azure OpenAI GPT-4",
      "LangChain",
      "LangGraph",
      "Agentic AI",
      "Multi-Agent Systems",
      "Supervisor Agent",
      "RAG",
      "Auto-RAG",
      "Cache-based RAG",
      "MCP",
      "CrewAI",
      "ReAct",
      "Chain-of-Thought (CoT)",
      "Prompt Engineering",
      "PydanticAI",
      "FastAPI",
      "Uvicorn",
    ],
  },
  {
    title: "LLM Evaluation & Observability",
    skills: [
      "Ragas",
      "DeepEval",
      "Faithfulness",
      "Answer Relevancy",
      "Context Precision",
      "Context Recall",
      "Prompt Optimization",
      "Model Monitoring",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    title: "Data Engineering",
    skills: [
      "ETL Pipelines",
      "Apache Spark",
      "PySpark",
      "Databricks",
      "Medallion Architecture",
      "Apache Airflow",
      "MLflow",
      "Hadoop",
      "Hive",
      "Impala",
      "Data Validation",
      "Data Quality",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "Microsoft Azure",
      "Azure OpenAI",
      "Azure Kubernetes Service (AKS)",
      "Kubernetes",
      "RBAC",
      "AWS (S3, EC2, SageMaker, Bedrock)",
      "GCP",
      "Vertex AI",
      "Docker",
      "CI/CD",
    ],
  },
  {
    title: "Databases & Vector Stores",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Snowflake", "Redis", "Pinecone", "ChromaDB", "FAISS", "BigQuery"],
  },
  {
    title: "MLOps",
    skills: ["Feature Engineering", "Fine-tuning (LoRA, QLoRA)", "Model Deployment", "Inference Optimization", "MLflow"],
  },
  {
    title: "Visualization & Analytics",
    skills: ["Power BI", "Tableau", "Excel", "Matplotlib"],
  },
  {
    title: "Collaboration",
    skills: ["Git", "Jira", "Agile/Scrum", "RESTful APIs"],
  },
];

export const experience = [
  {
    role: "AI Engineer",
    org: "Wells Fargo",
    start: "Jul 2024",
    end: "Present",
    bullets: [
      "Architected an Agentic AI system using Azure OpenAI GPT-4, LangChain, LangGraph, and RAG, leveraging Chain-of-Thought and ReAct reasoning to enable multi-step reasoning, improving AI task completion accuracy by 38%.",
      "Engineered a Supervisor Agent to decompose complex user requests and orchestrate specialized sub-agents, reducing average task execution time by 32% while improving workflow scalability across enterprise banking use cases.",
      "Designed a dual-layer memory architecture with cache-based RAG for low-latency conversational context and long-term semantic retrieval, reducing response latency by 45% and improving response consistency.",
      "Developed Auto-RAG pipelines that dynamically validated queries and retrieved banking policies and compliance documents only when required, reducing hallucinations by 30% and unnecessary retrieval by 35%.",
      "Applied advanced prompt engineering (role prompting, few-shot, CoT, ReAct, structured output) to translate banking business rules into production-grade agent behavior, increasing response relevance by 28%.",
      "Established an LLM evaluation framework using Ragas and DeepEval, achieving 94% Faithfulness and 92% Answer Relevancy across production evaluation datasets; automated pipelines cut manual validation effort by 60%.",
      "Deployed enterprise AI applications on Azure Kubernetes with Prometheus/Grafana observability, maintaining 99.9% service availability.",
      "Partnered with product, compliance, and business stakeholders to deliver secure, governed AI solutions, reducing manual support effort by 40% through continuous prompt and retrieval optimization.",
    ],
  },
  {
    role: "Data Engineer",
    org: "Accenture",
    start: "Jan 2022",
    end: "Dec 2023",
    bullets: [
      "Engineered scalable PySpark data pipelines on Databricks and AWS to ingest, transform, and process EHR, patient, claims, and clinical data for enterprise analytics and reporting.",
      "Designed and implemented a Medallion Architecture (Bronze/Silver/Gold) in Databricks, standardizing healthcare data processing for BI, regulatory reporting, and operational analytics.",
      "Developed and optimized complex SQL/PostgreSQL queries to transform, validate, and aggregate large healthcare datasets, improving data accessibility for analysts, clinicians, and stakeholders.",
      "Built reusable PySpark ETL workflows with data quality validations to cleanse, standardize, and integrate structured and semi-structured healthcare data.",
      "Collaborated with data scientists to integrate ML models for patient risk prediction, monitoring Precision (92%), Recall (89%), F1 (90%), and ROC-AUC (0.94).",
      "Automated data ingestion and optimized cloud-based workflows on AWS, ensuring secure, reliable, scalable data delivery for downstream analytics.",
    ],
  },
];

export const education = [
  {
    degree: "Master of Science in Data Science",
    org: "University of North Texas, Denton, TX",
    start: "2024",
    end: "2025",
    detail: "GPA: 4.0/4.0",
  },
  {
    degree: "Bachelor of Technology in Electronics and Communication Engineering",
    org: "Presidency University, Bangalore, India",
    start: "2019",
    end: "2023",
    detail: "GPA: 3.2/4.0",
  },
];

export const projects = [
  {
    name: "FinAgent AI",
    tagline: "RAG-Powered Banking Document Intelligence Platform",
    problem:
      "Loan underwriters had no fast, trustworthy way to get answers grounded in a specific borrower's uploaded documents plus the bank's policy corpus — generic LLM answers risked hallucinated compliance guidance.",
    impact:
      "Cut concurrent request latency from 30-60s to under 2s (95% reduction) and gave underwriters a 3-mode analysis engine (risk assessment, compliance check, executive summary) across 20 REST API endpoints, fully scoped per tenant.",
    description:
      "Full-stack, JWT-secured platform grounding loan-underwriting responses in user-uploaded documents and a curated bank policy corpus, with a 3-mode analysis engine (risk assessment, compliance check, executive summary) across 20 REST API endpoints.",
    bullets: [
      "Built a RAG pipeline using ChromaDB embeddings and a locally-hosted Ollama LLM (Llama 3.2) with metadata-based multi-tenant retrieval scoping.",
      "Engineered structured-extraction prompts to parse unstructured loan documents into typed JSON, backed by a deterministic regex fallback layer for guaranteed valid output.",
      "Diagnosed and resolved a concurrency bug where synchronous Ollama calls blocked FastAPI's event loop; rearchitected to async/await, cutting concurrent request latency from 30-60s to under 2s (95% reduction).",
      "Delivered a 1,900-line backend / 2,600-line frontend app with multi-turn chat history, session persistence, and a voice-driven query interface (Web Speech API).",
    ],
    tech: ["Python", "FastAPI", "LangChain", "ChromaDB", "Ollama", "Llama 3.2", "React", "TypeScript", "JWT"],
    metrics: [
      { label: "Latency reduction", value: "95%" },
      { label: "REST endpoints", value: "20" },
      { label: "Analysis modes", value: "3" },
      { label: "Backend + frontend LOC", value: "4,500" },
    ],
    lessons:
      "Synchronous I/O inside an async framework is invisible until concurrent load hits it — the FastAPI event-loop block only showed up under multi-user testing, not single-request dev testing.",
    futureImprovements:
      "Swap the regex fallback layer for a schema-constrained decoding approach, and add a lightweight reranker before the LLM call to shrink context and cost further.",
    link: "",
  },
  {
    name: "FlightLens",
    tagline: "Aviation RAG AI Assistant",
    problem:
      "Pilots and aviation professionals need fast, source-grounded answers across thousands of dense regulatory and operational documents — manual lookup is slow and error-prone in time-sensitive situations.",
    impact:
      "Delivered semantic search across 1,000+ aviation documents with source-grounded, citation-backed answers in under 2 seconds, cutting retrieval-relevant lookup time versus manual document search.",
    description:
      "End-to-end RAG application enabling semantic search across 1,000+ aviation documents, delivering accurate, source-grounded responses for pilots and aviation professionals.",
    bullets: [
      "Engineered a scalable ingestion and vector search pipeline (chunking, embeddings, FAISS indexing), improving retrieval relevance by 40% and cutting query response time to under 2 seconds.",
      "Built an interactive Streamlit app with voice-enabled queries (Whisper), live METAR weather integration, and optional MSFS telemetry.",
      "Integrated source attribution and retrieval evaluation via LangChain for transparent, citation-backed answers, reducing hallucinations.",
    ],
    tech: ["Python", "LangChain", "FAISS", "MPNet", "FLAN-T5", "Streamlit", "Whisper"],
    metrics: [
      { label: "Retrieval relevance", value: "+40%" },
      { label: "Query response time", value: "<2s" },
      { label: "Documents indexed", value: "1,000+" },
    ],
    lessons:
      "Citation-backed answers matter more than raw fluency for a safety-critical domain — pilots trusted the assistant once every claim linked back to a source document.",
    futureImprovements:
      "Add a feedback loop where flagged answers automatically get added to a regression eval set, and explore hybrid sparse+dense retrieval for rare terminology.",
    link: "",
  },
];

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Architecture", href: "#architecture" },
  { label: "Contact", href: "#contact" },
];

export const highlights = [
  { value: "4+", label: "Years in AI & Data" },
  { value: "38%", label: "AI Task Accuracy ↑" },
  { value: "94%", label: "RAG Faithfulness" },
  { value: "99.9%", label: "Prod Uptime" },
];

export const capabilityTags = [
  "Agentic AI",
  "Multi-Agent Systems",
  "LangGraph",
  "RAG",
  "Azure OpenAI",
  "MCP",
];

export const availability = "Open to AI Engineer roles";

export const architecturePipeline = [
  { title: "Visitor", detail: "Asks a question through the NAVIQ chat interface" },
  { title: "API Route", detail: "Next.js edge/server route receives the request" },
  { title: "Supervisor Agent", detail: "Groq LLM decides which sub-agent tools are needed" },
  { title: "Sub-Agents", detail: "Resume, Project, Skills, Contact & Architecture agents fetch grounded data" },
  { title: "Context Assembly", detail: "Tool results are appended back into the conversation" },
  { title: "Response Generation", detail: "Groq streams the grounded answer token-by-token" },
  { title: "Client Render", detail: "NDJSON stream is parsed and rendered live in the chat UI" },
];

export const architectureStack = {
  frontend: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS v4", "React"],
  backend: ["Next.js Route Handlers", "Node.js streaming (ReadableStream)"],
  ai: ["Groq (openai/gpt-oss-20b)", "Tool-calling / function-calling agent loop", "NDJSON streaming protocol"],
  deployment: ["Vercel-ready", "Environment-based config (GROQ_API_KEY)"],
};

export const agentRoster = [
  {
    id: "supervisor",
    name: "Supervisor Agent",
    description: "Reads every question, decides which specialists to call, and assembles the final answer.",
  },
  {
    id: "resume",
    name: "Resume Agent",
    description: "Owns verified work history and education — dates, companies, degrees.",
  },
  {
    id: "project",
    name: "Project Agent",
    description: "Owns verified project case studies — problem, architecture, impact, metrics.",
  },
  {
    id: "skills",
    name: "Skills Agent",
    description: "Owns the verified technical skill inventory, grouped by category.",
  },
  {
    id: "architecture",
    name: "Architecture Agent",
    description: "Explains how NAVIQ itself is built — this page is a live demo of its own answer.",
  },
  {
    id: "contact",
    name: "Contact Agent",
    description: "Owns verified contact details and hand-off to a human conversation.",
  },
];
