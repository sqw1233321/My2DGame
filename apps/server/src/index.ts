import { WebSocketServer } from "ws";
import { ApiMsgEnum } from "./Common";
import { symlinkCommon } from "./Utils";
symlinkCommon();
const wss = new WebSocketServer({ port: 9876 });

let inputDatas = [];

wss.on("connection", (socket) => {
    socket.on("message", (buffer) => {
        try {
            const msg = JSON.parse(buffer.toString());
            const { name, data } = msg;
            const { input, frameId } = data;
            if (name == ApiMsgEnum.MsgClientSync) {
                inputDatas.push(data);
            }
        } catch (error) {
            console.log(error);
        }
    })
    socket.send("hello,i am server");
    setInterval(() => {
        if (inputDatas.length <= 0) return;
        const temp = inputDatas;
        inputDatas = [];
        const msg = {
            name: ApiMsgEnum.MsgServerSync,
            inputDatas:temp
        }
        socket.send(JSON.stringify(msg));
    }, 100);
})

wss.on("listening", () => {
    console.log("服务启动123123");
})

