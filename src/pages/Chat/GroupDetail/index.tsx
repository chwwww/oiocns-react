import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Row, Typography, message } from 'antd';
import React, { useState } from 'react';
import HeadImg from '@/components/headImg/headImg';
import detailStyle from './index.module.less';
import chatCtrl from '@/ts/controller/chat';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import InviteMembers from '@/components/InviteMembers';
import RemoveMember from '@/components/RemoveMember';
import { schema } from '@/ts/base';
import userCtrl from '@/ts/controller/setting/userCtrl';

/**
 * @description:  个人、群聊详情
 * @return {*}
 */

const Groupdetail = () => {
  const [key, forceUpdate] = useCtrlUpdate(chatCtrl); // 刷新页面
  const [open, setOpen] = useState<boolean>(false); // 邀请弹窗开关
  const [removeOpen, setRemoveOpen] = useState<boolean>(false); // 移出弹窗开关
  const [selectPerson, setSelectPerson] = useState<schema.XTarget[]>([]); // 需要邀请的部门成员
  const [removePerosn, setRemovePerosn] = useState<any>();

  /**
   * @description: 邀请确认
   * @return {*}
   */
  const onOk = async () => {
    if (selectPerson && userCtrl.user) {
      let ids: string[] = [];
      selectPerson.forEach((item) => {
        ids.push(item?.id);
      });
      const success = await userCtrl.user.pullMembers(ids, selectPerson[0].typeName);
      if (success) {
        message.success('添加成功');
        userCtrl.changCallback();
      } else {
        message.error('添加失败');
      }
    }
    setOpen(false);
  };

  /**
   * @description: 移除确认
   * @return {*}
   */
  const onRemoveOk = async () => {
    setRemoveOpen(false);
    if (selectPerson && userCtrl.user) {
      let ids: string[] = [];
      selectPerson.forEach((item) => {
        ids.push(item?.id);
      });
      const success = await userCtrl.user.removeMembers(ids, selectPerson[0].typeName);
      if (success) {
        message.success('移除成功');
        userCtrl.changCallback();
      } else {
        message.error('移除失败');
      }
    }
  };

  /**
   * @description: 取消
   * @return {*}
   */
  const onCancel = () => {
    setOpen(false);
    setRemoveOpen(false);
  };
  /**
   * @description: 头像
   * @return {*}
   */
  const heads = (
    <Row style={{ paddingBottom: '12px' }}>
      <Col span={4}>
        <HeadImg name={chatCtrl.chat?.target.name} label={''} imgWidth={38} />
      </Col>
      <Col span={20}>
        <h4 className={detailStyle.title}>
          {chatCtrl.chat?.target.name}
          {chatCtrl.chat?.target.typeName !== '人员' ? (
            <span className={detailStyle.number}>({chatCtrl.chat?.personCount})</span>
          ) : (
            ''
          )}
        </h4>
        <div className={detailStyle.base_info_desc}>{chatCtrl.chat?.target.remark}</div>
      </Col>
    </Row>
  );

  /**
   * @description: 群组成员
   * @return {*}
   */
  const grouppeoples = (
    <>
      {chatCtrl.chat?.persons.map((item: any) => {
        return (
          <div key={item.id} title={item.name} className={detailStyle.show_persons}>
            <HeadImg name={item.name} label={''} />
            <Typography className={detailStyle.img_list_con_name}>{item.name}</Typography>
          </div>
        );
      })}
      {chatCtrl.chat?.target.typeName === '群组' ? (
        <>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setOpen(true);
              setRemovePerosn(undefined);
            }}>
            +
          </div>
          <div
            className={`${detailStyle.img_list_con} ${detailStyle.img_list_add}`}
            onClick={() => {
              setRemoveOpen(true);
              setRemovePerosn(chatCtrl.chat?.persons);
            }}>
            -
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );

  return (
    <>
      <div id={key} className={detailStyle.group_detail_wrap}>
        {heads}
        <div className={detailStyle.user_list}>
          <div className={`${detailStyle.img_list} ${detailStyle.con}`}>
            {grouppeoples}
            {chatCtrl.chat?.personCount ?? 0 > 1 ? (
              <span
                className={`${detailStyle.img_list} ${detailStyle.more_btn}`}
                onClick={async () => {
                  await chatCtrl.chat?.morePerson('');
                  forceUpdate();
                }}>
                查看更多
                <span className={detailStyle.more_btn_icon}>
                  <DownOutlined />
                </span>
              </span>
            ) : (
              ''
            )}
          </div>
          {chatCtrl.chat?.target.typeName === '群组' ? (
            <>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊名称</span>
                <span className={detailStyle.con_value}>
                  {chatCtrl.chat?.target.remark}
                </span>
              </div>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>群聊描述</span>
                <span className={detailStyle.con_value}>
                  {chatCtrl.chat?.target.remark}
                </span>
              </div>
              <div className={`${detailStyle.con} ${detailStyle.setting_con} `}>
                <span className={detailStyle.con_label}>我在本群的昵称</span>
                <span className={detailStyle.con_value}>测试昵称</span>
              </div>
            </>
          ) : (
            ''
          )}
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>消息免打扰</span>
            <Checkbox />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>
              {chatCtrl.chat?.target.typeName !== '人员' ? '置顶群聊' : '置顶聊天'}
            </span>
            <Checkbox />
          </div>
          <div className={`${detailStyle.con} ${detailStyle.check_con}`}>
            <span>查找聊天记录</span>
            <RightOutlined />
          </div>
        </div>
        {chatCtrl.chat?.spaceId === chatCtrl.userId ? (
          <div className={`${detailStyle.footer} `}>
            <Button
              block
              type="primary"
              size={'large'}
              onClick={async () => {
                if (await chatCtrl.chat?.clearMessage()) {
                  chatCtrl.changCallback();
                }
              }}>
              清空聊天记录
            </Button>
            {chatCtrl.chat?.target.typeName === '群组' ? (
              <>
                <Button type="primary" danger size={'large'} block>
                  退出该群
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" danger size={'large'} block>
                  删除好友
                </Button>
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      {/* 邀请成员 */}
      <InviteMembers
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        title="邀请成员"
        setSelectPerson={setSelectPerson}
      />
      <RemoveMember
        title="移出成员"
        open={removeOpen}
        onOk={onRemoveOk}
        onCancel={onCancel}
        setSelectPerson={setSelectPerson}
        personData={removePerosn}
      />
    </>
  );
};
export default Groupdetail;
