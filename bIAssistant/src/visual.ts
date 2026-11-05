
"use strict";

import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import "./../style/visual.less";

// import "../style/visual.less";


import VisualConstructorOptions =
powerbi.extensibility.visual.VisualConstructorOptions;

import VisualUpdateOptions =
powerbi.extensibility.visual.VisualUpdateOptions;

import IVisual =
powerbi.extensibility.visual.IVisual;


export class Visual implements IVisual {





    private host: IVisualHost;

    private target: HTMLElement;

    private connectionId: string | null = null;

    // =========================
    // OLD UI ELEMENTS
    // =========================

    private helpButton: HTMLButtonElement;
    private chatWindow: HTMLDivElement;
    private closeButton: HTMLButtonElement;

    // private inputBox: HTMLInputElement;
    // private sendButton: HTMLButtonElement;


    private inputBox?: HTMLInputElement;
    private sendButton?: HTMLButtonElement;
    private messagesArea: HTMLDivElement;

    private powerBIData: any = null;


    // =========================
    // BACKEND
    // =========================

    private readonly BACKEND_URL = "https://bi-assistance-chat-bot.onrender.com";


    // =========================
    // SELECTED WORKSPACE
    // =========================

    private selectedWorkspaceId: string | null = null;
    private selectedWorkspaceName: string | null = null;


    // =========================
    // SELECTED DATASET
    // =========================

    private selectedDatasetId: string | null = null;
    private selectedDatasetName: string | null = null;


