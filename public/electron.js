const { app, BrowserWindow, screen } = require("electron");
const { spawn, exec } = require("child_process");
const psTree = require("ps-tree");
const path = require("path");
const waitOn = require("wait-on");
const chalk = require("chalk");
const log = require("electron-log");

app.commandLine.appendSwitch("enable-features", "WaylandWindowDecorations");
app.commandLine.appendSwitch("ozone-platform-hint", "auto");
app.disableHardwareAcceleration();

console.log = log.log;
log.transports.file.level = "debug";

let frontend, backend, dynamo;
let lastChildPid;
let mainWindow, loadingScreen;

function createLoadingScreen() {
  loadingScreen = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    icon: path.join(
      __dirname,
      process.platform === "win32" ? "lock.ico" : "lock.png",
    ),
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    parent: mainWindow, // Set the parent to mainWindow
  });

  const loadingPath = path.join(__dirname, "loading.html");
  console.log("Loading screen path:", loadingPath);
  loadingScreen.loadFile(loadingPath);
  loadingScreen.center();
  loadingScreen.on("closed", () => (loadingScreen = null));
  loadingScreen.show();
}

function initializeApp() {
  console.log("Initializing app...");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(
      __dirname,
      process.platform === "win32" ? "lock.ico" : "lock.png",
    ),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1.0,
    },
    show: false,
  });

  createLoadingScreen();

  const args = process.argv.slice(2);
  const startGo = args.includes("true");

  console.log(`Starting up`);

  if (process.platform === "win32") {
    if (startGo) {
      console.log(chalk.green("Starting go server"));
      backend = spawn("npm", ["run", "start-go"], { shell: true });
      backend.stdout.on("data", (data) => {
        console.log(chalk.green(`[Backend]: ${data}`));
      });
    } else {
      console.log(chalk.red("Not starting go server"));
      console.log(
        chalk.red(
          "Please start go uvicorn manually with npm run start-uvicorn",
        ),
      );
      console.log(chalk.red("Starting dynamo"));
      dynamo = spawn("npm", ["run", "start-dynamo"], { shell: true });
      dynamo.stdout.on("data", (data) => {
        console.log(chalk.green(`[DynamoDB]: ${data}`));
      });
    }
  }

  frontend = spawn("npm", ["run", "start"], { shell: true, env: process.env });

  console.log(`Started Node.js process with PID: ${frontend.pid}`);

  frontend.stdout.on("data", (data) => {
    console.log(chalk.blue(`[Frontend]: ${data.toString()}`));
  });

  console.log("App started!");

  screen.on("display-metrics-changed", () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow.setSize(width, height);
  });

  console.log("Starting the server...");

  waitOn({ resources: ["http://localhost:3000"] }, (err) => {
    if (err) {
      console.error("Error waiting for the server:", err);
      return;
    }

    console.log("Server ready!");

    mainWindow.loadURL("http://localhost:3000");

    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.insertCSS(`
        body {
          overflow: hidden;
        }
      `);
    });

    mainWindow.once("ready-to-show", () => {
      if (loadingScreen) {
        loadingScreen.close();
      }
      mainWindow.setTitle("Rhythm Routes");
      mainWindow.maximize();
      mainWindow.show();
      if (process.platform === "win32") {
        psTree(frontend.pid, (err, children) => {
          if (err) {
            console.error(`Failed to get child processes: ${err}`);
          } else {
            console.log("Child processes:", children);
            lastChildPid = children[children.length - 1].PID;
            console.log(`Last child PID: ${lastChildPid}`);
          }
        });
      }
      console.log("Ready!");
    });
  });

  mainWindow.on("uncaughtException", (error) => {
    log.error("Uncaught Exception:", error);
  });

  mainWindow.on("unhandledRejection", (error) => {
    log.error("Unhandled Rejection:", error);
  });

  mainWindow.webContents.on("crashed", (event) => {
    console.error("Renderer process crashed:", event);
  });

  mainWindow.on("unresponsive", () => {
    console.error("Window became unresponsive");
  });
}

app.whenReady().then(initializeApp);

app.on("before-quit", () => {
  console.log("App is quitting...");
  if (process.platform === "win32") {
    exec(`taskkill /PID ${lastChildPid} /T /F`, (err) => {
      if (err) {
        console.error(`Failed to kill process ${lastChildPid}: ${err}`);
      } else {
        console.log(`Successfully killed process ${lastChildPid}`);
      }
    });
  } else {
    exec(`kill -9 ${frontend.pid}`, (err) => {
      if (err) {
        console.error(`Failed to kill process ${frontend.pid}: ${err}`);
      } else {
        console.log(`Successfully killed process ${frontend.pid}`);
      }
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("Quitting app");
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initializeApp();
  }
});

process.on("uncaughtException", (error) => {
  log.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (error) => {
  log.error("Unhandled rejection:", error);
});
