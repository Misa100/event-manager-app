import fs from "fs";
import path from "path";

const pkg = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf-8")
);

const readme = `
# ${pkg.name}

${pkg.description || "React application"}

## 🚀 Tech Stack
${[
  "react",
  "react-native",
  "vite",
  "redux",
  "tailwindcss",
]
  .filter(dep => pkg.dependencies?.[dep] || pkg.devDependencies?.[dep])
  .map(dep => `- ${dep}`)
  .join("\n")}

## 📦 Installation
\`\`\`bash
npm install
\`\`\`

## ▶️ Run
\`\`\`bash
${pkg.scripts?.start || "npm run dev"}
\`\`\`

## 🛠️ Scripts
${Object.entries(pkg.scripts || {})
  .map(([k, v]) => `- \`${k}\`: ${v}`)
  .join("\n")}

## 📁 Project Structure
\`\`\`
src/
components/
pages/
services/
\`\`\`
`;

fs.writeFileSync("README.md", readme.trim());
console.log("✅ README.md generated");
