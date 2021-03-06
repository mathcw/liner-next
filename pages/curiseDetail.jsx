import React, { useState } from 'react';
import '../css/index.css';
import Link from '../components/NextLink';
import { withRouter } from 'next/router';
import axios from 'axios';
import { connect } from 'react-redux';
import { host, getStaticFile } from '../lib/util';
import { get,cache } from '../lib/lruCache';

const Detail = ({ data }) => {

    const related = data['相关航线'] ? data['相关航线'] : [];
    const pics = data['邮轮图片'] ? data['邮轮图片'] : [];

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
                    <div className="information_content">
                        {data['des']}
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
                                                        <span className="route-title">{item['name']}</span>
                                                        <div style={{display:'flex',justifyContent:'space-between'}}>
                                                            <span style={{ lineHeight: '25px'}}>{item['day']}天{item['night']}晚</span>
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
                        flex-direction: column;
                        width:100%;
                        height: 100px;
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
    const res = await axios.get(`${host}api/WebApi/curiseDetail?id=${query['id']}`);
    if (res.status == 200 && res.data) {
        if(!res.data['data'] && res.data['message'] =='重复操作' ){
            const cache = get(`${host}api/WebApi/curiseDetail?id=${query['id']}`);
            if(!cache){
                return {
                    data: null
                }
            }
            return cache;
        }
        if(res.data['data']){
            cache(`${host}api/WebApi/curiseDetail?id=${query['id']}`,{
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