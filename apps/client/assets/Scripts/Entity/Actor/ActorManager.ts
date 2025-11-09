import { _decorator, Node } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { IActorState, IClientInput } from "../../Common/State";
import { EntityStateEnum, EventEnum, InputType } from "../../Enum";
import DataManager from "../../Global/DataManager";
import { rad2Angle } from "../../Utils";
import { ActorStateMachineManager } from "./ActorStateMachineManager";
import { ProgressBar } from "cc";
import EventManager from "../../Global/EventManager";

const { ccclass, property } = _decorator;

//人物对象
@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    @property(Node)
    hand: Node;

    @property(ProgressBar)
    bloodBar: ProgressBar;

    private _handleItem: Node;
    private _actorId: number;

    init(entityState: IActorState): void {
        this._actorId = entityState.id;
        this.fsm = this.node.getComponentSafe(ActorStateMachineManager);
        this.fsm.init(entityState.type);
        this.state = EntityStateEnum.Idle;
    }

    public tick(dt: number): void {
        const isMySelf = DataManager.Instance.isMySelf(this._actorId);
        if (!isMySelf) return;
        const delta = DataManager.Instance.jm.getDelta();
        const hasInput = delta.length() > 0;
        if (hasInput) {
            const { x, y } = delta.normalize();
            const moveInput: IClientInput = {
                inputType: InputType.ActorMove,
                id: this._actorId,
                direct: {
                    x: x,
                    y: y
                },
                dt: dt,
            }
            // DataManager.Instance.applyInput(moveInput);
            EventManager.Instance.emit(EventEnum.ClientSync, moveInput);
            this.state = EntityStateEnum.Run;
        }
        else {
            this.state = EntityStateEnum.Idle;
        }
    }

    public getHandle(handleItem: Node) {
        this._handleItem = handleItem;
        this._handleItem.setParent(this.hand);
    }

    public render(actorState: IActorState) {
        //人物的移动
        this.node.setWorldPosition(actorState.pos.x, actorState.pos.y, 0);
        const direct = actorState.direct;
        const scale = direct.x > 0 ? 1 : -1;
        this.node.setScale(scale, 1);
        //手的转动
        const side = Math.sqrt(direct.x ** 2 + direct.y ** 2);
        const rad = Math.asin(direct.y / side);
        const angle = rad2Angle(rad);
        this.hand.setRotationFromEuler(0, 0, angle);

        this.bloodBar.progress = actorState.hp;
    }

}