    constructor(options: VisualConstructorOptions) {

        this.host = options.host;

        this.target = options.element;

        // Clear existing content
        // this.target.innerHTML = "";
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild);
        }


        // =====================================
        // GREEN FLOATING CHAT BUTTON
        // =====================================

        this.helpButton = document.createElement("button");

        this.helpButton.className = "bi-help-button";
        // this.helpButton.innerHTML = "";


        this.helpButton.textContent = "";

        this.helpButton.setAttribute("aria-label", "Open BI Assistant");
        this.helpButton.title = "BI Assistant";
        // this.helpButton.className = "bi-help-button";

        // // this.helpButton.innerHTML = "💬";

        // this.helpButton.textContent = "💬";
        // this.helpButton.title = "BI Assistant";

        this.target.appendChild(this.helpButton);


        // =====================================
        // CHAT WINDOW
        // =====================================

        this.chatWindow = document.createElement("div");

        this.chatWindow.className = "bi-chat-window";

        this.chatWindow.style.display = "none";


        // =====================================
        // CHAT HEADER
        // =====================================

        const header = document.createElement("div");

        header.className = "bi-chat-header";


        // const title = document.createElement("span");

        // title.innerText = "BI Assistant";

        const titleArea = document.createElement("div");
        titleArea.className = "bi-chat-title-area";

        // const headerBotIcon = document.createElement("img");
        // headerBotIcon.className = "bi-header-bot-icon";

        // headerBotIcon.src = "../assets/BI_Bot.png";
        // headerBotIcon.alt = "BI Assistant";

        const headerBotIcon = document.createElement("span");
        headerBotIcon.className = "bi-header-bot-icon";
        headerBotIcon.setAttribute("aria-label", "BI Assistant");

        const title = document.createElement("span");

        title.innerText = "BI Assistant";

        titleArea.appendChild(headerBotIcon);
        titleArea.appendChild(title);


        this.closeButton = document.createElement("button");

        this.closeButton.className = "bi-close-button";

        this.closeButton.innerText = "×";


        header.appendChild(titleArea);

        header.appendChild(this.closeButton);


        // =====================================
        // MESSAGE AREA
        // =====================================

        this.messagesArea = document.createElement("div");

        this.messagesArea.className = "bi-messages";


        // =====================================
        // INPUT AREA
        // =====================================

        // const inputArea = document.createElement("div");

        // inputArea.className = "bi-input-area";

        // const geminiLogo = document.createElement("img");
        // geminiLogo.className = "bi-gemini-input-logo";
        // geminiLogo.src = "assets/Gemini_logo.png";
        // geminiLogo.alt = "Gemini AI";

        // // GEMINI LOGO — BOTTOM INPUT ONLY
        // // const geminiLogo = document.createElement("span");

        // geminiLogo.className = "bi-gemini-input-logo";
        // geminiLogo.innerText = "✦";
        // geminiLogo.title = "Gemini AI";
        // geminiLogo.setAttribute("aria-label", "Gemini AI");

        // this.inputBox = document.createElement("input");

        // this.inputBox.className = "bi-input";

        // this.inputBox.placeholder = "Ask your question...";


        // this.sendButton = document.createElement("button");

        // this.sendButton.className = "bi-send-button";

        // this.sendButton.innerText = "➤";


        // // inputArea.appendChild(this.inputBox);

        // // inputArea.appendChild(this.sendButton);

        // inputArea.appendChild(geminiLogo);

        // inputArea.appendChild(this.inputBox);

        // inputArea.appendChild(this.sendButton);

        // =====================================
        // BUILD CHAT
        // =====================================

        this.chatWindow.appendChild(header);

        this.chatWindow.appendChild(this.messagesArea);

        // this.chatWindow.appendChild(inputArea);

        this.target.appendChild(this.chatWindow);


        // =====================================
        // OPEN CHAT
        // =====================================

        // this.helpButton.addEventListener("click", () => {

        //     this.chatWindow.style.display = "flex";

        //     this.helpButton.style.display = "none";


        //     // Start only first time

        //     if (this.messagesArea.children.length === 0) {

        //         this.startBot();

        //     }



        // });


        // // =====================================
        // // CLOSE CHAT
        // // =====================================

        // this.closeButton.addEventListener("click", () => {

        //     this.chatWindow.style.display = "none";

        //     this.helpButton.style.display = "flex";

        // });


        // OPEN CHAT
        // this.helpButton.addEventListener("click", () => {
        //     this.chatWindow.style.display = "flex";
        //     this.helpButton.style.display = "none";

        //     requestAnimationFrame(() => {
        //         this.chatWindow.classList.add("bi-chat-open");
        //     });

        //     // Start only first time
        //     if (this.messagesArea.children.length === 0) {
        //         this.startBot();
        //     }
        // });


        this.helpButton.addEventListener("click", () => {

            // Open Power BI Focus Mode
            this.host.switchFocusModeState(true);

            this.chatWindow.style.display = "flex";
            this.helpButton.style.display = "none";

            requestAnimationFrame(() => {
                this.chatWindow.classList.add("bi-chat-open");
            });

            if (this.messagesArea.children.length === 0) {
                this.startBot();
            }
        });

        // CLOSE CHAT
        // this.closeButton.addEventListener("click", () => {
        //     this.chatWindow.classList.remove("bi-chat-open");

        //     this.chatWindow.addEventListener(
        //         "transitionend",
        //         () => {
        //             if (!this.chatWindow.classList.contains("bi-chat-open")) {
        //                 this.chatWindow.style.display = "none";
        //                 this.helpButton.style.display = "flex";
        //             }
        //         },
        //         { once: true }
        //     );
        // });


        this.closeButton.addEventListener("click", () => {

            this.chatWindow.classList.remove("bi-chat-open");

            this.chatWindow.addEventListener(
                "transitionend",
                () => {

                    if (!this.chatWindow.classList.contains("bi-chat-open")) {

                        this.chatWindow.style.display = "none";
                        this.helpButton.style.display = "flex";

                        // Exit Power BI Focus Mode
                        this.host.switchFocusModeState(false);
                    }

                },
                { once: true }
            );
        });
        // =====================================
        // SEND BUTTON
        // =====================================

        // this.sendButton.addEventListener("click", () => {

        //     this.sendMessage();

        // });


        // =====================================
        // ENTER KEY
        // =====================================

        // The persistent bottom input has been removed.
        // Ask AI uses its own input inside showOthers().



        // =====================================
        // LISTEN FOR POWER BI AUTH SUCCESS
        // =====================================

        window.addEventListener("message", (event) => {

            console.log("MESSAGE RECEIVED:", event.data);

            if (event.data?.type === "POWER_BI_AUTH_SUCCESS") {

                console.log("POWER BI AUTHENTICATION SUCCESSFUL");

                this.addBotMessage(
                    "✅ Power BI authentication successful! You can now ask me for help."
                );

            }

        });

    }


    // =====================================
    // START BOT
    // =====================================

    // =====================================
    // START BOT
    // =====================================

    private async startBot(): Promise<void> {

        this.addBotMessage(
            "Hi! 👋 I am your BI Assistant."
        );

        // const isAuthenticated =
        //     await this.checkAuthStatus();

        // console.log(
        //     "IS AUTHENTICATED:",
        //     isAuthenticated
        // );

        // if (isAuthenticated) {

        //     this.addBotMessage(
        //         "✅ Power BI authentication successful! You are connected."
        //     );

        //     this.loadWorkspaces();

        //     return;
        // }

        this.addBotMessage(
            "Please connect your Power BI account so I can access your workspaces and semantic models."
        );

        this.addLoginButton();
    }

    // =====================================
    // ADD BOT MESSAGE
    // =====================================

    // private addBotMessage(message: string): HTMLDivElement {

    //     const botMessage =
    //         document.createElement("div");

    //     botMessage.className = "bi-message bot";

    //     // botMessage.innerHTML = message;
    //     // botMessage.textContent = message;

    //     botMessage.textContent = message
    //         .replace(/<br\s*\/?>/gi, "\n")
    //         .replace(/<\/?b>/gi, "");

    //     this.messagesArea.appendChild(botMessage);

    //     this.scrollToBottom();

    //     return botMessage;

    // }




    private addBotMessage(message: string): HTMLDivElement {
        const botMessage = document.createElement("div");
        botMessage.className = "bi-message bot-message-row";

        // const botIcon = document.createElement("img");
        // botIcon.className = "bi-message-bot-icon";
        // botIcon.src = "../assets/BI_Bot.png";
        // botIcon.alt = "BI Assistant";

        const botIcon = document.createElement("span");
        botIcon.className = "bi-message-bot-icon";
        botIcon.setAttribute("aria-label", "BI Assistant");

        const messageBubble = document.createElement("div");
        messageBubble.className = "bi-message bot";

        messageBubble.textContent = message
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/?b>/gi, "");

        botMessage.appendChild(botIcon);
        botMessage.appendChild(messageBubble);

        this.messagesArea.appendChild(botMessage);
        this.scrollToBottom();

        return messageBubble;
    }


    // =====================================
    // ADD CONNECT POWER BI BUTTON
    // =====================================

    private addLoginButton(): void {

        const loginButton = document.createElement("button");

        loginButton.innerText = "🔐 Connect Power BI";

        loginButton.className = "login-button";

        loginButton.addEventListener("click", async () => {

            console.log("CONNECT POWER BI BUTTON CLICKED");

            // Create PRISM AI connection
            const connectionCreated =
                await this.createConnection();

            if (!connectionCreated) {

                this.addBotMessage(
                    "❌ Unable to create PRISM AI connection."
                );

                return;
            }

            console.log(
                "OPENING POWER BI LOGIN WITH CONNECTION ID:",
                this.connectionId
            );

            // Open Microsoft login with connection ID
            this.host.launchUrl(
                `${this.BACKEND_URL}/login?connectionId=${encodeURIComponent(
                    // `http://localhost:3000/login?connectionId=${encodeURIComponent(
                    this.connectionId!
                )}`
            );

            this.addBotMessage(
                "Please complete the Power BI login. I will detect the connection automatically..."
            );

            // Check authentication every 2 seconds
            const authInterval = setInterval(async () => {

                const authenticated =
                    await this.checkAuthStatus();

                console.log(
                    "CHECKING AUTH STATUS:",
                    authenticated
                );

                if (authenticated) {

                    clearInterval(authInterval);

                    this.addBotMessage(
                        "✅ Power BI authentication successful! You are now connected."
                    );

                    await this.loadWorkspaces();
                }

            }, 2000);

        });
        // loginButton.addEventListener("click", async () => {

        //     console.log("CONNECT POWER BI BUTTON CLICKED");


        // =====================================
        // CREATE PRISM AI CONNECTION
        // =====================================

        //     const connectionCreated =
        //         await this.createConnection();


        //     if (
        //         !connectionCreated ||
        //         !this.connectionId
        //     ) {

        //         this.addBotMessage(
        //             "❌ Unable to start the Power BI connection. Please try again."
        //         );

        //         return;

        //     }


        //     console.log(
        //         "OPENING LOGIN WITH CONNECTION ID:",
        //         this.connectionId
        //     );


        //     // =====================================
        //     // OPEN MICROSOFT LOGIN
        //     // =====================================

        //     this.host.launchUrl(
        //         `http://localhost:3000/login?connectionId=${this.connectionId}`
        //     );


        //     // =====================================
        //     // CHECK AUTH STATUS EVERY 2 SECONDS
        //     // =====================================

        //     const authInterval = setInterval(
        //         async () => {

        //             const authenticated =
        //                 await this.checkAuthStatus();


        //             console.log(
        //                 "CHECKING AUTH STATUS:",
        //                 authenticated
        //             );


        //             if (authenticated) {

        //                 clearInterval(
        //                     authInterval
        //                 );


        //                 this.addBotMessage(
        //                     "✅ Power BI authentication successful! You are now connected."
        //                 );


        //                 this.loadWorkspaces();

        //             }

        //         },
        //         2000
        //     );

        // });


        this.messagesArea.appendChild(
            loginButton
        );

        this.scrollToBottom();

    }
    // =====================================
    // ADD USER MESSAGE
    // =====================================

    private addUserMessage(message: string): void {

        const userMessage =
            document.createElement("div");

        userMessage.className = "bi-message user";

        userMessage.innerText = message;

        this.messagesArea.appendChild(userMessage);

        this.scrollToBottom();

    }


    // =====================================
    // SEND MESSAGE
    // =====================================

    private sendMessage(): void {

        // This legacy method is retained for compatibility.
        // The persistent bottom input is no longer created.
        if (!this.inputBox) {
            return;
        }

        const question = this.inputBox.value.trim();

        if (!question) {
            return;
        }

        this.addUserMessage(question);
        this.inputBox.value = "";

        void this.processUserMessage(question);
    }


    // =====================================
    // PROCESS TEXT MESSAGE
    // =====================================

    private async processUserMessage(message: string): Promise<void> {

        const lowerMessage =
            message.toLowerCase().trim();


        // =====================================
        // YES
        // =====================================

        if (
            lowerMessage === "yes" &&
            this.selectedDatasetId
        ) {

            this.showMainMenu();

            return;

        }


        // =====================================
        // NO
        // =====================================

        if (lowerMessage === "no") {

            this.addBotMessage(
                "No problem. Please select another dataset."
            );


            if (this.selectedWorkspaceId) {

                this.loadDatasets(
                    this.selectedWorkspaceId
                );

            }

            return;

        }


        // =====================================
        // CHECK DATASET
        // =====================================

        if (!this.selectedDatasetId) {

            this.addBotMessage(
                "Please select a workspace and dataset first."
            );

            return;

        }


        // =====================================
        // SEND QUESTION TO PRISM AI
        // =====================================

        await this.askPrismAI(message);

    }

    // =====================================
    // ASK PRISM AI
    // =====================================

    // =====================================
    // ASK PRISM AI
    // =====================================

    private async askPrismAI(
        question: string
    ): Promise<void> {

        const loadingMessage =
            this.addBotMessage(
                "🤔 Analyzing your question..."
            );

        try {

            console.log(
                "================================="
            );

            console.log(
                "PRISM AI QUESTION:",
                question
            );

            console.log(
                "CONNECTION ID:",
                this.connectionId
            );

            console.log(
                "WORKSPACE ID:",
                this.selectedWorkspaceId
            );

            console.log(
                "DATASET ID:",
                this.selectedDatasetId
            );

            console.log(
                "================================="
            );


            // =====================================
            // CHECK POWER BI CONNECTION
            // =====================================

            if (
                !this.connectionId ||
                !this.selectedWorkspaceId ||
                !this.selectedDatasetId
            ) {

                loadingMessage.remove();

                this.addBotMessage(
                    "❌ Power BI connection, workspace, or dataset information is missing."
                );

                return;
            }


            // =====================================
            // CALL PRISM AI BACKEND
            // =====================================

            const response =
                await fetch(
                    `${this.BACKEND_URL}/api/ask`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            question:
                                question,

                            connectionId:
                                this.connectionId,

                            workspaceId:
                                this.selectedWorkspaceId,

                            datasetId:
                                this.selectedDatasetId,

                            workspaceName:
                                this.selectedWorkspaceName,

                            datasetName:
                                this.selectedDatasetName

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "PRISM AI RESPONSE:",
                data
            );


            loadingMessage.remove();


            // =====================================
            // ERROR
            // =====================================

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Prism AI request failed."
                );

            }


            // =====================================
            // DISPLAY ANSWER
            // =====================================

            // this.addBotMessage(
            //     `🤖 ${data.answer}`
            // );

            // =====================================
            // DISPLAY ANSWER
            // =====================================

            // this.addBotMessage(
            //     `🤖 ${data.answer}`
            // );

            // =====================================
            // DISPLAY AI VISUALIZATION
            // =====================================


            // =====================================
            // DISPLAY AI VISUALIZATION
            // =====================================

            const visualizationElement =
                this.renderAIVisualization(
                    data.visualization,
                    data.data
                );

            this.messagesArea.appendChild(
                visualizationElement
            );

            this.scrollToBottom();


        } catch (error) {

            console.error(
                "PRISM AI ERROR:",
                error
            );


            loadingMessage.remove();


            this.addBotMessage(
                "❌ I couldn't process your question. Please try again."
            );

        }

    }



    // =====================================
    // LOAD WORKSPACES
    // =====================================

    private async loadWorkspaces(): Promise<void> {

        if (!this.connectionId) {

            this.addBotMessage(
                "❌ Connection information is missing. Please reconnect to Power BI."
            );

            return;
        }

        const loadingMessage =
            this.addBotMessage(
                "Loading available workspaces..."
            );

        try {

            const response = await fetch(
                `${this.BACKEND_URL}/api/workspaces?connectionId=${this.connectionId}`,
                // `http://localhost:3000/api/workspaces?connectionId=${this.connectionId}`,
                {
                    method: "GET"
                }
            );

            if (!response.ok) {

                throw new Error(
                    `Workspace API returned ${response.status}`
                );

            }

            const data =
                await response.json();

            loadingMessage.remove();

            this.showWorkspaceSelector(
                data.value || []
            );

        } catch (error) {

            console.error(
                "WORKSPACE ERROR:",
                error
            );

            loadingMessage.remove();

            this.addBotMessage(
                "Unable to load workspaces. Please check the backend connection."
            );

        }

    }



    // =====================================
    // CREATE PRISM AI CONNECTION
    // =====================================

    private async createConnection(): Promise<boolean> {

        try {

            const response = await fetch(
                `${this.BACKEND_URL}/api/create-connection`
                // "http://localhost:3000/api/create-connection"
            );

            const data = await response.json();

            console.log(
                "PRISM AI CONNECTION:",
                data
            );

            if (!data.connectionId) {

                console.error(
                    "Connection ID was not received."
                );

                return false;

            }

            this.connectionId =
                data.connectionId;

            console.log(
                "CONNECTION ID STORED:",
                this.connectionId
            );

            return true;

        } catch (error) {

            console.error(
                "CREATE CONNECTION ERROR:",
                error
            );

            return false;

        }

    }
    // =====================================
    // CHECK AUTH STATUS
    // =====================================
    private async checkAuthStatus(): Promise<boolean> {

        try {

            if (!this.connectionId) {

                console.error(
                    "AUTH STATUS: Connection ID missing."
                );

                return false;
            }

            const response = await fetch(
                `${this.BACKEND_URL}/api/auth-status?connectionId=${encodeURIComponent(
                    // `http://localhost:3000/api/auth-status?connectionId=${encodeURIComponent(
                    this.connectionId
                )}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            console.log(
                "AUTH STATUS:",
                data
            );

            return data.authenticated === true;

        } catch (error) {

            console.error(
                "AUTH STATUS ERROR:",
                error
            );

            return false;
        }
    }



    // =====================================
    // WORKSPACE DROPDOWN
    // =====================================

    private showWorkspaceSelector(
        workspaces: any[]
    ): void {

        const container =
            document.createElement("div");

        container.className =
            "bi-message bot";


        const label =
            document.createElement("div");

        label.style.marginBottom = "8px";

        label.style.fontWeight = "bold";

        label.innerText =
            "Select Workspace";


        const select =
            document.createElement("select");

        select.style.width = "100%";

        select.style.padding = "8px";


        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.text =
            "-- Select Workspace --";


        select.appendChild(defaultOption);


        workspaces.forEach(
            (workspace: any) => {

                const option =
                    document.createElement("option");

                option.value =
                    workspace.id;

                option.text =
                    workspace.name;

                select.appendChild(option);

            }
        );


        container.appendChild(label);

        container.appendChild(select);

        this.messagesArea.appendChild(container);


        select.addEventListener(
            "change",
            () => {

                if (!select.value) {

                    return;

                }


                const selectedOption =
                    select.options[
                    select.selectedIndex
                    ];


                this.selectedWorkspaceId =
                    select.value;

                this.selectedWorkspaceName =
                    selectedOption.text;


                select.disabled = true;


                this.addUserMessage(
                    this.selectedWorkspaceName
                );


                this.addBotMessage(
                    `Great! You selected <b>${this.selectedWorkspaceName}</b>.`
                );


                this.addBotMessage(
                    "Now please select a dataset."
                );


                this.loadDatasets(
                    this.selectedWorkspaceId
                );

            }
        );


        this.scrollToBottom();

    }


    // =====================================
    // LOAD DATASETS
    // =====================================

    private async loadDatasets(workspaceId: string): Promise<void> {

        // =====================================
        // CHECK CONNECTION
        // =====================================

        if (!this.connectionId) {

            this.addBotMessage(
                "❌ Connection information is missing. Please reconnect to Power BI."
            );

            return;

        }


        const loadingMessage =
            this.addBotMessage(
                "Loading datasets..."
            );


        try {

            const response =
                await fetch(

                    `${this.BACKEND_URL}/api/workspaces/${workspaceId}/datasets?connectionId=${this.connectionId}`,

                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json"
                        }

                    }

                );


            if (!response.ok) {

                throw new Error(
                    `Dataset API returned ${response.status}`
                );

            }


            const data =
                await response.json();


            loadingMessage.remove();


            this.showDatasetSelector(
                data.value || []
            );


        } catch (error) {

            console.error(
                "DATASET ERROR:",
                error
            );


            loadingMessage.remove();


            this.addBotMessage(
                "Unable to load datasets."
            );

        }

    }

    // =====================================
    // DATASET DROPDOWN
    // =====================================

    private showDatasetSelector(
        datasets: any[]
    ): void {

        const container =
            document.createElement("div");

        container.className =
            "bi-message bot";


        const label =
            document.createElement("div");

        label.style.marginBottom = "8px";

        label.style.fontWeight = "bold";

        label.innerText =
            "Select Dataset";


        const select =
            document.createElement("select");

        select.style.width = "100%";

        select.style.padding = "8px";


        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.text =
            "-- Select Dataset --";


        select.appendChild(defaultOption);


        datasets.forEach(
            (dataset: any) => {

                const option =
                    document.createElement("option");

                option.value =
                    dataset.id;

                option.text =
                    dataset.name;

                select.appendChild(option);

            }
        );


        container.appendChild(label);

        container.appendChild(select);

        this.messagesArea.appendChild(container);


        select.addEventListener(
            "change",
            () => {

                if (!select.value) {

                    return;

                }


                const selectedOption =
                    select.options[
                    select.selectedIndex
                    ];


                this.selectedDatasetId =
                    select.value;

                this.selectedDatasetName =
                    selectedOption.text;


                select.disabled = true;


                this.addUserMessage(
                    this.selectedDatasetName
                );


                this.addBotMessage(
                    `You selected <b>${this.selectedDatasetName}</b>.`
                );


                this.showConfirmation();

            }
        );


        this.scrollToBottom();

    }


    // =====================================
    // CONFIRM DATASET
    // =====================================

    private showConfirmation(): void {

        this.addBotMessage(
            `Please confirm if you need help with <b>${this.selectedDatasetName}</b>.`
        );


        const container =
            document.createElement("div");

        container.className =
            "bi-message bot";


        const yesButton =
            document.createElement("button");

        yesButton.innerText = "Yes";

        yesButton.style.marginRight = "8px";


        const noButton =
            document.createElement("button");

        noButton.innerText = "No";


        container.appendChild(yesButton);

        container.appendChild(noButton);

        this.messagesArea.appendChild(container);


        yesButton.addEventListener(
            "click",
            async () => {

                yesButton.disabled = true;

                noButton.disabled = true;


                this.addUserMessage(
                    "Yes"
                );


                // Load semantic model metadata
                const metadataLoaded =
                    await this.loadSemanticModelMetadata();


                if (metadataLoaded) {

                    this.addBotMessage(
                        "✅ Semantic model is ready for analysis."
                    );

                }


                // Test whether PRISM AI can query
                // the selected semantic model
                await this.testSemanticModelQuery();


                // Show main options
                this.showMainMenu();

            }
        );
        // yesButton.addEventListener(
        //     "click",
        //     async () => {

        //         yesButton.disabled = true;

        //         noButton.disabled = true;


        //         this.addUserMessage(
        //             "Yes"
        //         );



        //         const metadataLoaded =
        //             await this.loadSemanticModelMetadata();


        //         if (metadataLoaded) {

        //             this.addBotMessage(
        //                 "✅ Semantic model is ready for analysis."
        //             );


        //         }

        //          // Existing metadata call
        //         await this.loadSemanticModelMetadata();


        //         // NEW: Test whether PRISM AI can query
        //         // the selected semantic model
        //         await this.testSemanticModelQuery();


        //         this.showMainMenu();

        //     }
        // );


        noButton.addEventListener(
            "click",
            () => {

                yesButton.disabled = true;

                noButton.disabled = true;


                this.addUserMessage(
                    "No"
                );


                this.selectedDatasetId =
                    null;

                this.selectedDatasetName =
                    null;


                this.addBotMessage(
                    "Please select another dataset."
                );


                if (
                    this.selectedWorkspaceId
                ) {

                    this.loadDatasets(
                        this.selectedWorkspaceId
                    );

                }

            }
        );


        this.scrollToBottom();

    }

    // =====================================
    // LOAD SEMANTIC MODEL METADATA
    // =====================================

    private async loadSemanticModelMetadata(): Promise<boolean> {

        if (
            !this.connectionId ||
            !this.selectedWorkspaceId ||
            !this.selectedDatasetId
        ) {

            console.error(
                "Missing connection, workspace, or dataset information."
            );

            return false;

        }


        try {

            this.addBotMessage(
                "Preparing the semantic model for analysis..."
            );


            const response = await fetch(

                `${this.BACKEND_URL}/api/workspaces/${this.selectedWorkspaceId}/datasets/${this.selectedDatasetId}/metadata?connectionId=${this.connectionId}`,

                {
                    method: "GET"
                }

            );


            if (!response.ok) {

                throw new Error(
                    `Metadata API returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "SEMANTIC MODEL METADATA:",
                data
            );


            return true;

        } catch (error) {

            console.error(
                "SEMANTIC MODEL METADATA ERROR:",
                error
            );


            this.addBotMessage(
                "⚠️ I could not prepare the semantic model for analysis."
            );


            return false;

        }

    }

    private async testSemanticModelQuery(): Promise<void> {

        if (
            !this.connectionId ||
            !this.selectedWorkspaceId ||
            !this.selectedDatasetId
        ) {

            console.error(
                "Missing workspace, dataset, or connection information."
            );

            return;

        }


        try {

            console.log(
                "TESTING SEMANTIC MODEL QUERY..."
            );


            const response = await fetch(

                `${this.BACKEND_URL}/api/workspaces/${this.selectedWorkspaceId}/datasets/${this.selectedDatasetId}/schema-test?connectionId=${this.connectionId}`,

                {
                    method: "GET"
                }

            );


            const data =
                await response.json();


            console.log(
                "SEMANTIC MODEL QUERY TEST RESULT:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Semantic model query failed."
                );

            }


            this.addBotMessage(
                "✅ Connected successfully to the semantic model."
            );


        } catch (error) {

            console.error(
                "SEMANTIC MODEL QUERY ERROR:",
                error
            );


            this.addBotMessage(
                "⚠️ I could not query the semantic model."
            );

        }

    }
    // =====================================
    // MAIN MENU
    // =====================================

    // =====================================
    // MAIN MENU
    // =====================================

    private showMainMenu(): void {

        this.addBotMessage(
            "Great! How can I help you?"
        );

        const container =
            document.createElement("div");

        // container.className =
        //     "bi-message bot";
        container.className = "bi-options-container";

        const options = [
            "📊 KPI",
            "📈 Analysis by Category",
            "📞 Contact Us",
            "🤖 Ask AI"
        ];

        options.forEach(
            (optionText) => {

                const button =
                    document.createElement("button");
                button.innerText = optionText;
                button.className = "bi-option-button";

                // button.innerText =
                //     optionText;

                // button.style.display =
                //     "block";

                // button.style.width =
                //     "100%";

                // button.style.marginTop =
                //     "8px";

                // button.style.padding =
                //     "8px";

                button.style.cursor =
                    "pointer";

                button.addEventListener(
                    "click",
                    () => {

                        this.addUserMessage(
                            optionText
                        );

                        // =========================
                        // KPI
                        // =========================

                        if (
                            optionText.includes("KPI")
                        ) {

                            this.showKpiOptions();

                            return;
                        }

                        // =========================
                        // ANALYSIS BY CATEGORY
                        // =========================

                        if (
                            optionText.includes("Analysis")
                        ) {

                            this.showAnalysisOptions();

                            return;
                        }

                        // =========================
                        // CONTACT US
                        // =========================

                        if (
                            optionText.includes("Contact")
                        ) {

                            this.showContactUs();

                            return;
                        }

                        // =========================
                        // 🤖 Ask AI
                        // =========================

                        if (
                            optionText.includes("Ask AI")
                        ) {

                            this.showOthers();

                            return;
                        }

                    }
                );

                container.appendChild(button);

            }
        );

        this.messagesArea.appendChild(
            container
        );

        this.scrollToBottom();
    }


    // =====================================
    // KPI OPTIONS
    // =====================================

    // =====================================
    // KPI OPTIONS
    // =====================================

    // private showKpiOptions(): void {

    //     this.addBotMessage(
    //         "Please select a KPI:"
    //     );


    //     const container =
    //         document.createElement("div");

    //     container.className =
    //         "bi-message bot";


    //     const kpis = [

    //         "Total Sales",

    //         "Total Profit",

    //         "Total Orders",

    //         "⬅ Back"

    //     ];


    //     kpis.forEach(
    //         (kpi) => {

    //             const button =
    //                 document.createElement("button");

    //             button.innerText =
    //                 kpi;

    //             button.style.display =
    //                 "block";

    //             button.style.width =
    //                 "100%";

    //             button.style.marginTop =
    //                 "8px";

    //             button.style.padding =
    //                 "8px";


    //             button.addEventListener(
    //                 "click",
    //                 async () => {

    //                     this.addUserMessage(
    //                         kpi
    //                     );

    //                     if (
    //                         kpi === "⬅ Back"
    //                     ) {

    //                         this.showMainMenu();

    //                         return;

    //                     }

    //                     if (
    //                         kpi === "Total Sales"
    //                     ) {

    //                         await this.getTotalSales();

    //                         return;

    //                     }

    //                      if (
    //                         kpi === "Total Profit"
    //                     ) {

    //                         this.getTotalProfit();

    //                         return;
    //                     }

    //                     if (
    //                         kpi === "Total Orders"
    //                     ) {

    //                         this.getTotalOrders();

    //                         return;
    //                     }


    //                     if (
    //                         kpi === "← Back"
    //                     ) {

    //                         this.showMainMenu();

    //                         return;
    //                     }

    //                     this.addBotMessage(
    //                         `You selected <b>${kpi}</b>. This KPI will be connected next.`
    //                     );

    //                 }
    //             );


    //             container.appendChild(button);

    //         }
    //     );


    //     this.messagesArea.appendChild(container);

    //     this.scrollToBottom();

    // }



    private showKpiOptions(): void {

        this.addBotMessage("Please select a KPI:");

        const container = document.createElement("div");
        container.className = "bi-options-container";

        const kpis = [
            "Total Sales",
            "Total Profit",
            "Total Orders",
            "⬅ Back"
        ];

        kpis.forEach((kpi) => {

            const button = document.createElement("button");
            button.innerText = kpi;
            button.className = "bi-option-button";

            button.addEventListener("click", async () => {

                this.addUserMessage(kpi);

                if (kpi === "⬅ Back") {
                    this.showMainMenu();
                    return;
                }

                if (kpi === "Total Sales") {
                    await this.getTotalSales();
                    return;
                }

                if (kpi === "Total Profit") {
                    this.getTotalProfit();
                    return;
                }

                if (kpi === "Total Orders") {
                    this.getTotalOrders();
                    return;
                }

                this.addBotMessage(
                    `You selected <b>${kpi}</b>. This KPI will be connected next.`
                );
            });

            container.appendChild(button);
        });

        this.messagesArea.appendChild(container);
        this.scrollToBottom();
    }

    // =====================================
    // GET TOTAL SALES
    // =====================================

    private async getTotalSales(): Promise<void> {

        if (
            !this.connectionId ||
            !this.selectedWorkspaceId ||
            !this.selectedDatasetId
        ) {

            this.addBotMessage(
                "❌ Power BI connection, workspace, or dataset information is missing."
            );

            return;
        }

        const loadingMessage =
            this.addBotMessage(
                "⏳ Calculating Total Sales..."
            );

        try {

            const response = await fetch(
                `${this.BACKEND_URL}/api/workspaces/${this.selectedWorkspaceId}/datasets/${this.selectedDatasetId}/kpi/total-sales?connectionId=${encodeURIComponent(this.connectionId)}`,
                {
                    method: "GET"
                }
            );

            const data = await response.json();

            console.log(
                "TOTAL SALES API RESPONSE:",
                data
            );

            loadingMessage.remove();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Unable to retrieve Total Sales."
                );
            }

            const value = Number(data.value);

            const formattedValue =
                value.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

            this.addBotMessage(
                `📊 <b>Total Sales</b><br><br>💰 ${formattedValue}`
            );

            // this.addBotMessage(
            //     "Great! What would you like to check next?"
            // );

            this.showMainMenu();

        } catch (error) {

            console.error(
                "TOTAL SALES ERROR:",
                error
            );

            loadingMessage.remove();

            this.addBotMessage(
                "❌ I couldn't retrieve Total Sales from the Power BI semantic model."
            );

        }

    }


    // =====================================
    // GET TOTAL PROFIT
    // =====================================

    private async getTotalProfit(): Promise<void> {

        if (
            !this.connectionId ||
            !this.selectedWorkspaceId ||
            !this.selectedDatasetId
        ) {

            this.addBotMessage(
                "❌ Power BI connection, workspace, or dataset information is missing."
            );

            return;
        }

        const loadingMessage =
            this.addBotMessage(
                "⏳ Calculating Total Profit..."
            );

        try {

            const response = await fetch(
                `${this.BACKEND_URL}/api/workspaces/${this.selectedWorkspaceId}/datasets/${this.selectedDatasetId}/kpi/total-profit?connectionId=${encodeURIComponent(this.connectionId)}`
            );

            const data = await response.json();

            console.log(
                "TOTAL PROFIT API RESPONSE:",
                data
            );

            loadingMessage.remove();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Unable to retrieve Total Profit."
                );
            }

            const value = Number(data.value);

            const formattedValue =
                value.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

            this.addBotMessage(
                `📊 Total Profit<br><br>💰 ${formattedValue}`
            );

            this.showMainMenu();

        } catch (error) {

            console.error(
                "TOTAL PROFIT ERROR:",
                error
            );

            loadingMessage.remove();

            this.addBotMessage(
                "❌ I couldn't retrieve Total Profit from the Power BI semantic model."
            );
        }
    }


    // =====================================
    // GET TOTAL ORDERS
    // =====================================

    private async getTotalOrders(): Promise<void> {

        if (
            !this.connectionId ||
            !this.selectedWorkspaceId ||
            !this.selectedDatasetId
        ) {

            this.addBotMessage(
                "❌ Power BI connection, workspace, or dataset information is missing."
            );

            return;
        }

        const loadingMessage =
            this.addBotMessage(
                "⏳ Calculating Total Orders..."
            );

        try {

            const response = await fetch(
                `${this.BACKEND_URL}/api/workspaces/${this.selectedWorkspaceId}/datasets/${this.selectedDatasetId}/kpi/total-orders?connectionId=${encodeURIComponent(this.connectionId)}`
            );

            const data = await response.json();

            console.log(
                "TOTAL ORDERS API RESPONSE:",
                data
            );

            loadingMessage.remove();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Unable to retrieve Total Orders."
                );
            }

            const value = Number(data.value);

            const formattedValue =
                value.toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 0
                    }
                );

            this.addBotMessage(
                `📊 Total Orders<br><br>📦 ${formattedValue}`
            );

            this.showMainMenu();

        } catch (error) {

            console.error(
                "TOTAL ORDERS ERROR:",
                error
            );

            loadingMessage.remove();

            this.addBotMessage(
                "❌ I couldn't retrieve Total Orders from the Power BI semantic model."
            );
        }
    }


    // =====================================
    // ANALYSIS BY CATEGORY
    // =====================================

    private showAnalysisOptions(): void {

        this.addBotMessage(
            "📈 Analysis by Category is selected."
        );

        this.addBotMessage(
            "Category analysis will be connected next."
        );

        const container =
            document.createElement("div");

        container.className =
            "bi-message bot";

        const mainMenuButton =
            document.createElement("button");

        mainMenuButton.innerText =
            "⬅ Main Menu";

        mainMenuButton.style.display =
            "block";

        mainMenuButton.style.width =
            "100%";

        mainMenuButton.style.marginTop =
            "8px";

        mainMenuButton.style.padding =
            "8px";

        mainMenuButton.addEventListener(
            "click",
            () => {

                this.addUserMessage(
                    "⬅ Main Menu"
                );

                this.showMainMenu();

            }
        );

        container.appendChild(
            mainMenuButton
        );

        this.messagesArea.appendChild(
            container
        );

        this.scrollToBottom();
    }


    // =====================================
    // CONTACT US
    // =====================================

    private showContactUs(): void {

        this.addBotMessage(
            "📞 Please submit your request using the Contact Us option."
        );

        const container =
            document.createElement("div");

        container.className =
            "bi-message bot";

        const mainMenuButton =
            document.createElement("button");

        mainMenuButton.innerText =
            "⬅ Main Menu";

        mainMenuButton.style.display =
            "block";

        mainMenuButton.style.width =
            "100%";

        mainMenuButton.style.marginTop =
            "8px";

        mainMenuButton.style.padding =
            "8px";

        mainMenuButton.addEventListener(
            "click",
            () => {

                this.addUserMessage(
                    "⬅ Main Menu"
                );

                this.showMainMenu();

            }
        );

        container.appendChild(
            mainMenuButton
        );

        this.messagesArea.appendChild(
            container
        );

        this.scrollToBottom();
    }


    // =====================================
    // OTHERS
    // =====================================

    // private showOthers(): void {

    //     this.addBotMessage(
    //         "💬 Please type your question."

    //     );

    //     const container =
    //         document.createElement("div");

    //     container.className =
    //         "bi-message bot";

    //     const mainMenuButton =
    //         document.createElement("button");

    //     mainMenuButton.innerText =
    //         "⬅ Main Menu";

    //     mainMenuButton.style.display =
    //         "block";

    //     mainMenuButton.style.width =
    //         "100%";

    //     mainMenuButton.style.marginTop =
    //         "8px";

    //     mainMenuButton.style.padding =
    //         "8px";

    //     mainMenuButton.addEventListener(
    //         "click",
    //         () => {

    //             this.addUserMessage(
    //                 "⬅ Main Menu"
    //             );

    //             this.showMainMenu();

    //         }
    //     );

    //     container.appendChild(
    //         mainMenuButton
    //     );

    //     this.messagesArea.appendChild(
    //         container
    //     );

    //     this.scrollToBottom();
    // }




    private showOthers(): void {
        this.addBotMessage(
            "💬 Ask me anything about the selected Power BI dataset."
        );

        const container = document.createElement("div");
        container.className = "bi-options-container";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Example: What are the total sales?";
        input.style.width = "100%";
        input.style.boxSizing = "border-box";
        input.style.marginTop = "8px";
        input.style.padding = "8px";

        const sendButton = document.createElement("button");
        sendButton.innerText = "SEND";
        sendButton.className = "bi-option-button";

        const mainMenuButton = document.createElement("button");
        mainMenuButton.innerText = "⬅ Main Menu";
        mainMenuButton.className = "bi-option-button";
        mainMenuButton.style.marginTop = "8px";

        const askQuestion = (): void => {
            const question = input.value.trim();
            if (!question) return;

            this.addUserMessage(question);
            input.value = "";

            const normalized = question.toLowerCase().replace(/[!.?\s]+$/g, "");

            // Handle greetings without calling the Power BI backend.
            if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(normalized)) {
                this.addBotMessage(
                    "👋 Hi! I'm your BI Assistant. What would you like to know about your Power BI data?"
                );
                return;
            }

            if (
                !this.connectionId ||
                !this.selectedWorkspaceId ||
                !this.selectedDatasetId
            ) {
                this.addBotMessage(
                    "❌ Power BI connection, workspace, or dataset information is missing."
                );
                return;
            }

            this.addBotMessage("How would you like your answer displayed?");

            const formatContainer = document.createElement("div");
            formatContainer.className = "bi-options-container";

            const textButton = document.createElement("button");
            textButton.innerText = "📝 Brief Text";
            textButton.className = "bi-option-button";

            const visualButton = document.createElement("button");
            visualButton.innerText = "📊 Visualization";
            visualButton.className = "bi-option-button";

            formatContainer.appendChild(textButton);
            formatContainer.appendChild(visualButton);
            this.messagesArea.appendChild(formatContainer);
            this.scrollToBottom();

            textButton.addEventListener("click", () => {
                formatContainer.remove();
                void submitQuestion("text", "none");
            });

            visualButton.addEventListener("click", () => {
                formatContainer.remove();
                showChartOptions();
            });

            const showChartOptions = (): void => {
                this.addBotMessage("Choose a visualization type:");

                const chartContainer = document.createElement("div");
                chartContainer.className = "bi-options-container";

                const chartTypes = [
                    { label: "📊 Bar Chart", value: "bar" },
                    { label: "📈 Line Chart", value: "line" },
                    { label: "🥧 Pie Chart", value: "pie" },
                    { label: "📋 Table", value: "table" },
                    { label: "🔢 KPI Card", value: "kpi" }
                ];

                chartTypes.forEach((chart) => {
                    const button = document.createElement("button");
                    button.innerText = chart.label;
                    button.className = "bi-option-button";
                    button.style.margin = "4px";

                    button.addEventListener("click", () => {
                        chartContainer.remove();
                        void submitQuestion("visualization", chart.value);
                    });

                    chartContainer.appendChild(button);
                });

                this.messagesArea.appendChild(chartContainer);
                this.scrollToBottom();
            };

            const submitQuestion = async (
                responseMode: string,
                chartType: string
            ): Promise<void> => {
                const loadingMessage = this.addBotMessage(
                    responseMode === "text"
                        ? "Preparing your brief answer..."
                        : `Preparing your ${chartType} visualization...`
                );

                textButton.disabled = true;
                visualButton.disabled = true;

                try {
                    const response = await fetch(
                        `${this.BACKEND_URL}/api/ask`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                question,
                                connectionId: this.connectionId,
                                workspaceId: this.selectedWorkspaceId,
                                datasetId: this.selectedDatasetId,
                                responseMode,
                                chartType
                            })
                        }
                    );

                    const data = await response.json();
                    loadingMessage.remove();

                    if (!response.ok || !data.success) {
                        throw new Error(
                            data.error || "Unable to answer the question."
                        );
                    }

                    if (data.answer) {
                        this.addBotMessage(`🤖 ${data.answer}`);
                    }

                    const visualType = String(
                        data.visualization?.visualType || "none"
                    ).toLowerCase();

                    if (
                        responseMode === "visualization" &&
                        visualType !== "none" &&
                        visualType !== "text"
                    ) {
                        const visualizationElement =
                            this.renderAIVisualization(
                                data.visualization,
                                data.data
                            );

                        this.messagesArea.appendChild(visualizationElement);
                    } else if (
                        responseMode === "visualization" &&
                        visualType === "none"
                    ) {
                        this.addBotMessage(
                            "I couldn't create that visualization from the returned data. Try another chart type or choose Brief Text."
                        );
                    }

                    this.scrollToBottom();
                } catch (error) {
                    loadingMessage.remove();

                    this.addBotMessage(
                        `❌ ${error instanceof Error
                            ? error.message
                            : "Unable to process your question."}`
                    );
                } 
                // finally {
                //     textButton.disabled = false;
                //     visualButton.disabled = false;
                // }
                finally {
                    textButton.disabled = false;
                    visualButton.disabled = false;

                    // Move the question input to the bottom
                    // after displaying the AI response.
                    this.messagesArea.appendChild(container);

                    this.scrollToBottom();
                    input.focus();
                }
            };
        };

        sendButton.addEventListener("click", askQuestion);

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                askQuestion();
            }
        });

        mainMenuButton.addEventListener("click", () => {
            this.addUserMessage("⬅ Main Menu");
            this.showMainMenu();
        });

        container.appendChild(input);
        container.appendChild(sendButton);
        container.appendChild(mainMenuButton);

        this.messagesArea.appendChild(container);
        this.scrollToBottom();
        input.focus();
    }

    private renderAIVisualization(
        visualization: any,
        data: any[]
    ): HTMLElement {

        const container = document.createElement("div");

        container.className = "bi-ai-visualization";

        if (
            !visualization ||
            visualization.visualType === "none" ||
            !data ||
            data.length === 0
        ) {
            return container;
        }

        // ==============================
        // TITLE
        // ==============================

        const title = document.createElement("div");

        title.innerText =
            visualization.title || "AI Visualization";

        title.style.fontSize = "15px";
        title.style.fontWeight = "600";
        title.style.marginBottom = "10px";

        container.appendChild(title);


        // ==============================
        // KPI
        // ==============================

        if (visualization.visualType === "kpi") {

            const value = data[0]?.[visualization.valueField];

            const kpi = document.createElement("div");

            kpi.innerText =
                value !== undefined && value !== null
                    ? String(value)
                    : "No data";

            kpi.style.fontSize = "28px";
            kpi.style.fontWeight = "700";
            kpi.style.padding = "18px";
            kpi.style.textAlign = "center";
            kpi.style.borderRadius = "10px";
            kpi.style.background = "#f3f4f6";

            container.appendChild(kpi);

            return container;
        }


        // ==============================
        // TABLE
        // ==============================

        if (visualization.visualType === "table") {

            const table = document.createElement("table");

            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            table.style.fontSize = "12px";

            const headers =
                Object.keys(data[0] || {});

            const headerRow =
                document.createElement("tr");

            headers.forEach((header) => {

                const th =
                    document.createElement("th");

                th.innerText = header;

                th.style.padding = "6px";
                th.style.textAlign = "left";
                th.style.borderBottom =
                    "1px solid #ddd";

                headerRow.appendChild(th);

            });

            table.appendChild(headerRow);


            data.forEach((row) => {

                const tr =
                    document.createElement("tr");

                headers.forEach((header) => {

                    const td =
                        document.createElement("td");

                    td.innerText =
                        row[header] ?? "";

                    td.style.padding = "6px";
                    td.style.borderBottom =
                        "1px solid #eee";

                    tr.appendChild(td);

                });

                table.appendChild(tr);

            });

            container.appendChild(table);

            return container;
        }



        // PIE CHART
        if (visualization.visualType === "pie") {
            const categoryField = visualization.categoryField;
            const valueField = visualization.valueField;

            const total = data.reduce(
                (sum, row) => sum + (Number(row[valueField]) || 0),
                0
            );

            const colors = [
                "#2563eb",
                "#16a34a",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#06b6d4",
                "#f97316",
                "#ec4899"
            ];

            const pie = document.createElement("div");

            pie.style.width = "180px";
            pie.style.height = "180px";
            pie.style.borderRadius = "50%";
            pie.style.margin = "16px auto";

            let currentAngle = 0;

            const segments = data.map((row, index) => {
                const value = Number(row[valueField]) || 0;
                const angle = total > 0 ? (value / total) * 360 : 0;
                const start = currentAngle;
                currentAngle += angle;

                return `${colors[index % colors.length]} ${start}deg ${currentAngle}deg`;
            });

            pie.style.background =
                total > 0
                    ? `conic-gradient(${segments.join(", ")})`
                    : "#e5e7eb";

            container.appendChild(pie);

            const legend = document.createElement("div");
            legend.style.fontSize = "12px";

            data.forEach((row, index) => {
                const item = document.createElement("div");
                item.style.margin = "4px 0";

                const value = Number(row[valueField]) || 0;

                item.innerText =
                    `■ ${row[categoryField]}: ${value.toLocaleString("en-US", {
                        maximumFractionDigits: 2
                    })}`;

                item.style.color = colors[index % colors.length];
                legend.appendChild(item);
            });

            container.appendChild(legend);

            return container;
        }

        // ==============================
        // SIMPLE BAR / LINE CHART
        // ==============================

        // if (
        //     visualization.visualType === "bar" ||
        //     visualization.visualType === "line"
        // ) 



        if (visualization.visualType === "line") {
            const categoryField = visualization.categoryField;
            const valueField = visualization.valueField;

            const validData = data.filter(
                row => Number.isFinite(Number(row[valueField]))
            );

            const chartWidth = 320;
            const chartHeight = 180;
            const padding = 30;

            const values = validData.map(
                row => Number(row[valueField])
            );

            const minValue = Math.min(0, ...values);
            const maxValue = Math.max(1, ...values);
            const range = maxValue - minValue || 1;

            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");

            svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
            svg.setAttribute("width", "100%");
            svg.style.maxWidth = `${chartWidth}px`;
            svg.style.display = "block";
            svg.style.margin = "12px auto";

            const points = validData.map((row, index) => {
                const x = padding +
                    (index * (chartWidth - 2 * padding)) /
                    Math.max(validData.length - 1, 1);

                const y = chartHeight - padding -
                    ((Number(row[valueField]) - minValue) / range) *
                    (chartHeight - 2 * padding);

                return { x, y, row, value: Number(row[valueField]) };
            });

            const line = document.createElementNS(svgNS, "polyline");
            line.setAttribute(
                "points",
                points.map(point => `${point.x},${point.y}`).join(" ")
            );
            line.setAttribute("fill", "none");
            line.setAttribute("stroke", "#2563eb");
            line.setAttribute("stroke-width", "3");
            line.setAttribute("stroke-linejoin", "round");
            line.setAttribute("stroke-linecap", "round");
            svg.appendChild(line);

            points.forEach(point => {
                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttribute("cx", String(point.x));
                circle.setAttribute("cy", String(point.y));
                circle.setAttribute("r", "4");
                circle.setAttribute("fill", "#2563eb");
                svg.appendChild(circle);

                if (visualization.showDataLabels !== false) {
                    const text = document.createElementNS(svgNS, "text");
                    text.setAttribute("x", String(point.x));
                    text.setAttribute("y", String(Math.max(point.y - 8, 12)));
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("font-size", "10");
                    text.setAttribute("fill", "#1f2937");
                    text.textContent = point.value.toLocaleString("en-US", {
                        maximumFractionDigits: 2
                    });
                    svg.appendChild(text);
                }

                const label = document.createElementNS(svgNS, "text");
                label.setAttribute("x", String(point.x));
                label.setAttribute("y", String(chartHeight - 8));
                label.setAttribute("text-anchor", "middle");
                label.setAttribute("font-size", "9");
                label.setAttribute("fill", "#4b5563");
                label.textContent = String(point.row[categoryField] ?? "");
                svg.appendChild(label);
            });

            container.appendChild(svg);

            if (visualization.insight) {
                const insight = document.createElement("div");
                insight.innerText = `💡 ${visualization.insight}`;
                insight.style.marginTop = "10px";
                container.appendChild(insight);
            }

            return container;
        }

        if (visualization.visualType === "bar") {

            const categoryField =
                visualization.categoryField;

            const valueField =
                visualization.valueField;

            const chartWrapper =
                document.createElement("div");

            chartWrapper.style.width = "100%";
            chartWrapper.style.height = "260px";
            chartWrapper.style.position = "relative";
            chartWrapper.style.marginTop = "8px";
            chartWrapper.style.overflowX = "auto";

            const chart =
                document.createElement("div");

            chart.style.display = "flex";
            chart.style.alignItems = "flex-end";
            chart.style.gap = "8px";
            chart.style.height = "210px";
            chart.style.minWidth =
                `${Math.max(data.length * 55, 300)}px`;
            chart.style.padding =
                "10px 10px 35px 10px";
            chart.style.boxSizing =
                "border-box";
            chart.style.borderBottom =
                "1px solid #ccc";


            // Find maximum value

            const values = data.map((row) => {

                const value =
                    Number(row[valueField]);

                return Number.isFinite(value)
                    ? value
                    : 0;

            });

            const maxValue =
                Math.max(...values, 1);


            data.forEach((row, index) => {

                const rawValue =
                    Number(row[valueField]);

                const value =
                    Number.isFinite(rawValue)
                        ? rawValue
                        : 0;

                const category =
                    row[categoryField] ??
                    `Item ${index + 1}`;


                const item =
                    document.createElement("div");

                item.style.flex = "0 0 40px";
                item.style.height = "100%";
                item.style.display = "flex";
                item.style.flexDirection =
                    "column";
                item.style.justifyContent =
                    "flex-end";
                item.style.alignItems =
                    "center";


                // BAR

                const bar =
                    document.createElement("div");

                const height =
                    Math.max(
                        (value / maxValue) * 180,
                        value > 0 ? 4 : 0
                    );

                bar.style.width = "28px";
                bar.style.height =
                    `${height}px`;

                bar.style.background =
                    "#16a34a";

                bar.style.borderRadius =
                    "5px 5px 0 0";

                bar.title =
                    `${category}: ${value.toLocaleString()}`;




                // DATA VALUE LABEL ABOVE THE BAR

                const valueLabel =
                    document.createElement("div");

                valueLabel.innerText =
                    value.toLocaleString("en-US", {
                        maximumFractionDigits: 2
                    });

                valueLabel.style.fontSize = "10px";
                valueLabel.style.fontWeight = "600";
                valueLabel.style.color = "#1f2937";
                valueLabel.style.marginBottom = "3px";
                valueLabel.style.textAlign = "center";
                valueLabel.style.whiteSpace = "nowrap";

                // LABEL

                const label =
                    document.createElement("div");

                label.innerText =
                    String(category);

                label.style.fontSize =
                    "9px";

                label.style.marginTop =
                    "4px";

                label.style.maxWidth =
                    "45px";

                label.style.overflow =
                    "hidden";

                label.style.textOverflow =
                    "ellipsis";

                label.style.whiteSpace =
                    "nowrap";


                item.appendChild(bar);
                item.appendChild(valueLabel);
                item.appendChild(label);

                chart.appendChild(item);

            });


            chartWrapper.appendChild(chart);

            container.appendChild(chartWrapper);


            // ==============================
            // AI INSIGHT
            // ==============================

            if (visualization.insight) {

                const insight =
                    document.createElement("div");

                insight.innerText =
                    `💡 ${visualization.insight}`;

                insight.style.fontSize =
                    "12px";

                insight.style.marginTop =
                    "8px";

                insight.style.padding =
                    "8px";

                insight.style.borderRadius =
                    "6px";

                insight.style.background =
                    "#f0fdf4";

                container.appendChild(insight);

            }

            return container;
        }


        return container;
    }
    // private showOthers(): void {
    //     this.addBotMessage("💬 Please type your question.");

    //     const container = document.createElement("div");
    //     container.className = "bi-message bot";

    //     // Input box for the question
    //     const input = document.createElement("input");
    //     input.type = "text";
    //     input.placeholder = "Type your question here...";
    //     input.style.width = "100%";
    //     input.style.marginTop = "8px";
    //     input.style.padding = "8px";

    //     // Send button
    //     const sendButton = document.createElement("button");
    //     sendButton.innerText = "Send";
    //     sendButton.style.display = "block";
    //     sendButton.style.width = "100%";
    //     sendButton.style.marginTop = "8px";
    //     sendButton.style.padding = "8px";

    //     sendButton.addEventListener("click", async () => {
    //         const question = input.value.trim();
    //         if (!question) return;

    //         this.addUserMessage(question);

    //         try {
    //             const response = await fetch(`${this.BACKEND_URL}/api/ask`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({
    //                     question,
    //                     connectionId: this.connectionId,
    //                     workspaceId: this.selectedWorkspaceId,
    //                     datasetId: this.selectedDatasetId
    //                 })
    //             });

    //             const data = await response.json();
    //             if (data.success) {
    //                 this.addBotMessage(data.answer);
    //             } else {
    //                 this.addBotMessage("⚠️ Error: " + data.error);
    //             }
    //         } catch (error) {
    //             this.addBotMessage("⚠️ Failed to reach backend: " + error.message);
    //         }
    //     });

    //     // Main menu button
    //     const mainMenuButton = document.createElement("button");
    //     mainMenuButton.innerText = "⬅ Main Menu";
    //     mainMenuButton.style.display = "block";
    //     mainMenuButton.style.width = "100%";
    //     mainMenuButton.style.marginTop = "8px";
    //     mainMenuButton.style.padding = "8px";

    //     mainMenuButton.addEventListener("click", () => {
    //         this.addUserMessage("⬅ Main Menu");
    //         this.showMainMenu();
    //     });

    //     // Add everything to the container
    //     container.appendChild(input);
    //     container.appendChild(sendButton);
    //     container.appendChild(mainMenuButton);

    //     this.messagesArea.appendChild(container);
    //     this.scrollToBottom();
    // }


    // =====================================
    // SCROLL TO BOTTOM
    // =====================================

    private scrollToBottom(): void {

        setTimeout(
            () => {

                this.messagesArea.scrollTop =
                    this.messagesArea.scrollHeight;

            },
            50
        );

    }


    // =====================================
    // POWER BI UPDATE
    // =====================================

    public update(
        options: VisualUpdateOptions
    ): void {

        console.log(
            "BI Assistant - Power BI Visual Updated"
        );


        if (
            options.dataViews &&
            options.dataViews.length > 0
        ) {

            this.powerBIData =
                options.dataViews[0];


            console.log(
                "POWER BI DATA:",
                this.powerBIData
            );

        }

    }

}