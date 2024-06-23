"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installing = void 0;
const https = require("https");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const Installing = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const nodeJsUrl = "https://nodejs.org/dist/v16.15.1/node-v16.15.1-x64.msi";
    const fileName = path.basename(nodeJsUrl);
    const file = fs.createWriteStream(fileName);
    event.reply("reply-from-main", {
        type: "add",
        message: "Download Node.js (Ver : v16.15.1)\n",
    });
    const req = https.request(nodeJsUrl, {}, (res) => {
        res.pipe(file);
        const maxLength = parseInt(res.headers["content-length"]);
        let data;
        res.on("data", (chk) => {
            data += chk;
            event.reply("reply-from-main", {
                type: "change",
                message: "Downloading... " + (Math.floor((data.length / maxLength) * 100)).toString() + "%",
            });
        });
        res.on("end", () => {
            event.reply("reply-from-main", {
                type: "change",
                message: "Downloading... 100%",
            });
            event.reply("reply-from-main", {
                type: "add",
                message: "Save.",
            });
            event.reply("reply-from-main", {
                type: "add",
                message: "Node.js Download Complete!",
            });
            installNodeJs();
        });
    });
    req.end();
    const installNodeJs = () => {
        (0, child_process_1.exec)(fileName, (error) => {
            /*
            if (error) {
                event.reply("reply-from-main", {
                    type: "add",
                    message: ".... Node.js Install Falide.",
                });
            }
            else {
            */
            event.reply("reply-from-main", {
                type: "add",
                message: ".... Node.js Install Exit.",
            });
            minuetNpmInstall();
            // }
        });
    };
    const minuetNpmInstall = () => {
        const installJson = {
            description: "minuet desktop installed.",
            repository: "git*https://github.com/masatonakatsuji2021/minuet-server.git",
            license: "MIT",
        };
        fs.writeFileSync("/minuet/package.json", JSON.stringify(installJson, null, "  "));
        event.reply("reply-from-main", {
            type: "add",
            message: "Minuet NPM Package Install.",
        });
        let status = true;
        const child = (0, child_process_1.exec)("cd /minuet && npm i git+https://github.com/masatonakatsuji2021/minuet-server.git");
        child.stdout.on('data', (data) => {
            event.reply("reply-from-main", {
                type: "add",
                message: data.toString().trim(),
            });
        });
        child.stderr.on("data", (err) => {
            if (err.toString().indexOf("You should commit this file.") === -1) {
                status = false;
            }
            event.reply("reply-from-main", {
                type: "add",
                message: err.toString(),
            });
        });
        child.stdout.on("end", () => {
            let type = "complete";
            let message = "Complete!";
            if (!status) {
                type = "error";
                message = "Failed!";
            }
            event.reply("reply-from-main", {
                type: type,
                message: "......Install " + message,
            });
        });
    };
});
exports.Installing = Installing;
