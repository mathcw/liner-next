
import axios from 'axios';
import { useState } from 'react';
import { Input, Button, Pagination, Carousel } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/index.css';
import PageLoading from '../components/Loading';
import { host, getStaticFile } from '../lib/util';
import Router from 'next/router';
import getConfig from 'next/config'
import { get, cache } from '../lib/lruCache';

const { publicRuntimeConfig } = getConfig();

const pageSize = 6;
async function load_banner() {
    const res = await axios.post(`${host}api/WebApi/banner`);

    if (res.status == 200 && res.data) {
        if (!res.data['data'] && res.data['message'] == '重复操作') {
            const cache = get(`${host}api/WebApi/banner`);
            if (!cache) {
                return {
                    data: [],
                }
            }
            return cache;
        }
        if (res.data['data']) {
            cache(`${host}api/WebApi/banner`, {
                data: res.data['data']['data'],
            })
            return {
                data: res.data['data']['data'],
            }
        }
    }
    return {
        data: []
    }
}
async function load(search, current, pageSize) {
    const query = { ...search };
    query['start'] = pageSize * (current - 1);
    query['limit'] = pageSize;

    const res = await axios.post(`${host}api/WebApi/bourn`, {
        ...query
    });

    if (res.status == 200 && res.data) {
        if (!res.data['data'] && res.data['message'] == '重复操作') {
            const cache = get(`${host}api/WebApi/bourn`);
            if (!cache) {
                return {
                    data: [],
                    total: 0,
                }
            }
            return cache;
        }
        if (res.data['data']) {
            cache(`${host}api/WebApi/bourn`, {
                data: res.data['data']['data'],
                total: res.data['data']['total'],
            })
            return {
                data: res.data['data']['data'],
                total: res.data['data']['total'],
            }
        }
    }
    return {
        data: [],
        total: 0,
    }
}
const Bourn = ({ initData, initTotal, initBanner }) => {
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(initTotal);

    const [data, setData] = useState(initData);

    const [loading, setLoading] = useState(false);
    const searchCity = (city_id) => {
        Router.push({
            pathname: `${publicRuntimeConfig.basePath || ''}/ticket`,
            query: {
                destination: city_id
            }
        })
    }

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
            <div className="Bourn-top">
                <Carousel autoplay>
                    {
                        initBanner.map((item,index) => {
                            return (
                                <a key={`carousel${index}`} href={item['url']?item['url']:'/'}>
                                    <img className="Carousel-img" src={item['pic'] ? item['pic'] : getStaticFile('/route_detail_back.png')} />
                                </a>
                            )
                        })
                    }
                </Carousel>
                <style jsx>{`
                    .Bourn-top{
                        width: 100%;
                        position: relative;
                    }
                    .Bourn-top-img{
                        width:100%;
                        height: 180px;
                    }
                    .Bourn_vague{
                        width: 100%;
                        height: 180px;
                        background:rgba(0,0,0,0.4);
                        position: absolute;
                        top: 0;
                    }
                    .Bourn_search{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 180px;
                        width: 100%;
                        position: absolute;
                        top: 0;
                    }
                    .Bourn_search_label{
                        font-size:32px;
                        font-weight:500;
                        color:rgba(255,255,255,1);
                        line-height:45px;
                    }
                    .Bourn_search_back{
                        width: 100%;
                        height: 80px;
                        padding-top: 10px;
                        background: #333333c7;
                        border-radius: 5px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                        border-bottom-right-radius: 5px;
                        border-bottom-left-radius
                    }
                    .Carousel-img{
                        height:495px;
                        width:100%;
                    }
                    `}</style>
            </div>
            {/* 下面内容部分 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div className="Bourn-title">
                    <span>热门目的地</span>
                </div>
                <div className='Bourn-content'>
                    {
                        data.map(item => {
                            return (
                                <div className='Bourn-data' key={item['city_id']}>
                                    <div onClick={() => { searchCity(item['city_id']) }}>
                                        <a>
                                            <img src={item['pic'] == '' ? getStaticFile('/pic.png') : item['pic']} className="Bourn-img" />
                                            <div className="Bourn-vague"></div>
                                            <div className="Bourn-name">
                                                <span>{item['name']}</span>
                                            </div>
                                        </a>
                                    </div>
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
                        style={{ position: 'absolute', right: '15%' }}
                        defaultPageSize={pageSize}
                        total={total}
                        showSizeChanger={false}
                        onChange={pageNumChange}
                        current={current}
                    />
                </div>
                <style jsx>{`
                    .Bourn-title{
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;    
                        font-size:28px;
                        font-weight:500;
                        color:rgba(245,105,97,1);
                        line-height:40px;
                        margin-top: 30px;
                    }
                    .Bourn-content {
                        display: flex;
                        margin-top: 30px;
                        padding: 0px 15%;
                        flex-wrap: wrap;
                    }
                    .Bourn-img{
                        width: 100%;
                        height:256px;
                    }
                    .Bourn-vague{
                        height: 256px;
                        width: 100%;
                        background:rgba(0,0,0,0.25);
                        position: absolute;
                        top: 0;
                    }
                    .Bourn-data {
                        width: 32%;
                        margin-top: 15px;
                        margin-right: 10px;
                        position: relative;  
                    }
                    .Bourn-name{
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
Bourn.getInitialProps = async (appContext) => {
    const res = await load({}, 1, pageSize);

    const banner = await load_banner();
    return {
        initData: res.data,
        initTotal: res.total,
        initBanner: banner.data
    }
}

export default Bourn;