# AI Assistence – Power BI Custom Visual (BI Assistant)

An AI-powered conversational assistant built as a custom visual for Microsoft Power BI. AI helps users interact with their Power BI data using natural-language questions and receive AI-generated answers and visual insights.

## 1. About the Project

AI (BI Assistant) is a Power BI custom visual designed to make data exploration easier and more interactive.

Instead of manually navigating reports and creating queries, users can interact with the assistant through a chat interface and ask questions about their Power BI semantic models.

### Key Features

- **Interactive Chat Interface:** Open and close the BI Assistant directly inside a Power BI report.
- **Power BI Authentication:** Connect to a Microsoft Power BI account.
- **Workspace Selection:** Retrieve and select available Power BI workspaces.
- **Semantic Model Selection:** Select a dataset from the chosen workspace.
- **AI-Powered Questions:** Ask questions about the selected semantic model using natural language.
- **Text Responses:** Receive AI-generated answers.
- **Visual Insights:** Request supported visual representations of data, such as charts, tables, and KPI-style outputs.
- **Focus Mode:** Expand the assistant for a larger conversation experience.

## 2. Repository Structure

```text
PowerBI-Custom-Visual/
│
├── .gitignore
├── README.md
│
└── bIAssistant/
    ├── .vscode/
    ├── assets/
    │
    ├── src/
    │   ├── visual.ts
    │   ├── settings.ts
    │   └── less.d.ts
    │
    ├── style/
    │   └── visual.less
    │
    ├── capabilities.json
    ├── eslint.config.mjs
    ├── package.json
    ├── package-lock.json
    ├── pbiviz.json
    └── tsconfig.json
```

### Important Files

| File | Purpose |
|---|---|
| `src/visual.ts` | Main visual implementation and chat functionality |
| `src/settings.ts` | Visual formatting and settings |
| `style/visual.less` | UI styling and animations |
| `assets/` | Bot icons and image assets |
| `capabilities.json` | Power BI visual capabilities and data roles |
| `pbiviz.json` | Power BI visual configuration |
| `package.json` | Project dependencies and build scripts |
| `tsconfig.json` | TypeScript compiler configuration |

## 3. Technologies Used

- TypeScript
- JavaScript
- HTML
- CSS / LESS
- D3.js
- Microsoft Power BI Custom Visuals API
- Power BI Visual Tools (`pbiviz`)
- Node.js and npm

## 4. Prerequisites

Install the following software before building the visual.

| Software | Purpose |
|---|---|
| Node.js 18 or later | JavaScript runtime |
| npm | Package and dependency management |
| Visual Studio Code | Recommended code editor |
| Power BI Desktop | Testing and importing the visual |
| Git | Downloading and managing source code |

**Download links:**

- Node.js: https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/
- Power BI Desktop: https://powerbi.microsoft.com/desktop/
- Git: https://git-scm.com/

## 5. Install Required Packages

### Step 1: Install Power BI Visual Tools

Open PowerShell or a terminal and execute:

```bash
npm install -g powerbi-visuals-tools@latest
```

Verify the installation:

```bash
pbiviz
```

This installs the command-line tools required to compile, test, and package Power BI custom visuals.

### Step 2: Download Project Dependencies

The project already includes `package.json` and `package-lock.json`.

You do not need to install every dependency individually.

The package manager will install the required packages automatically.

## 6. Download the Repository

Clone the repository:

```bash
git clone https://github.com/Sahithi-mamidipally/PowerBI-Custom-Visual.git
```

Navigate into the repository:

```bash
cd PowerBI-Custom-Visual
```

Navigate into the actual Power BI visual project:

```bash
cd bIAssistant
```

**Important:** Run all npm and `pbiviz` commands from the `bIAssistant` directory, where `pbiviz.json` and `package.json` are located.

## 7. Install Project Dependencies

Run:

```bash
npm ci
```

This installs the exact project dependencies specified in `package-lock.json`.

## 8. Build the Power BI Custom Visual

Once the dependencies are installed, execute:

```bash
npm run package
```

This runs the project's packaging script:

```bash
pbiviz package
```

The command compiles the TypeScript and LESS files and generates the Power BI custom visual package.

### Build Output

After a successful build, the `.pbiviz` file will be available inside:

```text
bIAssistant/
    └── dist/
        └── <generated-visual-package>.pbiviz
```

This `.pbiviz` file is the package that can be imported into Power BI Desktop.

## 9. Run the Visual in Development Mode

To run the visual locally during development:

```bash
npm run start
```

This executes:

```bash
pbiviz start
```

The development server compiles the visual and supports live testing while you modify the source files.

Keep the terminal running while testing.

To stop the development server, press:

```text
Ctrl + C
```

## 10. Import the Visual into Power BI Desktop

After generating the `.pbiviz` file:

1. Open Power BI Desktop.
2. Open your Power BI report.
3. Navigate to the Visualizations pane.
4. Select the three-dot menu.
5. Choose **Import a visual from a file**.
6. Select the generated `.pbiviz` file from the `bIAssistant/dist/` directory.
7. Confirm the import.
8. Add the visual to your report.

The PRISM AI visual should now be available in your report.

## 11. Enable Developer Mode (Optional)

If you want to test changes using `npm run start`:

1. Open Power BI Desktop.
2. Navigate to **File → Options and settings → Options**.
3. Under Current file, select **Report settings**.
4. Enable **Develop a visual**.
5. Start the development server using `npm run start`.
6. Add the Developer visual to your report and test your changes.

## 12. Useful Commands

| Command | Description |
|---|---|
| `npm ci` | Install project dependencies |
| `npm run lint` | Run ESLint checks |
| `npm run start` | Start the local visual development server |
| `npm run package` | Compile and generate the `.pbiviz` package |
| `pbiviz` | Display Power BI Visual Tools commands |

## 13. Backend Integration

The custom visual communicates with a separately hosted backend service for authentication, workspace and semantic model retrieval, and AI-powered question processing.

The backend is not included in this repository.

The current frontend configuration uses the following backend endpoint:

```text
https://bi-assistance-chat-bot.onrender.com
```

The backend integration is configured in:

```text
bIAssistant/src/visual.ts
```

If you deploy your own backend, update the `BACKEND_URL` configuration accordingly.

**Note:** Building the custom visual does not deploy the backend. AI features require the backend service and its authentication configuration to be available.

## 14. Development Workflow

The recommended workflow for contributors is:

1. Clone the repository.
2. Install the global Power BI Visual Tools.
3. Navigate into `bIAssistant`.
4. Install dependencies using `npm ci`.
5. Make changes to the TypeScript or LESS source files.
6. Run `npm run lint` to check the code.
7. Run `npm run package` to generate the visual.
8. Import the generated `.pbiviz` file into Power BI Desktop.
9. Test the changes in a Power BI report.

## 15. Important Notes

- Do not commit API keys, passwords, access tokens, or private credentials.
- Do not commit `node_modules` or generated temporary build files.
- Keep `package-lock.json` updated when dependencies change.
- The backend must be configured separately for AI functionality.
- Verify changes in Power BI Desktop before distributing a new visual package.

## 16. References

- Power BI Custom Visual Development: https://learn.microsoft.com/en-us/power-bi/developer/visuals/
- Power BI Visual Tools: https://github.com/microsoft/PowerBI-visuals-tools
- Node.js: https://nodejs.org/
- TypeScript: https://www.typescriptlang.org/

---

**Project:** PRISM AI – BI Assistant  
**Platform:** Microsoft Power BI  
**Repository:** https://github.com/Sahithi-mamidipally/PowerBI-Custom-Visual
