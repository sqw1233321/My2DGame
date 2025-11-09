import { js } from "cc";
import { _decorator, Component, BaseNode, Constructor } from "cc";

const { ccclass, property } = _decorator;

declare module 'cc' {
    interface BaseNode {
        getComponentSafe: <T extends Component>(
            this: BaseNode,
            typeOrClassName: string | Constructor<T>
        ) => T | null;
    }
}


// 工具函数：根据字符串或类名找到构造函数
function getConstructor<T>(typeOrClassName: string | Constructor<T>): Constructor<T> | null {
    if (typeof typeOrClassName === 'string') {
        return js.getClassByName(typeOrClassName) as Constructor<T> ?? null;
    }
    return typeOrClassName;
}


//拓展方法
@ccclass('ExtensionFunc')
export class ExtensionFunc extends Component {
    protected onLoad(): void {
        this.implementFunc();
    }

    private implementFunc() {
        BaseNode.prototype.getComponentSafe = function <T extends Component>(
            this: BaseNode,
            typeOrClassName: string | Constructor<T>
        ): T | null {
            const ctor = getConstructor(typeOrClassName);
            if (!ctor) {
                console.warn(`[getComponentSafe] 找不到组件类型: ${typeOrClassName}`);
                return null;
            }
            let comp = this.getComponent(ctor);
            if (!comp) {
                this.addComponent(ctor);
            }
            return comp;
        };
    }
}


