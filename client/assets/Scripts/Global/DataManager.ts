import { Prefab } from "cc";
import Singleton from "../Base/Singleton";
import { EventEnum, InputType, StateMachineType } from "../Enum";
import { IClientInput, IState, IBulletState, IActorMove, IShoot, ITimePast, IExplosion, IExplosionState } from "../Common/State";
import { JoyStickManager } from "../UI/JoyStickManager";
import { PrefabId } from "../Enum/PrefabEnum";
import { SpriteFrame } from "cc";
import EventManager from "./EventManager";

const Actor_Speed = 100;
const Bullet_Speed = 600;
const MAP_WIDTH = 960;
const MAP_HEIGHT = 640;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  public jm: JoyStickManager;

  public _myPlayerID: number;

  private _inputState: IState = {
    actors: [
      {
        type: StateMachineType.Actor1,
        prefabId: PrefabId.Actor1,
        id: 1,
        pos: {
          x: 0,
          y: 0
        },
        direct: {
          x: 1,
          y: 0
        },
        weapon: {
          prefabId: PrefabId.Weapon1,
          type: StateMachineType.Weapon1,
        }
      },
      {
        type: StateMachineType.Actor2,
        prefabId: PrefabId.Actor2,
        id: 2,
        pos: {
          x: 200,
          y: 200
        },
        direct: {
          x: 1,
          y: 0
        },
        weapon: {
          prefabId: PrefabId.Weapon2,
          type: StateMachineType.Weapon2,
        }
      }
    ],
    bullets: [],
    explosions: [],
    nextBulletId: 0,
    nextExplosionId: 0,
  }

  private _prefabMap: Map<PrefabId, Prefab> = new Map();
  private _textureMap: Map<string, SpriteFrame[]> = new Map();

  constructor() {
    super();
    this._myPlayerID = 1;
  }


  public applyInput(input: IClientInput) {
    switch (input.inputType) {
      case InputType.ActorMove:
        this.updateActorState(input as IActorMove);
        break;
      case InputType.Shoot:
        this.updateBulletState(input as IShoot);
        break;
      case InputType.TimePast:
        this.updateTimePast(input as ITimePast);
        break;
      case InputType.Explosion:
        this.updateExplosion(input as IExplosion);
        break;
    }
  }

  //更新角色的状态
  private updateActorState(input: IActorMove) {
    const actors = this._inputState.actors;
    const stateInfo = actors.find(actor => actor.id == input.id);
    if (!stateInfo) actors.push(
      {
        type: StateMachineType.Actor1,
        prefabId: PrefabId.Actor1,
        id: input.id,
        pos: {
          x: 0,
          y: 0
        },
        direct: {
          x: 1,
          y: 0
        },
        weapon: {
          prefabId:PrefabId.Weapon1,
          type: StateMachineType.Weapon1,
        }
      }
    )
    stateInfo.direct = input.direct;
    stateInfo.pos.x += input.direct.x * Actor_Speed * input.dt;
    stateInfo.pos.y += input.direct.y * Actor_Speed * input.dt;
  }

  //更新子弹的状态
  private updateBulletState(input: IShoot) {
    const stateInfo: IBulletState = {
      ownerId: input.id,
      bulletId: this._inputState.nextBulletId++,
      pos: input.pos,
      direct: input.direct
    }
    this._inputState.bullets.push(stateInfo);
  }

  private updateTimePast(input: ITimePast) {
    let bullets = this._inputState.bullets;
    bullets?.forEach((bullet, index) => {
      bullet.pos.x += bullet.direct.x * input.dt * Bullet_Speed;
      bullet.pos.y += bullet.direct.y * input.dt * Bullet_Speed;
    })
    this._inputState.bullets = bullets.filter(bullet => {
      if (bullet.pos.x < 0 || bullet.pos.x > MAP_WIDTH || bullet.pos.y < 0 || bullet.pos.y > MAP_HEIGHT) {
        EventManager.Instance.emit(EventEnum.Explosion, bullet);
        return false;
      }
      return true;
    })
  }

  private updateExplosion(input: IExplosion) {
    const explosions = this._inputState.explosions;
    const stateInfo: IExplosionState = {
      explosionId: this._inputState.nextExplosionId++,
      bulletId: input.bulletId,
      pos: input.pos
    }
    explosions.push(stateInfo);
  }



  public getState() {
    return this._inputState;
  }

  public getPrefabMap() {
    return this._prefabMap;
  }

  public getTextureMap() {
    return this._textureMap;
  }

  public isMySelf(actorId: number) {
    return this._myPlayerID == actorId;
  }

}
