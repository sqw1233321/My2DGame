import { _decorator, Component, Node } from 'cc';
import { EntityStateEnum, StateMachineType } from '../../Enum';
import { Animation } from 'cc';
import { AnimationClip } from 'cc';
import State from '../../Base/State';
import StateMachine, { getInitParamsTrigger } from '../../Base/StateMachine';
const { ccclass, property } = _decorator;

@ccclass('WeaponStateMachineManager')
export class WeaponStateMachineManager extends StateMachine {
    init(type: StateMachineType) {
        this._type = type;
        this._animationComponent = this.node.addComponent(Animation);
        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();
    }

    initParams() {
        this._params.set(EntityStateEnum.Idle, getInitParamsTrigger());
        this._params.set(EntityStateEnum.Attack, getInitParamsTrigger());
    }

    initStateMachines() {
        this._stateMachines.set(EntityStateEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Normal));
        this._stateMachines.set(EntityStateEnum.Attack, new State(this, `${this._type}${EntityStateEnum.Attack}`, AnimationClip.WrapMode.Normal));
    }


    initAnimationEvent() {
        this._animationComponent.on(Animation.EventType.FINISHED, () => {
            this._finishCb?.();
        });
    }

    run() {
        switch (this.currentState) {
            case this._stateMachines.get(EntityStateEnum.Idle):
            case this._stateMachines.get(EntityStateEnum.Attack):
                if (this._params.get(EntityStateEnum.Attack).value) {
                    this.currentState = this._stateMachines.get(EntityStateEnum.Attack);
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

