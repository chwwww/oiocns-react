import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import personService from '@/module/org/person';

import cls from './index.module.less';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Person } from '@/module/org';
import { PageData } from '@/module/typings';
import Title from 'antd/lib/typography/Title';
import { Button, Col, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchPerson from '@/bizcomponents/SearchPerson';
import { ColumnsType } from 'antd/lib/table';
import PersonInfoCard from '@/bizcomponents/PersonInfoCard';
import { schema } from '../../../ts/base';
import PersonInfoEnty from '../../../ts/core/provider';
import friendController from '../../../ts/controller/friend/index';
interface OperationType {
  key: string;
  label: string;
  onClick: () => void;
}
const columns: ColumnsType<Person> = [
  {
    title: '好友名称',
    dataIndex: 'team.name',
    key: 'name',
    render: (_, person) => person.team?.name,
  },
  {
    title: '账号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'team.code',
    key: 'team.code',
    render: (_, person) => person.team?.code,
  },
  {
    title: '座右铭',
    dataIndex: 'team.remark',
    key: 'team.remark',
    render: (_, person) => person.team?.remark,
  },
];
const renderOperation = (item: schema.XTarget): OperationType[] => {
  return [
    {
      key: 'enterChat',
      label: '删除',
      onClick: () => {
        friendController.deleteFriend(PersonInfoEnty.getPerson!, item.id);
        console.log('按钮事件', 'enterChat', item);
      },
    },
  ];
};
/**
 * 好友设置
 * @returns
 */
const PersonFriend: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friend, setFriend] = useState<Person>();
  const [data, setData] = useState<schema.XTarget[]>([]);

  useEffect(() => {
    friendController.setCallBack(setData);
    // friendController.setCallBack(setData);
    getData();
  }, []);
  const getData = async () => {
    setData(await friendController.getMyFriend());
  };
  // const mutation = useMutation((id: string) => personService.applyJoin(id), {
  //   onSuccess: (data) => {
  //     if (data.success) {
  //       queryClient.invalidateQueries(['person.getFriends']);
  //       message.success('添加好友成功!');
  //     } else {
  //       message.error(data.msg);
  //     }
  //   },
  // });

  // const renderCard = () => {
  //   return data?.data.map((person: Person) => {
  //     return (
  //       <Col span={8} key={person.id}>
  //         <div className={cls['person-frend-info-card']}>
  //           <PersonInfoCard person={person} key={person.id} />
  //         </div>
  //       </Col>
  //     );
  //   });
  // };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    // if (friend) {
    //   mutation.mutate(friend?.id);
    // }

    console.log(friend);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 搜索回调
  const searchCallback = (person: Person) => {
    setFriend(person);
  };

  const top = (
    <div className={cls['person-friend-top']}>
      <Title level={4}>
        <strong>我的好友</strong>
      </Title>
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          加好友
        </Button>
      </div>
    </div>
  );
  return (
    <div className={cls['person-friend-container']}>
      {top}
      <CardOrTable
        dataSource={data}
        total={data.length}
        operation={renderOperation}
        // renderCardContent={renderCard}
        columns={columns as any}
        rowKey={'id'}
      />
      <Modal
        title="添加好友"
        okButtonProps={{ disabled: !friend }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}>
        <div>
          {
            <SearchPerson
              person={PersonInfoEnty.getPerson!}
              searchCallback={searchCallback}></SearchPerson>
          }
        </div>
      </Modal>
    </div>
  );
};

export default PersonFriend;
