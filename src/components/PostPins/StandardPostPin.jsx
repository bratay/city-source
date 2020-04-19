import React from 'react';
import PostViewModal from '../Post/PostViewModal.jsx';
import ImageContainer from '../MapUI/ImageContainer.jsx';
import CSLogo from '../MapUI/citysource.png';

function getStyle() {
    return {
        pin: {
            position: 'absolute',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            width: 30,
            height: 30,
            background: '#f29100',
            borderRadius: '50% 50% 50% 0%',
        },
        img: {
            height:27,
            width:27,
            borderRadius: '50% 50% 50% 0%',
            margin: '2px 14px 15px 1px',
        }
        
    }
}

const StandardPin = (props) => {

    const postObj = props.postObj;
    const style = getStyle();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    }
    const handleOpen = () => {
        setOpen(!open)
    }

    const pin = props.postObj ? (
        <React.Fragment>
            <PostViewModal open={open} action={setOpen} post={postObj}/>
            <div style={style.pin} onClick={() => {handleClick()}}>
                <img style={style.img} src={CSLogo} alt="CS Logo" />
            </div>
        </React.Fragment>
    ) : (
    <div style={style.pin} onClick={() => {handleClick()}}>
        <img style={style.img} src={CSLogo} alt="CS Logo" />
    </div>
    );
    return pin;
}

export {StandardPin};