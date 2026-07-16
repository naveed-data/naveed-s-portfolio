import type Groq from "groq-sdk";
import {
  architecturePipeline,
  architectureStack,
  education,
  experience,
  product,
  profile,
  projects,
  skillGroups,
} from "@/lib/data";

export type ToolName =
  | "get_experience"
  | "get_education"
  | "get_projects"
  | "get_skills"
  | "get_architecture"
  | "get_contact_info";

export const TOOL_LABELS: Record<ToolName, string> = {
  get_experience: "Resume Agent",
  get_education: "Resume Agent",
  get_projects: "Project Agent",
  get_skills: "Skills Agent",
  get_architecture: "Architecture Agent",
  get_contact_info: "Contact Agent",
};

export const TOOL_AGENT_ID: Record<ToolName, string> = {
  get_experience: "resume",
  get_education: "resume",
  get_projects: "project",
  get_skills: "skills",
  get_architecture: "architecture",
  get_contact_info: "contact",
};

function tool(name: ToolName, description: string): Groq.Chat.Completions.ChatCompletionTool {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  };
}

export const AGENT_TOOLS: Groq.Chat.Completions.ChatCompletionTool[] = [
  tool("get_experience", `${profile.name}'s verified work history: roles, companies, dates, and achievements.`),
  tool("get_education", `${profile.name}'s verified degrees and academic background.`),
  tool("get_projects", `${profile.name}'s verified personal/portfolio projects with tech stacks and outcomes.`),
  tool("get_skills", `${profile.name}'s verified technical skills, grouped by category.`),
  tool(
    "get_architecture",
    `How this ${product.name} assistant itself is built: request pipeline, sub-agents, and tech stack.`
  ),
  tool("get_contact_info", `${profile.name}'s verified contact details (email, phone, LinkedIn, GitHub).`),
];

export function isToolName(value: string): value is ToolName {
  return value in TOOL_LABELS;
}

export function runTool(name: ToolName): unknown {
  switch (name) {
    case "get_experience":
      return experience;
    case "get_education":
      return education;
    case "get_projects":
      return projects;
    case "get_skills":
      return skillGroups;
    case "get_architecture":
      return {
        builtBy: `${profile.name} designed and built this entire ${product.name} system solo — the agent loop, tool-calling, streaming, and every UI surface.`,
        pipeline: architecturePipeline,
        stack: architectureStack,
      };
    case "get_contact_info":
      return {
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin,
        github: profile.github,
        location: profile.location,
      };
  }
}
