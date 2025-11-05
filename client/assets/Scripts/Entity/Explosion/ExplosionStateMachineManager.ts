import { _decorator, Component, Node } from 'cc';
import StateMachine, { getInitParamsTrigger } from '../../Base/StateMachine';
import State from '../../Base/State';
import { StateMachineType, EntityStateEnum } from '../../Enum';
import { AnimationClip } from 'cc';
import { Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExplosionStateMachineManager')
export class ExplosionStateMachineManager extends StateMachine {
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
        this._stateMachines.set(EntityStateEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Normal));
    }

    initAnimationEvent() {
        this._animationComponent.on(Animation.EventType.FINISHED, () => {
            this._finishCb?.();
        })
    }

    run() {
        this.currentState = this._stateMachines.get(EntityStateEnum.Idle);
    }
}

