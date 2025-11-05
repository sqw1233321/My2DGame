import { _decorator, AnimationClip,Animation } from "cc";
import State from "../../Base/State";
import StateMachine, { getInitParamsTrigger } from "../../Base/StateMachine";
import { StateMachineType, EntityStateEnum } from "../../Enum";

const { ccclass, property } = _decorator;

@ccclass('ActorStateMachineManager')
export class ActorStateMachineManager extends StateMachine {
    init(type: StateMachineType) {
        this._type = type;
        this._animationComponent = this.node.addComponent(Animation);
        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();
    }

    initParams() {
        this._params.set(EntityStateEnum.Idle, getInitParamsTrigger());
        this._params.set(EntityStateEnum.Run, getInitParamsTrigger());
    }

    initStateMachines() {
        this._stateMachines.set(EntityStateEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Loop));
        this._stateMachines.set(EntityStateEnum.Run, new State(this, `${this._type}${EntityStateEnum.Run}`, AnimationClip.WrapMode.Loop));
    }

    initAnimationEvent() { }

    run() {
        switch (this.currentState) {
            case this._stateMachines.get(EntityStateEnum.Idle):
            case this._stateMachines.get(EntityStateEnum.Run):
                if (this._params.get(EntityStateEnum.Run).value) {
                    this.currentState = this._stateMachines.get(EntityStateEnum.Run);
                } else if (this._params.get(EntityStateEnum.Idle).value) {
                    this.currentState = this._stateMachines.get(EntityStateEnum.Idle);
                } else {
                    this.currentState = this.currentState;
                }
                break;
            default:
                this.currentState = this._stateMachines.get(EntityStateEnum.Idle);
                break;
        }
    }
}

