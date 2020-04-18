import React from 'react';
import PostViewModal from '../Post/PostViewModal.jsx';
import ImageContainer from '../MapUI/ImageContainer.jsx';

function getStyle() {
    return {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: 30,
        height: 30,
        background: '#f29100',
        borderRadius: '15px',
    }
}

const StandardPin = (props) => {

    const postObj = props.postObj;
    const lat = props.lat;
    const long = props.lng;
    const style = getStyle();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    }
    const handleOpen = () => {
        setOpen(!open)
    }

    const pin = (
        <React.Fragment>
            <PostViewModal open={open} action={setOpen} post={postObj}/>
            <div style={style} onClick={() => {handleClick()}}></div>
        </React.Fragment>
    )
    return pin;
}

export {StandardPin};