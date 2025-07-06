import { FC, useRef } from 'react';
import style from './slider.module.css';
import { CSSTransition } from 'react-transition-group';
import './slider.animation.css';
import { LoadFile } from '@shared/ui/LoadFile';
import { getDate } from '@shared/lib';

import {
    HiOutlineShare,
    HiOutlineDocumentArrowDown,
    HiMagnifyingGlassMinus,
    HiMagnifyingGlassPlus,
    HiOutlineXMark,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from 'react-icons/hi2';
import useSlider from '../lib/hooks/useSlider';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { setState, setZoom } from '../model/slice/sliderSlice';
import { Link } from 'react-router-dom';
import { RangeInput } from '@shared/ui/Input';
import { WhiteButton } from '@shared/ui/Button';
import { SliderMedia } from '@entities/Media';

const Slider: FC = () => {
    const refSwipe = useRef<HTMLDivElement | null>(null);
    const refSlider = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const { zoom, state, slideNumber } = useAppSelector(state => state.slider);

    const { downloadMedia, swipeSlide, zoomMedia, shareMedia, zoomSize, handleZoom, message } =
        useSlider(refSwipe);

    return (
        <CSSTransition
            in={state}
            nodeRef={refSlider}
            timeout={300}
            classNames="slider-node"
            unmountOnExit
        >
            <div className={style.SliderContainer} ref={refSlider}>
                <div onClick={event => event.stopPropagation()} className={style.ToolsBlock}>
                    <Link to={`/chat/${message.user.user_id}`}>
                        <LoadFile
                            imagePath={
                                message.user.user_img
                                    ? `users/${message.user.user_id}/${message.user.user_img}`
                                    : ''
                            }
                            imageTitle={message.user.user_name}
                        />
                        <div className={style.OwnerInfo}>
                            <p>{message.user.user_name}</p>
                            <p>{getDate(message.message_date)}</p>
                        </div>
                    </Link>
                    <span>
                        <WhiteButton foo={() => shareMedia()}>
                            <HiOutlineShare />
                        </WhiteButton>
                        <WhiteButton foo={() => downloadMedia()}>
                            <HiOutlineDocumentArrowDown />
                        </WhiteButton>
                        <WhiteButton
                            foo={() => {
                                dispatch(setZoom(!zoom));
                                zoomMedia(zoom ? 100 : 125);
                            }}
                        >
                            {zoom ? <HiMagnifyingGlassMinus /> : <HiMagnifyingGlassPlus />}
                        </WhiteButton>
                        <WhiteButton foo={() => dispatch(setState(false))}>
                            <HiOutlineXMark />
                        </WhiteButton>
                    </span>
                </div>
                {!zoom && slideNumber > 0 && (
                    <span className={style.LeftArrow}>
                        <WhiteButton foo={() => swipeSlide(false)}>
                            <HiOutlineChevronLeft />
                        </WhiteButton>
                    </span>
                )}
                {!zoom &&
                    message.message_files &&
                    slideNumber < message.message_files.length - 1 && (
                        <span className={style.RightArrow}>
                            <WhiteButton foo={() => swipeSlide(true)}>
                                <HiOutlineChevronRight />
                            </WhiteButton>
                        </span>
                    )}
                {zoom && (
                    <span className={style.Zoom}>
                        <WhiteButton foo={() => handleZoom(true)}>
                            <HiMagnifyingGlassMinus />
                        </WhiteButton>
                        <RangeInput min={100} max={200} value={zoomSize} foo={zoomMedia} />
                        <WhiteButton foo={() => handleZoom(false)}>
                            <HiMagnifyingGlassPlus />
                        </WhiteButton>
                    </span>
                )}
                <div className={style.Slider} onClick={() => dispatch(setState(false))}>
                    <div className={style.Swipe} ref={refSwipe}>
                        {message.message_files?.map(media => (
                            <div key={media.message_file_id} className={style.ImageBlock}>
                                <SliderMedia media={media} key={media.message_file_id} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
};

export default Slider;
