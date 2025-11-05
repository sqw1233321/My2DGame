import { v3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { IActorState, IWeaponState, IClientInput, Ivec2, IExplosionState } from '../../Common/State';
import { EntityStateEnum, EventEnum, InputType, StateMachineType } from '../../Enum';
import DataManager from '../../Global/DataManager';
import EventManager from '../../Global/EventManager';
import { WeaponStateMachineManager } from '../Weapon/WeaponStateMachineManager';
import { ExplosionStateMachineManager } from './ExplosionStateMachineManager';
const { ccclass, property } = _decorator;

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager {
    init(explosionState: IExplosionState): void {
        this.fsm = this.node.getComponent(ExplosionStateMachineManager);
        this.fsm.init(StateMachineType.Explosion);
        this.fsm.setfinishCb(() => {
            EventManager.Instance.emit(EventEnum.ExplosionOver, explosionState);
            this.node.destroy();
        })
        this.state = EntityStateEnum.Idle;
    }

    public render(explosionState: IExplosionState) {
        const pos = explosionState.pos;
        this.node.setWorldPosition(pos.x, pos.y, 0);
    }
}

