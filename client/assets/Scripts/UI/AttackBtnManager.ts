import { EventHandler } from 'cc';
import { _decorator, Component, Node } from 'cc';
import EventManager from '../Global/EventManager';
import { EventEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('AttackBtnManager')
export class AttackBtnManager extends Component {
    public onClickAttack() {
        EventManager.Instance.emit(EventEnum.Shoot);
    }
}

