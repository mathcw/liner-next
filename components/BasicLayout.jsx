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
                    <Menu.Item key="/ticket"><Link href="/ticket"><a>全部航线</a></Link></Menu.Item>
                    <Menu.Item key="/curise"><Link href="/curise"><a>邮轮公司</a></Link></Menu.Item>
                    <Menu.Item key="/ship"><Link href="/ship"><a>邮轮展示</a></Link></Menu.Item>
                    <Menu.Item key="/bourn"><Link href="/bourn"><a>目的地</a></Link></Menu.Item>
                </Menu>
                <div style={{ height: '3rem', width: '30%', display: 'flex', alignItems: 'center', background: '#fff', lineHeight: '3rem' }}>
                    <div style={{ position: 'absolute' }}>
                        <img src={getStaticFile('/tell.png')} />
                        <span style={{ fontSize: '0.8rem', color: '#000000', marginLeft: '1rem' }}>致电我们：010 249 8989</span>
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
                        <span className="bottom_titleone">TRADEMARK</span>
                        <span className="bottom_content">班达尼T.Chabangtigo亚兰路324号9400</span>
                        <span className="bottom_content">+66 28 878 5452</span>
                        <span className="bottom_content">+66 2 547 2223</span>
                        <span className="bottom_content">support@tourpacker.com</span>
                        <span className="bottom_content">©版权所有2016 Tour Packer。版权所有</span>
                    </div>
                    <div className="trademark">
                        <span className="bottom_title">关于我们</span>
                        <span className="bottom_content">为什么是我们</span>
                        <span className="bottom_content">为什么旅行</span>
                        <span className="bottom_content">评论</span>
                        <span className="bottom_content">旅游保险</span>
                        <span className="bottom_content">程序</span>
                    </div>
                    <div className="trademark">
                        <span className="bottom_title">客户服务</span>
                        <span className="bottom_content">付款</span>
                        <span className="bottom_content">反馈</span>
                        <span className="bottom_content">联系我们</span>
                        <span className="bottom_content">旅游咨询</span>
                        <span className="bottom_content">常见问题</span>
                    </div>
                    <div className="trademark">
                        <span className="bottom_title">其他</span>
                        <span className="bottom_content">目的地</span>
                        <span className="bottom_content">博客</span>
                        <span className="bottom_content">出发前计划</span>
                        <span className="bottom_content">签证</span>
                        <span className="bottom_content">保险</span>
                    </div>
                </div>
            </div>
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}

        </Layout>
    )
}
