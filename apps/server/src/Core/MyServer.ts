import { WebSocketServer } from "ws";
import { Connection } from "./Connection";
import { ApiMsgEnum } from "../Common";

export class MyServer {
    private _port: number;
    private _wss: WebSocketServer;

    private _connectionSets: Set<Connection> = new Set();

    private _inputDats = [];

    constructor({ port }: { port: number }) {
        this._port = port;
    }

    start() {
        return new Promise((resolve, reject) => {
            this._wss = new WebSocketServer({
                port: this._port,
            })
            this._wss.on("listening", () => {
                resolve(true);
            })
            this._wss.on("close", () => {
                reject(false);
            })
            this._wss.on("error", (e) => {
                reject(e);
            })
            this._wss.on("connection", (ws: WebSocket) => {
                const connection = new Connection(this._wss, ws);
                this._connectionSets.add(connection);
                console.log("来人了 ", this._connectionSets.size);
                connection.on("close", () => {
                    this._connectionSets.delete(connection);
                    console.log("走人了", this._connectionSets.size);
                })
                connection.on("addInput", (data) => {
                    console.log("data is", data);
                    this._inputDats.push(data);
                })
            })
            this.setInter();
        })
    }

    setInter() {
        setInterval(() => {
            if (this._inputDats.length <= 0) return;
            const temp = this._inputDats;
            this._inputDats = [];
            const msg = {
                name: ApiMsgEnum.MsgServerSync,
                inputDatas: temp
            }
            this._connectionSets.forEach((connection) => {
                connection.sendMsg(JSON.stringify(msg))
            })
        }, 100);
    }

}