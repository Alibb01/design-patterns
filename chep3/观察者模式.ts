/**
 *  观察者模式：
 *  指一个对象(Subject)维持一系统依赖于它的对象(Observer)，当有关状态发生变更时，Subject对象则通知所有的Observer对象来进行其他操作
 *  即： 对象A对于对象B的某一个属性敏感，当B的这个属性发生变化时，A要及时做出相对应的处理，此时A就是观察者Observer， B就是被观察者Subject。
 *  怎么能侦测的到属性变化，通过setter即可砍到目的
 * 
 *  下面以房地产开发完房子后，房产中介和市民购买者的一系列动作来解释观察者。
 *  分析： 
 *      根据上面的概念介绍，可以发定义房地产开发公司开发的房子为被观察者，房产中介和市民购买者为观察者
 *      当开发疝开发完房子时，立即通知中介、市民购买者房子开发完成了
 *      中介接到通知，会在自己的系统内发布通知房源信息，并给自己的意向客户打电话沟通让其购买房子；
 *      市民购买者接到通知，会去银行贷款，更新自己的账户余额用于购买房子
 */

 /**
  * @interface Observer  观察者
  */
 interface Observer {
  listener(params: any): void
}

/**
 * @interface Subject 被观察者
 */
interface Subject {
  // 添加观察者
  registerObserver(observer: Observer): void;
  // 删除观察者
  removeObserver(observer: Observer): void;
  // 发布消息
  notify(): void;
}

/**
 * 中介公司实现观察者
 * @class Intermediary
 * @implements {Observer}
 */
class Intermediary implements Observer {
  // 监听消息，房子是否开发完成
  listener(arg: boolean) {
    if (arg) {
      // 更新房源
      this.updateHose();
      // 打电话通知客户
      this.calling();
    }
  }

  updateHose() {
    console.log(`房子开发完成了，我更新了房源信息!`);
  }

  calling() {
    console.log(`房子开发完成了，你什么时间有空过来，我带你过去买，我这边有优惠...`);
  }

}

/**
 *  市民购买者实现观察者
 * @class Customer
 * @implements {Observer}
 */
class Customer implements Observer {
  // 定义账户余额
  private cost: number = 0;
  // 监听消息，房子是否开发完成
  listener(arg: boolean) {
    if (arg) {
      this.buy();
    }
  }

  // 取钱
  draw() {
    this.cost += 1000000;
  }

  // 购买
  async buy() {
    await this.draw();
    if (this.cost >= 3000000) {
      console.log(`购买了!`);
    } else {
      console.log('买不起！');
      this.buy();
    }
  }
}

/**
 *  房产公司实现被观察者
 * @class RealEstate
 * @implements {Subject}
 */
class RealEstate implements Subject {
  private observers: Observer[] = [];
  private _finished: boolean = false;

  set finished(v: boolean) {
    this._finished = v;
    // 发布通知
    this.notify();
  }

  get finished(): boolean {
    return this._finished;
  }

  registerObserver(observer: Observer): void {
    // 是否已添加，避免重复
    const hasRepeat = this.observers.some(item => item === observer);
    if (!hasRepeat) {
      this.observers.push(observer);
    }
  }
  removeObserver(observer: Observer): void {
    if (this.observers.length > 0) {
      this.observers = this.observers.filter(item => item !== observer);
    }
  }
  notify(): void {
    this.observers.forEach(item => {
      item.listener(this.finished);
    })
  }
}

const intermediary = new Intermediary();
const customer = new Customer();
const realEstate = new RealEstate();

// 添加观察者
realEstate.registerObserver(intermediary);
realEstate.registerObserver(customer);

// 修改监听属性，会触发通知
realEstate.finished = true;
