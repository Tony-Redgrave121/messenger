import React, { FC, ReactNode } from 'react';

interface IStopPropagationWrapperProps {
    children: ReactNode;
}

const StopPropagationWrapper: FC<IStopPropagationWrapperProps> = ({ children }) => {
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    return <div onClick={e => e.stopPropagation()}>{children}</div>;
};

export default StopPropagationWrapper;
