import { common } from '../../base';
import { CommonStatus, TargetType } from '../../core/enum';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

export class OrgTodo implements ITodoGroup {
  private _name: string;
  private _todoList: ApprovalItem[];
  private _doList: ApprovalItem[];
  private _applyList: ApplyItem[];
  private _targetTypes: TargetType[];
  get type(): string {
    return '组织待办';
  }
  get name(): string {
    return this._name;
  }
  constructor(name: string, targetTypes: TargetType[]) {
    this._name = name;
    this._targetTypes = targetTypes;
  }
  async getCount(): Promise<number> {
    if (this._todoList.length <= 0) {
      await this.getTodoList();
    }
    return this._todoList.length;
  }
  async getTodoList(): Promise<IApprovalItem[]> {
    if (this._todoList.length > 0) {
      return this._todoList;
    }
    await this.getApprovalList();
    return this._todoList;
  }
  async getNoticeList(): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItem[]> {
    if (this._doList.length > 0) {
      return this._doList;
    }
    await this.getApprovalList();
    return this._doList;
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItem[]> {
    if (this._applyList.length > 0) {
      return this._applyList;
    }
    const res = await kernel.queryJoinTeamApply({
      id: '0',
      //   typeNames:this._targetTypes;
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this._applyList.push(
          new ApplyItem(a, (q) => {
            this._applyList = this._applyList.filter((s) => {
              return s.Data.id != q.id;
            });
          }),
        );
      });
    }
    return this._applyList;
  }
  private async getApprovalList() {
    const res = await kernel.queryTeamJoinApproval({
      id: '0',
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      // 同意回调
      let passfun = (s: schema.XRelation) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != s.id;
        });
      };
      // 已办中再次同意回调
      let rePassfun = (s: schema.XRelation) => {
        this._doList = this._doList.filter((q) => {
          return q.Data.id != s.id;
        });
      };
      // 拒绝回调
      let rejectfun = (s) => {
        this._doList.unshift(new ApprovalItem(s, rePassfun, (s) => {}));
      };
      let reRejectfun = (s) => {};
      res.data.result?.forEach((a) => {
        if (a.status >= CommonStatus.RejectStartStatus) {
          this._doList.push(new ApprovalItem(a, rePassfun, reRejectfun));
        } else {
          this._todoList.push(new ApprovalItem(a, passfun, rejectfun));
        }
      });
    }
  }
}

class ApprovalItem implements IApprovalItem {
  private _data: schema.XRelation;
  private _passCall: (data: schema.XRelation) => void;
  private _rejectCall: (data: schema.XRelation) => void;
  constructor(
    data: schema.XRelation,
    passCall: (data: schema.XRelation) => void,
    rejectCall: (data: schema.XRelation) => void,
  ) {
    this._data = data;
    this._passCall = passCall;
    this._rejectCall = rejectCall;
  }
  get Data(): schema.XRelation {
    return this._data;
  }
  async pass(status: number, remark: string = ''): Promise<model.ResultType<any>> {
    const res = await kernel.joinTeamApproval({ id: this._data.id, status });
    if (res.success) {
      this._passCall.apply(this, [this._data]);
    }
    return res;
  }
  async reject(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.joinTeamApproval({ id: this._data.id, status });
    if (res.success) {
      this._rejectCall.apply(this, [this._data]);
    }
    return res;
  }
}

class ApplyItem implements IApplyItem {
  private _data: schema.XRelation;
  private _cancelFun: (s: schema.XRelation) => void;
  constructor(data: schema.XRelation, cancelFun: (s: schema.XRelation) => void) {
    this._data = data;
    this._cancelFun = cancelFun;
  }
  get Data(): schema.XRelation {
    return this._data;
  }
  async cancel(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.cancelJoinTeam({
      id: this._data.id,
      typeName: '',
      belongId: '0',
    });
    if (res.success) {
      this._cancelFun.apply(this, this._data);
    }
    return res;
  }
}
