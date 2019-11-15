import React from 'react';

const Loading = (props) => {
    if (props.error) {
        return (
                <div>Error!</div>
        )
    } else if (props.pastDelay) {
        // 300ms 之后显示
        return (
                <div>信息请求中...</div>
        )
    } else {
        return null
    }
};
export default Loading;