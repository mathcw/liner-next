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
    const query = {...search};
    query['start'] = pageSize * (current - 1);
    query['limit'] = pageSize;

    const res = await axios.post(`${host}api/WebApi/ship`, {
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
const Ship = ({ dict, initData, initTotal, query }) => {
    const initCond = useMemo(() => init(query), [query]);

    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(initTotal);

    const [data, setData] = useState(initData);

    const dictCompany = dict['CruiseCompany'] ? dict['CruiseCompany'] : {};
    const dictShipKind = dict['ShipKind'] ? dict['ShipKind'] : {};

    const [loading, setLoading] = useState(false);

    const pageNumChange = page => {
        setCurrent(page);
        setLoading(true);
        load(page, pageSize).then(r => {
            setTotal(r.total);
            setData(r.data);
            setLoading(false);
        }, e => {
            setLoading(false);
        })
    }

    return (
        <>
            <PageLoading loading={loading} />
            {/* 顶部图片 */}
            <div className="route_top">
                <img className="route_back" src={getStaticFile("/route_back.png")} />
                <div className="route_vague"></div>
                <div className="text">
                    <span className="all">邮轮列表</span>
                </div>
            </div>
            {/* 下面内容部分 */}
            <div className="route_main">
                {/* 右侧内容显示区域 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                }}>
                    {
                        data.map(item => {
                            return (
                                <Link href={`/shipDetail?id=${item['id']}`} key={item['id']}>
                                    <div className="row" style={{ marginTop: '-30px' }}>
                                        <div className="content" style={{ padding: '0' }}>
                                            <div className="side">
                                                <div className="side_left">
                                                    <img src={item['pic'] == '' ? getStaticFile('/pic.png') : item['pic']} />
                                                </div>
                                                <div className="side_right">
                                                    <div className="paly_theme">
                                                        {`${item['name']}`}
                                                    </div>
                                                    <div className="detail">
                                                        <div className="two">
                                                            <div style={{ display: 'flex', height: '25px' }}><span className="name">所属公司</span><span className="con">{dictCompany[item['cruise_company_id']]}</span></div>
                                                            <div style={{ display: 'flex' }}><span className="name">邮轮类型</span><span className="con">{dictShipKind[item['kind']]}</span></div>
                                                        </div>
                                                        <div className="two">
                                                            <div style={{ display: 'flex', height: '25px' }}><span className="name">客房数</span><span className="con">{item['room_number']}</span></div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginTop: '15px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                            <Rate style={{ color: '#76C8E6', fontSize: '15px' }} allowHalf disabled defaultValue={parseFloat(item['level'] || 5)} />
                                                            <span className="star">{item['level']}星</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                    <div className="page">
                        <Pagination className="pg"
                            defaultPageSize={pageSize}
                            total={total}
                            showSizeChanger={false}
                            onChange={pageNumChange}
                            current={current}
                        />
                    </div>
                    <style jsx>{`
                    .Curise-vague{
                        height: 256px;
                        width: 100%;
                        background:rgba(0,0,0,0.25);
                        position: absolute;
                        top: 0;
                    }
                `}</style>
                </div>
            </div>

        </>
    );
}

Ship.getInitialProps = async (appContext) => {
    const res = await load({}, 1, pageSize);
    return {
        initData: res.data,
        initTotal: res.total,
    }
}

export default connect(function mapProps(state) {
    return {
        dict: state.enum
    }
})(withRouter(Ship))