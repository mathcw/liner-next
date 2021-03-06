import React, { useState } from 'react';
import '../css/index.css';
import { Table, Modal, Input, Button, notification } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import Link from '../components/NextLink';
import { withRouter } from 'next/router';
import axios from 'axios';
import { connect } from 'react-redux';
import { host, getStaticFile } from '../lib/util';
import Debounce from 'lodash.debounce';
import { get, cache } from '../lib/lruCache';

const Detail = ({ data, dict }) => {

    const dictDepCity = dict['depCity'] ? dict['depCity'] : {};
    const dictDesCity = dict['desCity'] ? dict['desCity'] : {};

    const fees = data['fees'].map(fee => {
        fee['dep_date'] = data['dep_date'];
        return fee;
    })

    const related = data['其他航线'] ? data['其他航线'] : [];

    const [visible, setvisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [use_dep_date, setUseDepDate] = useState('');
    const [use_room_type, setUseRoomType] = useState('');
    const [use_price, setUsePrice] = useState('');
    const [use_duoren_price, setDuorenPrice] = useState('');
    const [FeeId, setFeeId] = useState('');

    const yuding = (record) => {
        setUseDepDate(record['dep_date']);
        setUseRoomType(record['room_type']);
        setUsePrice(record['price']);
        setDuorenPrice(record['duoren_price']);
        setFeeId(record['id']);
        setvisible(true);
    }

    const handleOk = Debounce(() => {
        axios.post(`${host}api/WebApi/order`, {
            name, phone, use_dep_date, use_room_type, use_price,
            use_duoren_price, group_id: data['id'], fee_id: FeeId
        }).then(r => {
            setUseDepDate('');
            setUseRoomType('');
            setUsePrice('');
            setDuorenPrice('');
            setName('');
            setPhone('');
            setFeeId('');
            setvisible(false);
            notification.open({
                message: '预订成功',
                description:
                    '我们已经收到了您的订单,稍后会有专业销售和您联系',
            });
        }, e => {
            setUseDepDate('');
            setUseRoomType('');
            setUsePrice('');
            setDuorenPrice('');
            setName('');
            setPhone('');
            notification.open({
                message: '预订成功',
                description:
                    '我们已经收到了您的订单,稍后会有专业销售和您联系',
            });
            setvisible(false);
        });
    }, 500);
    const handleCancel = () => {
        setvisible(false);
        setUseDepDate('');
        setUseRoomType('');
        setUsePrice('');
        setDuorenPrice('');
        setName('');
        setPhone('');
    }

    const columns = [
        {
            title: '出发时间',
            dataIndex: 'dep_date',
            key: 'dep_date',
        },
        {
            title: '房型',
            dataIndex: 'room_type',
            key: 'room_type',
        },
        {
            title: '位置',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '1/2人价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '3/4人价格',
            dataIndex: 'duoren_price',
            key: 'duoren_price',
        },
        {
            title: '报名',
            key: 'action',
            render: (text, record) => (
                <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { yuding(record) }}>立即预订</span>
            ),
        },
    ];

    return (
        <>
            <div className="route_detail_top">
                <div className='route_details_back'>
                    <img src={data['pic'] == '' ? getStaticFile('/route_detail_back.png') : data['pic']} />
                </div>
                <div className="route_vague"></div>
                <div className="text">
                    <span className="title">{data['name']}</span>
                    <div className="bt_content">
                        <div className="left">
                            <div className="part" style={{ borderRight: '1px solid #fff', paddingRight: '20px' }}>
                                <img src={getStaticFile('/time.png')} />
                                <span className="star">{data['day']}天{data['night']}晚</span>
                            </div>
                            <div className="part">
                                <img src={getStaticFile('/price.png')} />
                                <span className="star">￥{data['min_price']}起/人</span>
                            </div>
                        </div>
                        <div className="right">
                            <span className="m">￥</span>
                            <span className="c">{data['min_price']}</span>
                            <span className="c">起/人</span>
                        </div>
                    </div>

                </div>


            </div>
            {/* 内容区域 */}
            <div className="route_detail_content">
                <div className="left_content">
                    {/* 产品信息 */}
                    {
                        data['kind'] != 4 && <div className="information" >
                            <div className="top">
                                <div className="title">
                                    <span className="a">{data['name']}</span>
                                </div>
                                <div className="image">
                                    <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                                </div>
                            </div>

                            <Input.TextArea autoSize value={data['ship_dep']}
                                style={{
                                    width: '100%'
                                    , fontSize: '14px'
                                    , fontWeight: '500'
                                    , color: 'rgba(0,0,0,0.45)'
                                    , border: 'none'
                                }}
                                readOnly />
                        </div>
                    }
                    {/* 行程详情 */}
                    <div className="travel_detail" >
                        <div className="top">
                            <div className="title">
                                <span className="a">行程详情</span>
                            </div>
                            <div className="image">
                                <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                            </div>
                        </div>
                        <div className="teavel_content">
                            <div className="right">
                                <div className="feature">
                                    {
                                        data['kind'] != 1 &&
                                        <>
                                            <div className="head">
                                                <img src={getStaticFile('/point.png')} />
                                                <span className="text">产品特色</span>
                                            </div>
                                            <Input.TextArea autoSize value={data['bright_spot']}
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
                                            <div className="pro_detail">
                                                {
                                                    data['itins'] && data['itins'].map(itin => {
                                                        return (
                                                            <div className="among" key={itin['id']}>
                                                                <div className="title">
                                                                    <span className="num">{itin['order']}</span>
                                                                    <div className="text">{itin['dep_city'] == '' ? '' : itin['dep_city']}
                                                                        {(itin['dep_city'] != '' && itin['destination'] != '') ? '-' : ''}
                                                                        {itin['destination'] != '' ? itin['destination'] : ''}
                                                                    </div>
                                                                </div>
                                                                <div className="tdc">
                                                                    {
                                                                        (itin['arr_time'] != '' || itin['level_time'] != '') && <div className="part">
                                                                            <img src={getStaticFile('/time2.png')} />
                                                                            <div className="text">
                                                                                {itin['arr_time'] == '' ? '' : itin['arr_time']}
                                                                                {(itin['arr_time'] != '' && itin['level_time'] != '') ? '-' : ''}
                                                                                {itin['level_time'] != '' ? itin['level_time'] : ''}</div>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        (itin['dep_city'] != '' || itin['destination'] != '') && <div className="part">
                                                                            <img src={getStaticFile('/place.png')} />
                                                                            <div className="text">
                                                                                {itin['dep_city'] == '' ? '' : itin['dep_city']}
                                                                                {(itin['dep_city'] != '' && itin['destination'] != '') ? '-' : ''}
                                                                                {itin['destination'] != '' ? itin['destination'] : ''}</div>
                                                                        </div>
                                                                    }
                                                                    <div className="part">
                                                                        <img src={getStaticFile('/catering.png')} />
                                                                        {
                                                                            itin['breakfast'] != '' && <div className="text">早餐:{itin['breakfast']}</div>
                                                                        }
                                                                        {
                                                                            itin['lunch'] != '' && <div className="text">中餐:{itin['lunch']}</div>
                                                                        }
                                                                        {
                                                                            itin['dinner'] != '' && <div className="text">晚餐:{itin['dinner']}</div>
                                                                        }
                                                                    </div>

                                                                </div>
                                                                {
                                                                    itin['pic_arr'].length > 0 && <div className="image">
                                                                        <img src={itin['pic_arr'].length > 0 ? itin['pic_arr'][0] : getStaticFile('/pic.png')} />
                                                                    </div>
                                                                }

                                                                <Input.TextArea autoSize value={itin['des']}
                                                                    style={{
                                                                        width: '100%'
                                                                        , fontSize: '14px'
                                                                        , fontWeight: '500'
                                                                        , color: 'rgba(0,0,0,0.45)'
                                                                        , marginTop: '20px'
                                                                        , paddingLeft: '40px'
                                                                        , lineHeight: '28px'
                                                                        , border: 'none'
                                                                    }}
                                                                    readOnly />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product_include" >
                        <div className="top">
                            <div className="title">
                                <span className="a">产品明细</span>
                            </div>
                            <div className="image">
                                <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                            </div>
                        </div>
                        <div className="pro_information">
                            <div className="head">
                                <img src={getStaticFile('/right.png')} />
                                <span className="text">预订须知</span>
                            </div>
                            <Input.TextArea autoSize value={data['book_info']}
                                style={{
                                    width: '100%'
                                    , minHeight: '190px'
                                    , fontSize: '14px'
                                    , fontWeight: '500'
                                    , color: 'rgba(0,0,0,0.45)'
                                    , marginTop: '20px'
                                    , paddingLeft: '40px'
                                    , border: 'none'
                                }}
                                readOnly />
                        </div>
                        {/* {
                            data['fee_info'] != '' && <div className="pro_information">
                                <div className="head">
                                    <img src={getStaticFile('/right.png')} />
                                    <span className="text">旅游费用</span>
                                </div>
                                <Input.TextArea autoSize value={data['fee_info']}
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
                        } */}
                        {data['fee_include'] && <div className="pro_information">
                            <div className="head">
                                <img src={getStaticFile('/right.png')} />
                                <span className="text">费用包含</span>
                            </div>
                            <Input.TextArea autoSize value={data['fee_include']}
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
                        }
                        {data['fee_exclude'] && <div className="pro_information">
                            <div className="head">
                                <img src={getStaticFile('/right.png')} />
                                <span className="text">费用不含</span>
                            </div>
                            <Input.TextArea autoSize value={data['fee_exclude']}
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
                        }
                        {
                            data['cancel_info'] && <div className="pro_information">
                                <div className="head">
                                    <img src={getStaticFile('/right.png')} />
                                    <span className="text">取消条款</span>
                                </div>
                                <Input.TextArea autoSize value={data['cancel_info']}
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
                        }
                    </div>
                    {/* 班期房型 */}
                    <div className="schedule_room" >
                        <div className="top">
                            <div className="title">
                                <span className="a">价格明细</span>
                            </div>
                            <div className="image">
                                <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                            </div>
                        </div>
                        <div className="table">
                            <Table dataSource={fees} columns={columns} pagination={false} rowKey="id" />
                        </div>
                    </div>
                    {/* 其他航线 */}
                    {related.length !=0 && <div className="other_route" >
                        <div className="row">
                            <div className="top">
                                <div className="title">
                                    <span className="a">其他团期</span>
                                </div>
                                <div className="image">
                                    <img src={getStaticFile('/back.png')} style={{ width: '120px' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', padding: 0,display:'flex',flexWrap:'wrap',justifyContent:'wrap' }}>
                            {
                                related.map((item) => {
                                    return (
                                        <div style={{ width: '30%', padding: 10 }} key={item['id']}>
                                            <Link href={`/details?id=${item['id']}`} >
                                                <a>
                                                    <img style={{width:'100%',height:'256px'}} src={item['pic'] == '' ? getStaticFile('/pic.png') : item['pic']} />
                                                    <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100px',boxShadow:'0px 1px 8px 0px rgba(0,0,0,0.1)',padding:'12px 0px 0px 15px'}} >
                                                        <span style={{fontSize:'18px',fontWeight:'500',color:'rgba(0,0,0,1)',lineHeight:'25px'}}>{item['name']}</span>
                                                        <div style={{display:'flex',justifyContent:'space-between'}}>
                                                            <span style={{ lineHeight: '25px'}}>{item['day']}天{item['night']}晚</span>
                                                            <span style={{fontSize:'18px',fontWeight:'500',color:'rgba(245,105,97,1)',lineHeight:'25px'}}>￥{item['min_price']}</span>
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
                    </div>}
                </div>
            </div >
            <div style={{
                display: 'flex',
                flexDirection:'column',
                alignItems: 'center',
                borderBottom:  '1px dashed rgba(0,0,0,0.25)' ,
                position: 'fixed',
                left: '60px',
                bottom: '30px',
                fontSize: '14px',
                border:'1px solid',
                backgroundColor:'white',
                zIndex:'999',
                padding: '5px 5px 5px 5px'
            }}>
                <span>产品简介</span>
                <div className="detailMation">
                    <span className="front">持续时间：</span>
                    <span className="later">{data['day']}天{data['night']}晚</span>
                </div>
                {
                    data['dep_city_id']!=0 && <div className="detailMation">
                    <span className="front">出发地点：</span>
                    <span className="later">{dictDepCity[data['dep_city_id']]}</span>
                </div>
                }
                {
                    data['destination']!=0 && <div className="detailMation">
                    <span className="front">目  的 地：</span>
                    <span className="later">{dictDesCity[data['destination']]}</span>
                </div>
                }

            </div>
            <div>
                <Modal
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    title="订单信息"
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            取消
                    </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            下单
                    </Button>
                    ]}
                >
                    <div className="modalContent">
                        <Input addonBefore="出发日期" value={use_dep_date} style={{ width: '100%', marginBottom: '10px' }} disabled />
                        <Input addonBefore="房型" value={use_room_type} style={{ width: '100%', marginBottom: '10px' }} disabled />
                        <Input addonBefore="1/2人价" value={use_price} style={{ width: '100%', marginBottom: '10px' }} disabled />
                        <Input addonBefore="3/4人价" value={use_duoren_price} style={{ width: '100%', marginBottom: '10px' }} disabled />

                        <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的姓名" prefix={<UserOutlined />} />
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的电话" prefix={<PhoneOutlined />} />
                    </div>
                </Modal>
                <style jsx>{`
                .modalContent{
                    display:flex;
                    flex-direction:column;
                }
                .detailMation{
                    display: flex;
                    height: 36px;
                    align-items: center;
                    border-bottom:  1px dashed rgba(0,0,0,0.25) ;
                }
                .front{
                    font-size:14px;
                    font-weight:500;
                    color:rgba(0,0,0,1);
                    line-height:20px;
                }
                .later{
                    font-size:14px;
                    font-weight:300;
                    color:rgba(0,0,0,0.65);
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
    const res = await axios.get(`${host}api/WebApi/detail?id=${query['id']}`);

    if (res.status == 200 && res.data) {
        if (!res.data['data'] && res.data['message'] == '重复操作') {
            const cache = get(`${host}api/WebApi/detail?id=${query['id']}`);
            if (!cache) {
                return {
                    data: null
                }
            }
            return cache;
        }
        if (res.data['data']) {
            cache(`${host}api/WebApi/detail?id=${query['id']}`, {
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