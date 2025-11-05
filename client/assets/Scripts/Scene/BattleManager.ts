import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { PrefabId, PrefabPath } from '../Enum/PrefabEnum';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { ResourceManager } from '../Global/ResourceManager';
import { TexturePath } from '../Enum/TextureEnum';
import { SpriteFrame } from 'cc';
import { WeaponManager } from '../Entity/Weapon/WeaponManager';
import { BulletManager } from '../Entity/Bullet/BulletManager';
import { IBulletState, IClientInput, IExplosionState, ITimePast } from '../Common/State';
import { EventEnum, InputType } from '../Enum';
import EventManager from '../Global/EventManager';
import { ExplosionManager } from '../Entity/Explosion/ExplosionManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    @property(JoyStickManager)
    joyStickManager: JoyStickManager;

    @property(Node)
    stage: Node;

    private _allResLoaded: boolean = false;
    private _actorMap: Map<number, ActorManager> = new Map();
    private _weaponMap: Map<number, WeaponManager> = new Map();
    private _bulletMap: Map<number, BulletManager> = new Map();
    private _explosionMap: Map<number, ExplosionManager> = new Map();

    protected onLoad(): void {
        DataManager.Instance.jm = this.joyStickManager;
        this._allResLoaded = false;
        EventManager.Instance.on(EventEnum.Explosion, this.hasExplosion, this);
        EventManager.Instance.on(EventEnum.ExplosionOver, this.explosionOver, this);
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EventEnum.Explosion, this.hasExplosion, this);
        EventManager.Instance.off(EventEnum.ExplosionOver, this.explosionOver, this);
    }

    protected async start() {
        await this.loadAllRes();
        this.initMap();
        this._allResLoaded = true;
    }

    private async loadAllRes() {
        const promiseList = [];
        PrefabPath.forEach((path, prefabId) => {
            let p = ResourceManager.Instance.loadRes(path, Prefab).then(prefab => {
                DataManager.Instance.getPrefabMap().set(prefabId, prefab);
            })
            promiseList.push(p);
        });
        TexturePath.forEach((path, TextureId) => {
            let p = ResourceManager.Instance.loadDir(path, SpriteFrame).then(spriteFrames => {
                DataManager.Instance.getTextureMap().set(TextureId, spriteFrames);
            })
            promiseList.push(p);
        })
        await Promise.all(promiseList);
    }


    private initMap() {
        const prefab = DataManager.Instance.getPrefabMap().get(PrefabId.Map);
        if (!prefab) return;
        const mapNd = instantiate(prefab);
        mapNd.setParent(this.stage);
    }

    protected update(dt: number): void {
        if (!this._allResLoaded) return;
        this.tick(dt)
        this.render();
    }

    private tick(dt: number) {
        this.tickActor(dt);
        const input: ITimePast = {
            inputType: InputType.TimePast,
            dt: dt,
        }
        DataManager.Instance.applyInput(input);
    }

    private tickActor(dt: number) {
        this._actorMap.forEach((am) => {
            am.tick(dt);
        })
        // this._weaponMap.forEach(wm => {
        //     wm.tick(dt);
        // })
    }

    private render() {
        this.renderActor();
        this.renderWeapon();
        this.renderBullet();
        this.renderExplosion();

    }

    private renderActor() {
        DataManager.Instance.getState().actors.forEach(actor => {
            let am = this._actorMap.get(actor.id);
            if (!am) {
                const actPrefab = DataManager.Instance.getPrefabMap().get(actor.prefabId);
                const actorNd = instantiate(actPrefab);
                am = actorNd.getComponent(ActorManager);
                am.node.setParent(this.stage);
                am.init(actor);
                this._actorMap.set(actor.id, am);
            }
            am.render(actor);
        })
    }

    private renderWeapon() {
        DataManager.Instance.getState().actors.forEach(actor => {
            let wm = this._weaponMap.get(actor.id);
            if (!wm) {
                const prefab = DataManager.Instance.getPrefabMap().get(actor.weapon.prefabId);
                const entityNd = instantiate(prefab);
                wm = entityNd.getComponentSafe(WeaponManager);
                const am = this._actorMap.get(actor.id);
                if (!am) return;
                am.getHandle(entityNd);
                wm.init(actor);
                this._weaponMap.set(actor.id, wm);
            }
            wm.render(actor.weapon);
        })
    }

    private renderBullet() {
        DataManager.Instance.getState().bullets.forEach(bulletState => {
            let bm = this._bulletMap.get(bulletState.bulletId);
            if (!bm) {
                const prefab = DataManager.Instance.getPrefabMap().get(PrefabId.Bullet2);
                const entityNd = instantiate(prefab);
                bm = entityNd.getComponentSafe(BulletManager);
                bm.node.setParent(this.stage);
                bm.init(bulletState);
                this._bulletMap.set(bulletState.bulletId, bm);
            }
            bm.render(bulletState);
        })
    }

    private renderExplosion() {
        DataManager.Instance.getState().explosions.forEach(explosionState => {
            let em = this._explosionMap.get(explosionState.explosionId);
            if (!em) {
                const prefab = DataManager.Instance.getPrefabMap().get(PrefabId.Explosion);
                const entityNd = instantiate(prefab);
                em = entityNd.getComponentSafe(ExplosionManager);
                em.node.setParent(this.stage);
                em.init(explosionState);
                this._explosionMap.set(explosionState.explosionId, em);
                em.render(explosionState);
            }
        })
    }

    private hasExplosion(bullet: IBulletState) {
        this._bulletMap.delete(bullet.bulletId);
    }

    private explosionOver(explosion: IExplosionState) {
        console.log("爆炸结束", explosion.explosionId);
        let explosions = DataManager.Instance.getState().explosions;
        DataManager.Instance.getState().explosions = explosions.filter(explision => explision.explosionId != explosion.explosionId);
        this._explosionMap.delete(explosion.explosionId);
    }
}


