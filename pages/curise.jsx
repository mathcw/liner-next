
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import { Pagination } from 'antd';
import '../css/index.css';
import Link from '../components/NextLink';
import PageLoading from '../components/Loading';
import {host} from '../lib/util';

const pageSize = 6;
async function load(current, pageSize) {
    const query = {};
    query['start'] = pageSize * (current - 1);
    query['limit'] = pageSize;

    const res = await axios.post(`${host}api/WebApi/company`, {
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
const Curise = ({initData,initTotal}) =>{
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(initTotal);

    const [data, setData] = useState(initData);

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
                <div className='route_back'></div>
                <div className="route_vague"></div>
                <div className="text">
                    <span className="all">邮轮公司</span>
                </div>
            </div>
            {/* 下面内容部分 */}
            <div style={{
                    display:'flex',
                    flexDirection:'column',
                }}>
                <div className='Curise-content'>
                    {
                        data.map(item => {
                            return (
                                <div className='Curise-data' key={item['id']}>
                                    <Link href="">
                                        <a>
                                            <img src={item['banner']=='' ?'/pic.png':item['banner']} className="Curise-img"/>
                                            <div className="Curise-vague"></div>
                                            <div className="Curise-name">
                                                <span>{item['name']}</span>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
                <div style={{
                    width: '100%',
                    marginTop: '60px',
                    position: 'relative',
                }}>
                <Pagination 
                    style={{position:'absolute',right:'15%'}}
                    defaultPageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={pageNumChange}
                    current={current}
                />
                </div>
                <style jsx>{`
                    .Curise-content {
                        display: flex;
                        margin-top: 60px;
                        padding: 0px 15%;
                        flex-wrap: wrap;
                    }
                    .Curise-img{
                        width: 100%;
                        height:256px;
                    }
                    .Curise-vague{
                        height: 256px;
                        width: 100%;
                        background:rgba(0,0,0,0.25);
                        position: absolute;
                        top: 0;
                    }
                    .Curise-data {
                        width: 32%;
                        margin-top: 15px;
                        margin-right: 10px;
                        position: relative;  
                    }
                    .Curise-name{
                        position: absolute;
                        padding-left: 2%;
                        top: 8%;
                        left: 6%;
                        width: 100%;
                        font-size:26px;
                        font-weight:500;
                        line-height:37px;
                        color:rgba(255,255,255,1);
                    }
                `}</style>
            </div>
        </>
    );
}
Curise.getInitialProps = async (appContext) =>{
    const res = await load(1, pageSize);
    return {
        initData: res.data,
        initTotal: res.total
    }
}

export default Curise;