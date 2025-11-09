import { _decorator, Component, Node } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { IBulletState, IClientInput, IExplosion } from '../../Common/State';
import { rad2Angle } from '../../Utils';
import { v3 } from 'cc';
import { EventEnum, EntityStateEnum, InputType } from '../../Enum';
import DataManager from '../../Global/DataManager';
import EventManager from '../../Global/EventManager';
import { PrefabId } from '../../Enum/PrefabEnum';
import { instantiate } from 'cc';
import { ExplosionManager } from '../Explosion/ExplosionManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    private _bulletId: number = 0;

    init(entityState: IBulletState): void {
        this._bulletId = entityState.bulletId;
        EventManager.Instance.on(EventEnum.Explosion, this.handleExplosion, this);
    }

    public render(entityState: IBulletState) {
        this.node.setWorldPosition(entityState.pos.x, entityState.pos.y, 0);
        const direct = entityState.direct;
        const side = Math.sqrt(direct.x ** 2 + direct.y ** 2);
        const rad = direct.x > 0 ? Math.asin(direct.y / side) : Math.asin(-direct.y / side) + Math.PI;
        const angel = rad2Angle(rad);
        this.node.setRotationFromEuler(0, 0, angel);
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EventEnum.Explosion, this.handleExplosion, this);
    }


    handleExplosion(bullet: IBulletState) {
        if (bullet.bulletId != this._bulletId) return;
        const pos = this.node.getWorldPosition()
        const input: IExplosion = {
            inputType: InputType.Explosion,
            bulletId: this._bulletId,
            pos: { x: pos.x, y: pos.y }
        }
        DataManager.Instance.applyInput(input);
        this.node.destroy();
    }
}

