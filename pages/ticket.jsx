import { withRouter } from 'next/router';
import axios from 'axios';
import { DatePicker, Input, Checkbox, Menu, Rate, Pagination } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import locale from '../lib/local';
import PageLoading from '../components/Loading';
import Link from '../components/NextLink'
import '../css/index.css'
import { host, getStaticFile } from '../lib/util';
import { useState, useMemo, useEffect } from 'react';
import moment from "moment";

const { Search } = Input;
const pageSize = 5;
async function load(search, current, pageSize) {
    search['start'] = pageSize * (current - 1);
    search['limit'] = pageSize;

    const query = {};
    Object.keys(search).filter(k => {
        if (Array.isArray(search[k])) {
            return search[k].length != 0;
        }
        return search[k] !== undefined && search[k] !== '';
    }).forEach(k => {
        query[k] = search[k];
    })
    const res = await axios.post(`${host}api/WebApi/ticket`, {
        ...query
    });
    if (res.status == 200 && res.data && res.data['data']) {
        return {
            data: res.data['data']['data'],
            total: res.data['data']['total'],
        }
    }
    return {
        data: [],
        total: 0,
    }
}
function init(query) {
    if (!query || typeof query !== 'object' || Object.keys(query) === 0) {
        return {};
    }
    const rst = {};
    if (query.dep && (typeof query.dep === 'string' || typeof query.dep === 'number')) {
        rst['depCity'] = [query.dep];
    }
    if (query.destination && (typeof query.destination === 'string' || typeof query.destination === 'number')) {
        rst['desCity'] = [query.destination];
    }
    if (query.depDateFrom && (typeof query.depDateFrom === 'string')) {
        rst['depDateFrom'] = query.depDateFrom;
    }
    return rst;
}
const Ticket = ({ dict, initData, initTotal, query }) => {
    const initCond = useMemo(() => init(query), [query]);

    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(initTotal);

    const [data, setData] = useState(initData);
    const [desMore, setdesMore] = useState(false);
    const [depMore, setdepMore] = useState(false);
    const [comMore, setcomMore] = useState(false);

    const [keyWord, setWord] = useState('');
    const [depDateFrom, setDepDateFrom] = useState(initCond['depDateFrom'] ? initCond['depDateFrom'] : '');
    const [depDateTo, setDepDateTo] = useState('');

    const [pdKind, setPdKind] = useState([]);
    const [depCity, setDepCity] = useState(initCond['depCity'] ? [...initCond['depCity']] : []);
    const [desCity, setDesCity] = useState(initCond['desCity'] ? [...initCond['desCity']] : []);
    const [companys, setCompany] = useState([]);

    const [orderBy, setOrderBy] = useState('create_at');
    const [orderDir, setOrderDir] = useState('desc');

    const dictDepCity = dict['depCity'] ? dict['depCity'] : {};
    const dictDesCity = dict['desCity'] ? dict['desCity'] : {};
    const dictCompany = dict['CruiseCompany'] ? dict['CruiseCompany'] : {};
    const dictCruiseShip = dict['CruiseShip'] ? dict['CruiseShip'] : {};

    const [loading, setLoading] = useState(false);

    const pageNumChange = page => {
        setCurrent(page);
        setLoading(true);
        load({
            kind: pdKind,
            dep_city_id: depCity,
            destination: desCity,
            cruise_company_id: companys,
            name: keyWord,
            dep_date_to: depDateTo,
            dep_date_from: depDateFrom,
            order_field: orderBy,
            order_dir: orderDir
        }, page, pageSize).then(r => {
            setTotal(r.total);
            setData(r.data);
            setLoading(false);
        }, e => {
            setLoading(false);
        })
    }

    const searchClick = (value) => {
        setWord(value);
        setLoading(true);
        setCurrent(1);
        load({
            kind: pdKind,
            dep_city_id: depCity,
            destination: desCity,
            cruise_company_id: companys,
            name: keyWord,
            dep_date_to: depDateTo,
            dep_date_from: depDateFrom,
            order_field: orderBy,
            order_dir: orderDir
        }, 1, pageSize).then(r => {
            setTotal(r.total);
            setData(r.data);
            setLoading(false);
        }, e => {
            setLoading(false);
        })
    }

    useEffect(() => {
        setLoading(true);
        setCurrent(1);
        load({
            kind: pdKind,
            dep_city_id: depCity,
            destination: desCity,
            cruise_company_id: companys,
            name: keyWord,
            dep_date_to: depDateTo,
            dep_date_from: depDateFrom,
            order_field: orderBy,
            order_dir: orderDir
        }, 1, pageSize).then(r => {
            setTotal(r.total);
            setData(r.data);
            setLoading(false);
        }, e => {
            setLoading(false);
        });
    }, [pdKind, depCity, desCity, companys, orderBy, orderDir])



    const clearPdKind = () => {
        setPdKind([]);
    };

    const changePdKind = (kind) => {
        if (pdKind.indexOf(kind) === -1) {
            pdKind.push(kind)
        } else {
            const i = pdKind.indexOf(kind);
            pdKind.splice(i, 1);
        }
        setPdKind([...pdKind]);
    }

    const clearDesCity = () => {
        setDesCity([]);
    };

    const changeDesCity = (city) => {
        if (desCity.indexOf(city) === -1) {
            desCity.push(city)
        } else {
            const i = desCity.indexOf(city);
            desCity.splice(i, 1);
        }
        setDesCity([...desCity]);
    }

    const clearDepCity = () => {
        setDepCity([]);
    };

    const changeDepCity = (city) => {
        if (depCity.indexOf(city) === -1) {
            depCity.push(city)
        } else {
            const i = depCity.indexOf(city);
            depCity.splice(i, 1);
        }
        setDepCity([...depCity]);
    }

    const clearCompany = () => {
        setCompany([]);
    };

    const changeCompany = (com) => {
        if (companys.indexOf(com) === -1) {
            companys.push(com)
        } else {
            const i = companys.indexOf(com);
            companys.splice(i, 1);
        }
        setCompany([...companys]);
    }

    const clickOrderBY = (field) => {
        if (field != orderBy) {
            setOrderBy(field);
        }
    }

    const clickOrderDir = () => {
        if (orderDir === 'asc') {
            setOrderDir('desc');
        } else {
            setOrderDir('asc');
        }
    }

    return (
        <>
            <PageLoading loading={loading} />
            {/* 顶部图片 */}
            <div className="route_top">
                <img className="route_back" src={getStaticFile("/route_back.png")} />
                <div className="route_vague"></div>
                <div className="text">
                    <span className="all">全部航线</span>
                </div>
            </div>
            {/* 下面内容部分 */}
            <div className="route_main">
                {/* 左侧搜索内容 */}
                <div className="route_left">
                    <div className="key_name">
                        <div className="text">名称关键字</div>
                        <div className="content">
                            <Search style={{ width: 180 }} placeholder="搜索关键字" onSearch={value => { searchClick(value) }} enterButton />
                        </div>
                    </div>
                    <div className="go_date">
                        <div className="text">出发日期</div>
                        <div className="content">
                            <DatePicker
                                value={moment(depDateFrom).isValid() ? moment(depDateFrom) : undefined}
                                locale={locale}
                                style={{ width: '100%' }}
                                placeholder="出发日期起"
                                onChange={(date, value) => setDepDateFrom(value)}
                            />
                            <DatePicker
                                value={moment(depDateTo).isValid() ? moment(depDateTo) : undefined}
                                locale={locale}
                                style={{ width: '100%' }}
                                placeholder="出发日期止"
                                onChange={(date, value) => setDepDateTo(value)}
                            />
                        </div>
                    </div>
                </div>
                {/* 右侧内容显示区域 */}
                <div className="route_right">
                    <div className="right_top">
                        <div className="cloumn" style={{ alignItems: 'center' }}>
                            <span className="type">产品类型</span>
                            <div className="checkbox">
                                <span><Checkbox checked={pdKind.length === 0} onChange={clearPdKind}>不限</Checkbox></span>
                                {
                                    Object.keys(dict['PdKind']).map((kind) => {
                                        return (
                                            <span key={kind}><Checkbox checked={pdKind.indexOf(kind) !== -1} onChange={() => { changePdKind(kind) }}>{dict['PdKind'][kind]}</Checkbox></span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="cloumn" style={!desMore ? { alignItems: 'center' } : {}}>
                            <span className="type">目的地</span>
                            <div className="checkbox">
                                <span><Checkbox checked={desCity.length === 0} onChange={clearDesCity}>不限</Checkbox></span>
                                {
                                    Object.keys(dictDesCity).map((city, index) => {
                                        if (desMore) {
                                            return <span key={city}><Checkbox checked={desCity.indexOf(city) !== -1} onChange={() => { changeDesCity(city) }}>{dictDesCity[city]}</Checkbox></span>
                                        }
                                        return (
                                            index < 8 && <span key={city}><Checkbox checked={desCity.indexOf(city) !== -1} onChange={() => { changeDesCity(city) }}>{dictDesCity[city]}</Checkbox></span>
                                        )
                                    })
                                }
                            </div>
                            {
                                Object.keys(dictDesCity).length > 8 && <div className="more" onClick={() => { setdesMore(!desMore) }}>
                                    更多
                                {!desMore && <DownOutlined />}
                                    {desMore && <UpOutlined />}
                                </div>
                            }


                        </div>
                        <div className="cloumn" style={!depMore ? { alignItems: 'center' } : {}}>
                            <span className="type">出发地</span>
                            <div className="checkbox">
                                <span><Checkbox checked={depCity.length === 0} onChange={clearDepCity}>不限</Checkbox></span>
                                {
                                    Object.keys(dictDepCity).map((city, index) => {
                                        if (depMore) {
                                            return <span key={city}><Checkbox checked={depCity.indexOf(city) !== -1} onChange={() => { changeDepCity(city) }}>{dictDepCity[city]}</Checkbox></span>
                                        }
                                        return (
                                            index < 8 && <span key={city}><Checkbox checked={depCity.indexOf(city) !== -1} onChange={() => { changeDepCity(city) }}>{dictDepCity[city]}</Checkbox></span>
                                        )
                                    })
                                }

                            </div>
                            {
                                Object.keys(dictDepCity).length > 8 && <div className="more" onClick={() => { setdepMore(!depMore) }}>
                                    更多
                                {!depMore && <DownOutlined />}
                                    {depMore && <UpOutlined />}
                                </div>
                            }

                        </div>
                        <div className="cloumn" style={!comMore ? { alignItems: 'center' } : {}}>
                            <span className="type">邮轮公司</span>
                            <div className="checkbox">
                                <span><Checkbox checked={companys.length === 0} onChange={clearCompany}>不限</Checkbox></span>
                                {
                                    Object.keys(dictCompany).map((com, index) => {
                                        if (comMore) {
                                            return <span key={com}><Checkbox checked={companys.indexOf(com) !== -1} onChange={() => { changeCompany(com) }}>{dictCompany[com]}</Checkbox></span>
                                        }
                                        return (
                                            index < 8 && <span key={com}><Checkbox checked={companys.indexOf(com) !== -1} onChange={() => { changeCompany(com) }}>{dictCompany[com]}</Checkbox></span>
                                        )
                                    })
                                }
                            </div>
                            {
                                Object.keys(dictCompany).length > 8 && <div className="more" onClick={() => { setcomMore(!comMore) }}>
                                    更多
                                {!comMore && <DownOutlined />}
                                    {comMore && <UpOutlined />}
                                </div>
                            }
                        </div>
                        <div className="choice">
                            <span className="type">您已选择</span>
                            {
                                pdKind.map((kind) => {
                                    return (
                                        <div className="opt" key={kind}>
                                            <p>{dict['PdKind'][kind]}</p>
                                            <p className="close">x</p>
                                        </div>
                                    )
                                })
                            }
                            {
                                desCity.map((city) => {
                                    return (
                                        <div className="opt" key={city}>
                                            <p>{dict['City'][city]}</p>
                                            <p className="close">x</p>
                                        </div>
                                    )
                                })
                            }
                            {
                                depCity.map((city) => {
                                    return (
                                        <div className="opt" key={city}>
                                            <p>{dict['City'][city]}</p>
                                            <p className="close">x</p>
                                        </div>
                                    )
                                })
                            }
                            {
                                companys.map((com) => {
                                    return (
                                        <div className="opt" key={com}>
                                            <p>{dictCompany[com]}</p>
                                            <p className="close">x</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="right_bottom">
                        <div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
                            <Menu
                                theme="light"
                                mode="horizontal"
                                defaultSelectedKeys={orderBy}
                                style={{ border: '0', width: '70%' }}
                            >
                                <Menu.Item key="create_at" >
                                    <span onClick={() => { clickOrderBY('create_at') }}>新品</span>
                                    {orderBy === 'create_at' && orderDir === 'desc' && <DownOutlined onClick={() => { clickOrderDir() }} />}
                                    {orderBy === 'create_at' && orderDir === 'asc' && <UpOutlined onClick={() => { clickOrderDir() }} />}
                                </Menu.Item>
                                <Menu.Item key="order_nums" >
                                    <span onClick={() => { clickOrderBY('order_nums') }}>销量</span>
                                    {orderBy === 'order_nums' && orderDir === 'desc' && <DownOutlined onClick={() => { clickOrderDir() }} />}
                                    {orderBy === 'order_nums' && orderDir === 'asc' && <UpOutlined onClick={() => { clickOrderDir() }} />}
                                </Menu.Item>
                                <Menu.Item key="min_price">
                                    <span onClick={() => { clickOrderBY('min_price') }}>价钱</span>
                                    {orderBy === 'min_price' && orderDir === 'desc' && <DownOutlined onClick={() => { clickOrderDir() }} />}
                                    {orderBy === 'min_price' && orderDir === 'asc' && <UpOutlined onClick={() => { clickOrderDir() }} />}
                                </Menu.Item>
                            </Menu>
                        </div>
                        {
                            data.map(item => {
                                return (
                                    <Link href={`/details?id=${item['id']}`} key={item['id']}>
                                        <div className="row" style={{ marginTop: '-30px' }}>
                                            <div className="content" style={{ padding: '0' }}>
                                                <div className="side">
                                                    <div className="side_left">
                                                        <img src={item['pic'] ==''? getStaticFile('/pic.png'):item['pic']} />
                                                        <div className="cp">
                                                            <span className="time">{`${item['day']}天${item['night']}晚`}</span>
                                                        </div>
                                                    </div>
                                                    <div className="side_right">
                                                        <div className="paly_theme">
                                                            {`${item['name']} 航线编号 ${item['pd_num']}`}
                                                        </div>
                                                        <div className="detail">
                                                            <div className="two">
                                                                <div style={{ display: 'flex', height: '25px' }}><span className="name">出发地</span><span className="con">{dictDepCity[item['dep_city_id']]}</span></div>
                                                                <div style={{ display: 'flex' }}><span className="name">出发日期</span><span className="con">{item['dep_date']}</span></div>
                                                            </div>
                                                            <div className="two">
                                                                <div style={{ display: 'flex', height: '25px' }}><span className="name">目的地</span><span className="con">{item['destination']}</span></div>
                                                                <div style={{ display: 'flex' }}><span className="name">邮轮船只</span><span className="con">{dictCruiseShip[item['ship_id']]}</span></div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginTop: '15px' }}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Rate style={{ color: '#76C8E6', fontSize: '15px' }} allowHalf disabled defaultValue={parseFloat(item['level'] || 5)} />
                                                                <span className="star">{item['level']}星</span>
                                                            </div>
                                                            <span className="buck">￥{item['min_price']}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }

                    </div>
                    <div className="page">
                        <Pagination className="pg"
                            defaultPageSize={pageSize}
                            total={total}
                            showSizeChanger={false}
                            onChange={pageNumChange}
                            current={current}
                        />
                    </div>
                </div>
            </div>

        </>
    );
}

Ticket.getInitialProps = async (appContext) => {
    const { ctx } = appContext;
    const { query } = ctx;
    const fieldMap = {
        dep: 'dep_city_id',
        destination: 'destination',
        depDateFrom: 'dep_date_from'
    }
    const search = {
        order_field: 'create_at',
        order_dir: 'desc'
    };
    if (query['dep'] && query['dep'] != '' && (typeof query['dep'] == 'number' || typeof query['dep'] == 'string')) {
        search['dep_city_id'] = [query['dep']];
    }
    if (query['destination'] && query['destination'] != '' && (typeof query['destination'] == 'number' || typeof query['destination'] == 'string')) {
        search['destination'] = [query['destination']];
    }
    if (query['depDateFrom'] && query['depDateFrom'] != '' && (typeof query['depDateFrom'] == 'number' || typeof query['depDateFrom'] == 'string')) {
        search['dep_date_from'] = query['depDateFrom'];
    }
    const res = await load(search, 1, pageSize);
    return {
        initData: res.data,
        initTotal: res.total,
        query
    }
}

export default connect(function mapProps(state) {
    return {
        dict: state.enum
    }
})(withRouter(Ticket))