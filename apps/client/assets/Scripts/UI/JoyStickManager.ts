import { _decorator, Component, EventTouch, input, Input, Node, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStickManager')
export class JoyStickManager extends Component {
    @property(Node)
    joyStickNd: Node;

    @property(Node)
    joysTickBase: Node;

    @property(Node)
    touchNd: Node;

    private _defaultPos: Vec3;
    private _deltaPos: Vec3;
    private _radius: number;

    onLoad() {
        this._defaultPos = this.joyStickNd.getPosition().clone();
        this._deltaPos = v3(0, 0, 0);
        this._radius = this.joysTickBase.getComponent(UITransform).width / 2;
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const targetPos = event.getUILocation();
        let pos = this.joyStickNd.getPosition();
        pos.set(targetPos.x, targetPos.y, 0)
        this.joyStickNd.setPosition(pos);
    }

    onTouchMove(event: EventTouch) {
        const targetPos = event.getUILocation();
        const basePos = this.joyStickNd.getPosition();
        let deltaPos = this._deltaPos;
        deltaPos.set(targetPos.x - basePos.x, targetPos.y - basePos.y, 0);
        const disTance = Vec3.distance(deltaPos, Vec3.ZERO);
        if (disTance > this._radius) {
            const ratio = this._radius / disTance;
            deltaPos = deltaPos.multiplyScalar(ratio);
        }
        this.touchNd.setPosition(deltaPos);
    }

    onTouchEnd() {
        let pos = this.joyStickNd.getPosition();
        pos.set(this._defaultPos.x, this._defaultPos.y, 0);
        this.joyStickNd.setPosition(pos);
        this.touchNd.setPosition(0, 0, 0);
        this._deltaPos.set(0, 0, 0);
    }

    public getDelta() {
        return this._deltaPos;
    }
}

