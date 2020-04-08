import React from 'react';
import { Spin } from 'antd';

const PageLoading = ({loading}) => {
  return loading ? (
    <div className='Spin-box'>
        <Spin size="large"/>
        <style jsx>{`
        .Spin-box {
            background: rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `}</style>

    </div>

    
  ) : null;
}


export default PageLoading;
