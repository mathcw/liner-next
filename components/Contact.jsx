import React, { useState } from 'react';
import { Modal, Button, Input, notification } from 'antd';
import axios from 'axios';
import { UserOutlined, WechatOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import Debounce from 'lodash.debounce';

const Contact = () => {
    const [visible, setvisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [weChat, setWeChat] = useState('');

    const [mail, setMail] = useState('');

    const [comment, setComment] = useState('');

    const Click = () => {
        setvisible(true);
    }
    const handleOk = Debounce(() => {
        axios.post(`http://localhost:8080/liner-back/api/WebApi/comment`, {
            name, phone, weChat, mail, comment
        }).then(r => {
            setvisible(false);
            notification.open({
                message: '感谢您的留言',
                description:
                    '我们已经收到了您的留言,我们承诺对您的信息进行严格保密,您的每一份留言都是我们的动力',
            });
        }, e => {
            notification.open({
                message: '感谢您的留言',
                description:
                    '我们已经收到了您的留言,我们承诺对您的信息进行严格保密,您的每一份留言都是我们的动力',
            });
            setvisible(false);
        });
    },500);
    const handleCancel = () => {
        setvisible(false);
    }
    return (
        <div className='main' >
            <div className="content" onClick={Click}>
                <img className="img" src="/pic.png" />
                <div className="people">
                    <span>与我们联系</span>
                </div>
            </div>
            <Modal
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                title="请您留言"
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        留言
                    </Button>
                ]}
            >
                <div className="modalContent">
                    <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的姓名" prefix={<UserOutlined />} />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的电话" prefix={<PhoneOutlined />} />
                    <Input value={mail} onChange={(e) => setMail(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的邮箱" prefix={<MailOutlined />} />
                    <Input value={weChat} onChange={(e) => setWeChat(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} placeholder="您的微信" prefix={<WechatOutlined />} />
                    <Input.TextArea value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%' }} placeholder="宝贵留言" />
                </div>
            </Modal>
            <style jsx>{`
        .main {
            cursor:pointer;
            position: fixed;
            z-index: 999;
            right: 60px;
            bottom: 30px;
            font-size: 14px;
            border:1px solid;
            width:90px;
            background-color:white;
        }
        .content{
            display:flex;
            flex-direction:column;
        }
        .img{
            height:60px;
            width:90px;
        }
        .people{
            border:1px solid;
            border-radius:10px;
            margin:5px 5px 5px 5px;
            color: rgb(0, 0, 0);
            text-align:center
        }
        modalContent{
            display:flex;
            flex-direction:column;
        }
        `}</style>
        </div>
    );
}


export default Contact;
