import { Col, Divider, Dropdown, Layout, Row, Space, Typography, Button } from 'antd';
import React, { CSSProperties, useState } from 'react';
import cls from './index.module.less';
import CustomMenu from '@/components/CustomMenu';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { ImArrowLeft2 } from 'react-icons/im';
import { RiMore2Fill } from 'react-icons/ri';
import { Resizable } from 'devextreme-react';
import { LeftBarIcon, RightBarIcon } from '@/components/Common/GlobalComps/customIcon';
const { Content, Sider } = Layout;

/**
 * 内容区模板类
 */
type MainLayoutType = {
  style?: CSSProperties;
  menusHeight?: number | string;
  children?: React.ReactNode; // 子组件
  siderMenuData: MenuItemType;
  rightBar?: React.ReactNode;
  selectMenu: MenuItemType;
  notExitIcon?: boolean;
  onSelect?: (item: MenuItemType) => void;
  onMenuClick?: (item: MenuItemType, menuKey: string) => void;
};

/**
 * 内容区模板
 *
 * 包含：左侧、内容区顶部(面包屑、操作区)、内容区
 * @returns
 */
const MainLayout: React.FC<MainLayoutType> = (props) => {
  const [leftSider, setLeftSider] = useState<boolean>(true);
  const [rightSider, setRightSider] = useState<boolean>(false);
  const [mainWidth, setMainWidth] = useState<string | number>('40%');
  const parentMenu = props.selectMenu.parentMenu ?? props.siderMenuData;
  const outside =
    props.selectMenu.menus?.filter((item) => item.model === 'outside') ?? [];
  const inside = props.selectMenu.menus?.filter((item) => item.model != 'outside') ?? [];
  const findMenus = (
    key: string,
    menus?: OperateMenuType[],
  ): OperateMenuType | undefined => {
    for (const menu of menus ?? []) {
      if (menu.key === key) {
        return menu;
      } else {
        const find = findMenus(key, menu.children);
        if (find) {
          return find;
        }
      }
    }
  };
  const onOperateMenuClick = async (item: MenuItemType, key: string) => {
    const menu = findMenus(key, item.menus);
    if (menu && menu.beforeLoad) {
      await menu.beforeLoad();
    }
    props.onMenuClick?.apply(this, [item, key]);
  };
  const onSelectClick = async (item: MenuItemType) => {
    if (item.beforeLoad) {
      await item.beforeLoad();
    }
    props.onSelect?.apply(this, [item]);
  };
  return (
    <Layout className={cls.layout} style={props.style}>
      <Row className={cls[`content-top`]} justify="space-between">
        <Col>
          <CustomBreadcrumb
            selectKey={props.selectMenu.key}
            item={props.siderMenuData}
            onSelect={(item) => {
              onSelectClick(item);
            }}></CustomBreadcrumb>
        </Col>
        <Col className={cls.rightstyle}>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <Typography.Link
              title={'切换主测栏'}
              style={{ fontSize: 18 }}
              onClick={() => setLeftSider(!leftSider)}>
              <LeftBarIcon size={18} width={4} selected={leftSider} />
            </Typography.Link>
            <Typography.Link
              title={'切换辅助侧栏'}
              style={{ fontSize: 18 }}
              onClick={() => setRightSider(!rightSider)}>
              <RightBarIcon size={18} width={8} selected={rightSider} />
            </Typography.Link>
            {props.rightBar}
            {outside.length > 0 &&
              outside.map((item) => {
                return (
                  <Typography.Link
                    key={item.key}
                    title={item.label}
                    style={{ fontSize: 18 }}
                    onClick={() => {
                      onOperateMenuClick(props.selectMenu, item.key);
                    }}>
                    {item.icon}
                  </Typography.Link>
                );
              })}
            {inside.length > 0 && (
              <Dropdown
                menu={{
                  items: inside,
                  onClick: ({ key }) => {
                    onOperateMenuClick(props.selectMenu, key);
                  },
                }}
                dropdownRender={(menu) => (
                  <div>{menu && <Button type="link">{menu}</Button>}</div>
                )}
                placement="bottom"
                trigger={['click', 'contextMenu']}>
                <RiMore2Fill fontSize={22} style={{ cursor: 'pointer' }} />
              </Dropdown>
            )}
          </Space>
        </Col>
      </Row>
      <Layout>
        {leftSider && (
          <Sider className={cls.sider} width={250}>
            <div className={cls.menuBar}>
              <Typography.Link
                style={{ fontSize: 16 }}
                onClick={() => {
                  onSelectClick(parentMenu);
                }}>
                {parentMenu.key != props.siderMenuData.key && (
                  <div className={cls.backup}>
                    <ImArrowLeft2 fontSize={20} />
                  </div>
                )}
              </Typography.Link>
            </div>
            <div
              className={cls.title}
              title={parentMenu.label}
              onClick={() => {
                onSelectClick(parentMenu);
              }}>
              <span style={{ fontSize: 20, margin: '0 6px' }}>{parentMenu.icon}</span>
              <strong>{parentMenu.label}</strong>
            </div>
            <div
              className={cls.container}
              id="templateMenu"
              style={{ height: props.menusHeight }}>
              <CustomMenu
                item={parentMenu}
                collapsed={false}
                selectMenu={props.selectMenu}
                onSelect={(item) => {
                  onSelectClick(item);
                }}
                onMenuClick={onOperateMenuClick}
              />
            </div>
          </Sider>
        )}
        {rightSider ? (
          <>
            <Resizable
              handles={'right'}
              width={mainWidth}
              onResize={(e) => setMainWidth(e.width)}>
              <Sider className={cls.content} width={'100%'}>
                {props.children}
              </Sider>
            </Resizable>
            <Content className={cls.content}></Content>
          </>
        ) : (
          <Content className={cls.content}>{props.children}</Content>
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
