import { EventEmitter } from "stream";
import { WebSocketServer } from "ws";
import { ApiMsgEnum } from "../Common";

interface IItem {
    cb: Function;
    ctx: unknown;
}


export class Connection extends EventEmitter {
    private _map: Map<string, Array<IItem>> = new Map();

    constructor(private _server: WebSocketServer, private _ws: WebSocket) {
        super();
        this._ws.onclose = () => {
            this.emit("close");
        }
        this._ws.onmessage = ((buffer) => {
            try {
                const msg = JSON.parse(buffer.toString());
                const { name, data } = msg;
                const { input, frameId } = data;
                if (name == ApiMsgEnum.MsgClientSync) {
                    this.emit("addInput", data);
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    sendMsg(msg) {
        this._ws.send(JSON.stringify(msg));
    }

    listenMsg(name, cb: (...params: any) => void, ctx: unknown) {
        if (this._map.has(name)) {
            this._map.get(name).push({ cb, ctx });
        } else {
            this._map.set(name, [{ cb, ctx }]);
        }
    }

    offListenMsg(name, cb: (...params: any) => void, ctx: unknown) {
        if (!this._map.has(name)) return;
        const arr = this._map.get(name).filter(dat => dat.cb != cb || dat.ctx != ctx);
        this._map.set(name, arr);
    }

}