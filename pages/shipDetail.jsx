import React, { useState } from 'react';
import '../css/index.css';
import { Carousel, Input } from 'antd';
import Link from '../components/NextLink';
import { withRouter } from 'next/router';
import axios from 'axios';
import { connect } from 'react-redux';
import { host, getStaticFile } from '../lib/util';
import { get, cache } from '../lib/lruCache';


const Detail = ({ data, dict }) => {

    const related = data['相关航线'] ? data['相关航线'] : [];
    const pics = data['邮轮图片'] ? data['邮轮图片'] : [];
    const foods = data['餐饮'] ? data['餐饮'] : [];
    const rooms = data['房型'] ? data['房型'] : [];
    const games = data['娱乐'] ? data['娱乐'] : [];
    const dictKind = dict['ShipKind'] ? dict['ShipKind'] : {};
    const dictCom = dict['CruiseCompany'] ? dict['CruiseCompany'] : {}
    const header_pic = pics.length == 0 ? '' : pics[0]['pic'];
    return (
        <>
            <div className="route_detail_top">
                <div className='route_details_back'>
                    <img src={header_pic == '' ? getStaticFile('/route_detail_back.png') : header_pic} />
                </div>
                <div className="route_vague"></div>
                <div className="text">
                    <span className="title">{data['name']}</span>
                </div>
            </div>
            {/* 内容区域 */}
            <div className="content">
                {/* 产品信息 */}
                <div className="information" >
                    <div className="top">
                        <div className="title">
                            <span className="title-font">{data['name']}</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <Input.TextArea autoSize value={data['des']}
                        style={{
                            width: '100%'
                            , fontSize: '14px'
                            , fontWeight: '500'
                            , color: 'rgba(0,0,0,0.45)'
                            , marginTop: '20px'
                            , paddingLeft: '40px'
                            , border: 'none'
                        }}
                        readOnly />
                </div>
                <div className="information" style={{ marginTop: '10px' }}>
                    <div className="top">
                        <div className="title">
                            <span className="title-font">邮轮参数</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <div className="ParmsContent">
                        <div style={{ display: 'flex' }}>
                            {
                                data['kind'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront">邮轮类型</span>
                                    <span className="ParmsLater">{dictKind[data['kind']]}</span>
                                </div>
                            }
                            {
                                data['cruise_company_id'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>所属公司</span>
                                    <span className="ParmsLater">{dictCom[data['cruise_company_id']]}</span>
                                </div>
                            }
                            {
                                data['room_number'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>客房数</span>
                                    <span className="ParmsLater">{data['room_number']}</span>
                                </div>
                            }
                        </div>
                        <div style={{ display: 'flex' }}>
                            {
                                data['date_of_use'] != '' && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront">使用时间</span>
                                    <span className="ParmsLater">{data['date_of_use']}</span>
                                </div>
                            }
                            {
                                data['build_time'] != '' && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>翻新时间</span>
                                    <span className="ParmsLater">{data['build_time']}</span>
                                </div>

                            }
                            {
                                data['place_of_build'] != '' && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>建造地</span>
                                    <span className="ParmsLater">{data['place_of_build']}</span>
                                </div>
                            }
                        </div>
                        <div style={{ display: 'flex' }}>
                            {
                                data['length'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront">船体长</span>
                                    <span className="ParmsLater">{data['length']}米</span>
                                </div>
                            }
                            {
                                data['width'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>船体宽</span>
                                    <span className="ParmsLater">{data['width']}米</span>
                                </div>
                            }
                            {
                                data['speed'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront" style={{ marginLeft: '20px' }}>航速</span>
                                    <span className="ParmsLater">{data['speed']}</span>
                                </div>
                            }
                        </div>
                        <div style={{ display: 'flex' }}>
                            {
                                data['tonnage'] != 0 && <div style={{ minWidth: '15%' }}>
                                    <span className="ParmsFront">吨位</span>
                                    <span className="ParmsLater">{data['tonnage']}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/*展示图片 */}
                {pics.length != 0 && <div className="picture" style={{ marginTop: '10px' }}>
                    <div className="top">
                        <div className="title">
                            <span className="title-font">邮轮风光</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <Carousel autoplay>
                        {
                            pics.map((item) => {
                                return (<img className="Carousel-img" key={item.pic} src={item.pic == '' ? getStaticFile('/route_detail_back.png') : item.pic} />)
                            })
                        }
                    </Carousel>
                </div>
                }
                <div className="information" >
                    <div className="top">
                        <div className="title">
                            <span className="title-font">餐饮介绍</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <div className="block">
                        {
                            foods.map((item) => {
                                return (
                                    <div className="block-detail" key={item['id']}>
                                        <img className="block-detail-img" src={item['pic_arr'][0] == '' ? getStaticFile('/route_detail_back.png') : item['pic_arr'][0]} />
                                        <span className="block-detail-title">{item['restaurant']}</span>
                                        <Input.TextArea autoSize value={item['des']}
                                            style={{
                                                width: '100%'
                                                , fontSize: '14px'
                                                , fontWeight: '500'
                                                , color: 'rgba(0,0,0,0.45)'
                                                , border: 'none'
                                                , lineHeight: '20px'
                                                , overflow: 'hidden'
                                                , textOverflow: 'ellipsis'
                                            }}
                                            readOnly />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="information" >
                    <div className="top">
                        <div className="title">
                            <span className="title-font">娱乐设施</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <div className="block">
                        {
                            games.map((item) => {
                                return (
                                    <div className="block-detail" key={item['id']}>
                                        <img className="block-detail-img" src={item['pic_arr'][0] == '' ? getStaticFile('/route_detail_back.png') : item['pic_arr'][0]} />
                                        <span className="block-detail-title">{item['restaurant']}</span>
                                        <Input.TextArea autoSize value={item['des']}
                                            style={{
                                                width: '100%'
                                                , fontSize: '14px'
                                                , fontWeight: '500'
                                                , color: 'rgba(0,0,0,0.45)'
                                                , border: 'none'
                                                , lineHeight: '20px'
                                                , overflow: 'hidden'
                                                , textOverflow: 'ellipsis'
                                            }}
                                            readOnly />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="information" >
                    <div className="top">
                        <div className="title">
                            <span className="title-font">房型介绍</span>
                        </div>
                        <div className="image">
                            <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                        </div>
                    </div>
                    <div className="block">
                        {
                            rooms.map((item) => {
                                return (
                                    <>
                                        <div className="block-detail">
                                            <img className="block-detail-img" src={item['pic_arr'][0] == '' ? getStaticFile('/route_detail_back.png') : item['pic_arr'][0]} />
                                            <span className="block-detail-title">{item['restaurant']}</span>
                                            <Input.TextArea autoSize value={item['des']}
                                                style={{
                                                    width: '100%'
                                                    , fontSize: '14px'
                                                    , fontWeight: '500'
                                                    , color: 'rgba(0,0,0,0.45)'
                                                    , border: 'none'
                                                    , lineHeight: '20px'
                                                    , overflow: 'hidden'
                                                    , textOverflow: 'ellipsis'
                                                }}
                                                readOnly />
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="other_route" >
                    <div className="row">
                        <div className="top">
                            <div className="title">
                                <span className="a">相关航线</span>
                            </div>
                            <div className="image">
                                <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                            </div>
                        </div>
                        <div style={{ marginTop: '15px', padding: 0 }} className="other-routes">
                            {
                                related.map((item) => {
                                    return (
                                        <div style={{ width: '30%', padding: 10 }} key={item['id']}>
                                            <Link href={`/details?id=${item['id']}`} >
                                                <a>
                                                    <img className="route-img" src={item['pic'] == '' ? getStaticFile('/pic.png') : item['pic']} />
                                                    <div className="route-content">
                                                        <div>
                                                            <span className="route-title">{item['name']}</span>
                                                            <span style={{ lineHeight: '25px', position: 'absolute', right: '7%' }}>{item['day']}天{item['night']}晚</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginTop: '5px' }}>
                                                            <span className='route-price'>￥{item['min_price']}</span>
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
                </div>
                <style jsx>{`
                    .other-routes{
                        display: flex;
                        flex-wrap:wrap;
                        justify-content:center;
                    }
                    .route-img{
                        width: 100%;
                        height: 256px;
                    }
                    .route-content{
                        display: flex;
                        position: relative;
                        flex-direction: column;
                        width:100%;
                        height: 80px;
                        box-shadow:0px 1px 8px 0px rgba(0,0,0,0.1);
                        padding: 12px 0px 0px 15px;
                    }
                    .route-title{
                        font-size:18px;
                        font-weight:500;
                        color:rgba(0,0,0,1);
                        line-height:25px;
                    }
                    .route-price{
                        font-size:18px;
                        font-weight:500;
                        color:rgba(245,105,97,1);
                        line-height:25px;
                        position: absolute;
                        right: 7%;
                    }
                    .content{
                        display: flex;
                        flex-direction: column;
                        padding: 0 15%;
                    }
                    .information{
                        display: flex;
                        flex-direction: column;
                        margin-top: 110px;
                    }
                    .information_content{
                        margin-top: 40px;
                        font-size:16px;
                        font-weight:500;
                        color:rgba(0,0,0,0.45);
                        line-height:32px;
                        text-indent: 2em;
                    }
                    .top{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;  
                    }
                    .title{
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .title-font{
                        font-size:28px;
                        font-weight:500;
                        color:rgba(245,105,97,1);
                        line-height:40px;
                    }
                    .picture {
                        margin-top: 110px;
                        display:flex;
                        flex-direction: column;
                    }
                    .Carousel-img{
                        width:880px;
                        height:495px;
                    }
                    .block{
                        display:flex;
                        flex-wrap:wrap;
                        justify-content: center;
                    }
                    .block-detail{
                        display:flex;
                        flex-direction: column;
                        max-height:405px;
                        padding:10px 10px 10px 0px;
                    }
                    .block-detail-img{
                        width:420px;
                        height:280px;
                    }
                    .block-detail-title{
                        font-size:18px;
                        font-weight:500;
                        line-height:25px;
                    }
                    .block-detail-des{
                        font-size:14px;
                        font-weight:500;
                        line-height:20px;
                        overflow:hidden; 
                        text-overflow:ellipsis;
                    }
                    .ParmsContent{
                        display:flex;
                        flex-direction:column;
                        padding-left: 40px
                    }
                    .ParmsFront{
                        font-size:14px;
                        font-weight:500;
                        color:rgba(0,0,0,1);
                        line-height:20px;
                    }
                    .ParmsLater{
                        margin-left:20px;
                        font-size: 14px;
                        font-weight: 500;
                        color: rgba(0,0,0,0.45);
                        line-height:20px;
                    }
                    `}</style>
            </div>
        </>
    );
}

Detail.getInitialProps = async (appContext) => {
    const { ctx } = appContext;
    const { query } = ctx;

    if (!query['id'] || (typeof query['id'] !== 'string' && typeof query['id'] !== 'number')) {
        return {
            data: null
        }
    }
    const res = await axios.get(`${host}api/WebApi/shipDetail?id=${query['id']}`);
    if (res.status == 200 && res.data) {
        if (!res.data['data'] && res.data['message'] == '重复操作') {
            const cache = get(`${host}api/WebApi/shipDetail?id=${query['id']}`);
            if (!cache) {
                return {
                    data: null
                }
            }
            return cache;
        }
        if (res.data['data']) {
            cache(`${host}api/WebApi/shipDetail?id=${query['id']}`, {
                data: res.data['data']
            })
            return {
                data: res.data['data']
            }
        }

    }
    return {
        data: null
    }
}
export default connect(function mapProps(state) {
    return {
        dict: state.enum
    }
})(withRouter(Detail))