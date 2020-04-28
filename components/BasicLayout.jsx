import { Layout, Menu } from 'antd';
import Link from '../components/NextLink'
import '../css/index.css'
import {getStaticFile} from '../lib/util';

const { Content } = Layout;
export default (props) => {
    const {pathName} = props;
    return (
        <Layout>
            <div style={{ width: '100%', height: '3rem', background: '#FA6767' }}></div>
            <div style={{ width: '100%', background: '#fff', paddingLeft: '8%', display: 'flex' }}>
                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[pathName]}
                    style={{ border: '0', width: '70%' }}
                >
                    <Menu.Item key="/" ><Link href="/"><a>首页</a></Link></Menu.Item>
                    <Menu.Item key="/ticket"><Link href="/ticket"><a>全部产品</a></Link></Menu.Item>
                    <Menu.Item key="/curise"><Link href="/curise"><a>邮轮公司</a></Link></Menu.Item>
                    <Menu.Item key="/ship"><Link href="/ship"><a>邮轮展示</a></Link></Menu.Item>
                </Menu>
                <div style={{ height: '3rem', width: '30%', display: 'flex', alignItems: 'center', background: '#fff', lineHeight: '3rem' }}>
                    <div style={{ position: 'absolute' }}>
                        <img src={getStaticFile('/tell.png')} />
                        <span style={{ fontSize: '0.8rem', color: '#000000', marginLeft: '1rem' }}>致电我们:4000582007</span>
                    </div>
                </div>
            </div>
            <Content >
                <div className="content">{props.children}</div>
                <style jsx>
                    {`
                    .content{
                        background:#fff;
                        min-height:100vh;
                    }
                `}</style>
            </Content>
            <div style={{ height: '80px', width: '100%', background: '#fff' }}></div>
            <div className="bottom_row">
                <img src={getStaticFile("/bottom_backgroud.png")} />
                <div className="con_text">
                    <div className="trademark">
                        <span className="bottom_titleone">乐邮环球</span>
                        <span className="bottom_content">北京市朝阳区新源里16号琨莎中心A座三层</span>
                        <span className="bottom_content">©版权所有2020 乐邮环球 版权所有</span>
                        <span className="bottom_content">
                            <a href="http://www.beian.miit.gov.cn/">
                                京ICP备20014193号
                            </a>
                        </span>
                    </div>
                    <div className="trademark">
                        <span className="bottom_title">关于我们</span>
                        <span className="bottom_content">为什么是我们</span>
                        <span className="bottom_content">为什么旅行</span>
                    </div>
                    <div className="trademark">
                        <span className="bottom_title">客户服务</span>
                        <span className="bottom_content">联系我们</span>
                        <span className="bottom_content">旅游咨询</span>
                    </div>
                </div>
            </div>
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}

        </Layout>
    )
}
