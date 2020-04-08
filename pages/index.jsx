import { useState } from 'react';
import { Select, Input, DatePicker, Button, Rate } from 'antd';
import Router from 'next/router';
import locale from '../lib/local';
import { connect } from 'react-redux';
import axios from 'axios';
import Link from '../components/NextLink'
import '../css/index.css'
import { host,getStaticFile } from '../lib/util';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

function Home(props) {
  const { dict, companys, citys, recommands } = props;
  const dictDepCity = dict['depCity'] ? dict['depCity'] : {};
  const dictDesCity = dict['desCity'] ? dict['desCity'] : {};
  const [depCity, setDepCity] = useState('');
  const [destination, setDestination] = useState('');
  const [depDate, setDepDate] = useState('');

  const search = () => {
    const query = {};
    if (depCity && depCity != '') {
      query['dep'] = depCity
    }
    if (destination && destination != '') {
      query['destination'] = destination
    }
    if (depDate && depDate != '') {
      query['depDateFrom'] = depDate
    }
    Router.push({
      pathname: `${publicRuntimeConfig.basePath || ''}/ticket`,
      query
    })
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div className='top_back'>
          <img src="/background.png" />
        </div>
        <div className="top_vague"></div>
        <div className="container">
          <div className="top_title">与您一起游览大海</div>
          <div className="top_explain">追随梦想中的国度，一起探索未知</div>
          <div className="input_find">
            <Select
              showSearch
              optionFilterProp="children"
              getPopupContainer={node => node}
              placeholder="选择出发地"
              className="select"
              onChange={(value) => {
                setDepCity(value);
              }}
            >
              {Object.keys(dictDepCity).map(key => (
                <Select.Option key={key} value={key}>
                  {dictDepCity[key]}
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              optionFilterProp="children"
              getPopupContainer={node => node}
              placeholder="选择目的地"
              className="select"
              onChange={(value) => {
                setDestination(value);
              }}
            >
              {Object.keys(dictDesCity).map(key => (
                <Select.Option key={key} value={key}>
                  {dictDesCity[key]}
                </Select.Option>
              ))}
            </Select>
            <DatePicker className="data" placeholder="请输入日期"
              locale={locale} onChange={(date, value) => {
                setDepDate(value)
              }} />
            <div>
              <Button className="btn" onClick={search}>搜索</Button>
            </div>
          </div>
        </div>
      </div>
      {/* 热门目的地 */}
      <div className="row">
        <div className="title">
          <span className="a">热门目的地</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2%' }}>
            <Link href="/bourn"><a>
              <span className="more">更多</span>
              <img className="img" src={getStaticFile('/more.png')} />
            </a></Link>
          </div>
        </div>
        <div className="image">
          <img src={getStaticFile('/bottom_row.png')} />
        </div>
        <div className="content" style={{ marginTop: '15px' }}>
          {
            citys.map(city => {
              return (
                <div className="chunk" key={city['id']}>
                  <Link href="">
                    <a>
                      <img src={city['pic'] == '' ? getStaticFile('/pic.png') : city['pic']} />
                      <div className="vague"></div>
                      <div className="cp">
                        <span className="city">{city['name']}</span>
                      </div>
                    </a>
                  </Link>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* 邮轮公司 */}
      <div className="row">
        <div className="title">
          <span className="a">邮轮公司</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2%' }}>
            <Link href="/curise"><a>
              <span className="more">更多</span>
              <img className="img" src={getStaticFile('/more.png')} />
            </a></Link>
          </div>
        </div>
        <div className="image">
          <img src={getStaticFile('/bottom_row.png')} />
        </div>
        <div className="content">
          {
            companys.map(company => {
              return (
                <div className="chunk" style={{ marginTop: '15px' }} key={company['id']}>
                  <Link href="">
                    <a>
                      <img src={company['banner'] == '' ? getStaticFile('/pic.png') : company['banner']} />
                      <div className="vague"></div>
                      <div className="cp1">
                        <span className="city">{company['name']}</span>
                        <span className="price">{`旗下${company['ship_num']}艘邮轮`}</span>
                      </div>
                    </a>
                  </Link>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* 特价航线 */}
      <div className="row">
        <div className="title">
          <span className="a">推荐航线</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2%' }}>
            <Link href="/ticket"><a>
              <span className="more">更多</span>
              <img className="img" src={getStaticFile('/more.png')} />
            </a></Link>
          </div>
        </div>
        <div className="image">
          <img src={getStaticFile('/bottom_row.png')} />
        </div>
        <div className="content">
          {
            recommands.map(recommand => {
              return (
                <div className="chunk" style={{ marginTop: '15px' }} key={recommand['id']}>
                  <Link href="">
                    <a>
                      <div className="top">
                        <img src={recommand['pic'] == '' ? getStaticFile('/pic.png') : recommand['pic']} />
                        <div className="cp">
                          <span className="time">{`${recommand['day']}天${recommand['night']}夜`}</span>
                        </div>
                      </div>
                      <div className="bottom">
                        <div>
                          <span className="adress">{recommand['name']}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginTop: '5px' }}>
                          <div style={{ display: 'flex' }}>
                            <Rate style={{ color: '#76C8E6', fontSize: '15px' }} allowHalf disabled defaultValue={parseFloat(recommand['level'])} />
                            <span className="star">{recommand['level']}星</span>
                          </div>
                          <span className="buck">￥{recommand['price']}</span>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* 关于我们 */}
      <div className="row">
        <div className="title">
          <span className="a">关于我们</span>
        </div>
        <div className="image">
          <img src={getStaticFile('/bottom_row.png')} />
        </div>
        <div className="text">
          诺唯真游轮（Norwegian Cruise Line）作为游轮行业最富创新力的品牌，
          我报别线地几计门将交便领结向还成思过文段张研红油细低往称的五八又走
          关厂得亲场管积分你造她造严身眼复府增认严形来识计文高。清天美起不必
          后山报与头样后本无报都立率点加大想直最速然色维口他中前区阶品马严转
          处圆需万他里层矿地无油术此克感小准长度然说开。属际研级石权特养委在
          指多导声国改放革及价组离斗其下斯委收业低共铁清展他京白家至往后众行
          农构青出理山反人府角了金养子极办最飞天江林不科专。理适律存发济江律
          声方再务主被或入速都确口调相电对传或元当联深低装部应据日进酸整数上
          方该由平场走难性省该年物民族向制事水信参压政效边求。
            </div>
      </div>
      {/* 底部 */}

    </div>
  );
}

Home.getInitialProps = async function (ctx) {
  const res = await axios.get(`${host}api/WebApi/home`);
  if (res.status === 200 && res.data['data']) {
    return {
      companys: res.data['data']['邮轮公司'],
      citys: res.data['data']['目的地'],
      recommands: res.data['data']['推荐航线']
    }
  }
  return {
    companys: [],
    citys: [],
    recommands: []
  }
}

export default connect(function mapProps(state) {
  return {
    dict: state.enum
  }
})(Home)