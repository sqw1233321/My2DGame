import { _decorator, Component, Node } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { IActorState, IClientInput, IWeaponState } from '../../Common/State';
import { EntityStateEnum, EventEnum, InputType } from '../../Enum';
import DataManager from '../../Global/DataManager';
import { WeaponStateMachineManager } from './WeaponStateMachineManager';
import EventManager from '../../Global/EventManager';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager {
    @property(Node)
    anchorNd: Node;

    @property(Node)
    pointNd: Node;

    private _ownerId: number;

    init(entityState: IActorState): void {
        const weapon = entityState.weapon;
        this._ownerId = entityState.id;
        this.fsm = this.node.getComponentInChildren(WeaponStateMachineManager);
        this.fsm.init(weapon.type);
        this.fsm.setfinishCb(() => {
            if (this.state == EntityStateEnum.Attack) this.state = EntityStateEnum.Idle;
        })
        this.state = EntityStateEnum.Idle;
        EventManager.Instance.on(EventEnum.Shoot, this.handleShoot, this);
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EventEnum.Shoot, this.handleShoot, this);
    }

    public render(entityState: IWeaponState) {

    }

    handleShoot() {
        const isMyself = DataManager.Instance.isMySelf(this._ownerId);
        if (!isMyself) return;
        if (this.state == EntityStateEnum.Attack) return;
        const start = this.anchorNd.getWorldPosition();
        const end = this.pointNd.getWorldPosition();
        const direct = v3(end.x - start.x, end.y - start.y, 0).normalize();
        const input: IClientInput = {
            inputType: InputType.Shoot,
            id: this._ownerId,
            direct: direct,
            pos: {
                x: end.x,
                y: end.y
            }
        }
        DataManager.Instance.applyInput(input);
        this.state = EntityStateEnum.Attack;
    }


}

