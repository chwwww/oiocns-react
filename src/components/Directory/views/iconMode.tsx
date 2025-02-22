import { Dropdown, Card, Typography } from 'antd';

import React from 'react';
import cls from './less/icon.module.less';
import { IFileInfo } from '@/ts/core';
import { command, schema } from '@/ts/base';
import { loadFileMenus } from '@/executor/fileOperate';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const IconMode = ({
  current,
  mode,
}: {
  current: IFileInfo<schema.XEntity>;
  mode: number;
}) => {
  const cmdType = mode === 1 ? 'data' : 'config';
  const FileCard = (el: IFileInfo<schema.XEntity>) => (
    <Dropdown
      menu={{
        items: loadFileMenus(el, mode),
        onClick: ({ key }) => {
          command.emitter(cmdType, key, el);
        },
      }}
      trigger={['contextMenu']}>
      <Card
        size="small"
        className={cls.fileCard}
        bordered={false}
        key={el.key}
        onDoubleClick={async () => {
          await el.loadContent();
          command.emitter(cmdType, 'open', el);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <EntityIcon entity={el.metadata} size={50} />
        </div>
        <div className={cls.fileName} title={el.name}>
          <Typography.Text title={el.name} ellipsis>
            {el.name}
          </Typography.Text>
        </div>
        <div className={cls.fileName} title={el.typeName}>
          <Typography.Text
            style={{ fontSize: 12, color: '#888' }}
            title={el.typeName}
            ellipsis>
            {el.typeName}
          </Typography.Text>
        </div>
      </Card>
    </Dropdown>
  );
  return (
    <Dropdown
      menu={{
        items: loadFileMenus(current, mode),
        onClick: ({ key }) => {
          command.emitter(cmdType, key, current, current.key);
        },
      }}
      trigger={['contextMenu']}>
      <div
        className={cls.content}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        {current.content(mode).map((el) => FileCard(el))}
      </div>
    </Dropdown>
  );
};
export default IconMode;
