import { _decorator, Component, Node } from 'cc';
import Singleton from '../Base/Singleton';
const { ccclass, property } = _decorator;

interface IItem {
    cb: Function;
    ctx: unknown;
}

@ccclass('NetWorkManager')
export class NetWorkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetWorkManager>();
    }

    private _prot = 9876;
    private _wss: WebSocket;
    private _map: Map<string, Array<IItem>> = new Map();

    connect() {
        return new Promise((resolve, reject) => {
            this._wss = new WebSocket(`ws://localhost:${this._prot}`);
            this._wss.onopen = () => {
                resolve(true);
            }
            this._wss.onclose = () => {
                reject(false);
            }
            this._wss.onerror = (e) => {
                console.log(e);
                reject(false);
            }
            this._wss.onmessage = (e) => {
                try {
                    //JSON.parse容易报错，用tryCatch包裹
                    const json = JSON.parse(e.data);
                    const { name, inputDatas } = json;
                    if (this._map.has(name)) {
                        this._map.get(name).forEach((item: IItem) => {
                            item.cb.apply(item.ctx, [inputDatas]);
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    sendMsg(name: string, data) {
        const msg = {
            name,
            data
        }
        this._wss.send(JSON.stringify(msg));
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

